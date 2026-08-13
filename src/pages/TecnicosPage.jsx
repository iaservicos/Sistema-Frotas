import React, { useState } from 'react';
import { ini } from '../utils/hash';
import { filtrarPorRegiao } from '../utils/constants';

export default function TecnicosPage({ tecnicos = [], regiaoAtual, buscaGlobal = '', onNovoTecnico, onImportarXLSX }) {
  const [busca, setBusca] = useState('');
  const [filtroUf, setFiltroUf] = useState('');
  const [filtroAtp, setFiltroAtp] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  const tecnicosFiltradosRegiao = filtrarPorRegiao(tecnicos, regiaoAtual, 'uf');

  const ufs = Array.from(new Set(tecnicosFiltradosRegiao.map(t => t.uf).filter(Boolean)));
  const atps = Array.from(new Set(tecnicosFiltradosRegiao.map(t => t.atp).filter(Boolean)));

  const listaFiltrada = tecnicosFiltradosRegiao.filter(t => {
    const term = busca.toLowerCase();
    const globalTerm = buscaGlobal.toLowerCase();
    if (term && !t.nome?.toLowerCase().includes(term) && !String(t.matricula).includes(term) && !t.email?.toLowerCase().includes(term)) return false;
    if (globalTerm && !t.nome?.toLowerCase().includes(globalTerm) && !String(t.matricula).includes(globalTerm) && !t.email?.toLowerCase().includes(globalTerm)) return false;
    if (filtroUf && t.uf !== filtroUf) return false;
    if (filtroAtp && t.atp !== filtroAtp) return false;
    if (filtroStatus && t.status !== filtroStatus) return false;
    return true;
  });

  return (
    <div id="tab-tecnicos" className="tab-content active">
      <div className="section-header">
        <div>
          <div className="section-title">Técnicos de Campo</div>
          <div className="section-sub">Base HC - Técnicos ativos na operação</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost" onClick={onImportarXLSX || (() => alert('Funcionalidade de importação de planilhas em desenvolvimento.'))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Importar XLSX
          </button>
          <button className="btn btn-primary" onClick={onNovoTecnico || (() => alert('Modal de Novo Técnico será exibido aqui.'))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo Técnico
          </button>
        </div>
      </div>

      <div className="card">
        <div className="filter-row">
          <div className="search-wrap" style={{ flex: 2 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Buscar por nome, matrícula, email…" 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
            />
          </div>

          <select value={filtroUf} onChange={(e) => setFiltroUf(e.target.value)} style={{ width: '100px', margin: 0 }}>
            <option value="">Todos UF</option>
            {ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>

          <select value={filtroAtp} onChange={(e) => setFiltroAtp(e.target.value)} style={{ width: '170px', margin: 0 }}>
            <option value="">Todas ATPs</option>
            {atps.map(atp => <option key={atp} value={atp}>{atp}</option>)}
          </select>

          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ width: '130px', margin: 0 }}>
            <option value="">Todos Status</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>MATRÍCULA</th>
                <th>NOME</th>
                <th>FUNÇÃO</th>
                <th>ATP / BASE</th>
                <th>UF</th>
                <th>CELULAR</th>
                <th>STATUS</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty">Nenhum técnico cadastrado na base HC.</td>
                </tr>
              ) : (
                listaFiltrada.map((t) => (
                  <tr key={t.id || t.matricula}>
                    <td className="mono">{t.matricula}</td>
                    <td>
                      <div className="tech-info">
                        <div className="tech-avatar">{ini(t.nome)}</div>
                        <div className="tech-name">{t.nome}</div>
                      </div>
                    </td>
                    <td>{t.funcao || 'Técnico de Campo'}</td>
                    <td>{t.atp || '—'}</td>
                    <td><span className="badge badge-gray">{t.uf || '—'}</span></td>
                    <td className="mono">{t.celular || '—'}</td>
                    <td>
                      <span className={`badge ${t.status === 'inativo' ? 'badge-red' : 'badge-green'}`}>
                        {t.status === 'inativo' ? '• Inativo' : '• Ativo'}
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
