import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';
import { 
  X, Truck, UserCheck, ShieldAlert, Wrench, FileText, 
  Calendar, Gauge, AlertTriangle, CheckCircle2, Building2
} from 'lucide-react';

export const VehicleDetailsModal = ({ placa, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('resumo');

  useEffect(() => {
    if (!placa) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.getVeiculoPorPlaca(placa)
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Erro ao carregar dados do veículo.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [placa]);

  if (!placa) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-app-darkSurface border border-slate-200/90 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-app-darkSurface2/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-black text-lg px-2.5 py-0.5 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 tracking-wider">
                  {placa}
                </span>
                <StatusBadge status={data?.status_operacional?.toLowerCase() || 'em_uso'} />
                {data?.locadora_nome && (
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-white/5">
                    {data.locadora_nome}
                  </span>
                )}
              </div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                {data?.modelo || 'Carregando veículo...'} {data?.ano ? `(${data.ano})` : ''} • {data?.base_nome || ''} ({data?.base_uf || ''})
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas Internas */}
        <div className="flex border-b border-slate-100 dark:border-white/10 px-6 gap-6 bg-white dark:bg-app-darkSurface text-xs font-bold">
          <button
            onClick={() => setActiveTab('resumo')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'resumo'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Resumo & Contrato</span>
          </button>
          <button
            onClick={() => setActiveTab('revisoes')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'revisoes'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Revisões ({data?.historico_revisoes?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('multas')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'multas'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Multas & AITs ({data?.historico_multas?.length || 0})</span>
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading && (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Buscando dados em tempo real no Supabase...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
              {error}
            </div>
          )}

          {!loading && data && (
            <>
              {/* Tab 1: Resumo */}
              {activeTab === 'resumo' && (
                <div className="space-y-6">
                  {/* Card do Condutor Atual sob Custódia */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-app-darkSurface2 border border-slate-200/80 dark:border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                        <span>Condutor Sob Custódia Ativa</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Termo Assinado
                      </span>
                    </div>

                    {data.condutor_atual_nome ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Nome do Técnico</span>
                          <span className="font-extrabold text-slate-800 dark:text-white text-sm">
                            {data.condutor_atual_nome}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Matrícula / SAP</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {data.condutor_atual_matricula || 'NÃO INFORMADA'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Base Operacional</span>
                          <span className="font-bold text-brand-600 dark:text-brand-400">
                            {data.base_nome} ({data.base_uf})
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Veículo atualmente disponível no pátio, sem condutor ativo associado.
                      </p>
                    )}
                  </div>

                  {/* Informações Contratuais Arval */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-app-darkSurface">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Hodômetro Atual</span>
                      <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                        {Number(data.hodometro_atual || 0).toLocaleString('pt-BR')} km
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-app-darkSurface">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Franquia Mensal</span>
                      <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                        {Number(data.franquia_mensal_km || 4000).toLocaleString('pt-BR')} km
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-app-darkSurface">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Fim do Contrato</span>
                      <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                        {data.data_fim_contrato || '2026-01-15'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-app-darkSurface">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Vigência Restante</span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {data.dias_para_fim_contrato || '478'} dias
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Revisões */}
              {activeTab === 'revisoes' && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-500">
                    Histórico de manutenções periódicas a cada 10.000 km registradas na base do Supabase.
                  </div>
                  {(!data.historico_revisoes || data.historico_revisoes.length === 0) ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      Nenhuma manutenção registrada para este veículo até o momento.
                    </div>
                  ) : (
                    <div className="border border-slate-200/80 dark:border-white/10 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-app-darkSurface2 text-slate-500 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="py-2.5 px-4">Ciclo (km)</th>
                            <th className="py-2.5 px-4">Odômetro no Ato</th>
                            <th className="py-2.5 px-4">Próxima Revisão</th>
                            <th className="py-2.5 px-4">Data Realização</th>
                            <th className="py-2.5 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                          {data.historico_revisoes.map((rev) => (
                            <tr key={rev.id_manutencao} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                              <td className="py-2.5 px-4 font-bold">{rev.ciclo_km || '—'} km</td>
                              <td className="py-2.5 px-4">{Number(rev.odometro_momento || 0).toLocaleString('pt-BR')} km</td>
                              <td className="py-2.5 px-4 text-brand-600 dark:text-brand-400 font-bold">
                                {Number(rev.proxima_revisao_km || 0).toLocaleString('pt-BR')} km
                              </td>
                              <td className="py-2.5 px-4">{rev.data_realizacao || '—'}</td>
                              <td className="py-2.5 px-4">
                                <span className="font-sans font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                  {rev.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Multas */}
              {activeTab === 'multas' && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-500">
                    Autuações de trânsito vinculadas ao chassi/placa deste veículo com acompanhamento de indicação de condutor (NIC).
                  </div>
                  {(!data.historico_multas || data.historico_multas.length === 0) ? (
                    <div className="p-8 text-center text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Veículo sem nenhuma autuação de trânsito pendente!</span>
                    </div>
                  ) : (
                    <div className="border border-slate-200/80 dark:border-white/10 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-app-darkSurface2 text-slate-500 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="py-2.5 px-4">Número AIT</th>
                            <th className="py-2.5 px-4">Data Infração</th>
                            <th className="py-2.5 px-4">Infração</th>
                            <th className="py-2.5 px-4">Valor</th>
                            <th className="py-2.5 px-4">Condutor Indicado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                          {data.historico_multas.map((m) => (
                            <tr key={m.id_multa} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                              <td className="py-2.5 px-4 font-bold">{m.numero_ait}</td>
                              <td className="py-2.5 px-4">{m.data_hora_infracao ? m.data_hora_infracao.substring(0, 10) : '—'}</td>
                              <td className="py-2.5 px-4 font-sans max-w-xs truncate">{m.descricao_infracao}</td>
                              <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-white">
                                R$ {Number(m.valor_original || 0).toFixed(2)}
                              </td>
                              <td className="py-2.5 px-4">
                                <span className={`font-sans font-bold text-[10px] px-2 py-0.5 rounded-full ${
                                  m.condutor_indicado
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                }`}>
                                  {m.condutor_indicado ? 'Sim (Protocolado)' : 'Pendente NIC'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
