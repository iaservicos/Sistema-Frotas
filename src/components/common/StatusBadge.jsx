import React from 'react';

const badgeConfig = {
  disponivel: {
    label: 'Disponível',
    bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  em_uso: {
    label: 'Em Uso (Custódia)',
    bg: 'bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/20',
    dot: 'bg-brand-500 animate-pulse',
  },
  manutencao: {
    label: 'Em Oficina',
    bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500',
  },
  sinistrado: {
    label: 'Sinistrado',
    bg: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
    dot: 'bg-rose-500',
  },
  revisao_pendente: {
    label: 'Revisão Próxima',
    bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500 animate-pulse',
  },
  ok: {
    label: 'Regular',
    bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  atencao: {
    label: 'Vencendo',
    bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500',
  },
  vencido: {
    label: 'Vencido',
    bg: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
    dot: 'bg-rose-500 animate-pulse',
  }
};

export const StatusBadge = ({ status, labelOverride }) => {
  const normalizedKey = String(status || '').toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const config = badgeConfig[normalizedKey] || {
    label: labelOverride || status || 'Indefinido',
    bg: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20',
    dot: 'bg-slate-400',
  };

  const displayText = labelOverride || config.label;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} whitespace-nowrap transition-colors`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      <span>{displayText}</span>
    </span>
  );
};
