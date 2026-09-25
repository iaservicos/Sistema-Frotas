from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict

class CustodiaCreate(BaseModel):
    id_veiculo: UUID
    id_tecnico: int
    hodometro_retirada: Decimal
    data_retirada: Optional[datetime] = None
    observacoes: Optional[str] = None

class CustodiaDevolucao(BaseModel):
    id_custodia: UUID
    hodometro_devolucao: Decimal
    data_devolucao: Optional[datetime] = None
    observacoes: Optional[str] = None

class CustodiaRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_custodia: UUID
    id_veiculo: UUID
    veiculo_placa: Optional[str] = None
    veiculo_modelo: Optional[str] = None
    id_tecnico: int
    tecnico_nome: Optional[str] = None
    tecnico_matricula: Optional[str] = None
    data_retirada: datetime
    hodometro_retirada: Decimal
    data_devolucao: Optional[datetime] = None
    hodometro_devolucao: Optional[Decimal] = None
    status: str
    observacoes: Optional[str] = None

class MeuVeiculoResponse(BaseModel):
    tem_veiculo_ativo: bool
    custodia: Optional[CustodiaRead] = None
    veiculo: Optional[dict] = None
    alertas: list[str] = []
