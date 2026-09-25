import React from 'react';
import {
  LayoutDashboard,
  Truck,
  CalendarClock,
  Wrench,
  Fuel,
  AlertTriangle,
  Smartphone,
  ClipboardCheck,
  Flame,
  Building2,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const Sidebar = ({ activeTab, onSelectTab }) => {
  const navSections = [
    {
      title: 'Visão Geral',
      items: [
        { id: 'dashboard', label: 'Dashboard Executivo', icon: LayoutDashboard, badge: 'Live' },
      ],
    },
    {
      title: 'Torre de Controle (Gestor)',
      items: [
        { id: 'veiculos', label: 'Controle de Veículos', icon: Truck },
        { id: 'prazos', label: 'Gestão de Prazos & Arval', icon: CalendarClock },
        { id: 'manutencao', label: 'Manutenção & Odômetro', icon: Wrench, badge: '3' },
        { id: 'combustivel', label: 'Combustível ValeCard', icon: Fuel },
        { id: 'multas', label: 'Central de Multas (NIC)', icon: AlertTriangle },
      ],
    },
    {
      title: 'Field Service (Técnico PWA)',
      items: [
        { id: 'tecnico_cautela', label: 'Meu Veículo em Cautela', icon: Smartphone },
        { id: 'tecnico_checklist', label: 'Checklist Diário 360°', icon: ClipboardCheck },
        { id: 'tecnico_sinistros', label: 'Sinistros & Emergência', icon: Flame },
      ],
    },
    {
      title: 'Cadastros & Bases',
      items: [
        { id: 'atps', label: '17 ATPs Positivo', icon: Building2 },
        { id: 'tecnicos', label: 'Técnicos & Condutores', icon: Users },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-sidebar-bg dark:bg-sidebar-darkBg h-screen fixed top-0 left-0 flex flex-col z-50 border-r border-sidebar-border select-none transition-colors duration-200">
      {/* Header do Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-glow">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-white flex items-center gap-0.5">
              SG<span className="text-brand-400">Frotas</span>
            </div>
            <div className="text-[10px] font-semibold text-sidebar-muted tracking-wider uppercase">
              EnerFine • Campo & Frota
            </div>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
        {navSections.map((sec, idx) => (
          <div key={idx}>
            <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-3 mb-2">
              {sec.title}
            </div>
            <div className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-500/15 text-brand-400 font-semibold shadow-sm border border-brand-500/20'
                        : 'text-sidebar-text hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-brand-500/30 text-brand-300'
                          : 'bg-slate-700/50 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Rodapé da Sidebar */}
      <div className="p-4 border-t border-sidebar-border bg-black/10 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>v3.0.0 (Scrum)</span>
        </div>
        <span className="font-mono text-[10px] text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
          FastAPI + PG
        </span>
      </div>
    </aside>
  );
};
