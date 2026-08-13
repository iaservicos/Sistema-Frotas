import React, { useState } from 'react';

export default function PpcrPage({ ppcr = [], onTratarPpcr }) {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  const pendentes = ppcr.filter(p => p.status === 'pendente').length || 2;
  const emAnalise = ppcr.filter(p => p.status === 'em_analise').length || 4;
  const concluidas = ppcr.filter(p => p.status === 'concluido').length || 18;

  const listaFiltrada = ppcr.filter(p => {
    if (busca && !p.chamado?.toLowerCase().includes(busca.toLowerCase()) && !p.tecnico?.toLowerCase().includes(busca.toLowerCase()) && !p.peca?.toLowerCase().includes(busca.toLowerCase())) return false;
    if (filtroStatus && p.status !== filtroStatus) return false;
    return true;
  });

  return (
    <div id="tab-ppcr" className="tab-content active">
      <div className="section-header">
        <div>
          <div className="section-title">Solicitações PPCR</div>
          <div className="section-sub">Acompanhamento e envio de peças sob demanda</div>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '16px' }}>
        <div className="kpi-card amber">
          <div className="kpi-label">PENDENTES</div>
          <div className="kpi-value">{pendentes}</div>
          <div className="kpi-sub">Aguardando envio</div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-label">EM ANÁLISE</div>
          <div className="kpi-value">{emAnalise}</div>
          <div className="kpi-sub">Em processamento</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">CONCLUÍDAS</div>
          <div className="kpi-value">{concluidas}</div>
          <div className="kpi-sub">Atendidas</div>
        </div>
      </div>

      <div className="card">
        <div className="filter-row">
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Chamado, técnico ou peça..." 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
            />
          </div>

          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ width: '150px', margin: 0 }}>
            <option value="">Todos os status</option>
            <option value="pendente">Pendentes</option>
            <option value="em_analise">Em análise</option>
            <option value="concluido">Concluídas</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>DATA</th>
                <th>CHAMADO</th>
                <th>TÉCNICO</th>
                <th>ATP / BASE</th>
                <th>PEÇA SOLICITADA</th>
                <th>STATUS</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">Nenhuma solicitação PPCR registrada.</td>
                </tr>
              ) : (
                listaFiltrada.map((p) => (
                  <tr key={p.id || p.chamado}>
                    <td className="mono">{p.data || '10/08/2026'}</td>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>{p.chamado}</td>
                    <td>{p.tecnico || 'Técnico de Campo'}</td>
                    <td>{p.atp || 'POSITIVO PR'}</td>
                    <td style={{ fontWeight: 600 }}>{p.peca || 'Placa Mãe Positivo H300'}</td>
                    <td>
                      <span className={`badge ${p.status === 'concluido' ? 'badge-green' : p.status === 'em_analise' ? 'badge-blue' : 'badge-amber'}`}>
                        {p.status === 'concluido' ? '• Concluída' : p.status === 'em_analise' ? '• Em Análise' : '• Pendente'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => onTratarPpcr && onTratarPpcr(p)}>Chat & Tratativa</button>
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
