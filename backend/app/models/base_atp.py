from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class BaseATP(Base):
    __tablename__ = "tb_base_atp"

    id_base = Column(Integer, primary_key=True, index=True)
    ct_codigo = Column(String(50), nullable=False)
    nome_atp = Column(String(200), nullable=False)
    cidade = Column(String(100))
    uf = Column(String(2))
    regiao = Column(String(50))
    supervisor = Column(String(150))
    id_supervisor = Column(Integer)
    ativa = Column(Boolean, default=True, index=True)
    opera_frota = Column(Boolean, default=False, index=True)
    status_base = Column(String(30), default="OPERACIONAL")

    # Relacionamentos
    veiculos = relationship("Veiculo", back_populates="base_atp")
