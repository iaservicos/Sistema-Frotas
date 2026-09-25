from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.cautela_service import CautelaService
from backend.app.schemas.custodia import CustodiaCreate, CustodiaDevolucao, CustodiaRead, MeuVeiculoResponse

router = APIRouter()

@router.get("/meu-veiculo", response_model=MeuVeiculoResponse, summary="Veículo em Cautela Ativa (PWA do Técnico)")
def get_meu_veiculo(
    id_tecnico: Optional[int] = Query(None, description="ID interno do técnico no banco"),
    matricula: Optional[str] = Query(None, description="Matrícula do técnico"),
    db: Session = Depends(get_db)
):
    """Retorna o veículo ativo sob custódia do técnico para visualização no aplicativo móvel."""
    return CautelaService.get_meu_veiculo(db, id_tecnico=id_tecnico, matricula=matricula)

@router.post("/alocar", response_model=CustodiaRead, status_code=status.HTTP_201_CREATED, summary="Alocar Veículo a um Técnico")
def alocar_veiculo(dados: CustodiaCreate, db: Session = Depends(get_db)):
    """
    Registra termo de responsabilidade e posse de um veículo.
    Bloqueia automaticamente se o técnico estiver inativo, demitido ou com CNH irregular.
    """
    return CautelaService.alocar_veiculo(db, dados)

@router.post("/devolver", response_model=CustodiaRead, summary="Encerrar Custódia e Devolver Veículo")
def devolver_veiculo(dados: CustodiaDevolucao, db: Session = Depends(get_db)):
    """
    Registra a devolução do veículo com odômetro de retorno, liberando o carro para novas alocações.
    """
    return CautelaService.devolver_veiculo(db, dados)
