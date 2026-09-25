from typing import List
from uuid import UUID
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.core.database import get_db
from backend.app.models.multa import Multa
from backend.app.models.tecnico import Tecnico
from backend.app.schemas.multa import MultaRead, MultaIndicacaoRequest

router = APIRouter()

@router.get("/pendentes-indicacao", response_model=List[MultaRead], summary="Multas Pendentes de Indicação (Prevenção Multa NIC)")
def get_multas_pendentes_indicacao(db: Session = Depends(get_db)):
    """
    Lista autos de infração onde o condutor ainda não foi indicado ao órgão de trânsito,
    ordenados pela criticidade do prazo fatal para evitar a Multa NIC (Não Indicação do Condutor).
    """
    sql = text("""
        SELECT 
            m.id_multa, m.numero_ait, m.id_veiculo, v.placa AS veiculo_placa,
            m.id_tecnico, t.nome_completo AS condutor_nome, t.matricula AS condutor_matricula,
            m.data_hora_infracao, m.local_infracao, m.codigo_infracao, m.descricao_infracao,
            m.gravidade, m.pontuacao, m.valor_original, m.valor_com_desconto,
            m.data_limite_indicacao, m.data_limite_pagamento, m.condutor_indicado,
            m.link_documento, m.status_pagamento, m.status_cobranca_colaborador,
            oa.sigla AS orgao_sigla,
            (m.data_limite_indicacao - CURRENT_DATE) AS dias_para_vencer_indicacao,
            CASE 
                WHEN (m.data_limite_indicacao - CURRENT_DATE) < 0 THEN 'PRAZO_ESTOURADO_RISCO_NIC'
                WHEN (m.data_limite_indicacao - CURRENT_DATE) <= 5 THEN 'URGENTE_CRITICO'
                WHEN (m.data_limite_indicacao - CURRENT_DATE) <= 15 THEN 'ALERTA_MODERADO'
                ELSE 'NO_PRAZO'
            END AS gravidade_prazo_indicacao
        FROM tb_frota_multas m
        JOIN tb_frota_veiculos v ON m.id_veiculo = v.id_veiculo
        LEFT JOIN tb_tecnico t ON m.id_tecnico = t.id_tecnico
        LEFT JOIN tb_frota_orgaos_autuadores oa ON m.id_orgao = oa.id_orgao
        WHERE m.condutor_indicado = FALSE
        ORDER BY m.data_limite_indicacao ASC NULLS LAST;
    """)

    rows = db.execute(sql).fetchall()
    return [
        MultaRead(
            id_multa=r.id_multa,
            numero_ait=r.numero_ait,
            id_veiculo=r.id_veiculo,
            veiculo_placa=r.veiculo_placa,
            id_tecnico=r.id_tecnico,
            condutor_nome=r.condutor_nome,
            condutor_matricula=r.condutor_matricula,
            data_hora_infracao=r.data_hora_infracao,
            local_infracao=r.local_infracao,
            codigo_infracao=r.codigo_infracao,
            descricao_infracao=r.descricao_infracao,
            gravidade=r.gravidade,
            pontuacao=r.pontuacao,
            valor_original=r.valor_original,
            valor_com_desconto=r.valor_com_desconto,
            data_limite_indicacao=r.data_limite_indicacao,
            data_limite_pagamento=r.data_limite_pagamento,
            condutor_indicado=r.condutor_indicado,
            link_documento=r.link_documento,
            status_pagamento=r.status_pagamento,
            status_cobranca_colaborador=r.status_cobranca_colaborador,
            orgao_sigla=r.orgao_sigla,
            dias_para_vencer_indicacao=r.dias_para_vencer_indicacao,
            gravidade_prazo_indicacao=r.gravidade_prazo_indicacao
        )
        for r in rows
    ]

@router.post("/{id_multa}/indicar-condutor", summary="Protocolar Indicação de Condutor Infrator")
def indicar_condutor(id_multa: UUID, dados: MultaIndicacaoRequest, db: Session = Depends(get_db)):
    """
    Registra o condutor indicado no Auto de Infração, protocolo de envio e atualiza a flag condutor_indicado.
    Permite associar a técnicos desligados caso a infração tenha ocorrido durante o período de trabalho.
    """
    multa = db.query(Multa).filter(Multa.id_multa == id_multa).first()
    if not multa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Auto de Infração não encontrado.")

    tecnico = db.query(Tecnico).filter(Tecnico.id_tecnico == dados.id_tecnico).first()
    if not tecnico:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Técnico não encontrado.")

    multa.id_tecnico = tecnico.id_tecnico
    multa.condutor_indicado = True
    multa.protocolo_indicacao = dados.protocolo_indicacao
    multa.data_envio_arval = dados.data_envio_arval or date.today()
    if dados.observacoes:
        multa.observacoes = f"{multa.observacoes or ''} | Indicação: {dados.observacoes}".strip(" | ")

    db.commit()
    return {
        "status": "sucesso",
        "mensagem": f"Condutor {tecnico.nome_completo} indicado com sucesso no AIT {multa.numero_ait}.",
        "numero_ait": multa.numero_ait,
        "condutor_indicado": True
    }
