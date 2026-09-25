import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRegiao, setSelectedRegiao] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-app-bg dark:bg-app-darkBg text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
        {/* Sidebar Fixa Lateral */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Topbar Fixa Superior */}
        <Topbar
          selectedRegiao={selectedRegiao}
          onSelectRegiao={setSelectedRegiao}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Conteúdo Principal Dinâmico */}
        <main className="flex-1 lg:pl-64 pt-20 px-4 sm:px-6 lg:px-8 pb-12 w-full max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              selectedRegiao={selectedRegiao}
              searchTerm={searchTerm}
            />
          )}

          {activeTab !== 'dashboard' && (
            <div className="bg-white dark:bg-app-darkSurface p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 text-center space-y-3">
              <div className="text-lg font-bold text-slate-800 dark:text-white">
                Módulo em Estruturação ({activeTab})
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Este módulo está mapeado no roadmap das Sprints 1 a 6. Você pode interagir com o Dashboard Geral para visualizar os dados unificados.
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all"
              >
                Voltar ao Dashboard Geral
              </button>
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
