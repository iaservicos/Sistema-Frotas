import React, { useState } from 'react';

const REGIOES = [
  { label: 'Todos', id: 'TODOS' },
  { label: 'SUL', id: 'SUL' },
  { label: 'NORTE', id: 'NORTE' },
  { label: 'NORDESTE', id: 'NORDESTE' },
  { label: 'SUDESTE', id: 'SUDESTE' },
  { label: 'C-OESTE', id: 'C-OESTE' }
];

export default function Topbar({ activeTab, regiaoAtual, setRegiaoAtual, notifCount = 10, onSearch }) {
  const [busca, setBusca] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const mapTitles = {
    'sla-painel': 'SLA / Painel SLA Monitor',
    'alertas-sla': 'SLA / Alertas SLA',
    'dashboard': 'Dashboard / Dashboard',
    'atps': 'Cadastros / ATPs',
    'tecnicos': 'Cadastros / Técnicos (HC)',
    'ferias': 'Férias / Férias',
    'veiculos': 'Administrativo / Veículos',
    'relatorios': 'Administrativo / Relatórios',
    'usuarios': 'Administrativo / Usuários Admin',
    'estoque': 'Ferramentas / Estoque',
    'kits': 'Ferramentas / Kits & Vínculos',
    'ppcr': 'PPCR / Solicitações',
    'bkl-dash': 'Backlog / Painel Geral',
    'bkl-chamados': 'Backlog / Chamados',
    'bkl-pecas': 'Backlog / Solicitações PP',
    'bkl-upload': 'Backlog / Importar Base',
    'gestec-dash': 'GESTEC / Dashboard TEC',
    'gestec-mapa': 'GESTEC / Mapa de Campo',
    'gestec-chamados': 'GESTEC / Atendimentos',
    'gestec-ponto': 'GESTEC / Controle de Ponto',
    'gestec-incidentes': 'GESTEC / Incidentes',
    'gestec-avisos': 'GESTEC / Avisos',
    'gestec-acesso': 'GESTEC / Acesso & Senhas'
  };

  const currentTitle = mapTitles[activeTab] || 'Dashboard / Dashboard';
  const parts = currentTitle.split(' / ');

  const handleRegionClick = (regId) => {
    if (setRegiaoAtual) {
      setRegiaoAtual(regId);
    }
  };

  const handleNotifToggle = (e) => {
    e.stopPropagation();
    setNotifOpen(prev => !prev);
  };

  return (
    <header className="topbar" style={{ zIndex: 1000 }}>
      <div className="topbar-title font-bold">
        {parts[0]} <span style={{ color: 'var(--text3)', fontWeight: 400 }}>/ {parts[1] || parts[0]}</span>
      </div>

      <div style={{ position: 'relative', flex: 1, maxWidth: '280px', margin: '0 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0 10px', height: '32px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text3)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Buscar no sistema..." 
            value={busca} 
            onChange={(e) => {
              setBusca(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '12px', width: '100%' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', flexShrink: 0 }}>
        {REGIOES.map((r) => {
          const isActive = regiaoAtual === r.id;
          return (
            <button 
              key={r.id}
              type="button"
              id={`rpill-${r.id}`}
              className={`rpill ${isActive ? 'active' : ''}`}
              onClick={() => handleRegionClick(r.id)}
              style={{ cursor: 'pointer', pointerEvents: 'auto', zIndex: 1001 }}
            >
              {r.label}
            </button>
          );
        })}

        <div style={{ width: '1px', height: '22px', background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />

        <div style={{ position: 'relative', zIndex: 1001 }}>
          <button 
            type="button"
            className="notif-bell" 
            onClick={handleNotifToggle}
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span>Avisos</span>
            <span className="notif-count" style={{ display: 'inline-flex' }}>{notifCount}</span>
          </button>

          {notifOpen && (
            <div 
              className="notif-panel open" 
              style={{ 
                display: 'block', 
                position: 'absolute', 
                right: 0, 
                top: 'calc(100% + 8px)', 
                width: '320px', 
                background: 'var(--surface)', 
                border: '1px solid var(--border)', 
                borderRadius: '12px', 
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)', 
                zIndex: 9999, 
                padding: '14px' 
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '6px', color: 'var(--text)' }}>
                Centro de Notificações
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text2)', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <strong style={{ color: 'var(--danger)' }}>10 Alertas de SLA:</strong> Chamados críticos fora do prazo em atraso.
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text2)', padding: '6px 0' }}>
                <strong style={{ color: 'var(--warning)' }}>8 Férias Pendentes:</strong> Técnicos aguardando programação de férias.
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
