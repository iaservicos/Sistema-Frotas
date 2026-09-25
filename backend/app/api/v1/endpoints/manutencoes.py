from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.core.database import get_db
from backend.app.schemas.manutencao import AlertaManutencaoPreventiva

router = APIRouter()

@router.get("/alertas-preventivos", response_model=List[AlertaManutencaoPreventiva], summary="Alertas de Revisão Periódica por Odômetro")
def get_alertas_manutencao(
    status_alerta: Optional[str] = Query(None, description="Filtro: REVISAO_VENCIDA, ALERTA_CRITICO, PROGRAMAR_REVISAO, REGULAR"),
    db: Session = Depends(get_db)
):
    """
    Lista veículos monitorados por ciclos de revisão a cada 10.000 km,
    calculando o km restante e a criticidade do agendamento preventivo.
    """
    where_sql = "WHERE status_alerta_revisao = :status" if status_alerta else ""
    params = {"status": status_alerta.upper()} if status_alerta else {}

    sql = text(f"""
        SELECT 
            id_veiculo, placa, modelo, hodometro_atual,
            nome_atp AS base_nome, uf AS base_uf,
            proxima_revisao_km, km_restante_revisao, status_alerta_revisao
        FROM vw_frota_alertas_manutencao
        {where_sql}
        ORDER BY km_restante_revisao ASC;
    """)

    rows = db.execute(sql, params).fetchall()
    return [
        AlertaManutencaoPreventiva(
            id_veiculo=r.id_veiculo,
            placa=r.placa,
            modelo=r.modelo,
            hodometro_atual=r.hodometro_atual,
            base_nome=r.base_nome,
            base_uf=r.base_uf,
            proxima_revisao_km=r.proxima_revisao_km,
            km_restante_revisao=r.km_restante_revisao,
            status_alerta_revisao=r.status_alerta_revisao
        )
        for r in rows
    ]
