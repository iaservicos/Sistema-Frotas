import React, { useState, useMemo, useEffect } from 'react';
import { KpiCard } from '../components/common/KpiCard';
import { PillTabs } from '../components/dashboard/PillTabs';
import { FleetTable } from '../components/dashboard/FleetTable';
import { PrazosView } from '../components/dashboard/PrazosView';
import { ManutencaoView } from '../components/dashboard/ManutencaoView';
import { CombustivelView } from '../components/dashboard/CombustivelView';
import { TechnicianPreviewCard } from '../components/dashboard/TechnicianPreviewCard';
import { VehicleDetailsModal } from '../components/dashboard/VehicleDetailsModal';
import { VEICULOS_MOCK } from '../data/mockData';
import { api } from '../services/api';
import { 
  Truck, CheckCircle2, AlertTriangle, ShieldCheck, Download, Plus, 
  Database, RefreshCw, AlertCircle
} from 'lucide-react';

const UF_TO_REGIAO = {
  SP: 'SUDESTE', RJ: 'SUDESTE', MG: 'SUDESTE', ES: 'SUDESTE',
  PR: 'SUL', SC: 'SUL', RS: 'SUL',
  BA: 'NORDESTE', PE: 'NORDESTE', CE: 'NORDESTE', MA: 'NORDESTE',
  PB: 'NORDESTE', RN: 'NORDESTE', AL: 'NORDESTE', SE: 'NORDESTE', PI: 'NORDESTE',
  GO: 'C-OESTE', MT: 'C-OESTE', MS: 'C-OESTE', DF: 'C-OESTE',
  AM: 'NORTE', PA: 'NORTE', AC: 'NORTE', RO: 'NORTE', RR: 'NORTE', AP: 'NORTE', TO: 'NORTE'
};

export const DashboardPage = ({ selectedRegiao, searchTerm }) => {
  const [activePillar, setActivePillar] = useState('frota');
  const [veiculosData, setVeiculosData] = useState([]);
  const [kpisApi, setKpisApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUsingLiveApi, setIsUsingLiveApi] = useState(false);
  const [selectedPlaca, setSelectedPlaca] = useState(null);

  // Carrega dados da API FastAPI (Supabase PostgreSQL)
  const carregarDados = async () => {
    setLoading(true);
    try {
      const [kpisRes, veicRes] = await Promise.all([
        api.getKPIs(),
        api.getVeiculos({ pageSize: 300 })
      ]);

      if (veicRes && veicRes.items && veicRes.items.length > 0) {
        // Mapeia veículos do Supabase para formato visual homogêneo
        const mapped = veicRes.items.map(v => {
          const hodo = Number(v.hodometro_atual || 0);
          const ultRev = Math.floor(hodo / 10000) * 10000;
          const proxRev = ultRev + 10000;
          const regiao = UF_TO_REGIAO[v.base_uf] || 'SUDESTE';

          return {
            id: v.id_veiculo,
            placa: v.placa,
            modelo: v.modelo || 'Renault Kwid Zen 1.0',
            ano: v.ano || 2024,
            propriedade: v.locadora_nome || 'Arval Brasil',
            atp: v.base_nome || 'Central',
            uf: v.base_uf || 'PR',
            regiao: regiao,
            tecnicoAlocado: v.condutor_atual_nome || null,
            matricula: v.condutor_atual_matricula || null,
            status: v.status_operacional ? v.status_operacional.toLowerCase() : 'disponivel',
            hodometro: hodo,
            tanque: '75%',
            ultimaRevisaoKm: ultRev,
            proximaRevisaoKm: proxRev,
            diasContrato: v.dias_para_fim_contrato || 478,
            contratoFim: v.data_fim_contrato || '2026-01-15',
            licenciamento: 'ok',
            seguro: 'ok'
          };
        });

        setVeiculosData(mapped);
        setKpisApi(kpisRes);
        setIsUsingLiveApi(true);
      } else {
        setVeiculosData(VEICULOS_MOCK);
        setIsUsingLiveApi(false);
      }
    } catch (err) {
      console.warn('API indisponível, utilizando dados mock locais:', err);
      setVeiculosData(VEICULOS_MOCK);
      setIsUsingLiveApi(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Filtragem dos veículos por Região e Busca
  const filteredVeiculos = useMemo(() => {
    return veiculosData.filter(v => {
      const matchRegiao = selectedRegiao === 'TODAS' || v.regiao === selectedRegiao;
      const term = (searchTerm || '').toLowerCase();
      const matchSearch =
        !term ||
        v.placa.toLowerCase().includes(term) ||
        v.modelo.toLowerCase().includes(term) ||
        (v.tecnicoAlocado && v.tecnicoAlocado.toLowerCase().includes(term)) ||
        (v.atp && v.atp.toLowerCase().includes(term));

      return matchRegiao && matchSearch;
    });
  }, [veiculosData, selectedRegiao, searchTerm]);

  // Contagens dos KPIs
  const total = kpisApi ? kpisApi.total_veiculos : filteredVeiculos.length;
  const emUso = kpisApi ? kpisApi.em_uso : filteredVeiculos.filter(v => v.status === 'em_uso').length;
  const disponivel = kpisApi ? kpisApi.disponiveis : filteredVeiculos.filter(v => v.status === 'disponivel').length;
  const emManutencaoOuSinistro = kpisApi ? (kpisApi.em_manutencao + kpisApi.sinistrados) : filteredVeiculos.filter(v => v.status === 'manutencao' || v.status === 'sinistrado').length;

  return (
    <div className="space-y-6 animate-fadeUp">
      {/* Cabeçalho da Seção com Ações Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Torre de Controle Operacional
            </h1>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
              19 ATPs Ativas
            </span>
            {isUsingLiveApi ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Supabase PostgreSQL Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                <span>Modo Local</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão unificada de ativos veiculares, custódia de campo e conciliação ValeCard/Arval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={carregarDados}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-app-darkSurface border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm transition-colors"
            title="Recarregar dados do banco"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-500' : ''}`} />
            <span>Atualizar</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-app-darkSurface border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Base</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/25 transition-all">
            <Plus className="w-4 h-4" />
            <span>Novo Veículo</span>
          </button>
        </div>
      </div>

      {/* Alerta de Auditoria Governança: Condutores Inativos */}
      {kpisApi && kpisApi.veiculos_condutor_inativo > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <strong className="block font-bold">Auditoria de Custódia Anti-Inativos ({kpisApi.veiculos_condutor_inativo} Alertas):</strong>
              <span>
                Existem veículos associados a técnicos com status <em>DESLIGADO/INATIVO</em> no banco central. Execute o recolhimento ou reatribuição imediata.
              </span>
            </div>
          </div>
          <span className="font-bold text-[11px] px-3 py-1 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300">
            Trava Preventiva Ativa
          </span>
        </div>
      )}

      {/* Grid de 4 KPIs Superiores (Padrão EnerFine Legado) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total da Frota"
          value={total.toString()}
          sub="Veículos Registrados"
          color="blue"
          icon={Truck}
        />
        <KpiCard
          title="Em Custódia (Campo)"
          value={emUso.toString()}
          sub="Alocados com Técnicos"
          color="green"
          icon={CheckCircle2}
        />
        <KpiCard
          title="Disponíveis no Pátio"
          value={disponivel.toString()}
          sub="Prontos para Despacho"
          color="amber"
          icon={ShieldCheck}
        />
        <KpiCard
          title="Oficina / Sinistros"
          value={emManutencaoOuSinistro.toString()}
          sub="Bloqueados para Saída"
          color="red"
          icon={AlertTriangle}
        />
      </div>

      {/* Widget da Jornada do Técnico (Scrum Diagram: Sprint 1) */}
      <TechnicianPreviewCard />

      {/* Navegação por Pílulas dos 4 Pilares do Gestor (Alinhamento 23/09) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <PillTabs activePillar={activePillar} onSelectPillar={setActivePillar} />
        </div>

        {/* Visualização de acordo com o Pilar Selecionado */}
        {activePillar === 'frota' && (
          <FleetTable 
            veiculos={filteredVeiculos} 
            onSelectVeiculo={(v) => setSelectedPlaca(v.placa)}
          />
        )}
        {activePillar === 'prazos' && <PrazosView veiculos={filteredVeiculos} />}
        {activePillar === 'manutencao' && <ManutencaoView veiculos={filteredVeiculos} />}
        {activePillar === 'combustivel' && <CombustivelView />}
      </div>

      {/* Modal de Detalhes da Ficha Completa do Veículo */}
      {selectedPlaca && (
        <VehicleDetailsModal
          placa={selectedPlaca}
          onClose={() => setSelectedPlaca(null)}
        />
      )}
    </div>
  );
};
