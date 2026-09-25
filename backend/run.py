import uvicorn
import os
import sys

# Garante que o diretório raiz esteja no PYTHONPATH
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

if __name__ == "__main__":
    print("Iniciando SGFrotas FastAPI Server na porta 8000...", flush=True)
    print("Swagger UI disponível em: http://localhost:8000/docs", flush=True)
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
