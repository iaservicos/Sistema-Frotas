import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import KPI from '../components/common/KPI';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import SearchInput from '../components/common/SearchInput';
import Modal from '../components/common/Modal';
import { 
  getAbastecimentos, 
  calcularDesvioKm, 
  validarFotoHodometro 
} from '../services/combustivelService';
import { Fuel, AlertTriangle, CheckCircle, MapPin, Image, Check, X } from 'lucide-react';

export default function CombustivelPage() {
  const [subTab, setSubTab] = useState('historico');
  const [abastecimentos, setAbastecimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getAbastecimentos();
    setAbastecimentos(data);
    setLoading(false);
  };

  const handleValidarFoto = async (id, decisao) => {
    await validarFotoHodometro(id, decisao, 'Admin');
    loadData();
  };

  const desviosCalculados = calcularDesvioKm(abastecimentos);
  const fotosPendentes = abastecimentos.filter(r => r.fotoStatus === 'pendente' && r.fotoHodometro);

  // Totais
  const totalGasto = abastecimentos.reduce((acc, r) => acc + (Number(r.valorTotal) || 0), 0);
  const totalLitros = abastecimentos.reduce((acc, r) => acc + (Number(r.quantidade) || 0), 0);
  const mediaPrecoLitro = abastecimentos.length > 0 ? (totalGasto / (totalLitros || 1)).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Análise de Combustível & Hodômetros</h2>
          <p className="text-xs text-[var(--text3)] mt-0.5">Auditoria de consumo, desvio de Km rodado e validação de fotos de painel</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl w-fit">
        <button 
          onClick={() => setSubTab('historico')} 
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${subTab === 'historico' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text2)] hover:bg-[var(--surface2)]'}`}
        >
          Abastecimentos
        </button>
        <button 
          onClick={() => setSubTab('desvio')} 
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${subTab === 'desvio' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text2)] hover:bg-[var(--surface2)]'}`}
        >
          Cálculo de Desvio Km
        </button>
        <button 
          onClick={() => setSubTab('fotos')} 
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${subTab === 'fotos' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text2)] hover:bg-[var(--surface2)]'}`}
        >
          Validar Fotos Hodômetro {fotosPendentes.length > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">{fotosPendentes.length}</span>}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPI label="Total Gasto" value={`R$ ${totalGasto.toFixed(2)}`} subtext="Período acumulado" color="blue" />
        <KPI label="Total Litros" value={`${totalLitros.toFixed(1)} L`} subtext="Volume de combustível" color="amber" />
        <KPI label="Preço Médio / L" value={`R$ ${mediaPrecoLitro}`} subtext="Valor por litro" color="green" />
        <KPI label="Fotos Pendentes" value={fotosPendentes.length} subtext="Requer auditoria" color="purple" />
      </div>

      {/* Sub-tab: Histórico de Abastecimentos */}
      {subTab === 'historico' && (
        <Card title="Histórico de Abastecimentos">
          <Table headers={['Placa', 'Motorista / Técnico', 'Data / Hora', 'Litros', 'R$ Total', 'R$ / L', 'Hodômetro', 'Status Foto']}>
            {abastecimentos.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--surface2)] transition-colors">
                <td className="px-3.5 py-3 font-mono font-bold text-sky-500">{r.placa}</td>
                <td className="px-3.5 py-3 font-semibold">{r.motorista}</td>
                <td className="px-3.5 py-3 font-mono text-xs">{r.data}</td>
                <td className="px-3.5 py-3 font-mono">{r.quantidade} L</td>
                <td className="px-3.5 py-3 font-mono font-bold">R$ {Number(r.valorTotal || 0).toFixed(2)}</td>
                <td className="px-3.5 py-3 font-mono text-xs">R$ {Number(r.precoLitro || 0).toFixed(2)}</td>
                <td className="px-3.5 py-3 font-mono">{Number(r.hodometro || 0).toLocaleString('pt-BR')} km</td>
                <td className="px-3.5 py-3">
                  <Badge variant={r.fotoStatus === 'aprovado' ? 'green' : r.fotoStatus === 'rejeitado' ? 'red' : 'amber'}>
                    {r.fotoStatus === 'aprovado' ? 'Aprovada' : r.fotoStatus === 'rejeitado' ? 'Rejeitada' : 'Pendente'}
                  </Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Sub-tab: Cálculo de Desvio Km */}
      {subTab === 'desvio' && (
        <Card title="Análise e Cálculo de Desvio de Km Rodado" subtitle="Comparativo de hodômetros entre abastecimentos">
          <Table headers={['Técnico Motorista', 'Placa', 'Km Real Rodado', 'Km Estimado', 'Diferença Desvio', 'Média Km/L', 'Alerta de Desvio']}>
            {desviosCalculados.map((d) => (
              <tr key={d.matricula} className="hover:bg-[var(--surface2)] transition-colors">
                <td className="px-3.5 py-3 font-semibold">{d.motorista}</td>
                <td className="px-3.5 py-3 font-mono font-bold text-sky-500">{d.placa}</td>
                <td className="px-3.5 py-3 font-mono font-bold">{d.kmReal.toLocaleString('pt-BR')} km</td>
                <td className="px-3.5 py-3 font-mono text-[var(--text3)]">{d.kmEsperado.toLocaleString('pt-BR')} km</td>
                <td className={`px-3.5 py-3 font-mono font-extrabold ${d.desvio > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {d.desvio > 0 ? '+' : ''}{d.desvio.toLocaleString('pt-BR')} km
                </td>
                <td className="px-3.5 py-3 font-mono font-semibold">{d.kmL} km/L</td>
                <td className="px-3.5 py-3">
                  <Badge variant={d.alertaColor}>
                    {d.alerta}
                  </Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Sub-tab: Validar Fotos de Hodômetro */}
      {subTab === 'fotos' && (
        <Card title="Central de Validação de Fotos do Painel / Hodômetro">
          {fotosPendentes.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text3)]">
              Nenhuma foto de hodômetro pendente de aprovação.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {fotosPendentes.map((f) => (
                <div key={f.id} className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface2)] flex flex-col">
                  <img 
                    src={f.fotoHodometro} 
                    alt="Hodômetro" 
                    onClick={() => setSelectedPhoto(f.fotoHodometro)}
                    className="w-full h-44 object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                  />
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-xs">{f.placa} · {f.motorista}</div>
                      <div className="text-[11px] text-[var(--text3)] font-mono mt-0.5">
                        {f.data} · {Number(f.hodometro || 0).toLocaleString('pt-BR')} km
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="success" className="flex-1" icon={Check} onClick={() => handleValidarFoto(f.id, 'aprovado')}>
                        Aprovar
                      </Button>
                      <Button size="sm" variant="danger" className="flex-1" icon={X} onClick={() => handleValidarFoto(f.id, 'rejeitado')}>
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Modal Zoom da Foto */}
      <Modal isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} title="Visualização da Foto do Hodômetro">
        {selectedPhoto && (
          <img src={selectedPhoto} alt="Hodômetro Ampliado" className="w-full max-h-[70vh] object-contain rounded-xl" />
        )}
      </Modal>
    </div>
  );
}
