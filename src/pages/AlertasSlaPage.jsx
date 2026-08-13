import React, { useState } from 'react';

export default function AlertasSlaPage({ backlog = [], alertas = [] }) {
  const [filtroTipo, setFiltroTipo] = useState('');
  const [busca, setBusca] = useState('');

  // KPIs do Monitor SLA
  const perdidos = backlog.filter(b => b.status === 'atrasado' || b.statusSla === 'perdido').length || 24;
  const venceHoje = backlog.filter(b => b.status === 'vence_hoje' || b.statusSla === 'hoje').length || 3;
  const venceAmanha = backlog.filter(b => b.statusSla === '1dia').length || 2;
  const vence2Dias = backlog.filter(b => b.statusSla === '2dias').length || 5;
  const semTecnico = backlog.filter(b => !b.tecMatricula && !b.tecnico).length || 8;

  const listaFiltrada = backlog.filter(item => {
    if (busca && !item.chamado?.toLowerCase().includes(busca.toLowerCase()) && !item.tecnico?.toLowerCase().includes(busca.toLowerCase())) return false;
    if (filtroTipo === 'perdido' && item.status !== 'atrasado') return false;
    if (filtroTipo === 'hoje' && item.status !== 'vence_hoje') return false;
    return true;
  });

  return (
    <div id="tab-alertas-sla" className="tab-content active">
      <div className="section-header">
        <div>
          <div className="section-title">Monitor de SLA</div>
          <div className="section-sub">Monitoramento contínuo | atualizado automaticamente</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Atualizado agora</div>
          <button className="btn btn-primary">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
            Verificar agora
          </button>
        </div>
      </div>

      {/* 5 KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)', marginBottom: '20px' }}>
        <div className="kpi-card red">
          <div className="kpi-label">Perdidos</div>
          <div className="kpi-value">{perdidos}</div>
          <div className="kpi-sub">SLA vencido</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">Vence hoje</div>
          <div className="kpi-value">{venceHoje}</div>
          <div className="kpi-sub">Urgente</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">Vence amanhã</div>
          <div className="kpi-value">{venceAmanha}</div>
          <div className="kpi-sub">Crítico</div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-label">Vence em 2d</div>
          <div className="kpi-value">{vence2Dias}</div>
          <div className="kpi-sub">Atenção</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">Sem técnico</div>
          <div className="kpi-value">{semTecnico}</div>
          <div className="kpi-sub">Não atribuídos</div>
        </div>
      </div>

      {/* Tabela de chamados em risco */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span className="dot" style={{ background: 'var(--danger)' }}></span>
            Chamados em Risco de Perda de SLA
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input 
                type="text" 
                placeholder="Chamado, técnico..." 
                value={busca} 
                onChange={(e) => setBusca(e.target.value)} 
              />
            </div>
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} style={{ width: '160px', margin: 0 }}>
              <option value="">Todas situações</option>
              <option value="perdido">Perdidos</option>
              <option value="hoje">Vence hoje</option>
              <option value="1dia">Vence amanhã</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>STATUS SLA</th>
                <th>CHAMADO</th>
                <th>PROJETO / PEP</th>
                <th>TÉCNICO</th>
                <th>ATP / BASE</th>
                <th>DATA LIMITE SLA</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">Nenhum chamado em risco no momento.</td>
                </tr>
              ) : (
                listaFiltrada.map((item) => (
                  <tr key={item.id || item.chamado}>
                    <td>
                      <span className={`badge ${item.status === 'atrasado' ? 'badge-red' : 'badge-amber'}`}>
                        {item.status === 'atrasado' ? '• Perdido' : '• Vence Hoje'}
                      </span>
                    </td>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>{item.chamado}</td>
                    <td>{item.pep || item.projeto || 'H3-02956'}</td>
                    <td>{item.tecnico || 'Sem técnico'}</td>
                    <td>{item.atp || 'POSITIVO PR'}</td>
                    <td className="mono" style={{ color: 'var(--danger)', fontWeight: 700 }}>{item.dataLimite || '10/08/2026'}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm">Notificar</button>
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
