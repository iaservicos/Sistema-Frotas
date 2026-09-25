from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.app.core.database import get_db
from backend.app.models.tecnico import Tecnico
from backend.app.schemas.tecnico import TecnicoSimple, TecnicoAptoResponse

router = APIRouter()

@router.get("/aptos-cautela", response_model=List[TecnicoAptoResponse], summary="Técnicos Aptos para Cautelar Veículos")
def get_tecnicos_aptos(db: Session = Depends(get_db)):
    """
    Retorna técnicos aptos e inaptos para cautela com a justificativa de negócio:
    - Requer ativo = TRUE e status 'ATIVO'
    - Requer CNH não vencida
    - Requer pontuação na CNH inferior a 20 pontos
    """
    hoje = date.today()
    tecnicos = db.query(Tecnico).order_by(Tecnico.nome_completo.asc()).all()

    resultado = []
    for t in tecnicos:
        apto = True
        motivo = None

        if not t.ativo or t.status_colaborador in ("DESLIGADO", "INATIVO"):
            apto = False
            motivo = f"Colaborador com status '{t.status_colaborador}'."
        elif t.cnh_vencimento and t.cnh_vencimento < hoje:
            apto = False
            motivo = f"CNH vencida em {t.cnh_vencimento}."
        elif (t.cnh_pontuacao or 0) >= 20:
            apto = False
            motivo = f"Pontuação elevada na CNH ({t.cnh_pontuacao} pontos)."

        resultado.append(
            TecnicoAptoResponse(
                id_tecnico=t.id_tecnico,
                matricula=t.matricula,
                nome_completo=t.nome_completo,
                apto_para_cautela=apto,
                motivo_inaptidao=motivo,
                cnh_vencimento=t.cnh_vencimento,
                cnh_pontuacao=t.cnh_pontuacao or 0
            )
        )

    return resultado

@router.get("", response_model=List[TecnicoSimple], summary="Busca Geral de Técnicos (Ativos e Históricos)")
def list_tecnicos(
    status: Optional[str] = Query("ATIVO", description="Filtro: ATIVO, DESLIGADO, TODOS"),
    busca: Optional[str] = Query(None, description="Busca por nome, matrícula ou CPF"),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """
    Lista técnicos permitindo filtrar ativos para rotinas diárias
    ou consultar desligados para vincular a multas passadas e auditoria.
    """
    query = db.query(Tecnico)

    if status and status.upper() != "TODOS":
        if status.upper() == "ATIVO":
            query = query.filter(Tecnico.ativo == True)
        elif status.upper() == "DESLIGADO":
            query = query.filter(Tecnico.status_colaborador == "DESLIGADO")

    if busca:
        filtro_busca = f"%{busca}%"
        query = query.filter(
            or_(
                Tecnico.nome_completo.ilike(filtro_busca),
                Tecnico.matricula.ilike(filtro_busca),
                Tecnico.cpf.ilike(filtro_busca)
            )
        )

    return query.order_by(Tecnico.nome_completo.asc()).limit(limit).all()
