import React, { useState } from 'react';

export default function GestecPage({ activeTab = 'gestec-dash', tecnicos = [], regiaoAtual, buscaGlobal = '' }) {
  const [busca, setBusca] = useState('');

  return (
    <div id="tab-gestec" className="tab-content active">
      <div className="section-header">
        <div>
          <div className="section-title">Gestão de Técnicos (GESTEC)</div>
          <div className="section-sub">Acompanhamento operacional de campo, GPS, ponto e incidentes</div>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '16px' }}>
        <div className="kpi-card blue">
          <div className="kpi-label">TÉCNICOS EM CAMPO</div>
          <div className="kpi-value">{tecnicos.length || 28}</div>
          <div className="kpi-sub">Com localização ativa</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">ATENDIMENTOS HOJE</div>
          <div className="kpi-value">42</div>
          <div className="kpi-sub">Check-ins efetuados</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">PONTO REGISTRADO</div>
          <div className="kpi-value">26</div>
          <div className="kpi-sub">Técnicos ativos hoje</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-label">ALERTAS GPS</div>
          <div className="kpi-value">0</div>
          <div className="kpi-sub">Sem divergências</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><span className="dot"></span>Técnicos Ativos em Operação</div>
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Buscar por técnico…" 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>TÉCNICO</th>
                <th>MATRÍCULA</th>
                <th>ATP / BASE</th>
                <th>STATUS PONTO</th>
                <th>ÚLTIMO CHECK-IN</th>
                <th>LOCALIZAÇÃO GPS</th>
              </tr>
            </thead>
            <tbody>
              {tecnicos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty">Nenhum registro de ponto/atendimento hoje.</td>
                </tr>
              ) : (
                tecnicos.map((t) => (
                  <tr key={t.id || t.matricula}>
                    <td style={{ fontWeight: 600 }}>{t.nome}</td>
                    <td className="mono">{t.matricula}</td>
                    <td>{t.atp || 'POSITIVO PR'}</td>
                    <td><span className="badge badge-green">• Ponto Aberto</span></td>
                    <td className="mono">08:00 (Check-in)</td>
                    <td><span className="badge badge-blue">GPS Ativo (-25.4284, -49.2733)</span></td>
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
