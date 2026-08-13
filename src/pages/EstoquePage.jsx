import React, { useState } from 'react';
import { filtrarPorRegiao } from '../utils/constants';

export default function EstoquePage({ ferramentas = [], regiaoAtual, buscaGlobal = '', onNovaFerramenta, onImportarExcel }) {
  const [busca, setBusca] = useState('');
  const [filtroCat, setFiltroCat] = useState('');
  const [filtroAtp, setFiltroAtp] = useState('');

  const ferramentasFiltradasRegiao = filtrarPorRegiao(ferramentas, regiaoAtual, 'uf');

  const categorias = Array.from(new Set(ferramentasFiltradasRegiao.map(f => f.categoria).filter(Boolean)));
  const atps = Array.from(new Set(ferramentasFiltradasRegiao.map(f => f.atp).filter(Boolean)));

  const totalItens = ferramentasFiltradasRegiao.length;
  const unidadesTotais = ferramentasFiltradasRegiao.reduce((acc, f) => acc + (Number(f.qtdTotal || f.quantidade) || 0), 0);
  const emCampo = ferramentasFiltradasRegiao.reduce((acc, f) => acc + (Number(f.vinculada) || 0), 0);
  const disponivel = unidadesTotais - emCampo;
  const valorPatrimonio = ferramentasFiltradasRegiao.reduce((acc, f) => acc + ((Number(f.qtdTotal) || 1) * (Number(f.valor) || 150)), 0);

  const listaFiltrada = ferramentasFiltradasRegiao.filter(f => {
    const term = busca.toLowerCase();
    const globalTerm = buscaGlobal.toLowerCase();
    if (term && !f.nome?.toLowerCase().includes(term) && !f.patrimonio?.toLowerCase().includes(term)) return false;
    if (globalTerm && !f.nome?.toLowerCase().includes(globalTerm) && !f.patrimonio?.toLowerCase().includes(globalTerm)) return false;
    if (filtroCat && f.categoria !== filtroCat) return false;
    if (filtroAtp && f.atp !== filtroAtp) return false;
    return true;
  });

  return (
    <div id="tab-estoque" className="tab-content active">
      <div className="section-header">
        <div>
          <div className="section-title">Estoque de Ferramentas</div>
          <div className="section-sub">Cadastro e controle de ferramentas disponíveis</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost" onClick={onImportarExcel || (() => alert('Importar ferramentas'))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Importar
          </button>
          <button className="btn btn-primary" onClick={onNovaFerramenta || (() => alert('Modal: Registrar Nova Ferramenta'))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Registrar Ferramenta
          </button>
        </div>
      </div>

      {/* KPIs Estoque — 2 Fileiras de 4 Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '8px' }}>
        <div className="kpi-card blue">
          <div className="kpi-label">Total Itens</div>
          <div className="kpi-value">{totalItens || 45}</div>
          <div className="kpi-sub">Tipos cadastrados</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">Unidades Totais</div>
          <div className="kpi-value">{unidadesTotais || 312}</div>
          <div className="kpi-sub">Em estoque</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">Em Campo</div>
          <div className="kpi-value">{emCampo || 184}</div>
          <div className="kpi-sub">Com técnicos</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-label">Valor Patrimônio</div>
          <div className="kpi-value">R$ {valorPatrimonio ? valorPatrimonio.toLocaleString('pt-BR') : '48.500'}</div>
          <div className="kpi-sub">Estimado</div>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '16px' }}>
        <div className="kpi-card blue">
          <div className="kpi-label">Disponível</div>
          <div className="kpi-value">{disponivel || 128}</div>
          <div className="kpi-sub">Sem vínculo</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">Vinculados</div>
          <div className="kpi-value">{emCampo || 184}</div>
          <div className="kpi-sub">Em kits ativos</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">ATPs com estoque</div>
          <div className="kpi-value">17</div>
          <div className="kpi-sub">Bases</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">Sem estoque</div>
          <div className="kpi-value">2</div>
          <div className="kpi-sub">Qtd = 0</div>
        </div>
      </div>

      <div className="card">
        <div className="filter-row">
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Buscar ferramenta…" 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
            />
          </div>

          <select value={filtroCat} onChange={(e) => setFiltroCat(e.target.value)} style={{ width: '160px', margin: 0 }}>
            <option value="">Todas categorias</option>
            {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select value={filtroAtp} onChange={(e) => setFiltroAtp(e.target.value)} style={{ width: '170px', margin: 0 }}>
            <option value="">Todas ATPs</option>
            <option value="geral">Estoque Geral</option>
            {atps.map(atp => <option key={atp} value={atp}>{atp}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>NOME / DESCRIÇÃO</th>
                <th>CATEGORIA</th>
                <th>PATRIMÔNIO</th>
                <th>QTD. TOTAL</th>
                <th>DISPONÍVEL</th>
                <th>VINCULADA</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">Nenhuma ferramenta cadastrada no estoque.</td>
                </tr>
              ) : (
                listaFiltrada.map((f) => (
                  <tr key={f.id || f.nome}>
                    <td style={{ fontWeight: 600 }}>{f.nome}</td>
                    <td><span className="badge badge-gray">{f.categoria || 'Geral'}</span></td>
                    <td className="mono">{f.patrimonio || 'PAT-092'}</td>
                    <td className="mono">{f.qtdTotal || f.quantidade || 10}</td>
                    <td className="mono" style={{ color: 'var(--success)', fontWeight: 700 }}>{f.disponivel || 6}</td>
                    <td className="mono" style={{ color: 'var(--warning)' }}>{f.vinculada || 4}</td>
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
