import React from 'react';
import { Truck, CalendarClock, Wrench, Fuel } from 'lucide-react';

export const PillTabs = ({ activePillar, onSelectPillar }) => {
  const pillars = [
    { id: 'frota', label: 'Status da Frota & Alocação', icon: Truck, count: '7' },
    { id: 'prazos', label: 'Prazo de Veículos (Arval & Licença)', icon: CalendarClock, count: '3 Vencendo', badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400' },
    { id: 'manutencao', label: 'Manutenção & Odômetro (10k km)', icon: Wrench, count: '2 Alertas', badgeColor: 'bg-rose-500/20 text-rose-600 dark:text-rose-400' },
    { id: 'combustivel', label: 'Consumo & ValeCard REST', icon: Fuel, count: '2 Fraudes Evitadas', badgeColor: 'bg-brand-500/20 text-brand-600 dark:text-brand-400' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 dark:bg-app-darkSurface2 rounded-2xl border border-slate-300/60 dark:border-white/5 overflow-x-auto select-none transition-colors">
      {pillars.map((p) => {
        const Icon = p.icon;
        const isActive = activePillar === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onSelectPillar(p.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              isActive
                ? 'bg-brand-600 dark:bg-brand-500 text-white shadow-md shadow-brand-500/25 scale-[1.01]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{p.label}</span>
            {p.count && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : p.badgeColor || 'bg-slate-300 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {p.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
