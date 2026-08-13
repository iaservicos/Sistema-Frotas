import React from 'react';

export default function Table({ 
  headers = [], 
  children, 
  isEmpty = false, 
  emptyMessage = 'Nenhum registro encontrado.',
  className = '' 
}) {
  return (
    <div className={`overflow-x-auto w-full ${className}`}>
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {headers.map((h, idx) => (
              <th 
                key={idx} 
                className="px-3.5 py-2.5 text-[10px] font-bold tracking-wider uppercase text-[var(--text3)] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] text-[var(--text2)]">
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length || 1} className="py-8 text-center text-xs text-[var(--text3)]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
