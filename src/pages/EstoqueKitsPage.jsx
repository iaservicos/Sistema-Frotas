import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import KPI from '../components/common/KPI';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { getEstoque, getKits, gerarTermoPDF } from '../services/estoqueKitsService';
import { Package, Wrench, FileText, Download, Plus } from 'lucide-react';

export default function EstoqueKitsPage() {
  const [subTab, setSubTab] = useState('kits');
  const [estoque, setEstoque] = useState([]);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const eData = await getEstoque();
    const kData = await getKits();
    setEstoque(eData);
    setKits(kData);
    setLoading(false);
  };

  const valorTotalCampo = kits.reduce((acc, k) => acc + (Number(k.valorCampo) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Estoque de Ferramentas & Kits Vinculados</h2>
          <p className="text-xs text-[var(--text3)] mt-0.5">Patrimônio, insumos e emissão de Termos de Responsabilidade em PDF</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl w-fit">
        <button 
          onClick={() => setSubTab('kits')} 
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${subTab === 'kits' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text2)] hover:bg-[var(--surface2)]'}`}
        >
          Kits com Técnicos
        </button>
        <button 
          onClick={() => setSubTab('estoque')} 
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${subTab === 'estoque' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text2)] hover:bg-[var(--surface2)]'}`}
        >
          Estoque Geral Ferramentas
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <KPI label="Valor em Campo" value={`R$ ${valorTotalCampo.toFixed(2)}`} subtext="Kits ativos com técnicos" color="blue" />
        <KPI label="Kits Ativos" value={kits.length} subtext="Vínculos vigentes" color="green" />
        <KPI label="Itens no Estoque" value={estoque.reduce((acc, i) => acc + Number(i.disponivel || 0), 0)} subtext="Disponíveis para uso" color="purple" />
      </div>

      {subTab === 'kits' && (
        <Card title="Kits de Ferramentas Vinculados aos Técnicos">
          <Table headers={['Técnico Responsável', 'Matrícula', 'Identificação do Kit', 'Data Vínculo', 'Valor Estimado', 'Status', 'Termo PDF']}>
            {kits.map((k) => (
              <tr key={k.id} className="hover:bg-[var(--surface2)] transition-colors">
                <td className="px-3.5 py-3 font-semibold">{k.tecNome}</td>
                <td className="px-3.5 py-3 font-mono text-xs">{k.tecMatricula}</td>
                <td className="px-3.5 py-3 font-semibold text-sky-500">{k.nomeKit}</td>
                <td className="px-3.5 py-3 font-mono text-xs">{k.dataVinculo}</td>
                <td className="px-3.5 py-3 font-mono font-bold">R$ {Number(k.valorCampo || 0).toFixed(2)}</td>
                <td className="px-3.5 py-3"><Badge variant="green">Ativo</Badge></td>
                <td className="px-3.5 py-3">
                  <Button size="sm" variant="ghost" icon={Download} onClick={() => gerarTermoPDF(k)}>
                    Baixar PDF
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {subTab === 'estoque' && (
        <Card title="Inventário de Ferramentas e Equipamentos">
          <Table headers={['Nome / Descrição', 'Categoria', 'Patrimônio', 'Qtd Total', 'Disponível', 'Em Campo']}>
            {estoque.map((i) => (
              <tr key={i.id} className="hover:bg-[var(--surface2)] transition-colors">
                <td className="px-3.5 py-3 font-semibold">{i.nome}</td>
                <td className="px-3.5 py-3 text-xs">{i.categoria}</td>
                <td className="px-3.5 py-3 font-mono text-xs text-sky-500 font-bold">{i.patrimonio}</td>
                <td className="px-3.5 py-3 font-mono">{i.qtdTotal}</td>
                <td className="px-3.5 py-3 font-mono text-emerald-500 font-bold">{i.disponivel}</td>
                <td className="px-3.5 py-3 font-mono text-amber-500">{i.vinculada}</td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
    </div>
  );
}
