import uuid
from sqlalchemy import Column, Integer, String, Numeric, Boolean, Date, DateTime, ForeignKey, Text, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class OrgaoAutuador(Base):
    __tablename__ = "tb_frota_orgaos_autuadores"

    id_orgao = Column(Integer, primary_key=True, index=True)
    sigla = Column(String(30), unique=True, nullable=False)
    nome = Column(String(150), nullable=True)
    esfera = Column(String(30), default="MUNICIPAL")
    created_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))

    multas = relationship("Multa", back_populates="orgao")

class Multa(Base):
    __tablename__ = "tb_frota_multas"

    id_multa = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    numero_ait = Column(String(60), unique=True, nullable=False, index=True)
    id_veiculo = Column(UUID(as_uuid=True), ForeignKey("tb_frota_veiculos.id_veiculo", ondelete="CASCADE"), nullable=False, index=True)
    id_tecnico = Column(Integer, ForeignKey("tb_tecnico.id_tecnico", ondelete="SET NULL"), nullable=True, index=True)
    id_orgao = Column(Integer, ForeignKey("tb_frota_orgaos_autuadores.id_orgao"), nullable=True)
    data_hora_infracao = Column(DateTime(timezone=True), nullable=False, index=True)
    local_infracao = Column(String(250), nullable=True)
    codigo_infracao = Column(String(30), nullable=True)
    descricao_infracao = Column(String(250), nullable=True)
    gravidade = Column(String(20), default="MEDIA")
    pontuacao = Column(Integer, default=0)
    valor_original = Column(Numeric(10, 2), nullable=False, default=0.00)
    valor_com_desconto = Column(Numeric(10, 2), nullable=True)
    data_limite_indicacao = Column(Date, nullable=True, index=True)
    data_limite_pagamento = Column(Date, nullable=True)
    condutor_indicado = Column(Boolean, default=False, nullable=False, index=True)
    data_envio_arval = Column(Date, nullable=True)
    protocolo_indicacao = Column(String(100), nullable=True)
    link_documento = Column(Text, nullable=True)
    status_pagamento = Column(String(30), default="PENDENTE", index=True)
    status_cobranca_colaborador = Column(String(30), default="A_DESCONTAR")
    mes_desconto_folha = Column(String(7), nullable=True)
    observacoes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("clock_timestamp()"))

    # Relacionamentos
    veiculo = relationship("Veiculo", back_populates="multas")
    tecnico = relationship("Tecnico", back_populates="multas")
    orgao = relationship("OrgaoAutuador", back_populates="multas")
