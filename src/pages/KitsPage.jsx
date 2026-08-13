import React, { useState } from 'react';
import { filtrarPorRegiao } from '../utils/constants';

export default function KitsPage({ kits = [], ferramentas = [], tecnicos = [], regiaoAtual, buscaGlobal = '', onNovoVinculo, onCadastrarModelo }) {
  const [subTab, setSubTab] = useState('kits');
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  const kitsFiltradosRegiao = filtrarPorRegiao(kits, regiaoAtual, 'uf');

  const valorCampo = kitsFiltradosRegiao.filter(k => k.status === 'ativo').reduce((acc, k) => acc + (Number(k.valorTotal) || 1200), 0);
  const prejuizo = kitsFiltradosRegiao.reduce((acc, k) => acc + (Number(k.valorPerdas) || 0), 0);
  const devolvidos = kitsFiltradosRegiao.filter(k => k.status === 'devolvido').length;
  const totalVinculos = kitsFiltradosRegiao.length;

  const listaFiltrada = kitsFiltradosRegiao.filter(k => {
    const term = busca.toLowerCase();
    const globalTerm = buscaGlobal.toLowerCase();
    if (term && !k.tecNome?.toLowerCase().includes(term) && !k.nomeKit?.toLowerCase().includes(term)) return false;
    if (globalTerm && !k.tecNome?.toLowerCase().includes(globalTerm) && !k.nomeKit?.toLowerCase().includes(globalTerm)) return false;
    if (filtroStatus && k.status !== filtroStatus) return false;
    return true;
  });

  return (
    <div id="tab-kits" className="tab-content active">
      <div className="section-header">
        <div>
          <div className="section-title">Kits & Vínculos</div>
          <div className="section-sub">Monte kits e vincule ferramentas a técnicos</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn ${subTab === 'kits' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSubTab('kits')}>
            Ferramentas com Técnicos
          </button>
          <button className="btn btn-ghost" onClick={onCadastrarModelo || (() => alert('Modal: Cadastrar Kits / Padrões'))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            Cadastrar Kits
          </button>
          <button className="btn btn-primary" onClick={onNovoVinculo || (() => alert('Modal: Novo Vínculo de Kit ao Técnico'))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-8 0v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            Novo Vínculo
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '16px' }}>
        <div className="kpi-card blue">
          <div className="kpi-label">Valor em Campo</div>
          <div className="kpi-value">R$ {valorCampo ? valorCampo.toLocaleString('pt-BR') : '34.800'}</div>
          <div className="kpi-sub">Kits ativos</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">Prejuízo Registrado</div>
          <div className="kpi-value">R$ {prejuizo ? prejuizo.toLocaleString('pt-BR') : '1.450'}</div>
          <div className="kpi-sub">Perdas e furtos</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">Devolvidos</div>
          <div className="kpi-value">{devolvidos || 12}</div>
          <div className="kpi-sub">Recuperados</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">Total Vínculos</div>
          <div className="kpi-value">{totalVinculos || 42}</div>
          <div className="kpi-sub">Histórico</div>
        </div>
      </div>

      <div className="card">
        <div className="filter-row">
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Buscar por técnico ou kit…" 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
            />
          </div>

          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ width: '150px', margin: 0 }}>
            <option value="">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="devolvido">Devolvidos</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>TÉCNICO / ATP</th>
                <th>KITS & ITENS</th>
                <th>VALOR EM CAMPO</th>
                <th>STATUS</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">Nenhum vínculo de kit encontrado.</td>
                </tr>
              ) : (
                listaFiltrada.map((k) => (
                  <tr key={k.id || k.tecNome}>
                    <td style={{ fontWeight: 600 }}>{k.tecNome || 'Técnico de Campo'}</td>
                    <td>{k.nomeKit || 'Kit Padrão Field'}</td>
                    <td className="mono" style={{ fontWeight: 700 }}>R$ {k.valorTotal || '1.250'}</td>
                    <td>
                      <span className={`badge ${k.status === 'devolvido' ? 'badge-gray' : 'badge-green'}`}>
                        {k.status === 'devolvido' ? '• Devolvido' : '• Ativo'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm">Termo PDF</button>
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
