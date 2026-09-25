from typing import Optional
from uuid import UUID
from datetime import date
from decimal import Decimal
from pydantic import BaseModel, ConfigDict

class ManutencaoBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ciclo_km: Optional[int] = None
    odometro_momento: Decimal
    proxima_revisao_km: Optional[Decimal] = None
    tipo_manutencao: str = "PREVENTIVA"
    status: str = "PENDENTE"
    data_agendamento: Optional[date] = None
    data_realizacao: Optional[date] = None
    valor_total: Optional[Decimal] = Decimal("0.00")
    ordem_servico_numero: Optional[str] = None
    notas: Optional[str] = None

class ManutencaoCreate(ManutencaoBase):
    id_veiculo: UUID
    id_oficina: Optional[int] = None

class ManutencaoRead(ManutencaoBase):
    id_manutencao: UUID
    id_veiculo: UUID
    placa: Optional[str] = None
    modelo: Optional[str] = None
    oficina_nome: Optional[str] = None
    km_restante: Optional[Decimal] = None
    status_alerta: Optional[str] = "REGULAR"

class AlertaManutencaoPreventiva(BaseModel):
    id_veiculo: UUID
    placa: str
    modelo: str
    hodometro_atual: Decimal
    base_nome: Optional[str] = None
    base_uf: Optional[str] = None
    proxima_revisao_km: Decimal
    km_restante_revisao: Decimal
    status_alerta_revisao: str # REVISAO_VENCIDA, ALERTA_CRITICO, PROGRAMAR_REVISAO, REGULAR
