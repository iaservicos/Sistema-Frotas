from typing import Optional
from uuid import UUID
from datetime import datetime, date
from decimal import Decimal
from pydantic import BaseModel, ConfigDict

class MultaBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    numero_ait: str
    data_hora_infracao: datetime
    local_infracao: Optional[str] = None
    codigo_infracao: Optional[str] = None
    descricao_infracao: Optional[str] = None
    gravidade: str = "MEDIA"
    pontuacao: int = 0
    valor_original: Decimal
    valor_com_desconto: Optional[Decimal] = None
    data_limite_indicacao: Optional[date] = None
    data_limite_pagamento: Optional[date] = None
    condutor_indicado: bool = False
    link_documento: Optional[str] = None
    status_pagamento: str = "PENDENTE"
    status_cobranca_colaborador: str = "A_DESCONTAR"

class MultaRead(MultaBase):
    id_multa: UUID
    id_veiculo: UUID
    veiculo_placa: Optional[str] = None
    id_tecnico: Optional[int] = None
    condutor_nome: Optional[str] = None
    condutor_matricula: Optional[str] = None
    orgao_sigla: Optional[str] = None
    dias_para_vencer_indicacao: Optional[int] = None
    gravidade_prazo_indicacao: Optional[str] = "NO_PRAZO"

class MultaIndicacaoRequest(BaseModel):
    id_tecnico: int
    protocolo_indicacao: Optional[str] = None
    data_envio_arval: Optional[date] = None
    observacoes: Optional[str] = None
