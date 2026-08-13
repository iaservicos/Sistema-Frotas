import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  loading = false, 
  disabled = false, 
  className = '', 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none font-sans";
  
  const variants = {
    primary: "bg-[var(--accent)] text-white hover:brightness-110 shadow-sm shadow-sky-500/20",
    ghost: "bg-[var(--surface2)] text-[var(--text2)] border border-[var(--border)] hover:bg-[var(--surface3)] hover:text-[var(--text)]",
    danger: "bg-red-500/10 text-[var(--danger)] border border-red-500/20 hover:bg-red-500/20",
    success: "bg-emerald-500/10 text-[var(--success)] border border-emerald-500/20 hover:bg-emerald-500/20",
    warning: "bg-amber-500/10 text-[var(--warning)] border border-amber-500/20 hover:bg-amber-500/20"
  };

  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3.5 py-2 text-xs",
    lg: "px-4 py-2.5 text-sm"
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
