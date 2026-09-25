"""
Executor de Migrações Flyway Direto no Supabase
Aplica as migrações V70 a V77 e registra o histórico na tabela flyway_schema_history.
"""

import os
import time
import zlib
import ctypes
import psycopg2
from dotenv import dotenv_values

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MIGRATIONS_DIR = os.path.join(BASE_DIR, "db", "migrations")

def compute_checksum(filepath):
    with open(filepath, "rb") as f:
        data = f.read()
    crc = zlib.crc32(data)
    return ctypes.c_int32(crc).value

def apply_migrations():
    print("Iniciando aplicação das migrações de Frota no Supabase...", flush=True)
    env = dotenv_values(os.path.join(BASE_DIR, ".env"))
    conn = psycopg2.connect(
        host=env.get('POSTGRES_HOST'),
        port=env.get('POSTGRES_PORT'),
        dbname=env.get('POSTGRES_DB'),
        user=env.get('POSTGRES_USER'),
        password=env.get('POSTGRES_PASSWORD'),
        sslmode='require'
    )
    conn.autocommit = False
    cur = conn.cursor()

    # 1. Verificar último installed_rank
    cur.execute("SELECT COALESCE(MAX(installed_rank), 0) FROM flyway_schema_history;")
    last_rank = cur.fetchone()[0]
    print(f"Último installed_rank no Supabase: {last_rank}", flush=True)

    # 2. Obter versões já instaladas
    cur.execute("SELECT version FROM flyway_schema_history WHERE version IS NOT NULL;")
    installed_versions = set(r[0] for r in cur.fetchall())
    print(f"Versões já instaladas no Supabase: {sorted(list(installed_versions))}", flush=True)

    # 3. Listar arquivos de migração
    migration_files = sorted([f for f in os.listdir(MIGRATIONS_DIR) if f.endswith(".sql") and f.startswith("V")])
    print(f"Migrações encontradas em db/migrations/: {migration_files}", flush=True)

    current_rank = last_rank

    for filename in migration_files:
        # Extrai versão e descrição do padrão V{version}__{description}.sql
        parts = filename.split("__")
        version = parts[0][1:]
        raw_desc = parts[1].replace(".sql", "").replace("_", " ")
        description = raw_desc.title()

        if version in installed_versions:
            print(f"[-] Migração V{version} ({filename}) já aplicada. Pulando.", flush=True)
            continue

        print(f"\n[+] Aplicando V{version}: {description}...", flush=True)
        filepath = os.path.join(MIGRATIONS_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            sql_content = f.read()

        start_time = time.time()
        try:
            # Executa o script
            cur.execute(sql_content)
            exec_time_ms = int((time.time() - start_time) * 1000)
            checksum = compute_checksum(filepath)
            current_rank += 1

            # Registra no histórico do Flyway
            cur.execute("""
                INSERT INTO flyway_schema_history 
                (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success)
                VALUES (%s, %s, %s, 'SQL', %s, %s, %s, clock_timestamp(), %s, TRUE);
            """, (current_rank, version, description, filename, checksum, env.get('POSTGRES_USER'), exec_time_ms))

            conn.commit()
            print(f"[OK] Migração V{version} aplicada com SUCESSO em {exec_time_ms}ms!", flush=True)
        except Exception as e:
            conn.rollback()
            print(f"[ERRO] Falha ao aplicar migração V{version}: {e}", flush=True)
            break

    conn.close()
    print("\nProcesso de migrações no Supabase finalizado!", flush=True)

if __name__ == "__main__":
    apply_migrations()
