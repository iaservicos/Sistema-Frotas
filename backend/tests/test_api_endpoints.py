def test_root_and_health(client):
    """Testa endpoints de raiz e healthcheck."""
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert res_root.json()["status"] == "online"

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"

def test_get_kpis(client):
    """Testa o cálculo em tempo real dos 4 KPIs da Torre de Controle."""
    res = client.get("/api/v1/veiculos/kpis")
    assert res.status_code == 200
    data = res.json()
    assert "total_veiculos" in data
    assert data["total_veiculos"] >= 200
    assert "em_uso" in data
    assert "taxa_utilizacao_percent" in data
    assert "revisoes_urgentes_ou_vencidas" in data
    assert "multas_pendentes_indicacao" in data
    assert "veiculos_condutor_inativo" in data

def test_list_veiculos(client):
    """Testa a listagem paginada de veículos e filtros."""
    res = client.get("/api/v1/veiculos?page=1&page_size=10")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 200
    assert len(data["items"]) == 10
    first = data["items"][0]
    assert "placa" in first
    assert "status_operacional" in first

def test_get_alertas_manutencao(client):
    """Testa o endpoint de alertas de manutenção periódica (10k km)."""
    res = client.get("/api/v1/manutencoes/alertas-preventivos")
    assert res.status_code == 200
    items = res.json()
    assert len(items) > 0
    primeiro = items[0]
    assert "placa" in primeiro
    assert "proxima_revisao_km" in primeiro
    assert "km_restante_revisao" in primeiro

def test_get_multas_pendentes_indicacao(client):
    """Testa o endpoint de controle de multas NIC e contagem de prazo."""
    res = client.get("/api/v1/multas/pendentes-indicacao")
    assert res.status_code == 200
    items = res.json()
    assert len(items) > 0
    multa = items[0]
    assert "numero_ait" in multa
    assert "dias_para_vencer_indicacao" in multa

def test_tecnicos_aptos_cautela(client):
    """Testa o endpoint que valida aptidão de condutores com CNH e status."""
    res = client.get("/api/v1/tecnicos/aptos-cautela")
    assert res.status_code == 200
    tecnicos = res.json()
    assert len(tecnicos) > 0
    assert "apto_para_cautela" in tecnicos[0]

def test_get_veiculo_por_placa(client):
    """Testa a ficha detalhada de um veículo com histórico de manutenções e multas."""
    # Obtém uma placa real da listagem
    res_list = client.get("/api/v1/veiculos?page=1&page_size=1")
    assert res_list.status_code == 200
    placa = res_list.json()["items"][0]["placa"]

    res_ficha = client.get(f"/api/v1/veiculos/{placa}")
    assert res_ficha.status_code == 200
    ficha = res_ficha.json()
    assert ficha["placa"] == placa
    assert "historico_revisoes" in ficha
    assert "historico_multas" in ficha

def test_bloqueio_cautela_tecnico_desligado(client):
    """Garante que a API rejeita com 422 qualquer tentativa de alocar veículo a técnico desligado/inativo."""
    # Obtém um id_veiculo qualquer
    res_list = client.get("/api/v1/veiculos?page=1&page_size=1")
    id_veiculo = res_list.json()["items"][0]["id_veiculo"]

    payload = {
        "id_veiculo": id_veiculo,
        "id_tecnico": 785,  # Técnico 'MURILO VITOR DE ARAUJO' (DESLIGADO)
        "hodometro_retirada": 35000,
        "observacoes": "Tentativa de teste de governança anti-inativos"
    }
    res = client.post("/api/v1/cautela/alocar", json=payload)
    assert res.status_code == 422
    assert "Não é permitido cautelar veículo para técnico com status" in res.json()["detail"]

def test_get_meu_veiculo_tecnico(client):
    """Testa a consulta do PWA do técnico para o condutor sob cautela ativa."""
    # Pega um técnico com veículo alocado
    res_list = client.get("/api/v1/veiculos?page=1&page_size=10")
    items_com_condutor = [it for it in res_list.json()["items"] if it.get("condutor_atual_id")]
    assert len(items_com_condutor) > 0
    primeiro = items_com_condutor[0]
    id_tecnico = primeiro["condutor_atual_id"]

    res_meu = client.get(f"/api/v1/cautela/meu-veiculo?id_tecnico={id_tecnico}")
    assert res_meu.status_code == 200
    data = res_meu.json()
    assert data["tem_veiculo_ativo"] is True
    assert data["custodia"]["id_tecnico"] == id_tecnico
    assert data["veiculo"]["placa"] == primeiro["placa"]

