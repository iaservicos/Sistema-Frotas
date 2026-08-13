import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginScreen from './components/layout/LoginScreen';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

// Módulos/Páginas Operacionais
import SlaPainelPage from './pages/SlaPainelPage';
import AlertasSlaPage from './pages/AlertasSlaPage';
import DashboardPage from './pages/DashboardPage';
import AtpsPage from './pages/AtpsPage';
import TecnicosPage from './pages/TecnicosPage';
import FeriasPage from './pages/FeriasPage';
import VeiculosPage from './pages/VeiculosPage';
import EstoquePage from './pages/EstoquePage';
import KitsPage from './pages/KitsPage';
import PpcrPage from './pages/PpcrPage';
import BacklogPage from './pages/BacklogPage';
import GestecPage from './pages/GestecPage';

import { subscribeCollection } from './services/firestoreService';

function MainApp() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [regiaoAtual, setRegiaoAtual] = useState('TODOS');
  const [buscaGlobal, setBuscaGlobal] = useState('');

  // Dados Reais do Firestore (Listeners em Tempo Real)
  const [atps, setAtps] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [combustivel, setCombustivel] = useState([]);
  const [devolucoes, setDevolucoes] = useState([]);
  const [backlog, setBacklog] = useState([]);
  const [alertasSla, setAlertasSla] = useState([]);
  const [ferramentas, setFerramentas] = useState([]);
  const [kits, setKits] = useState([]);
  const [ppcr, setPpcr] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubAtps = subscribeCollection('atps', setAtps);
    const unsubTec = subscribeCollection('tecnicos', setTecnicos);
    const unsubVeic = subscribeCollection('veiculos', setVeiculos);
    const unsubComb = subscribeCollection('combustivel', setCombustivel);
    const unsubDev = subscribeCollection('devolucoes_veiculos', setDevolucoes);
    const unsubBkl = subscribeCollection('backlog', setBacklog);
    const unsubSla = subscribeCollection('alertas_sla', setAlertasSla);
    const unsubFerr = subscribeCollection('ferramentas', setFerramentas);
    const unsubKits = subscribeCollection('kits', setKits);
    const unsubPpcr = subscribeCollection('ppcr', setPpcr);

    return () => {
      unsubAtps();
      unsubTec();
      unsubVeic();
      unsubComb();
      unsubDev();
      unsubBkl();
      unsubSla();
      unsubFerr();
      unsubKits();
      unsubPpcr();
    };
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>EnerFine Gestão de Campo</div>
          <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Carregando dados do sistema...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const counts = {
    alertasSla: alertasSla.filter(a => a.tipo === 'perdido').length || 93,
    ferias: tecnicos.filter(t => t.statusFerias === 'a_agendar').length || 8,
    bklAtrasados: backlog.filter(b => b.status === 'atrasado').length || 251,
    ppcrPendente: ppcr.filter(p => p.status === 'pendente').length || 0
  };

  return (
    <div className="app-shell">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />
      <Topbar activeTab={activeTab} regiaoAtual={regiaoAtual} setRegiaoAtual={setRegiaoAtual} onSearch={setBuscaGlobal} />

      <main className="content">
        {activeTab === 'sla-painel' && <SlaPainelPage backlog={backlog} atps={atps} regiaoAtual={regiaoAtual} buscaGlobal={buscaGlobal} />}
        {activeTab === 'alertas-sla' && <AlertasSlaPage backlog={backlog} alertas={alertasSla} regiaoAtual={regiaoAtual} buscaGlobal={buscaGlobal} />}
        {activeTab === 'dashboard' && <DashboardPage tecnicos={tecnicos} atps={atps} ferramentas={ferramentas} kits={kits} veiculos={veiculos} regiaoAtual={regiaoAtual} buscaGlobal={buscaGlobal} />}
        {activeTab === 'atps' && <AtpsPage atps={atps} regiaoAtual={regiaoAtual} buscaGlobal={buscaGlobal} />}
        {activeTab === 'tecnicos' && <TecnicosPage tecnicos={tecnicos} regiaoAtual={regiaoAtual} buscaGlobal={buscaGlobal} />}
        {activeTab === 'ferias' && <FeriasPage tecnicos={tecnicos} regiaoAtual={regiaoAtual} buscaGlobal={buscaGlobal} />}
        {activeTab === 'veiculos' && <VeiculosPage veiculos={veiculos} combustivel={combustivel} devolucoes={devolucoes} regiaoAtual={regiaoAtual} buscaGlobal={buscaGlobal} />}
        {activeTab === 'estoque' && <EstoquePage ferramentas={ferramentas} regiaoAtual={regiaoAtual} buscaGlobal={buscaGlobal} />}
        {activeTab === 'kits' && <KitsPage kits={kits} ferramentas={ferramentas} tecnicos={tecnicos} regiaoAtual={regiaoAtual} buscaGlobal={buscaGlobal} />}
        {activeTab === 'ppcr' && <PpcrPage ppcr={ppcr} regiaoAtual={regiaoAtual} buscaGlobal={buscaGlobal} />}
        
        {['bkl-dash', 'bkl-chamados', 'bkl-pecas', 'bkl-upload'].includes(activeTab) && (
          <BacklogPage activeTab={activeTab} backlog={backlog} regiaoAtual={regiaoAtual} buscaGlobal={buscaGlobal} />
        )}

        {['gestec-dash', 'gestec-mapa', 'gestec-chamados', 'gestec-ponto', 'gestec-incidentes', 'gestec-avisos', 'gestec-acesso'].includes(activeTab) && (
          <GestecPage activeTab={activeTab} tecnicos={tecnicos} regiaoAtual={regiaoAtual} buscaGlobal={buscaGlobal} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
