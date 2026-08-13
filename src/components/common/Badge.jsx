import React from 'react';

export default function Badge({ 
  children, 
  variant = 'blue', 
  className = '', 
  showDot = true 
}) {
  const variants = {
    green: "bg-emerald-500/10 text-[var(--success)]",
    red: "bg-red-500/10 text-[var(--danger)]",
    amber: "bg-amber-500/10 text-[var(--warning)]",
    blue: "bg-sky-500/10 text-[var(--accent)]",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    gray: "bg-[var(--surface3)] text-[var(--text3)]"
  };

  const dotColors = {
    green: "bg-[var(--success)]",
    red: "bg-[var(--danger)]",
    amber: "bg-[var(--warning)]",
    blue: "bg-[var(--accent)]",
    purple: "bg-purple-500",
    gray: "bg-[var(--text3)]"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${variants[variant]} ${className}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
