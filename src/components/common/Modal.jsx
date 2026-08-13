import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-2xl',
  className = '' 
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${className}`}>
        <div className="flex items-center justify-between mb-5">
          {title && <h3 className="text-base font-extrabold text-[var(--text)]">{title}</h3>}
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[var(--surface2)] text-[var(--text3)] hover:text-[var(--text)] border border-[var(--border)] transition-all"
          >
            <X size={16} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
