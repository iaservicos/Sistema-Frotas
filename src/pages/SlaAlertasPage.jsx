import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import KPI from '../components/common/KPI';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { getAlertasSLA } from '../services/slaService';
import { AlertTriangle, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function SlaAlertasPage() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(new Date().toLocaleTimeString('pt-BR'));

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 60000); // 1 minuto
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getAlertasSLA();
    setAlertas(data);
    setLastCheck(new Date().toLocaleTimeString('pt-BR'));
    setLoading(false);
  };

  const perdidos = alertas.filter(a => a.tipo === 'perdido').length;
  const hoje1dia = alertas.filter(a => a.tipo === '1dia').length;
  const em2dias = alertas.filter(a => a.tipo === '2dias').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Painel SLA & Central de Alertas Vivos</h2>
          <p className="text-xs text-[var(--text3)] mt-0.5">
            Monitoramento de chamados em risco com atualização automática · Última checagem: <span className="font-mono text-sky-500 font-bold">{lastCheck}</span>
          </p>
        </div>
        <Button icon={RefreshCw} variant="ghost" onClick={loadData} loading={loading}>
          Atualizar Agora
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <KPI label="SLA Perdido" value={perdidos} subtext="Atraso crítico" color="red" />
        <KPI label="Vence Hoje / Amanhã" value={hoje1dia} subtext="Ação urgente" color="amber" />
        <KPI label="Vence em 2 dias" value={em2dias} subtext="Acompanhamento" color="blue" />
      </div>

      <Card title="Chamados Operacionais em Risco de SLA">
        <Table headers={['Status SLA', 'Chamado', 'Código PEP', 'Técnico Atribuído', 'ATP / Base', 'Data Limite SLA', 'Ações']}>
          {alertas.map((a) => (
            <tr key={a.id} className="hover:bg-[var(--surface2)] transition-colors">
              <td className="px-3.5 py-3">
                <Badge variant={a.tipo === 'perdido' ? 'red' : a.tipo === '1dia' ? 'amber' : 'blue'}>
                  {a.tipo === 'perdido' ? '❌ SLA Vencido' : a.tipo === '1dia' ? '🚨 Vence Amanhã' : '⚠️ 2 dias'}
                </Badge>
              </td>
              <td className="px-3.5 py-3 font-mono font-bold text-sky-500">{a.chamado}</td>
              <td className="px-3.5 py-3 font-mono text-xs">{a.pep}</td>
              <td className="px-3.5 py-3 font-semibold">{a.tecNome}</td>
              <td className="px-3.5 py-3 text-xs">{a.atp}</td>
              <td className="px-3.5 py-3 font-mono text-xs text-red-500 font-bold">{a.dataLimite}</td>
              <td className="px-3.5 py-3">
                <Button size="sm" variant="ghost">Detalhes</Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
