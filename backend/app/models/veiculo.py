import uuid
from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Locadora(Base):
    __tablename__ = "tb_frota_locadoras"

    id_locadora = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), unique=True, nullable=False)
    cnpj = Column(String(20))
    contato_suporte = Column(String(150))
    created_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))

    veiculos = relationship("Veiculo", back_populates="locadora")

class Veiculo(Base):
    __tablename__ = "tb_frota_veiculos"

    id_veiculo = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    placa = Column(String(10), unique=True, nullable=False, index=True)
    chassi = Column(String(30), unique=True)
    renavam = Column(String(20))
    marca = Column(String(50), default="RENAULT")
    modelo = Column(String(120), nullable=False)
    ano = Column(Integer, default=2026)
    id_locadora = Column(Integer, ForeignKey("tb_frota_locadoras.id_locadora"), nullable=True)
    id_base = Column(Integer, ForeignKey("tb_base_atp.id_base"), nullable=True, index=True)
    status_operacional = Column(String(30), nullable=False, default="DISPONIVEL", index=True)
    hodometro_atual = Column(Numeric(10, 2), nullable=False, default=0.00)
    tanque_capacidade_litros = Column(Numeric(5, 2), default=50.00)
    franquia_mensal_km = Column(Numeric(10, 2), default=2800.00)
    franquia_final_km = Column(Numeric(10, 2), default=100800.00)
    custo_locacao_mensal = Column(Numeric(10, 2), default=1933.53)
    data_inicio_contrato = Column(Date)
    data_fim_contrato = Column(Date, index=True)
    created_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))

    # Relacionamentos
    locadora = relationship("Locadora", back_populates="veiculos")
    base_atp = relationship("BaseATP", back_populates="veiculos")
    custodias = relationship("Custodia", back_populates="veiculo", cascade="all, delete-orphan")
    manutencoes = relationship("Manutencao", back_populates="veiculo", cascade="all, delete-orphan")
    multas = relationship("Multa", back_populates="veiculo", cascade="all, delete-orphan")
