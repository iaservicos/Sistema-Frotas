from backend.app.models.tecnico import Tecnico
from backend.app.models.base_atp import BaseATP
from backend.app.models.veiculo import Veiculo, Locadora
from backend.app.models.custodia import Custodia
from backend.app.models.manutencao import Manutencao, Oficina
from backend.app.models.multa import Multa, OrgaoAutuador

__all__ = [
    "Tecnico",
    "BaseATP",
    "Veiculo",
    "Locadora",
    "Custodia",
    "Manutencao",
    "Oficina",
    "Multa",
    "OrgaoAutuador"
]
