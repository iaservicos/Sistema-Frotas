import React from 'react';
import { Wrench, AlertTriangle, CheckCircle, ArrowRight, Gauge } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const ManutencaoView = ({ veiculos }) => {
  return (
    <div className="space-y-4">
      {/* Alerta de Políticas de Revisão */}
      <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-900 dark:text-brand-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <Wrench className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />
          <span>
            <strong>Controle de Manutenção Preventiva:</strong> Alertas acionados automaticamente a 2.000 km de antecedência de cada marco de 10.000 km.
          </span>
        </div>
        <span className="font-mono font-bold bg-brand-500/20 px-2 py-0.5 rounded text-brand-700 dark:text-brand-300">
          Garantia Arval
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {veiculos.map(v => {
          const delta = v.proximaRevisaoKm - v.hodometro;
          const isUrgente = delta <= 1000;
          const pct = Math.min(100, Math.max(0, Math.round(((v.hodometro - v.ultimaRevisaoKm) / (v.proximaRevisaoKm - v.ultimaRevisaoKm)) * 100)));

          return (
            <div
              key={v.id}
              className={`p-5 rounded-2xl bg-white dark:bg-app-darkSurface border transition-all ${
                isUrgente
                  ? 'border-rose-500/30 shadow-sm shadow-rose-500/5'
                  : 'border-slate-200/80 dark:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-app-darkSurface2 text-slate-900 dark:text-white border border-slate-300 dark:border-white/10">
                      {v.placa}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {v.modelo}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {v.atp} • Condutor: {v.tecnicoAlocado || 'Sem alocação'}
                  </div>
                </div>

                <StatusBadge
                  status={isUrgente ? 'revisao_pendente' : v.status}
                  labelOverride={isUrgente ? `Faltam ${delta} km` : undefined}
                />
              </div>

              {/* Barra de Progresso de Revisão */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Gauge className="w-3.5 h-3.5 text-slate-400" />
                    Última: {v.ultimaRevisaoKm.toLocaleString('pt-BR')} km
                  </span>
                  <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
                    Atual: {v.hodometro.toLocaleString('pt-BR')} km
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Meta: {v.proximaRevisaoKm.toLocaleString('pt-BR')} km
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-app-darkSurface2 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 90 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                  <span>Ciclo de 10.000 km</span>
                  <span>{pct}% do ciclo completado</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
