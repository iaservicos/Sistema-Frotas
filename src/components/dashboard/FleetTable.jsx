import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Fuel, Eye, ArrowUpRight, ShieldCheck, UserCheck } from 'lucide-react';

export const FleetTable = ({ veiculos, onSelectVeiculo }) => {
  return (
    <div className="bg-white dark:bg-app-darkSurface border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-card overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-app-darkSurface2 border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-5">Placa & Propriedade</th>
              <th className="py-3.5 px-4">Modelo / Ano</th>
              <th className="py-3.5 px-4">Base Operacional (ATP)</th>
              <th className="py-3.5 px-4">Condutor Atual</th>
              <th className="py-3.5 px-4">Hodômetro & Nível</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {veiculos.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  Nenhum veículo encontrado com os filtros aplicados.
                </td>
              </tr>
            ) : (
              veiculos.map((v) => (
                <tr
                  key={v.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  onClick={() => onSelectVeiculo?.(v)}
                >
                  {/* Placa & Propriedade */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-app-darkSurface2 text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 tracking-wider">
                        {v.placa}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {v.propriedade.includes('Arval') ? 'Arval' : 'Próprio'}
                      </span>
                    </div>
                  </td>

                  {/* Modelo */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {v.modelo}
                    </div>
                    <div className="text-[11px] text-slate-400">Ano {v.ano}</div>
                  </td>

                  {/* ATP */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-700 dark:text-slate-300 font-medium">
                      {v.atp}
                    </div>
                    <div className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">
                      {v.uf} • {v.regiao}
                    </div>
                  </td>

                  {/* Condutor */}
                  <td className="py-3.5 px-4">
                    {v.tecnicoAlocado ? (
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{v.tecnicoAlocado}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Disponível no Pátio</span>
                    )}
                  </td>

                  {/* Hodômetro */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {v.hodometro.toLocaleString('pt-BR')} km
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                      <Fuel className="w-3 h-3 text-amber-500" />
                      <span>Tanque: {v.tanque}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={v.status} />
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVeiculo?.(v);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-white/5 dark:hover:bg-brand-500/20 dark:hover:text-brand-300 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detalhes</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
