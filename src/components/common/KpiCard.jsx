import React from 'react';

const colorStyles = {
  blue: {
    stripe: 'kpi-stripe-blue',
    text: 'text-brand-600 dark:text-brand-400',
    iconBg: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
  },
  green: {
    stripe: 'kpi-stripe-green',
    text: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    stripe: 'kpi-stripe-amber',
    text: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  red: {
    stripe: 'kpi-stripe-red',
    text: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  },
  purple: {
    stripe: 'kpi-stripe-purple',
    text: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
};

export const KpiCard = ({ title, value, sub, color = 'blue', icon: Icon, trend }) => {
  const current = colorStyles[color] || colorStyles.blue;

  return (
    <div className={`relative overflow-hidden bg-white dark:bg-app-darkSurface border border-slate-200/80 dark:border-white/10 rounded-xl p-5 shadow-card hover:shadow-md transition-all duration-200 ${current.stripe}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg ${current.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className={`font-mono text-3xl font-extrabold tracking-tight ${current.text}`}>
        {value}
      </div>

      {(sub || trend) && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
          <span>{sub}</span>
          {trend && (
            <span className={`font-semibold ${trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
