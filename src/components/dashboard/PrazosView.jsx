import React from 'react';
import { Calendar, AlertCircle, FileCheck, ShieldAlert, Clock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const PrazosView = ({ veiculos }) => {
  const locados = veiculos.filter(v => v.propriedade.includes('Arval'));

  return (
    <div className="space-y-4">
      {/* Banner Informativo */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span>
            <strong>Gestão de Prazos & Arval:</strong> 2 contratos de leasing encerram em menos de 60 dias. Inicie o fluxo de devolução ou renovação de frota.
          </span>
        </div>
        <span className="font-bold text-amber-700 dark:text-amber-300 whitespace-nowrap ml-4">
          Meta: Evitar Multa de Retenção
        </span>
      </div>

      {/* Grid de Contratos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locados.map(v => {
          const isUrgente = v.diasContrato && v.diasContrato < 60;
          return (
            <div
              key={v.id}
              className={`p-4 rounded-xl bg-white dark:bg-app-darkSurface border transition-all ${
                isUrgente
                  ? 'border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'border-slate-200/80 dark:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-app-darkSurface2 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/10">
                  {v.placa}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isUrgente
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {v.diasContrato} dias restantes
                </span>
              </div>

              <div className="text-sm font-extrabold text-slate-800 dark:text-white mb-1">
                {v.modelo}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {v.atp} ({v.uf})
              </div>

              <div className="space-y-1.5 text-xs pt-3 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Término Contrato:
                  </span>
                  <span className="font-mono font-bold">{v.contratoFim}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Licenciamento 2026:</span>
                  <StatusBadge status={v.licenciamento} labelOverride={v.licenciamento === 'ok' ? 'Regular' : 'Vencendo'} />
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Seguro Obrigatório:</span>
                  <StatusBadge status={v.seguro} labelOverride={v.seguro === 'ok' ? 'Vigente' : 'Vencendo'} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
