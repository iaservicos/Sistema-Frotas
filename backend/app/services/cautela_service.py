from datetime import datetime, date, timezone
from typing import Optional, Dict, Any
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException, status
from backend.app.models.custodia import Custodia
from backend.app.models.veiculo import Veiculo
from backend.app.models.tecnico import Tecnico
from backend.app.schemas.custodia import CustodiaCreate, CustodiaDevolucao, CustodiaRead, MeuVeiculoResponse

class CautelaService:

    @staticmethod
    def get_meu_veiculo(db: Session, id_tecnico: Optional[int] = None, matricula: Optional[str] = None) -> MeuVeiculoResponse:
        """Retorna o veículo atualmente em posse do técnico para o PWA Mobile."""
        # Localiza o técnico
        tecnico = None
        if id_tecnico:
            tecnico = db.query(Tecnico).filter(Tecnico.id_tecnico == id_tecnico).first()
        elif matricula:
            tecnico = db.query(Tecnico).filter(Tecnico.matricula == matricula).first()

        if not tecnico:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Técnico não encontrado.")

        # Busca custódia ativa
        custodia = db.query(Custodia).filter(
            Custodia.id_tecnico == tecnico.id_tecnico,
            Custodia.status == "ATIVA"
        ).first()

        if not custodia:
            return MeuVeiculoResponse(tem_veiculo_ativo=False)

        veiculo = db.query(Veiculo).filter(Veiculo.id_veiculo == custodia.id_veiculo).first()
        alertas = []

        # Checa alertas preventivos do veículo
        if veiculo:
            km_restante = (round(float(veiculo.hodometro_atual) / 10000.0 + 0.5) * 10000) - float(veiculo.hodometro_atual)
            if km_restante <= 0:
                alertas.append("⚠️ Revisão preventiva periódica VENCIDA! Agende imediatamente na oficina credenciada.")
            elif km_restante <= 500:
                alertas.append(f"⚠️ Atenção: Revisão preventiva em {int(km_restante)} km.")

        if tecnico.cnh_vencimento and tecnico.cnh_vencimento < date.today():
            alertas.append("🚨 Sua CNH está vencida no cadastro. Procure seu supervisor.")

        c_read = CustodiaRead(
            id_custodia=custodia.id_custodia,
            id_veiculo=custodia.id_veiculo,
            veiculo_placa=veiculo.placa if veiculo else None,
            veiculo_modelo=veiculo.modelo if veiculo else None,
            id_tecnico=custodia.id_tecnico,
            tecnico_nome=tecnico.nome_completo,
            tecnico_matricula=tecnico.matricula,
            data_retirada=custodia.data_retirada,
            hodometro_retirada=custodia.hodometro_retirada,
            status=custodia.status,
            observacoes=custodia.observacoes
        )

        v_dict = {
            "id_veiculo": str(veiculo.id_veiculo),
            "placa": veiculo.placa,
            "modelo": veiculo.modelo,
            "hodometro_atual": float(veiculo.hodometro_atual),
            "tanque_capacidade_litros": float(veiculo.tanque_capacidade_litros),
            "status_operacional": veiculo.status_operacional
        } if veiculo else None

        return MeuVeiculoResponse(
            tem_veiculo_ativo=True,
            custodia=c_read,
            veiculo=v_dict,
            alertas=alertas
        )

    @staticmethod
    def alocar_veiculo(db: Session, dados: CustodiaCreate) -> CustodiaRead:
        """Aloca um veículo aplicando as travas de governança (rejeita inativos e CNH irregular)."""
        # 1. Valida o técnico
        tecnico = db.query(Tecnico).filter(Tecnico.id_tecnico == dados.id_tecnico).first()
        if not tecnico:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Técnico não encontrado.")

        if not tecnico.ativo or tecnico.status_colaborador in ("DESLIGADO", "INATIVO"):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Não é permitido cautelar veículo para técnico com status '{tecnico.status_colaborador}'."
            )

        if tecnico.cnh_vencimento and tecnico.cnh_vencimento < date.today():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"CNH do técnico está vencida desde {tecnico.cnh_vencimento}. Cautela bloqueada."
            )

        if (tecnico.cnh_pontuacao or 0) >= 20:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Técnico possui {tecnico.cnh_pontuacao} pontos na CNH (limite legal atingido). Cautela bloqueada."
            )

        # 2. Verifica se o técnico já tem um carro ativo
        posse_existente = db.query(Custodia).filter(
            Custodia.id_tecnico == tecnico.id_tecnico,
            Custodia.status == "ATIVA"
        ).first()
        if posse_existente:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Técnico já possui um veículo sob custódia ativa. É necessário realizar a devolução antes de retirar outro."
            )

        # 3. Valida o veículo
        veiculo = db.query(Veiculo).filter(Veiculo.id_veiculo == dados.id_veiculo).first()
        if not veiculo:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Veículo não encontrado.")

        if veiculo.status_operacional in ("MANUTENCAO", "SINISTRADO", "DEVOLVIDO"):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Veículo com placa {veiculo.placa} está em status '{veiculo.status_operacional}' e não pode ser cautelado."
            )

        carro_ocupado = db.query(Custodia).filter(
            Custodia.id_veiculo == veiculo.id_veiculo,
            Custodia.status == "ATIVA"
        ).first()
        if carro_ocupado:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Veículo {veiculo.placa} já está sob custódia ativa de outro condutor."
            )

        # 4. Cria o registro de custódia
        agora = dados.data_retirada or datetime.now(timezone.utc)
        hodo_retirada = dados.hodometro_retirada if dados.hodometro_retirada > 0 else veiculo.hodometro_atual

        nova_custodia = Custodia(
            id_veiculo=veiculo.id_veiculo,
            id_tecnico=tecnico.id_tecnico,
            data_retirada=agora,
            hodometro_retirada=hodo_retirada,
            status="ATIVA",
            observacoes=dados.observacoes
        )
        db.add(nova_custodia)

        # 5. Atualiza o status do veículo para EM_USO
        veiculo.status_operacional = "EM_USO"
        veiculo.hodometro_atual = hodo_retirada
        db.commit()
        db.refresh(nova_custodia)

        return CustodiaRead(
            id_custodia=nova_custodia.id_custodia,
            id_veiculo=veiculo.id_veiculo,
            veiculo_placa=veiculo.placa,
            veiculo_modelo=veiculo.modelo,
            id_tecnico=tecnico.id_tecnico,
            tecnico_nome=tecnico.nome_completo,
            tecnico_matricula=tecnico.matricula,
            data_retirada=nova_custodia.data_retirada,
            hodometro_retirada=nova_custodia.hodometro_retirada,
            status=nova_custodia.status,
            observacoes=nova_custodia.observacoes
        )

    @staticmethod
    def devolver_veiculo(db: Session, dados: CustodiaDevolucao) -> CustodiaRead:
        """Encerra a custódia do veículo e atualiza o hodômetro para status DISPONIVEL."""
        custodia = db.query(Custodia).filter(Custodia.id_custodia == dados.id_custodia).first()
        if not custodia:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registro de custódia não encontrado.")

        if custodia.status != "ATIVA":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Esta custódia já está com status '{custodia.status}'."
            )

        if dados.hodometro_devolucao < custodia.hodometro_retirada:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Hodômetro de devolução ({dados.hodometro_devolucao}) não pode ser inferior ao de retirada ({custodia.hodometro_retirada})."
            )

        veiculo = db.query(Veiculo).filter(Veiculo.id_veiculo == custodia.id_veiculo).first()
        tecnico = db.query(Tecnico).filter(Tecnico.id_tecnico == custodia.id_tecnico).first()

        agora = dados.data_devolucao or datetime.now(timezone.utc)
        custodia.status = "FINALIZADA"
        custodia.data_devolucao = agora
        custodia.hodometro_devolucao = dados.hodometro_devolucao
        if dados.observacoes:
            custodia.observacoes = f"{custodia.observacoes or ''} | Devolução: {dados.observacoes}".strip(" | ")

        # Libera o veículo
        if veiculo:
            veiculo.status_operacional = "DISPONIVEL"
            veiculo.hodometro_atual = dados.hodometro_devolucao

        db.commit()
        db.refresh(custodia)

        return CustodiaRead(
            id_custodia=custodia.id_custodia,
            id_veiculo=custodia.id_veiculo,
            veiculo_placa=veiculo.placa if veiculo else None,
            veiculo_modelo=veiculo.modelo if veiculo else None,
            id_tecnico=custodia.id_tecnico,
            tecnico_nome=tecnico.nome_completo if tecnico else None,
            tecnico_matricula=tecnico.matricula if tecnico else None,
            data_retirada=custodia.data_retirada,
            hodometro_retirada=custodia.hodometro_retirada,
            data_devolucao=custodia.data_devolucao,
            hodometro_devolucao=custodia.hodometro_devolucao,
            status=custodia.status,
            observacoes=custodia.observacoes
        )
