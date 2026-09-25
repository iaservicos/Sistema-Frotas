import psycopg2
from dotenv import dotenv_values

env = dotenv_values('.env')
conn = psycopg2.connect(
    host=env.get('POSTGRES_HOST'),
    port=env.get('POSTGRES_PORT'),
    dbname=env.get('POSTGRES_DB'),
    user=env.get('POSTGRES_USER'),
    password=env.get('POSTGRES_PASSWORD'),
    sslmode='require'
)
cur = conn.cursor()

print("=== flyway_schema_history ===")
try:
    cur.execute("SELECT installed_rank, version, description, script, installed_on, success FROM flyway_schema_history ORDER BY installed_rank;")
    for r in cur.fetchall():
        print(r)
except Exception as e:
    print("Erro lendo flyway_schema_history:", e)
    conn.rollback()

print("\n=== tb_tecnico columns ===")
try:
    cur.execute("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'tb_tecnico' ORDER BY ordinal_position;")
    for r in cur.fetchall():
        print(f"  {r[0]:25} | {r[1]:15} | Nullable: {r[2]}")
except Exception as e:
    print("Erro lendo tb_tecnico:", e)
    conn.rollback()

print("\n=== tb_base_atp columns ===")
try:
    cur.execute("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'tb_base_atp' ORDER BY ordinal_position;")
    for r in cur.fetchall():
        print(f"  {r[0]:25} | {r[1]:15} | Nullable: {r[2]}")
except Exception as e:
    print("Erro lendo tb_base_atp:", e)
    conn.rollback()

print("\n=== tb_supervisor columns ===")
try:
    cur.execute("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'tb_supervisor' ORDER BY ordinal_position;")
    for r in cur.fetchall():
        print(f"  {r[0]:25} | {r[1]:15} | Nullable: {r[2]}")
    cur.execute("SELECT COUNT(*) FROM tb_supervisor;")
    print("Total tb_supervisor:", cur.fetchone()[0])
except Exception as e:
    print("Erro lendo tb_supervisor:", e)
    conn.rollback()

print("\n=== Quantidade de registros em tb_tecnico e tb_base_atp ===")
try:
    cur.execute("SELECT COUNT(*) FROM tb_tecnico;")
    print("Total tb_tecnico:", cur.fetchone()[0])
    cur.execute("SELECT COUNT(*) FROM tb_base_atp;")
    print("Total tb_base_atp:", cur.fetchone()[0])
except Exception as e:
    print("Erro contando:", e)
    conn.rollback()

conn.close()
