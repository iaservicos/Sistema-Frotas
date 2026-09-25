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

print("=== 1. STATUS DE TÉCNICOS EM tb_tecnico ===")
cur.execute("SELECT ativo, COUNT(*) FROM tb_tecnico GROUP BY ativo;")
for r in cur.fetchall():
    print(f"  Ativo={r[0]}: {r[1]} técnicos")

print("\n=== 2. AMOSTRA DE CAMPOS DE tb_tecnico ===")
cur.execute("SELECT id_tecnico, matricula, nome_completo, cargo, ativo, role FROM tb_tecnico LIMIT 5;")
for r in cur.fetchall():
    print(" ", r)

print("\n=== 3. STATUS DE BASES EM tb_base_atp ===")
cur.execute("SELECT tipo_atp, COUNT(*) FROM tb_base_atp GROUP BY tipo_atp LIMIT 10;")
for r in cur.fetchall():
    print(" ", r)

print("\n=== 4. TABELAS DO PROGRAMA BRILHA MAIS ===")
brilha_tables = ['tb_campanha', 'tb_regra_kpi', 'tb_faixa_pontuacao', 'tb_apuracao_mensal']
for t in brilha_tables:
    try:
        cur.execute(f"SELECT COUNT(*) FROM {t};")
        count = cur.fetchone()[0]
        print(f"\n--- {t} (Total: {count} registros) ---")
        cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{t}' ORDER BY ordinal_position;")
        cols = [f"{c[0]} ({c[1]})" for c in cur.fetchall()]
        print("  Colunas:", ", ".join(cols[:8]))
        cur.execute(f"SELECT * FROM {t} LIMIT 3;")
        for row in cur.fetchall():
            print("  Exemplo:", row[:6])
    except Exception as e:
        print(f"  Erro ao consultar {t}:", e)
        conn.rollback()

print("\n=== 5. VIEWS DO BRILHA MAIS ===")
cur.execute("""
    SELECT table_name 
    FROM information_schema.views 
    WHERE table_schema = 'public' AND table_name LIKE 'vw_%';
""")
for v in cur.fetchall():
    print("  View:", v[0])

conn.close()
