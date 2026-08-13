import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ini } from '../../utils/hash';

export default function Sidebar({ activeTab, setActiveTab, counts = {} }) {
  const { adminAtual, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isMaster = adminAtual?.tipo === 'master';
  const modulos = isMaster ? [
    'dashboard','atps','tecnicos','estoque','kits','veiculos','ferias','relatorios','gestec','backlog','sla','alertas_sla','ppcr','usuarios','frota','incidentes','ponto'
  ] : (adminAtual?.modulos || []);

  const temMod = (mod) => isMaster || modulos.includes(mod);

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <div className="logo-text">Ener<span>Fine</span></div>
            <div className="logo-sub">Gestão de Campo</div>
          </div>
        </div>
      </div>

      <div className="sidebar-user">
        <div id="s-avatar" className="s-avatar">{ini(adminAtual?.nome || 'Admin')}</div>
        <span id="s-user-name" className="s-user-name">{adminAtual?.nome || 'Administrador'}</span>
        <button className="s-logout" onClick={logout} title="Sair do sistema">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>

      <div className="sidebar-nav">
        {/* Visão Geral */}
        {temMod('dashboard') && (
          <div className="nav-section">
            <div className="nav-label">Visão Geral</div>
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Dashboard
            </button>
          </div>
        )}

        {/* SLA */}
        {temMod('sla') && (
          <div className="nav-section">
            <div className="nav-label">SLA</div>
            <button 
              className={`nav-btn ${activeTab === 'sla-painel' ? 'active' : ''}`}
              onClick={() => setActiveTab('sla-painel')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Painel SLA
            </button>
            <button 
              className={`nav-btn ${activeTab === 'alertas-sla' ? 'active' : ''}`}
              onClick={() => setActiveTab('alertas-sla')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Alertas SLA
              {counts.alertasSla > 0 && <span className="badge badge-red" style={{ marginLeft: 'auto' }}>{counts.alertasSla}</span>}
            </button>
          </div>
        )}

        {/* Cadastros */}
        {(temMod('atps') || temMod('tecnicos') || temMod('ferias')) && (
          <div className="nav-section">
            <div className="nav-label">Cadastros</div>
            {temMod('atps') && (
              <button className={`nav-btn ${activeTab === 'atps' ? 'active' : ''}`} onClick={() => setActiveTab('atps')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ATPs (Bases)
              </button>
            )}
            {temMod('tecnicos') && (
              <button className={`nav-btn ${activeTab === 'tecnicos' ? 'active' : ''}`} onClick={() => setActiveTab('tecnicos')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                Técnicos (HC)
              </button>
            )}
            {temMod('ferias') && (
              <button className={`nav-btn ${activeTab === 'ferias' ? 'active' : ''}`} onClick={() => setActiveTab('ferias')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Férias
                {counts.ferias > 0 && <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>{counts.ferias}</span>}
              </button>
            )}
          </div>
        )}

        {/* Backlog */}
        {temMod('backlog') && (
          <div className="nav-section">
            <div className="nav-label">Backlog</div>
            <button className={`nav-btn ${activeTab === 'bkl-dash' ? 'active' : ''}`} onClick={() => setActiveTab('bkl-dash')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Painel Geral
            </button>
            <button className={`nav-btn ${activeTab === 'bkl-chamados' ? 'active' : ''}`} onClick={() => setActiveTab('bkl-chamados')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Chamados
              {counts.bklAtrasados > 0 && <span className="badge badge-red" style={{ marginLeft: 'auto' }}>{counts.bklAtrasados}</span>}
            </button>
            <button className={`nav-btn ${activeTab === 'bkl-pecas' ? 'active' : ''}`} onClick={() => setActiveTab('bkl-pecas')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
              Solicitações PP
            </button>
            <button className={`nav-btn ${activeTab === 'bkl-upload' ? 'active' : ''}`} onClick={() => setActiveTab('bkl-upload')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Importar Base
            </button>
          </div>
        )}

        {/* Gestão de Técnicos */}
        {(temMod('gestec') || isMaster) && (
          <div className="nav-section">
            <div className="nav-label">Gestão de Técnicos</div>
            <button className={`nav-btn ${activeTab === 'gestec-dash' ? 'active' : ''}`} onClick={() => setActiveTab('gestec-dash')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Dashboard TEC
            </button>
            <button className={`nav-btn ${activeTab === 'gestec-mapa' ? 'active' : ''}`} onClick={() => setActiveTab('gestec-mapa')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
              Mapa de Campo
            </button>
            <button className={`nav-btn ${activeTab === 'gestec-chamados' ? 'active' : ''}`} onClick={() => setActiveTab('gestec-chamados')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
              Atendimentos
            </button>
            <button className={`nav-btn ${activeTab === 'gestec-ponto' ? 'active' : ''}`} onClick={() => setActiveTab('gestec-ponto')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Controle de Ponto
            </button>
            <button className={`nav-btn ${activeTab === 'gestec-incidentes' ? 'active' : ''}`} onClick={() => setActiveTab('gestec-incidentes')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              Incidentes
            </button>
            <button className={`nav-btn ${activeTab === 'gestec-avisos' ? 'active' : ''}`} onClick={() => setActiveTab('gestec-avisos')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
              Avisos
            </button>
            <button className={`nav-btn ${activeTab === 'gestec-acesso' ? 'active' : ''}`} onClick={() => setActiveTab('gestec-acesso')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Acesso & Senhas
            </button>
          </div>
        )}

        {/* Administrativo */}
        {(temMod('veiculos') || temMod('relatorios') || temMod('usuarios')) && (
          <div className="nav-section">
            <div className="nav-label">Administrativo</div>
            {temMod('veiculos') && (
              <button className={`nav-btn ${activeTab === 'veiculos' ? 'active' : ''}`} onClick={() => setActiveTab('veiculos')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                Veículos
              </button>
            )}
            {temMod('relatorios') && (
              <button className={`nav-btn ${activeTab === 'relatorios' ? 'active' : ''}`} onClick={() => setActiveTab('relatorios')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                Relatórios
              </button>
            )}
            {temMod('usuarios') && (
              <button className={`nav-btn ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => setActiveTab('usuarios')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Usuários Admin
              </button>
            )}
          </div>
        )}

        {/* Ferramentas */}
        {(temMod('estoque') || temMod('kits')) && (
          <div className="nav-section">
            <div className="nav-label">Ferramentas</div>
            {temMod('estoque') && (
              <button className={`nav-btn ${activeTab === 'estoque' ? 'active' : ''}`} onClick={() => setActiveTab('estoque')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                Estoque
              </button>
            )}
            {temMod('kits') && (
              <button className={`nav-btn ${activeTab === 'kits' ? 'active' : ''}`} onClick={() => setActiveTab('kits')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                Kits & Vínculos
              </button>
            )}
          </div>
        )}

        {/* PPCR */}
        {temMod('ppcr') && (
          <div className="nav-section">
            <div className="nav-label">PPCR</div>
            <button className={`nav-btn ${activeTab === 'ppcr' ? 'active' : ''}`} onClick={() => setActiveTab('ppcr')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              Solicitações
              {counts.ppcrPendente > 0 && <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>{counts.ppcrPendente}</span>}
            </button>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-footer-text">EnerFine v2.0 · SPA</span>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
          <span>{theme === 'dark' ? 'Escuro' : 'Claro'}</span>
        </button>
      </div>
    </nav>
  );
}
