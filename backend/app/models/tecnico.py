from sqlalchemy import Column, Integer, String, Boolean, Date
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Tecnico(Base):
    __tablename__ = "tb_tecnico"

    id_tecnico = Column(Integer, primary_key=True, index=True)
    matricula = Column(String(50), unique=True, index=True)
    nome_completo = Column(String(200), nullable=False)
    cargo = Column(String(100))
    ativo = Column(Boolean, default=True, index=True)
    status_colaborador = Column(String(30), default="ATIVO", index=True)
    cpf = Column(String(20), unique=True, index=True)
    rg = Column(String(30))
    data_admissao = Column(Date)
    data_demissao = Column(Date)
    data_nascimento = Column(Date)
    cnh_numero = Column(String(30))
    cnh_categoria = Column(String(10))
    cnh_vencimento = Column(Date, index=True)
    cnh_pontuacao = Column(Integer, default=0)
    codigo_sap_fornecedor = Column(String(50))
    email = Column(String(150))
    celular_corporativo = Column(String(30))
    id_supervisor = Column(Integer)

    # Relacionamentos
    custodias = relationship("Custodia", back_populates="tecnico")
    multas = relationship("Multa", back_populates="tecnico")
