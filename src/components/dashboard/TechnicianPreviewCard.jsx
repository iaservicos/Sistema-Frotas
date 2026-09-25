import React, { useState } from 'react';
import { Smartphone, CheckCircle, Camera, ShieldCheck, Bell, ChevronRight, Gauge, Fuel } from 'lucide-react';

export const TechnicianPreviewCard = () => {
  const [checklistRealizado, setChecklistRealizado] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 border border-slate-700/60 shadow-xl relative overflow-hidden">
      {/* Glow de Fundo */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header do Card */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Sprint 1 • Field Service (Scrum Diagram)
            </div>
            <div className="text-sm font-extrabold text-white">
              Visão do Técnico: Meu Veículo em Cautela
            </div>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          PWA Mobile-First
        </span>
      </div>

      {/* Card do Veículo em Cautela */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded bg-white text-slate-950 tracking-wider">
                BRA-2026
              </span>
              <span className="text-xs font-bold text-slate-200">
                Renault Kwid Zen 1.0 (2025)
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              ATP Curitiba (Matriz) • Custodiante: <strong>Marcio Eduardo</strong>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Hodômetro</span>
            <div className="font-mono font-black text-emerald-400 text-sm">19.450 km</div>
          </div>
        </div>

        {/* Notificação Push Ativa (Firebase FCM) */}
        <div className="mt-3 p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-200">
          <Bell className="w-4 h-4 text-amber-400 flex-shrink-0 animate-bounce" />
          <span>
            <strong>Aviso de Manutenção:</strong> Faltam <strong>550 km</strong> para a revisão obrigatória de 20.000 km na Arval.
          </span>
        </div>
      </div>

      {/* Status do Checklist Diário */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
            checklistRealizado ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-900'
          }`}>
            <CheckCircle className="w-2.5 h-2.5" />
          </div>
          <span>
            Checklist Diário: {checklistRealizado ? <strong className="text-emerald-400">Realizado hoje às 08:10</strong> : <strong className="text-amber-400">Pendente de Saída</strong>}
          </span>
        </div>

        <button
          onClick={() => setChecklistRealizado(!checklistRealizado)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/30 active:scale-95"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{checklistRealizado ? 'Ver Vistoria 360° Realizada' : 'Iniciar Vistoria 360°'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
