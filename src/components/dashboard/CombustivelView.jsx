import React from 'react';
import { Fuel, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { TRANSACOES_VALECARD_MOCK } from '../../data/mockData';

export const CombustivelView = () => {
  return (
    <div className="space-y-4">
      {/* Banner de Integração REST ValeCard */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm flex items-center gap-2">
              <span>Conector REST ValeCard Ativo</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              WebService Oficial autenticado • Token: <span className="font-mono text-slate-300">OTMzOTgzQHdlYlNl...</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Média da Frota</div>
            <div className="font-mono font-black text-emerald-400 text-base">13.2 km/L</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Auditoria Automática</div>
            <div className="font-bold text-xs text-brand-400">Anti-Fraude Ativo</div>
          </div>
        </div>
      </div>

      {/* Tabela de Transações com Alertas */}
      <div className="bg-white dark:bg-app-darkSurface border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
            <span>Últimos Abastecimentos Auditados</span>
            <span className="text-xs font-normal text-slate-400">(Webhook &amp; REST)</span>
          </div>
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer">
            Exportar Relatório CSV
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
          {TRANSACOES_VALECARD_MOCK.map((t) => {
            const hasAlert = t.status.startsWith('alerta');
            return (
              <div key={t.id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl flex-shrink-0 ${
                    hasAlert
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {hasAlert ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-app-darkSurface2 border border-slate-300 dark:border-white/10 text-xs">
                        {t.placa}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {t.posto}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {t.data} • {t.combustivel} • Hodômetro na Bomba: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{t.kmBomba.toLocaleString('pt-BR')} km</span>
                    </div>

                    {t.motivo && (
                      <div className="mt-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md inline-block">
                        ⚠️ Alerta Anti-Fraude: {t.motivo}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right flex md:flex-col justify-between items-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 dark:border-white/5">
                  <div className="font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                    R$ {t.valor.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {t.litros.toFixed(1)} Litros
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
