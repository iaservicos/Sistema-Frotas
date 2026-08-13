import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import KPI from '../components/common/KPI';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import SearchInput from '../components/common/SearchInput';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { 
  getVeiculos, 
  saveVeiculo, 
  deleteVeiculo, 
  transferirVeiculo, 
  getManutencoes, 
  saveManutencao 
} from '../services/veiculosService';
import { 
  Car, 
  Wrench, 
  ArrowRightLeft, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit, 
  UserPlus, 
  AlertTriangle 
} from 'lucide-react';

export default function FrotasPage() {
  const [subTab, setSubTab] = useState('frota');
  const [veiculos, setVeiculos] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [search, setSearch] = useState('');
  const [filterAtp, setFilterAtp] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modais
  const [isVeiculoModalOpen, setIsVeiculoModalOpen] = useState(false);
  const [isTransfModalOpen, setIsTransfModalOpen] = useState(false);
  const [selectedVeiculo, setSelectedVeiculo] = useState(null);

  // Form de Veículo
  const [formVeiculo, setFormVeiculo] = useState({
    placa: '', modelo: '', uf: 'PR', atp: '', tecNome: '', tecMatricula: '', hodometro: 0, ipva: '', seguro: '', licenciamento: ''
  });

  // Form de Transferência
  const [transfForm, setTransfForm] = useState({ novoTecNome: '', novoTecMat: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const vData = await getVeiculos();
    const mData = await getManutencoes();
    setVeiculos(vData);
    setManutencoes(mData);
    setLoading(false);
  };

  const handleSaveVeiculo = async (e) => {
    e.preventDefault();
    if (!formVeiculo.placa || !formVeiculo.modelo) return;
    await saveVeiculo({
      ...formVeiculo,
      status: formVeiculo.tecNome ? 'uso' : 'livre'
    });
    setIsVeiculoModalOpen(false);
    loadData();
  };

  const handleTransferir = async (e) => {
    e.preventDefault();
    if (!selectedVeiculo) return;
    await transferirVeiculo(selectedVeiculo.placa, transfForm.novoTecMat, transfForm.novoTecNome, 'Admin');
    setIsTransfModalOpen(false);
    loadData();
  };

  const handleDelete = async (placa) => {
    if (confirm(`Tem certeza que deseja excluir o veículo de placa ${placa}?`)) {
      await deleteVeiculo(placa);
      loadData();
    }
  };

  const filteredVeiculos = veiculos.filter(v => {
    const matchSearch = !search || v.placa.toLowerCase().includes(search.toLowerCase()) || 
                        v.modelo.toLowerCase().includes(search.toLowerCase()) || 
                        (v.tecNome || '').toLowerCase().includes(search.toLowerCase());
    const matchAtp = !filterAtp || v.atp === filterAtp;
    const matchStatus = !filterStatus || v.status === filterStatus;
    return matchSearch && matchAtp && matchStatus;
  });

  // KPIs
  const totalFrota = veiculos.length;
  const emUso = veiculos.filter(v => v.status === 'uso').length;
  const disponiveis = veiculos.filter(v => v.status === 'livre').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-nav Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Gestão de Veículos e Frota</h2>
          <p className="text-xs text-[var(--text3)] mt-0.5">Alocações, manutenções preventivas e histórico financeiro</p>
        </div>
        <Button icon={Plus} onClick={() => { setFormVeiculo({ placa: '', modelo: '', uf: 'PR', atp: '', tecNome: '', tecMatricula: '', hodometro: 0, ipva: '', seguro: '', licenciamento: '' }); setIsVeiculoModalOpen(true); }}>
          Novo Veículo
        </Button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl w-fit">
        <button 
          onClick={() => setSubTab('frota')} 
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${subTab === 'frota' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text2)] hover:bg-[var(--surface2)]'}`}
        >
          Frota
        </button>
        <button 
          onClick={() => setSubTab('manutencao')} 
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${subTab === 'manutencao' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text2)] hover:bg-[var(--surface2)]'}`}
        >
          Manutenções
        </button>
        <button 
          onClick={() => setSubTab('financeiro')} 
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${subTab === 'financeiro' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text2)] hover:bg-[var(--surface2)]'}`}
        >
          Financeiro
        </button>
      </div>

      {/* Sub-tab: Frota */}
      {subTab === 'frota' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <KPI label="Total Frota" value={totalFrota} subtext="Veículos cadastrados" color="blue" />
            <KPI label="Em Uso" value={emUso} subtext="Alocados a técnicos" color="green" />
            <KPI label="Disponíveis" value={disponiveis} subtext="Sem alocação" color="amber" />
          </div>

          <Card title="Listagem da Frota">
            <div className="flex gap-3 mb-4">
              <SearchInput value={search} onChange={setSearch} placeholder="Buscar placa, modelo, técnico..." />
              <Select 
                value={filterStatus} 
                onChange={setFilterStatus} 
                placeholder="Todos os status" 
                options={[
                  { value: 'uso', label: 'Em uso' },
                  { value: 'livre', label: 'Disponível' }
                ]}
                className="w-40"
              />
            </div>

            <Table 
              headers={['Placa', 'Modelo', 'UF', 'ATP', 'Técnico Alocado', 'Hodômetro', 'IPVA', 'Status', 'Ações']}
              isEmpty={filteredVeiculos.length === 0}
            >
              {filteredVeiculos.map((v) => (
                <tr key={v.placa} className="hover:bg-[var(--surface2)] transition-colors">
                  <td className="px-3.5 py-3 font-mono font-bold text-sky-500">{v.placa}</td>
                  <td className="px-3.5 py-3 font-semibold">{v.modelo}</td>
                  <td className="px-3.5 py-3">{v.uf}</td>
                  <td className="px-3.5 py-3 text-xs">{v.atp || '—'}</td>
                  <td className="px-3.5 py-3">{v.tecNome || <span className="text-[var(--text3)] font-normal">Sem alocação</span>}</td>
                  <td className="px-3.5 py-3 font-mono">{Number(v.hodometro || 0).toLocaleString('pt-BR')} km</td>
                  <td className="px-3.5 py-3 font-mono text-[11px] text-red-500">{v.ipva || '—'}</td>
                  <td className="px-3.5 py-3">
                    <Badge variant={v.status === 'uso' ? 'green' : 'blue'}>
                      {v.status === 'uso' ? 'Em Uso' : 'Livre'}
                    </Badge>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="ghost" icon={ArrowRightLeft} title="Transferir Técnico" onClick={() => { setSelectedVeiculo(v); setIsTransfModalOpen(true); }} />
                      <Button size="sm" variant="danger" icon={Trash2} title="Excluir" onClick={() => handleDelete(v.placa)} />
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      )}

      {/* Sub-tab: Manutenções */}
      {subTab === 'manutencao' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <KPI label="Manutenções Vencidas" value={manutencoes.filter(m => m.status === 'vencida').length} subtext="Atenção imediata" color="red" />
            <KPI label="Próximos 30 dias" value={manutencoes.filter(m => m.status === 'proximo').length} subtext="Agendar serviço" color="amber" />
            <KPI label="Em Dia" value={manutencoes.filter(m => m.status === 'ok').length} subtext="Revisões em dia" color="green" />
          </div>

          <Card title="Histórico de Manutenções da Frota">
            <Table headers={['Placa', 'Modelo', 'Tipo', 'Data Realiz.', 'Próxima Prev.', 'Km', 'Valor (R$)', 'Status']}>
              {manutencoes.map((m) => (
                <tr key={m.id} className="hover:bg-[var(--surface2)] transition-colors">
                  <td className="px-3.5 py-3 font-mono font-bold text-sky-500">{m.placa}</td>
                  <td className="px-3.5 py-3 font-semibold">{m.modelo}</td>
                  <td className="px-3.5 py-3 capitalize">{m.tipo?.replace('_', ' ')}</td>
                  <td className="px-3.5 py-3 font-mono text-xs">{m.dataRealiz}</td>
                  <td className="px-3.5 py-3 font-mono text-xs text-red-500">{m.proximaPrev}</td>
                  <td className="px-3.5 py-3 font-mono">{Number(m.km || 0).toLocaleString('pt-BR')} km</td>
                  <td className="px-3.5 py-3 font-mono font-bold">R$ {Number(m.valor || 0).toFixed(2)}</td>
                  <td className="px-3.5 py-3">
                    <Badge variant={m.status === 'vencida' ? 'red' : m.status === 'proximo' ? 'amber' : 'green'}>
                      {m.status === 'vencida' ? 'Vencida' : m.status === 'proximo' ? 'Próxima' : 'Em Dia'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      )}

      {/* Sub-tab: Financeiro */}
      {subTab === 'financeiro' && (
        <Card title="Consolidação Financeira da Frota">
          <div className="p-4 text-xs text-[var(--text2)] space-y-2">
            <p><strong>Custo Total de Manutenções:</strong> R$ 2.440,00</p>
            <p><strong>Custo Médio por Veículo:</strong> R$ 610,00</p>
          </div>
        </Card>
      )}

      {/* Modal Cadastro de Veículo */}
      <Modal isOpen={isVeiculoModalOpen} onClose={() => setIsVeiculoModalOpen(false)} title="Cadastrar / Editar Veículo">
        <form onSubmit={handleSaveVeiculo} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--text3)] uppercase tracking-wider mb-1">Placa *</label>
              <input 
                type="text" 
                required 
                value={formVeiculo.placa} 
                onChange={e => setFormVeiculo({...formVeiculo, placa: e.target.value.toUpperCase()})}
                placeholder="Ex: ABC1D23" 
                className="w-full px-3 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl outline-none text-xs font-mono" 
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--text3)] uppercase tracking-wider mb-1">Modelo *</label>
              <input 
                type="text" 
                required 
                value={formVeiculo.modelo} 
                onChange={e => setFormVeiculo({...formVeiculo, modelo: e.target.value})}
                placeholder="Ex: Fiat Strada 1.4" 
                className="w-full px-3 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl outline-none text-xs" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--text3)] uppercase tracking-wider mb-1">Técnico Alocado</label>
              <input 
                type="text" 
                value={formVeiculo.tecNome} 
                onChange={e => setFormVeiculo({...formVeiculo, tecNome: e.target.value})}
                placeholder="Nome do técnico" 
                className="w-full px-3 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl outline-none text-xs" 
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--text3)] uppercase tracking-wider mb-1">Hodômetro Atual (Km)</label>
              <input 
                type="number" 
                value={formVeiculo.hodometro} 
                onChange={e => setFormVeiculo({...formVeiculo, hodometro: e.target.value})}
                className="w-full px-3 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl outline-none text-xs font-mono" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" type="button" onClick={() => setIsVeiculoModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Salvar Veículo</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Transferência de Veículo */}
      <Modal isOpen={isTransfModalOpen} onClose={() => setIsTransfModalOpen(false)} title={`Transferir Custódia — ${selectedVeiculo?.placa}`}>
        <form onSubmit={handleTransferir} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[var(--text3)] uppercase tracking-wider mb-1">Novo Técnico Responsável</label>
            <input 
              type="text" 
              required
              value={transfForm.novoTecNome} 
              onChange={e => setTransfForm({...transfForm, novoTecNome: e.target.value})}
              placeholder="Nome do técnico" 
              className="w-full px-3 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl outline-none text-xs" 
            />
          </div>
          <div>
            <label className="block font-bold text-[var(--text3)] uppercase tracking-wider mb-1">Matrícula do Técnico</label>
            <input 
              type="text" 
              value={transfForm.novoTecMat} 
              onChange={e => setTransfForm({...transfForm, novoTecMat: e.target.value})}
              placeholder="Ex: 1005" 
              className="w-full px-3 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl outline-none text-xs font-mono" 
            />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" type="button" onClick={() => setIsTransfModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Confirmar Transferência</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
