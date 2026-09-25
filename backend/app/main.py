from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    ## 🚀 SGFrotas API - Sistema Integrado de Gestão de Frotas & Operações de Campo
    
    API REST oficial conectada ao **PostgreSQL Central (Supabase)**, integrada ao ecossistema **DigitalTwin** e **Brilha Mais**.
    
    ### Principais Recursos Disponibilizados:
    * 🚗 **Torre de Controle:** 4 KPIs em tempo real, listagem filtrada por ATP, máquina de estados da frota e fichas completas.
    * 📱 **Jornada do Técnico (PWA Mobile):** Consulta de veículo cautelado, termo de alocação com trava anti-inativo e devolução com registro de odômetro.
    * ⏱️ **Prazos & Contratos Arval:** Monitoramento de vigência e desmobilização de ativos.
    * 🔧 **Manutenção Preventiva:** Acompanhamento de revisões periódicas a cada 10.000 km e quilometragem restante.
    * 🛡️ **Prevenção de Multa NIC:** Gestão de prazos de indicação de condutor e contagem regressiva para expirar o prazo no DETRAN/órgãos.
    """,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra as rotas da versão 1
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Healthcheck & Status"])
def root():
    """Endpoint raiz para verificação de status da API."""
    return {
        "status": "online",
        "projeto": settings.PROJECT_NAME,
        "versao": settings.VERSION,
        "banco": "PostgreSQL Supabase (Central)",
        "documentacao_swagger": "/docs",
        "documentacao_redoc": "/redoc"
    }

@app.get("/health", tags=["Healthcheck & Status"])
def healthcheck():
    """Healthcheck para monitoramento e orquestradores."""
    return {"status": "healthy"}
