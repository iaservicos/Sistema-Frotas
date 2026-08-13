import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Buscar...', 
  className = '' 
}) {
  return (
    <div className={`relative flex-1 min-w-[200px] ${className}`}>
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] placeholder-[var(--text3)] outline-none focus:border-[var(--accent)] transition-all"
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text)]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
