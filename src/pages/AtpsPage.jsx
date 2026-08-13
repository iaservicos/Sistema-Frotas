import React, { useState } from 'react';
import { filtrarPorRegiao } from '../utils/constants';

export default function AtpsPage({ atps = [], regiaoAtual, buscaGlobal = '', onNovaAtp }) {
  const [busca, setBusca] = useState('');
  const [filtroUf, setFiltroUf] = useState('');

  const ufs = Array.from(new Set(atps.map(a => a.uf).filter(Boolean)));

  const atpsFiltradasRegiao = filtrarPorRegiao(atps, regiaoAtual, 'uf');

  const listaFiltrada = atpsFiltradasRegiao.filter(a => {
    const term = busca.toLowerCase();
    const globalTerm = buscaGlobal.toLowerCase();
    if (term && !a.nome?.toLowerCase().includes(term) && !a.codigo?.toLowerCase().includes(term) && !a.uf?.toLowerCase().includes(term)) return false;
    if (globalTerm && !a.nome?.toLowerCase().includes(globalTerm) && !a.codigo?.toLowerCase().includes(globalTerm) && !a.uf?.toLowerCase().includes(globalTerm)) return false;
    if (filtroUf && a.uf !== filtroUf) return false;
    return true;
  });

  return (
    <div id="tab-atps" className="tab-content active">
      <div className="section-header">
        <div>
          <div className="section-title">Assistências Técnicas</div>
          <div className="section-sub">Gestão de ATPs e centros de custo</div>
        </div>
        <button className="btn btn-primary" onClick={onNovaAtp || (() => alert('Modal de Nova ATP será exibido aqui.'))}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nova ATP
        </button>
      </div>

      <div className="card">
        <div className="filter-row">
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Buscar por nome, código ou UF…" 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
            />
          </div>
          <select value={filtroUf} onChange={(e) => setFiltroUf(e.target.value)} style={{ width: '120px', margin: 0 }}>
            <option value="">Todos UF</option>
            {ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>OPERAÇÃO</th>
                <th>NOME / ASSISTÊNCIA</th>
                <th>UF</th>
                <th>SUPERVISOR</th>
                <th>DISPATCHER</th>
                <th>CC</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty">Nenhuma ATP cadastrada.</td>
                </tr>
              ) : (
                listaFiltrada.map((a) => (
                  <tr key={a.id || a.codigo}>
                    <td className="mono" style={{ fontWeight: 700 }}>{a.codigo}</td>
                    <td>{a.operacao}</td>
                    <td style={{ fontWeight: 600 }}>{a.nome}</td>
                    <td><span className="badge badge-gray">{a.uf}</span></td>
                    <td>{a.supervisor || '—'}</td>
                    <td>{a.dispatcher || '—'}</td>
                    <td className="mono">{a.cc || '—'}</td>
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
