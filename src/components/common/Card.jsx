import React from 'react';

export default function Card({ 
  children, 
  title, 
  subtitle, 
  action, 
  dotColor = 'bg-[var(--accent)]', 
  className = '' 
}) {
  return (
    <div className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm mb-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                {title}
              </h3>
            )}
            {subtitle && <p className="text-[11px] text-[var(--text3)] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
