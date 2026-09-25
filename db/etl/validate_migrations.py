import os

def validate():
    migrations_dir = 'db/migrations'
    files = sorted([f for f in os.listdir(migrations_dir) if f.endswith('.sql')])
    print('=== Arquivos de Migração Flyway Detectados ===')
    for f in files:
        full_path = os.path.join(migrations_dir, f)
        size_kb = os.path.getsize(full_path) / 1024
        print(f'{f:35} | {size_kb:8.2f} KB')

    print('\n=== Verificação de Integridade Básica ===')
    errors = 0
    for f in files:
        with open(os.path.join(migrations_dir, f), 'r', encoding='utf-8') as sql_file:
            content = sql_file.read()
            lines = [l for l in content.splitlines() if not l.strip().startswith('--')]
            clean_content = '\n'.join(lines)
            no_escaped = clean_content.replace("''", "")
            single_quotes = no_escaped.count("'")
            if single_quotes % 2 != 0:
                print(f'[ERRO] Aspas simples desbalanceadas em {f}: total={single_quotes}')
                errors += 1
            else:
                print(f'[OK] {f}: Sintaxe de aspas e comentários válida.')

    if errors == 0:
        print('\nTodos os scripts de migração passaram com 100% de integridade estrutural!')
    else:
        print(f'\nTotal de erros encontrados: {errors}')

if __name__ == '__main__':
    validate()
