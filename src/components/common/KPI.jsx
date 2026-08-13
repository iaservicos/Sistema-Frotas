import React from 'react';

export default function KPI({ 
  label, 
  value, 
  subtext, 
  color = 'blue', 
  className = '' 
}) {
  const topBars = {
    blue: "from-[var(--accent)] to-sky-400",
    green: "from-[var(--success)] to-emerald-400",
    amber: "from-[var(--warning)] to-amber-400",
    red: "from-[var(--danger)] to-red-400",
    purple: "from-purple-500 to-purple-400"
  };

  const textColors = {
    blue: "text-[var(--accent)]",
    green: "text-[var(--success)]",
    amber: "text-[var(--warning)]",
    red: "text-[var(--danger)]",
    purple: "text-purple-500"
  };

  return (
    <div className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 relative overflow-hidden shadow-sm ${className}`}>
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${topBars[color] || topBars.blue}`} />
      <div className="text-[10px] font-bold text-[var(--text3)] uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className={`text-3xl font-extrabold tracking-tight font-mono ${textColors[color] || textColors.blue}`}>
        {value ?? '—'}
      </div>
      {subtext && (
        <div className="text-[11px] text-[var(--text3)] mt-1.5">
          {subtext}
        </div>
      )}
    </div>
  );
}
