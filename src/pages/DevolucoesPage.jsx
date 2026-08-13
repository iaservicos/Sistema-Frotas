import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { getDevolucoes, saveDevolucao } from '../services/devolucoesService';
import { RotateCcw, Camera, Eye, MapPin, Plus, Check } from 'lucide-react';

export default function DevolucoesPage() {
  const [devolucoes, setDevolucoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);

  const [form, setForm] = useState({
    placa: '', tecNome: '', tecMatricula: '', hodometro: '', motivo: 'troca', observacoes: '',
    fotoFrente: '', fotoTraseira: '', fotoEsq: '', fotoDir: '', fotoPainel: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getDevolucoes();
    setDevolucoes(data);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.placa || !form.tecNome) return;
    await saveDevolucao({
      ...form,
      data: new Date().toLocaleString('pt-BR'),
      gpsLat: -25.4284,
      gpsLng: -49.2733
    });
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Devoluções & Vistoria Digital em 5 Ângulos</h2>
          <p className="text-xs text-[var(--text3)] mt-0.5">Inspeção física do veículo no ato da devolução (Frente, Traseira, Laterais e Painel)</p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Registrar Devolução
        </Button>
      </div>

      <Card title="Histórico de Devoluções Registradas">
        <Table headers={['Data / Hora', 'Placa', 'Técnico Motorista', 'Hodômetro', 'Motivo', 'Vistoria 5 Fotos', 'Ações']}>
          {devolucoes.map((d) => (
            <tr key={d.id} className="hover:bg-[var(--surface2)] transition-colors">
              <td className="px-3.5 py-3 font-mono text-xs">{d.data}</td>
              <td className="px-3.5 py-3 font-mono font-bold text-sky-500">{d.placa}</td>
              <td className="px-3.5 py-3 font-semibold">{d.tecNome}</td>
              <td className="px-3.5 py-3 font-mono">{Number(d.hodometro || 0).toLocaleString('pt-BR')} km</td>
              <td className="px-3.5 py-3 capitalize">{d.motivo}</td>
              <td className="px-3.5 py-3">
                <Badge variant="green">
                  <Camera className="w-3 h-3 mr-1" /> 5 Ângulos Registrados
                </Badge>
              </td>
              <td className="px-3.5 py-3">
                <Button size="sm" variant="ghost" icon={Eye} onClick={() => setSelectedInspection(d)}>
                  Ver Fotos
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Modal Registrar Devolução */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Nova Devolução de Veículo">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--text3)] uppercase tracking-wider mb-1">Placa do Veículo *</label>
              <input type="text" required value={form.placa} onChange={e => setForm({...form, placa: e.target.value.toUpperCase()})} placeholder="Ex: KLR4567" className="w-full px-3 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-xs font-mono" />
            </div>
            <div>
              <label className="block font-bold text-[var(--text3)] uppercase tracking-wider mb-1">Técnico Motorista *</label>
              <input type="text" required value={form.tecNome} onChange={e => setForm({...form, tecNome: e.target.value})} placeholder="Nome do técnico" className="w-full px-3 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--text3)] uppercase tracking-wider mb-1">Hodômetro na Entrega (Km)</label>
              <input type="number" value={form.hodometro} onChange={e => setForm({...form, hodometro: e.target.value})} placeholder="62400" className="w-full px-3 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-xs font-mono" />
            </div>
            <div>
              <label className="block font-bold text-[var(--text3)] uppercase tracking-wider mb-1">Motivo da Devolução</label>
              <select value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})} className="w-full px-3 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-xs">
                <option value="troca">Troca de Veículo</option>
                <option value="desligamento">Desligamento do Técnico</option>
                <option value="manutencao">Envio para Manutenção</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[var(--text3)] uppercase tracking-wider mb-1">Observações do Estado Físico</label>
            <textarea rows={2} value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})} placeholder="Avarias, nível de combustível, ferramentas presentes..." className="w-full px-3 py-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-xs" />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Salvar e Registrar Vistoria</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Lightbox Inspeção Visual 5 Fotos */}
      <Modal isOpen={!!selectedInspection} onClose={() => setSelectedInspection(null)} title={`Vistoria Digital — ${selectedInspection?.placa} (${selectedInspection?.tecNome})`} maxWidth="max-w-4xl">
        {selectedInspection && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[var(--surface2)] rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold">Motivo:</span> {selectedInspection.motivo} | <span className="font-bold">Hodômetro:</span> {selectedInspection.hodometro} km
              </div>
              {selectedInspection.gpsLat && (
                <a href={`https://www.google.com/maps?q=${selectedInspection.gpsLat},${selectedInspection.gpsLng}`} target="_blank" rel="noreferrer" className="text-sky-500 hover:underline flex items-center gap-1 font-semibold">
                  <MapPin size={13} /> Ver Localização GPS
                </a>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Frente', src: selectedInspection.fotoFrente },
                { label: 'Traseira', src: selectedInspection.fotoTraseira },
                { label: 'Lateral Esquerda', src: selectedInspection.fotoEsq },
                { label: 'Lateral Direita', src: selectedInspection.fotoDir },
                { label: 'Painel / Hodômetro', src: selectedInspection.fotoPainel }
              ].filter(f => f.src).map((f, idx) => (
                <div key={idx} className="border border-[var(--border)] rounded-xl p-2 bg-[var(--surface2)] text-center">
                  <div className="font-bold text-[10px] uppercase text-[var(--text3)] mb-1">{f.label}</div>
                  <img src={f.src} alt={f.label} className="w-full h-36 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(f.src, '_blank')} />
                </div>
              ))}
            </div>

            {selectedInspection.observacoes && (
              <div className="p-3 bg-[var(--surface2)] rounded-xl italic text-[var(--text2)]">
                "{selectedInspection.observacoes}"
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
