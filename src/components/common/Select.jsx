import React from 'react';

export default function Select({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Selecionar...', 
  className = '', 
  ...props 
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all cursor-pointer ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
