/**
 * SGFrotas API Client
 * Integração Frontend Vite <-> FastAPI Backend (Supabase PostgreSQL)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || `HTTP Error ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`[SGFrotas API] Falha na chamada a ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  // 1. KPIs da Torre de Controle
  async getKPIs() {
    return fetchJson('/veiculos/kpis');
  },

  // 2. Listagem Paginada de Veículos
  async getVeiculos({ status = '', baseId = null, busca = '', page = 1, pageSize = 250 } = {}) {
    const params = new URLSearchParams();
    if (status && status !== 'TODOS') params.append('status', status);
    if (baseId) params.append('base_id', baseId);
    if (busca) params.append('busca', busca);
    params.append('page', page);
    params.append('page_size', pageSize);

    return fetchJson(`/veiculos?${params.toString()}`);
  },

  // 3. Ficha Completa do Veículo por Placa
  async getVeiculoPorPlaca(placa) {
    return fetchJson(`/veiculos/${encodeURIComponent(placa)}`);
  },

  // 4. Manutenções Preventivas e Alertas Periódicos (10.000 km)
  async getAlertasManutencao(statusAlerta = null) {
    const param = statusAlerta ? `?status_alerta=${statusAlerta}` : '';
    return fetchJson(`/manutencoes/alertas-preventivos${param}`);
  },

  // 5. Multas Pendentes de Indicação (Controle NIC)
  async getMultasPendentesIndicacao() {
    return fetchJson('/multas/pendentes-indicacao');
  },

  // 6. Indicação de Condutor
  async indicarCondutor(idMulta, payload) {
    return fetchJson(`/multas/${idMulta}/indicar-condutor`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // 7. Lista de Técnicos Aptos (Filtra inativos e CNHs irregulares)
  async getTecnicosAptos(apenasAptos = true) {
    return fetchJson(`/tecnicos/aptos-cautela?apenas_aptos=${apenasAptos}`);
  },

  // 8. PWA do Técnico: Consulta de Veículo Cautelado
  async getMeuVeiculo({ idTecnico = null, matricula = null } = {}) {
    const params = new URLSearchParams();
    if (idTecnico) params.append('id_tecnico', idTecnico);
    if (matricula) params.append('matricula', matricula);
    return fetchJson(`/cautela/meu-veiculo?${params.toString()}`);
  },

  // 9. Cautela: Alocar Veículo
  async alocarVeiculo(payload) {
    return fetchJson('/cautela/alocar', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // 10. Cautela: Devolver Veículo
  async devolverVeiculo(payload) {
    return fetchJson('/cautela/devolver', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
