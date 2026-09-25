import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Search, Zap, Bell, CheckCircle2 } from 'lucide-react';

const REGIOES = ['TODAS', 'SUDESTE', 'SUL', 'NORDESTE', 'C-OESTE', 'NORTE'];

export const Topbar = ({ selectedRegiao, onSelectRegiao, searchTerm, onSearchChange }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white/90 dark:bg-app-darkSurface/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 z-40 px-4 lg:px-8 flex items-center justify-between transition-colors duration-200">
      {/* Lado Esquerdo: Identificador Mobile & Filtro Regional */}
      <div className="flex items-center gap-4">
        {/* Mobile Logo Only */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-glow">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            SG<span className="text-brand-500">Frotas</span>
          </span>
        </div>

        {/* Pílulas Regionais */}
        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-app-darkSurface2 p-1 rounded-xl border border-slate-200/80 dark:border-white/5">
          {REGIOES.map(reg => (
            <button
              key={reg}
              onClick={() => onSelectRegiao(reg)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedRegiao === reg
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Centro: Campo de Busca Rápida */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por placa, técnico, ATP ou contrato Arval..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 dark:bg-app-darkSurface2 border border-slate-200/80 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>
      </div>

      {/* Lado Direito: Status Conexão, Notificações, Tema & Usuário */}
      <div className="flex items-center gap-3">
        {/* Status Live */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>17 ATPs Ativas</span>
        </div>

        {/* Notificações */}
        <button
          className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
          title="Notificações Operacionais"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-app-darkSurface" />
        </button>

        {/* Alternador de Tema */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
          title={isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Perfil */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80 dark:border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            GF
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              Gestor de Frotas
            </div>
            <div className="text-[10px] text-slate-400">Torre Central</div>
          </div>
        </div>
      </div>
    </header>
  );
};
