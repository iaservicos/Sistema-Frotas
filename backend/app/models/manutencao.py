import uuid
from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, ForeignKey, Text, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Oficina(Base):
    __tablename__ = "tb_frota_oficinas"

    id_oficina = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    cnpj = Column(String(20), unique=True)
    telefone = Column(String(30))
    email = Column(String(150))
    endereco = Column(String(250))
    cidade = Column(String(100))
    uf = Column(String(2))
    created_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))

    manutencoes = relationship("Manutencao", back_populates="oficina")

class Manutencao(Base):
    __tablename__ = "tb_frota_manutencoes"

    id_manutencao = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_veiculo = Column(UUID(as_uuid=True), ForeignKey("tb_frota_veiculos.id_veiculo", ondelete="CASCADE"), nullable=False, index=True)
    id_oficina = Column(Integer, ForeignKey("tb_frota_oficinas.id_oficina"), nullable=True)
    tipo_manutencao = Column(String(30), nullable=False, default="PREVENTIVA", index=True)
    ciclo_km = Column(Integer, nullable=True)
    odometro_momento = Column(Numeric(10, 2), nullable=False, default=0.00)
    proxima_revisao_km = Column(Numeric(10, 2), nullable=True, index=True)
    data_agendamento = Column(Date, nullable=True)
    data_realizacao = Column(Date, nullable=True, index=True)
    valor_total = Column(Numeric(10, 2), default=0.00)
    status = Column(String(30), nullable=False, default="PENDENTE", index=True)
    ordem_servico_numero = Column(String(50), nullable=True)
    descricao_servico = Column(Text, nullable=True)
    notas = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))

    # Relacionamentos
    veiculo = relationship("Veiculo", back_populates="manutencoes")
    oficina = relationship("Oficina", back_populates="manutencoes")
