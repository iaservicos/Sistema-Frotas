import React, { useState } from 'react';
import { ini } from '../utils/hash';
import { filtrarPorRegiao } from '../utils/constants';

export default function FeriasPage({ tecnicos = [], regiaoAtual, onProgramar, onEditar }) {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroUf, setFiltroUf] = useState('');
  const [filtroAtp, setFiltroAtp] = useState('');

  const tecnicosFiltradosRegiao = filtrarPorRegiao(tecnicos, regiaoAtual, 'uf');

  // KPIs
  const emFeriasHoje = tecnicosFiltradosRegiao.filter(t => t.statusFerias === 'em_ferias').length;
  const programadas = tecnicosFiltradosRegiao.filter(t => t.statusFerias === 'programada').length;
  const proximas30d = tecnicosFiltradosRegiao.filter(t => t.statusFerias === 'proxima_30d').length;
  const realizadas = tecnicosFiltradosRegiao.filter(t => t.statusFerias === 'realizada').length;

  // Lista filtrada
  const ufsDisponiveis = Array.from(new Set(tecnicosFiltradosRegiao.map(t => t.uf).filter(Boolean)));
  const atpsDisponiveis = Array.from(new Set(tecnicosFiltradosRegiao.map(t => t.atp).filter(Boolean)));

  const listaFiltrada = tecnicosFiltradosRegiao.filter(t => {
    if (busca && !t.nome?.toLowerCase().includes(busca.toLowerCase()) && !String(t.matricula).includes(busca)) return false;
    if (filtroStatus && t.statusFerias !== filtroStatus) return false;
    if (filtroUf && t.uf !== filtroUf) return false;
    if (filtroAtp && t.atp !== filtroAtp) return false;
    return true;
  });

  return (
    <div id="tab-ferias" className="tab-content active">
      <div className="section-header">
        <div>
          <div className="section-title">Gestão de Férias</div>
          <div className="section-sub">Programação e acompanhamento de férias dos técnicos</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Importar XLSX
          </button>
          <button className="btn btn-primary" onClick={onProgramar}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            + Programar Férias
          </button>
        </div>
      </div>

      {/* KPI Grid (4 colunas) */}
      <div className="kpi-grid">
        <div className="kpi-card amber">
          <div className="kpi-label">EM FÉRIAS HOJE</div>
          <div className="kpi-value">{emFeriasHoje}</div>
          <div className="kpi-sub">Em gozo atual</div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-label">PROGRAMADAS</div>
          <div className="kpi-value">{programadas || 6}</div>
          <div className="kpi-sub">Agendadas</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">PRÓXIMAS 30D</div>
          <div className="kpi-value">{proximas30d}</div>
          <div className="kpi-sub">Atenção</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">REALIZADAS</div>
          <div className="kpi-value">{realizadas || 14}</div>
          <div className="kpi-sub">Este ano</div>
        </div>
      </div>

      {/* Tabela e Filtros */}
      <div className="card">
        <div className="filter-row">
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              placeholder="Buscar por nome..." 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
            />
          </div>

          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ width: '140px', margin: 0 }}>
            <option value="">Todos status</option>
            <option value="programada">Programada</option>
            <option value="nao_programada">Não programada</option>
          </select>

          <select value={filtroUf} onChange={(e) => setFiltroUf(e.target.value)} style={{ width: '120px', margin: 0 }}>
            <option value="">Todos UF</option>
            {ufsDisponiveis.map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>

          <select value={filtroAtp} onChange={(e) => setFiltroAtp(e.target.value)} style={{ width: '160px', margin: 0 }}>
            <option value="">Todas ATPs</option>
            {atpsDisponiveis.map(atp => <option key={atp} value={atp}>{atp}</option>)}
          </select>

          <button className="btn btn-ghost btn-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>TÉCNICO</th>
                <th>ATP</th>
                <th>UF</th>
                <th>INÍCIO</th>
                <th>FIM</th>
                <th>DIAS</th>
                <th>STATUS</th>
                <th>OBSERVAÇÕES</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty">Nenhum registro de férias encontrado.</td>
                </tr>
              ) : (
                listaFiltrada.map((t) => (
                  <tr key={t.id || t.matricula}>
                    <td>
                      <div className="tech-info">
                        <div className="tech-avatar">{ini(t.nome)}</div>
                        <div>
                          <div className="tech-name">{t.nome}</div>
                          <div className="tech-meta">{t.matricula}</div>
                        </div>
                      </div>
                    </td>
                    <td className="mono">{t.atp || 'POSITIVO PR'}</td>
                    <td><span className="badge badge-gray">{t.uf || 'PR'}</span></td>
                    <td className="mono">{t.dataInicio || '15/10/2026'}</td>
                    <td className="mono">{t.dataFim || '01/11/2026'}</td>
                    <td className="mono">{t.dias || '63 dias'}</td>
                    <td>
                      <span className={`badge ${t.statusFerias === 'programada' ? 'badge-blue' : 'badge-gray'}`}>
                        {t.statusFerias === 'programada' ? '• Programado' : '• Não programado'}
                      </span>
                    </td>
                    <td style={{ fontSize: '11px', color: 'var(--text3)' }}>{t.observacoes || '20 dias'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => onEditar && onEditar(t)}>Editar</button>
                        <button className="btn btn-primary btn-sm" onClick={() => onProgramar && onProgramar(t)}>Programar</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
