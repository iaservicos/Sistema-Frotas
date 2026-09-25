from typing import Optional
from datetime import date
from pydantic import BaseModel, ConfigDict

class TecnicoSimple(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_tecnico: int
    matricula: Optional[str] = None
    nome_completo: str
    cargo: Optional[str] = None
    ativo: Optional[bool] = True
    status_colaborador: Optional[str] = "ATIVO"
    cnh_numero: Optional[str] = None
    cnh_vencimento: Optional[date] = None
    cnh_pontuacao: Optional[int] = 0

class TecnicoDetail(TecnicoSimple):
    cpf: Optional[str] = None
    rg: Optional[str] = None
    email: Optional[str] = None
    celular_corporativo: Optional[str] = None
    data_admissao: Optional[date] = None
    data_demissao: Optional[date] = None
    codigo_sap_fornecedor: Optional[str] = None

class TecnicoAptoResponse(BaseModel):
    id_tecnico: int
    matricula: Optional[str] = None
    nome_completo: str
    apto_para_cautela: bool
    motivo_inaptidao: Optional[str] = None
    cnh_vencimento: Optional[date] = None
    cnh_pontuacao: int = 0
