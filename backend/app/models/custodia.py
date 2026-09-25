import uuid
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Text, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Custodia(Base):
    __tablename__ = "tb_frota_custodias"

    id_custodia = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_veiculo = Column(UUID(as_uuid=True), ForeignKey("tb_frota_veiculos.id_veiculo", ondelete="CASCADE"), nullable=False, index=True)
    id_tecnico = Column(Integer, ForeignKey("tb_tecnico.id_tecnico", ondelete="RESTRICT"), nullable=False, index=True)
    data_retirada = Column(DateTime(timezone=True), nullable=False)
    hodometro_retirada = Column(Numeric(10, 2), nullable=False, default=0.00)
    data_devolucao = Column(DateTime(timezone=True), nullable=True)
    hodometro_devolucao = Column(Numeric(10, 2), nullable=True)
    status = Column(String(30), nullable=False, default="ATIVA", index=True)
    observacoes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))

    # Relacionamentos
    veiculo = relationship("Veiculo", back_populates="custodias")
    tecnico = relationship("Tecnico", back_populates="custodias")
