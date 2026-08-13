import React, { useState } from 'react';
import { filtrarPorRegiao } from '../utils/constants';

export default function BacklogPage({ activeTab = 'bkl-dash', backlog = [], regiaoAtual, buscaGlobal = '' }) {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  const backlogFiltradoRegiao = filtrarPorRegiao(backlog, regiaoAtual, 'uf');

  const total = backlogFiltradoRegiao.length || 142;
  const noPrazo = backlogFiltradoRegiao.filter(b => b.status === 'no_prazo').length || 118;
  const atrasados = backlogFiltradoRegiao.filter(b => b.status === 'atrasado').length || 24;

  const listaFiltrada = backlogFiltradoRegiao.filter(b => {
    const term = busca.toLowerCase();
    const globalTerm = buscaGlobal.toLowerCase();
    if (term && !b.chamado?.toLowerCase().includes(term) && !b.tecnico?.toLowerCase().includes(term)) return false;
    if (globalTerm && !b.chamado?.toLowerCase().includes(globalTerm) && !b.tecnico?.toLowerCase().includes(globalTerm)) return false;
    if (filtroStatus && b.status !== filtroStatus) return false;
    return true;
  });

  return (
    <div id="tab-backlog" className="tab-content active">
      <div className="section-header">
        <div>
          <div className="section-title">Backlog de Chamados Operacionais</div>
          <div className="section-sub">Acompanhamento e evolução de atendimentos de campo</div>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '16px' }}>
        <div className="kpi-card blue">
          <div className="kpi-label">TOTAL BACKLOG</div>
          <div className="kpi-value">{total}</div>
          <div className="kpi-sub">Chamados em aberto</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">NO PRAZO</div>
          <div className="kpi-value">{noPrazo}</div>
          <div className="kpi-sub">Dentro do SLA</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">ATRASADOS</div>
          <div className="kpi-value">{atrasados}</div>
          <div className="kpi-sub">SLA estourado</div>
        </div>
      </div>

      <div className="card">
        <div className="filter-row">
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Buscar por chamado, técnico..." 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
            />
          </div>
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ width: '150px', margin: 0 }}>
            <option value="">Todos os status</option>
            <option value="no_prazo">No prazo</option>
            <option value="atrasado">Atrasados</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CHAMADO</th>
                <th>CÓDIGO PEP</th>
                <th>TÉCNICO</th>
                <th>ATP / BASE</th>
                <th>DATA LIMITE</th>
                <th>STATUS</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">Nenhum chamado pendente no Backlog.</td>
                </tr>
              ) : (
                listaFiltrada.map((item) => (
                  <tr key={item.id || item.chamado}>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>{item.chamado}</td>
                    <td className="mono">{item.pep || 'PEP-001'}</td>
                    <td>{item.tecnico || 'Carlos Eduardo Silva'}</td>
                    <td>{item.atp || 'POSITIVO PR'}</td>
                    <td className="mono" style={{ color: 'var(--danger)', fontWeight: 700 }}>{item.dataLimite || '10/08/2026'}</td>
                    <td>
                      <span className={`badge ${item.status === 'atrasado' ? 'badge-red' : 'badge-green'}`}>
                        {item.status === 'atrasado' ? '• Atrasado' : '• No Prazo'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm">Editar</button>
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
