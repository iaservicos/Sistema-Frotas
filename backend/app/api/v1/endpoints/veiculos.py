from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.frota_service import FrotaService
from backend.app.schemas.veiculo import PaginatedVeiculos, VeiculoKPISummary

router = APIRouter()

@router.get("/kpis", response_model=VeiculoKPISummary, summary="4 KPIs Executivos da Torre de Controle")
def get_kpis(db: Session = Depends(get_db)):
    """Retorna métricas da frota em tempo real: totais, % em uso, revisões críticas, multas NIC e inativos."""
    return FrotaService.get_kpis(db)

@router.get("", response_model=PaginatedVeiculos, summary="Listagem Paginada de Veículos com Filtros")
def list_veiculos(
    status: Optional[str] = Query(None, description="Filtro de status: DISPONIVEL, EM_USO, MANUTENCAO, SINISTRADO, DEVOLVIDO"),
    base_id: Optional[int] = Query(None, description="ID da base/ATP de alocação"),
    busca: Optional[str] = Query(None, description="Busca por placa, modelo ou condutor"),
    page: int = Query(1, ge=1, description="Número da página"),
    page_size: int = Query(50, ge=1, le=500, description="Itens por página"),
    db: Session = Depends(get_db)
):
    """Lista a frota com filtros dinâmicos e enriquecimento de condutor sob custódia ativa."""
    return FrotaService.list_veiculos(
        db=db,
        status=status,
        base_id=base_id,
        busca=busca,
        page=page,
        page_size=page_size
    )

@router.get("/{placa}", summary="Ficha Completa de um Veículo")
def get_veiculo_por_placa(placa: str, db: Session = Depends(get_db)):
    """Retorna os dados do veículo, condutor ativo, histórico de manutenções e autuações de trânsito."""
    veiculo = FrotaService.get_veiculo_por_placa(db, placa)
    if not veiculo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Veículo com placa '{placa.upper()}' não encontrado."
        )
    return veiculo
