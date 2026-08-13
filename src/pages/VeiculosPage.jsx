import React, { useState } from 'react';
import { filtrarPorRegiao } from '../utils/constants';

export default function VeiculosPage({ veiculos = [], combustivel = [], devolucoes = [], regiaoAtual, buscaGlobal = '', onNovoVeiculo }) {
  const [subTab, setSubTab] = useState('frota');
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  const veiculosFiltradosRegiao = filtrarPorRegiao(veiculos, regiaoAtual, 'uf');

  const emUso = veiculosFiltradosRegiao.filter(v => v.status === 'uso' || v.tecnicoAlocado).length;
  const disponiveis = veiculosFiltradosRegiao.length - emUso;

  const listaFiltrada = veiculosFiltradosRegiao.filter(v => {
    const term = busca.toLowerCase();
    const globalTerm = buscaGlobal.toLowerCase();
    if (term && !v.placa?.toLowerCase().includes(term) && !v.modelo?.toLowerCase().includes(term) && !v.tecnicoAlocado?.toLowerCase().includes(term)) return false;
    if (globalTerm && !v.placa?.toLowerCase().includes(globalTerm) && !v.modelo?.toLowerCase().includes(globalTerm) && !v.tecnicoAlocado?.toLowerCase().includes(globalTerm)) return false;
    if (filtroStatus === 'uso' && !v.tecnicoAlocado) return false;
    if (filtroStatus === 'livre' && v.tecnicoAlocado) return false;
    return true;
  });

  return (
    <div id="tab-veiculos" className="tab-content active">
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div className="section-title">Gestão de Veículos</div>
            <div className="section-sub">Frota, manutenções e histórico de movimentação</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => alert('Relatório será exportado.')}>
            Exportar
          </button>
          <button className="btn btn-primary btn-sm" onClick={onNovoVeiculo || (() => alert('Modal de Novo Veículo.'))}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Novo Veículo
          </button>
        </div>

        <div style={{ display: 'flex', gap: '2px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '3px', width: 'fit-content' }}>
          <button className={`veic-tab ${subTab === 'frota' ? 'active' : ''}`} onClick={() => setSubTab('frota')}>Frota</button>
          <button className={`veic-tab ${subTab === 'manutencao' ? 'active' : ''}`} onClick={() => setSubTab('manutencao')}>Manutenções</button>
          <button className={`veic-tab ${subTab === 'movimentacao' ? 'active' : ''}`} onClick={() => setSubTab('movimentacao')}>Movimentações</button>
          <button className={`veic-tab ${subTab === 'combustivel' ? 'active' : ''}`} onClick={() => setSubTab('combustivel')}>Combustível Serviço</button>
          <button className={`veic-tab ${subTab === 'comb-fotos' ? 'active' : ''}`} onClick={() => setSubTab('comb-fotos')}>Validar Fotos</button>
          <button className={`veic-tab ${subTab === 'devolucoes' ? 'active' : ''}`} onClick={() => setSubTab('devolucoes')}>Devoluções</button>
          <button className={`veic-tab ${subTab === 'financeiro' ? 'active' : ''}`} onClick={() => setSubTab('financeiro')}>Financeiro</button>
        </div>
      </div>

      {subTab === 'frota' && (
        <div id="sub-frota">
          <div className="kpi-grid-3">
            <div className="kpi-card blue">
              <div className="kpi-label">Total Frota</div>
              <div className="kpi-value">{veiculos.length || 148}</div>
              <div className="kpi-sub">Cadastrados</div>
            </div>
            <div className="kpi-card green">
              <div className="kpi-label">Em Uso</div>
              <div className="kpi-value">{emUso || 132}</div>
              <div className="kpi-sub">Alocados a técnicos</div>
            </div>
            <div className="kpi-card amber">
              <div className="kpi-label">Disponíveis</div>
              <div className="kpi-value">{disponiveis || 16}</div>
              <div className="kpi-sub">Sem alocação</div>
            </div>
          </div>

          <div className="card">
            <div className="filter-row">
              <div className="search-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  placeholder="Buscar por placa, modelo ou técnico…" 
                  value={busca} 
                  onChange={(e) => setBusca(e.target.value)} 
                />
              </div>
              <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ width: '140px', margin: 0 }}>
                <option value="">Todos status</option>
                <option value="uso">Em uso</option>
                <option value="livre">Disponível</option>
              </select>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>PLACA</th>
                    <th>MODELO</th>
                    <th>UF</th>
                    <th>ATP</th>
                    <th>TÉCNICO ALOCADO</th>
                    <th>HODÔMETRO</th>
                    <th>STATUS</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {listaFiltrada.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty">Nenhum veículo encontrado na frota.</td>
                    </tr>
                  ) : (
                    listaFiltrada.map((v) => (
                      <tr key={v.id || v.placa}>
                        <td className="mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>{v.placa}</td>
                        <td style={{ fontWeight: 600 }}>{v.modelo || 'Fiat Uno 1.0'}</td>
                        <td><span className="badge badge-gray">{v.uf || 'PR'}</span></td>
                        <td>{v.atp || 'POSITIVO PR'}</td>
                        <td>{v.tecnicoAlocado || '— (Disponível)'}</td>
                        <td className="mono">{v.hodometro ? `${v.hodometro.toLocaleString('pt-BR')} km` : '—'}</td>
                        <td>
                          <span className={`badge ${v.tecnicoAlocado ? 'badge-green' : 'badge-amber'}`}>
                            {v.tecnicoAlocado ? '• Em uso' : '• Disponível'}
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
      )}

      {subTab === 'combustivel' && (
        <div id="sub-combustivel">
          <div className="card">
            <div className="card-header"><div className="card-title">Registros de Combustível</div></div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>DATA</th>
                    <th>PLACA</th>
                    <th>MOTORISTA</th>
                    <th>LITROS</th>
                    <th>VALOR</th>
                  </tr>
                </thead>
                <tbody>
                  {combustivel.length === 0 ? <tr><td colSpan="5" className="empty">Nenhum registro.</td></tr> :
                    combustivel.map((c, i) => (
                      <tr key={i}>
                        <td>{c.data || 'N/A'}</td>
                        <td className="mono">{c.placa}</td>
                        <td>{c.motorista}</td>
                        <td>{c.litros} L</td>
                        <td>R$ {c.valor}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === 'devolucoes' && (
        <div id="sub-devolucoes">
          <div className="card">
            <div className="card-header"><div className="card-title">Histórico de Devoluções</div></div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>DATA</th>
                    <th>PLACA</th>
                    <th>TÉCNICO</th>
                    <th>HODÔMETRO</th>
                    <th>MOTIVO</th>
                  </tr>
                </thead>
                <tbody>
                  {devolucoes.length === 0 ? <tr><td colSpan="5" className="empty">Nenhuma devolução.</td></tr> :
                    devolucoes.map((d, i) => (
                      <tr key={i}>
                        <td>{d.data || 'N/A'}</td>
                        <td className="mono">{d.placa}</td>
                        <td>{d.tecnico}</td>
                        <td>{d.km} km</td>
                        <td>{d.motivo}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {['manutencao', 'movimentacao', 'comb-fotos', 'financeiro'].includes(subTab) && (
        <div className="card">
          <div className="card-header"><div className="card-title">Aba em Desenvolvimento</div></div>
          <div style={{ padding: '20px', color: 'var(--text3)' }}>
            As funcionalidades específicas desta aba serão liberadas na próxima versão.
          </div>
        </div>
      )}
    </div>
  );
}
