"""
Script de Conciliação e De-Duplicação: Planilhas Legadas ⇄ Supabase DigitalTwin
Gera a migração V77__frota_seed_initial_data.sql aplicando o Protocolo Zero Duplicações.
"""

import os
import re
import csv
from datetime import datetime
import openpyxl
import psycopg2
from dotenv import dotenv_values

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DOCS_PLANILHAS = os.path.join(BASE_DIR, "docs", "Planilhas")
OUTPUT_SQL = os.path.join(BASE_DIR, "db", "migrations", "V77__frota_seed_initial_data.sql")

def escape_sql(val):
    if val is None:
        return "NULL"
    val_str = str(val).strip()
    if val_str == "" or val_str.lower() == "none" or val_str.lower() == "null":
        return "NULL"
    cleaned = val_str.replace("'", "''")
    return f"'{cleaned}'"

def format_date_sql(val):
    if not val:
        return "NULL"
    if isinstance(val, datetime):
        return f"'{val.strftime('%Y-%m-%d')}'"
    val_str = str(val).strip()
    match_br = re.match(r'^(\d{2})/(\d{2})/(\d{4})', val_str)
    if match_br:
        d, m, y = match_br.groups()
        return f"'{y}-{m}-{d}'"
    match_iso = re.match(r'^(\d{4})-(\d{2})-(\d{2})', val_str)
    if match_iso:
        return f"'{val_str[:10]}'"
    return "NULL"

def format_timestamp_sql(val):
    if not val:
        return "NULL"
    if isinstance(val, datetime):
        return f"'{val.strftime('%Y-%m-%d %H:%M:%S+00')}'"
    val_str = str(val).strip()
    match_br = re.match(r'^(\d{2})/(\d{2})/(\d{4})\s*(\d{2}:\d{2}(?::\d{2})?)?', val_str)
    if match_br:
        d, m, y, hora = match_br.groups()
        h = hora if hora else "00:00:00"
        if len(h) == 5:
            h += ":00"
        return f"'{y}-{m}-{d} {h}+00'"
    match_iso = re.match(r'^(\d{4})-(\d{2})-(\d{2})\s*(\d{2}:\d{2}(?::\d{2})?)?', val_str)
    if match_iso:
        d_str = val_str[:10]
        h_part = val_str[11:].strip() if len(val_str) > 10 else "00:00:00"
        return f"'{d_str} {h_part}+00'"
    return "NULL"

def clean_decimal(val, default=0.0):
    if val is None:
        return str(default)
    val_str = str(val).strip()
    if not val_str:
        return str(default)
    val_str = val_str.replace("R$", "").replace(" ", "")
    if "," in val_str and "." in val_str:
        val_str = val_str.replace(".", "").replace(",", ".")
    elif "," in val_str:
        val_str = val_str.replace(",", ".")
    try:
        f = float(val_str)
        return f"{f:.2f}"
    except ValueError:
        return str(default)

def clean_cpf(val):
    if not val:
        return None
    val_str = re.sub(r'\D', '', str(val))
    if len(val_str) == 11:
        return f"{val_str[:3]}.{val_str[3:6]}.{val_str[6:9]}-{val_str[9:]}"
    return str(val).strip()[:14] if str(val).strip() else None

def clean_placa(val):
    if not val:
        return None
    placa = str(val).strip().upper().replace("-", "")
    return placa if len(placa) >= 7 else None

def normalize_name(name):
    if not name:
        return ""
    s = str(name).strip().upper()
    s = re.sub(r'\s+', ' ', s)
    return s

def run_sync():
    print("Iniciando conciliação estrita com Supabase...", flush=True)
    env = dotenv_values(os.path.join(BASE_DIR, ".env"))
    conn = psycopg2.connect(
        host=env.get('POSTGRES_HOST'),
        port=env.get('POSTGRES_PORT'),
        dbname=env.get('POSTGRES_DB'),
        user=env.get('POSTGRES_USER'),
        password=env.get('POSTGRES_PASSWORD'),
        sslmode='require'
    )
    cur = conn.cursor()

    # 1. Carregar Técnicos Existentes do Supabase
    cur.execute("SELECT id_tecnico, matricula, cpf, nome_completo, ativo FROM tb_tecnico;")
    db_tecnicos = cur.fetchall()
    print(f"Total de técnicos existentes no Supabase: {len(db_tecnicos)}", flush=True)

    # Dicionários de Busca Rápida
    tec_by_matricula = {}
    tec_by_cpf = {}
    tec_by_name = {}

    for t in db_tecnicos:
        id_tec, mat, cpf, nome, ativo = t
        if mat and str(mat).strip():
            tec_by_matricula[str(mat).strip()] = id_tec
        if cpf:
            cpf_clean = re.sub(r'\D', '', str(cpf))
            if cpf_clean:
                tec_by_cpf[cpf_clean] = id_tec
        if nome:
            tec_by_name[normalize_name(nome)] = id_tec

    # 2. Carregar Bases ATP Existentes do Supabase
    cur.execute("SELECT id_base, ct_codigo, nome_atp, uf, cidade FROM tb_base_atp;")
    db_bases = cur.fetchall()
    print(f"Total de bases ATP existentes no Supabase: {len(db_bases)}", flush=True)
    conn.close()

    base_by_cod = {}
    base_by_name = {}
    for b in db_bases:
        id_base, cod, nome, uf, cid = b
        if cod and str(cod).strip():
            base_by_cod[str(cod).strip()] = id_base
        if nome:
            base_by_name[normalize_name(nome)] = id_base

    # 3. Processar Planilha de Controle de Frotas
    planilha_controle = os.path.join(DOCS_PLANILHAS, "Planilha Controle Frota.xlsx")
    wb_controle = openpyxl.load_workbook(planilha_controle, read_only=True, data_only=True)

    sql_statements = [
        "-- =====================================================================",
        "-- Migration V77: Seed Inicial Sanitizado & Conciliação Zero Duplicações",
        "-- Database: PostgreSQL (Supabase Central)",
        "-- =====================================================================\n",
        "-- 1. Locadora Padrão",
        "INSERT INTO tb_frota_locadoras (nome, contato_suporte) VALUES ('ARVAL', 'suporte@arval.com.br') ON CONFLICT (nome) DO NOTHING;\n"
    ]

    # 4. Ativar as 19 Bases Operacionais da Frota (ZERO INSERTS em tb_base_atp)
    sql_statements.append("-- 2. Ativação das 19 Bases ATPs Operacionais da Frota")
    bases_operacionais_codigos = [
        '8788711', '2791005', '7812231', '89000650', '89007070', '89001910',
        '89007090', '89009100', '89009120', '89009140', '89009160', '89009170',
        '89009180', '89009190', '89009210', '89009220', '89009240', '89009260'
    ]
    cods_in_sql = ", ".join([f"'{c}'" for c in bases_operacionais_codigos])
    sql_statements.append(f"UPDATE tb_base_atp SET opera_frota = TRUE WHERE ct_codigo IN ({cods_in_sql});")
    sql_statements.append("UPDATE tb_base_atp SET opera_frota = TRUE WHERE nome_atp ILIKE '%POSITIVO%' OR nome_atp ILIKE '%FILIAL SP%' OR nome_atp ILIKE '%FIELD PR%';\n")

    # 5. Conciliação de Técnicos: UPDATE para existentes e INSERT apenas para novos reais
    sql_statements.append("-- 3. Conciliação e Enriquecimento de Técnicos (Zero Duplicações)")
    updates_count = 0
    inserts_count = 0

    if 'Base de técnicos' in wb_controle.sheetnames:
        ws_tecnicos = wb_controle['Base de técnicos']
        for row in ws_tecnicos.iter_rows(min_row=3, values_only=True):
            if not row or not row[1]:
                continue
            matr = str(row[1]).strip()
            nome = str(row[2]).strip() if len(row) > 2 and row[2] else ""
            status_raw = str(row[3]).strip().upper() if len(row) > 3 and row[3] else "EFETIVO"
            cargo = str(row[4]).strip() if len(row) > 4 and row[4] else None
            admissao = format_date_sql(row[6]) if len(row) > 6 else "NULL"
            rg = str(row[12]).strip() if len(row) > 12 and row[12] else None
            cpf_raw = clean_cpf(row[13]) if len(row) > 13 else None
            cpf_digits = re.sub(r'\D', '', cpf_raw) if cpf_raw else ""
            nasc = format_date_sql(row[14]) if len(row) > 14 else "NULL"
            sap = str(row[15]).strip() if len(row) > 15 and row[15] else None

            ativo_bool = "TRUE" if status_raw in ("EFETIVO", "ATIVO") else "FALSE"
            status_colab = "ATIVO" if status_raw in ("EFETIVO", "ATIVO") else "DESLIGADO"

            # Tenta Match nas 3 chaves
            matched_id = None
            if matr in tec_by_matricula:
                matched_id = tec_by_matricula[matr]
            elif cpf_digits and cpf_digits in tec_by_cpf:
                matched_id = tec_by_cpf[cpf_digits]
            elif normalize_name(nome) in tec_by_name:
                matched_id = tec_by_name[normalize_name(nome)]

            if matched_id:
                # UPDATE do técnico existente (sem alterar id_tecnico nem duplicar)
                updates_count += 1
                set_clauses = [
                    f"ativo = {ativo_bool}",
                    f"status_colaborador = '{status_colab}'"
                ]
                if cargo: set_clauses.append(f"cargo = {escape_sql(cargo)}")
                if rg: set_clauses.append(f"rg = {escape_sql(rg)}")
                if cpf_raw: set_clauses.append(f"cpf = {escape_sql(cpf_raw)}")
                if admissao != "NULL": set_clauses.append(f"data_admissao = {admissao}")
                if nasc != "NULL": set_clauses.append(f"data_nascimento = {nasc}")
                if sap: set_clauses.append(f"codigo_sap_fornecedor = {escape_sql(sap)}")
                
                sql_statements.append(f"UPDATE tb_tecnico SET {', '.join(set_clauses)} WHERE id_tecnico = {matched_id};")
            else:
                # Inserção segura apenas se não existir por nenhuma chave
                inserts_count += 1
                sql_statements.append(
                    f"INSERT INTO tb_tecnico (matricula, nome_completo, cargo, ativo, status_colaborador, cpf, rg, data_admissao, data_nascimento, codigo_sap_fornecedor) "
                    f"VALUES ({escape_sql(matr)}, {escape_sql(nome)}, {escape_sql(cargo)}, {ativo_bool}, '{status_colab}', {escape_sql(cpf_raw)}, {escape_sql(rg)}, {admissao}, {nasc}, {escape_sql(sap)}) "
                    f"ON CONFLICT (matricula) DO NOTHING;"
                )
    print(f"Conciliação de Técnicos: {updates_count} UPDATES gerados, {inserts_count} novos INSERTS.", flush=True)
    sql_statements.append("")

    # 6. Cadastro de Veículos da Frota
    sql_statements.append("-- 4. Cadastro de Veículos da Frota")
    veiculos_map = {}
    if 'Base Veiculos x técnicos' in wb_controle.sheetnames:
        ws_veic = wb_controle['Base Veiculos x técnicos']
        for row in ws_veic.iter_rows(min_row=2, values_only=True):
            if not row or not row[1]:
                continue
            placa = clean_placa(row[1])
            if not placa:
                continue
            
            data_entrega = format_date_sql(row[0]) if row[0] else "NULL"
            tecnico_nome = str(row[2]).strip() if len(row) > 2 and row[2] else None
            filial = str(row[4]).strip() if len(row) > 4 and row[4] else ""
            base = str(row[5]).strip() if len(row) > 5 and row[5] else ""
            hodo = clean_decimal(row[7], default=0.0) if len(row) > 7 else "0.00"
            franquia_mes = clean_decimal(row[12], default=2800.0) if len(row) > 12 else "2800.00"
            franquia_fim = clean_decimal(row[13], default=100800.0) if len(row) > 13 else "100800.00"

            locadora_subquery = "(SELECT id_locadora FROM tb_frota_locadoras WHERE nome = 'ARVAL' LIMIT 1)"
            base_subquery = f"(SELECT id_base FROM tb_base_atp WHERE nome_atp ILIKE '%{base}%' OR nome_atp ILIKE '%{filial}%' LIMIT 1)" if (base or filial) else "NULL"

            veiculos_map[placa] = {
                "tecnico_nome": tecnico_nome,
                "hodometro": hodo,
                "data_entrega": data_entrega
            }

            sql_statements.append(
                f"INSERT INTO tb_frota_veiculos (placa, modelo, id_locadora, id_base, status_operacional, hodometro_atual, franquia_mensal_km, franquia_final_km, data_inicio_contrato) "
                f"VALUES ({escape_sql(placa)}, 'RENAULT KWID ZEN 1.0', {locadora_subquery}, {base_subquery}, 'EM_USO', {hodo}, {franquia_mes}, {franquia_fim}, {data_entrega}) "
                f"ON CONFLICT (placa) DO UPDATE SET hodometro_atual = EXCLUDED.hodometro_atual, updated_at = clock_timestamp();"
            )
    sql_statements.append("")

    # 7. Custódia Ativa de Veículos (Vínculo Veículo x Condutor)
    sql_statements.append("-- 5. Custódias de Veículos (Termo de Posse com id_tecnico Oficial)")
    for placa, info in veiculos_map.items():
        if info["tecnico_nome"] and info["tecnico_nome"] != "0":
            tec_clean = info["tecnico_nome"].replace("'", "''")
            data_ini = info["data_entrega"] if info["data_entrega"] != "NULL" else "CURRENT_DATE"
            hodo = info["hodometro"]
            sql_statements.append(
                f"INSERT INTO tb_frota_custodias (id_veiculo, id_tecnico, data_retirada, hodometro_retirada, status) "
                f"SELECT v.id_veiculo, t.id_tecnico, COALESCE({data_ini}, CURRENT_DATE), {hodo}, 'ATIVA' "
                f"FROM tb_frota_veiculos v, tb_tecnico t "
                f"WHERE v.placa = '{placa}' AND (t.nome_completo ILIKE '%{tec_clean}%' OR '{tec_clean}' ILIKE '%' || t.nome_completo || '%') "
                f"ON CONFLICT (id_veiculo) WHERE status = 'ATIVA' DO NOTHING;"
            )
    sql_statements.append("")

    # 8. Manutenções Preventivas (Ciclos de 10.000 km)
    sql_statements.append("-- 6. Manutenções Preventivas e Revisões")
    planilha_manutencao = os.path.join(DOCS_PLANILHAS, "manutenção preventiva .xlsx")
    if os.path.exists(planilha_manutencao):
        wb_manut = openpyxl.load_workbook(planilha_manutencao, read_only=True, data_only=True)
        if 'condutores' in wb_manut.sheetnames:
            ws_man = wb_manut['condutores']
            for row in ws_man.iter_rows(min_row=2, values_only=True):
                if not row or not row[1]:
                    continue
                placa = clean_placa(row[1])
                if not placa:
                    continue
                km_real = clean_decimal(row[3], default=0.0)
                km_prox = clean_decimal(row[5], default=0.0)
                status_raw = str(row[7]).strip().upper() if len(row) > 7 and row[7] else "OK"
                data_agendada = format_date_sql(row[8]) if len(row) > 8 else "NULL"
                obs = str(row[9]).strip() if len(row) > 9 and row[9] else ""

                status_map = {
                    "OK": "CONCLUIDA",
                    "URGENTE": "PENDENTE",
                    "AGENDADA": "AGENDADA",
                    "PENDENTE": "PENDENTE"
                }
                status_man = status_map.get(status_raw, "PENDENTE")
                ciclo_km = int(float(km_prox)) if float(km_prox) > 0 else None
                ciclo_val = str(ciclo_km) if ciclo_km else "NULL"

                sql_statements.append(
                    f"INSERT INTO tb_frota_manutencoes (id_veiculo, tipo_manutencao, ciclo_km, odometro_momento, proxima_revisao_km, data_agendamento, status, notas) "
                    f"SELECT v.id_veiculo, 'PREVENTIVA', {ciclo_val}, {km_real}, {km_prox}, {data_agendada}, '{status_man}', {escape_sql(obs)} "
                    f"FROM tb_frota_veiculos v WHERE v.placa = '{placa}';"
                )
    sql_statements.append("")

    # 9. Infrações e Multas Históricas
    sql_statements.append("-- 7. Histórico de Infrações e Multas")
    if 'Infrações ' in wb_controle.sheetnames:
        ws_infr = wb_controle['Infrações ']
        for row in ws_infr.iter_rows(min_row=2, values_only=True):
            if not row or not row[9]:
                continue
            ait = str(row[9]).strip().upper()
            if not ait:
                continue
            placa = clean_placa(row[8])
            if not placa:
                continue
            
            data_infracao = format_timestamp_sql(row[10]) if len(row) > 10 else "NULL"
            desc_infracao = str(row[11]).strip() if len(row) > 11 and row[11] else "Infração de Trânsito"
            categoria = str(row[12]).strip().upper() if len(row) > 12 and row[12] else "MEDIA"
            cat_map = {
                "LEVE": "LEVE",
                "MÉDIA": "MEDIA",
                "MEDIA": "MEDIA",
                "GRAVE": "GRAVE",
                "GRAVÍSSIMA": "GRAVISSIMA",
                "GRAVISSIMA": "GRAVISSIMA"
            }
            gravidade = cat_map.get(categoria, "MEDIA")
            pontos = int(row[13]) if len(row) > 13 and str(row[13]).isdigit() else 0
            valor = clean_decimal(row[14], default=0.0) if len(row) > 14 else "0.00"
            matr = str(row[3]).strip() if len(row) > 3 and row[3] else None

            tec_subquery = f"(SELECT id_tecnico FROM tb_tecnico WHERE matricula = {escape_sql(matr)} LIMIT 1)" if matr else "NULL"

            sql_statements.append(
                f"INSERT INTO tb_frota_multas (numero_ait, id_veiculo, id_tecnico, data_hora_infracao, descricao_infracao, gravidade, pontuacao, valor_original, status_pagamento) "
                f"SELECT {escape_sql(ait)}, v.id_veiculo, {tec_subquery}, COALESCE({data_infracao}, CURRENT_TIMESTAMP), {escape_sql(desc_infracao)}, '{gravidade}', {pontos}, {valor}, 'PAGO' "
                f"FROM tb_frota_veiculos v WHERE v.placa = '{placa}' "
                f"ON CONFLICT (numero_ait) DO NOTHING;"
            )
    sql_statements.append("")

    # 10. Notificações Recentes de Multas (Prazos de Indicação e Gestão NIC)
    sql_statements.append("-- 8. Notificações Recentes com Prazos de Indicação de Condutor (Prevenção NIC)")
    csv_multas = os.path.join(DOCS_PLANILHAS, "Multas notificação.csv")
    if os.path.exists(csv_multas):
        with open(csv_multas, mode='r', encoding='latin1') as f:
            reader = csv.reader(f, delimiter=';')
            for i, row in enumerate(reader):
                if i == 0 or len(row) < 10:
                    continue
                placa = clean_placa(row[0])
                fez_indicacao = True if str(row[1]).strip().lower() == "sim" else False
                data_infr = row[2].strip()
                hora_infr = row[3].strip()
                dt_str = f"{data_infr} {hora_infr}" if data_infr else None
                data_hora_sql = format_timestamp_sql(dt_str)
                limite_orgao = format_date_sql(row[5])
                ait = str(row[9]).strip().upper()
                link = str(row[10]).strip() if len(row) > 10 else None

                if ait and placa:
                    ind_bool = "TRUE" if fez_indicacao else "FALSE"
                    sql_statements.append(
                        f"INSERT INTO tb_frota_multas (numero_ait, id_veiculo, data_hora_infracao, data_limite_indicacao, condutor_indicado, link_documento, status_pagamento) "
                        f"SELECT {escape_sql(ait)}, v.id_veiculo, COALESCE({data_hora_sql}, CURRENT_TIMESTAMP), {limite_orgao}, {ind_bool}, {escape_sql(link)}, 'PENDENTE' "
                        f"FROM tb_frota_veiculos v WHERE v.placa = '{placa}' "
                        f"ON CONFLICT (numero_ait) DO UPDATE SET "
                        f"data_limite_indicacao = EXCLUDED.data_limite_indicacao, "
                        f"condutor_indicado = EXCLUDED.condutor_indicado, "
                        f"link_documento = EXCLUDED.link_documento;"
                    )
    sql_statements.append("")

    with open(OUTPUT_SQL, mode="w", encoding="utf-8") as f:
        f.write("\n".join(sql_statements))

    print(f"Migração V77 gerada com sucesso em: {OUTPUT_SQL}", flush=True)
    print(f"Total de comandos SQL: {len(sql_statements)}", flush=True)

if __name__ == "__main__":
    run_sync()
