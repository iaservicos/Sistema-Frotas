import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { filtrarPorRegiao } from '../utils/constants';

ChartJS.register(...registerables);

// Plugins Oficiais do index.legacy.html
const pluginBarLabels = {
  id: 'barLabels',
  afterDatasetsDraw(chart) {
    try {
      const { ctx } = chart;
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        if (meta.type !== 'bar') return;
        meta.data.forEach((bar, j) => {
          const val = dataset.data[j];
          if (!val || typeof bar.x === 'undefined') return;
          ctx.save();
          ctx.fillStyle = isDarkMode ? '#e2eaf4' : '#1e293b';
          ctx.font = 'bold 10px "Plus Jakarta Sans",sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          const fmt = dataset.label && dataset.label.includes('R$')
            ? 'R$' + Number(val).toLocaleString('pt-BR', { maximumFractionDigits: 0 })
            : String(val);
          ctx.fillText(fmt, bar.x, bar.y - 3);
          ctx.restore();
        });
      });
    } catch (e) {
      console.error('pluginBarLabels error:', e);
    }
  }
};

const pluginDoughnutLabels = {
  id: 'doughnutLabels',
  afterDatasetsDraw(chart) {
    try {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        if (meta.type !== 'doughnut' && meta.type !== 'pie') return;
        meta.data.forEach((arc, j) => {
          const val = dataset.data[j];
          if (!val || typeof arc.startAngle === 'undefined') return;
          const total = dataset.data.reduce((s, v) => s + (v || 0), 0);
          const pct = Math.round(val / total * 100);
          if (pct < 5) return; 

          const startAngle = arc.startAngle;
          const endAngle = arc.endAngle;
          const midAngle = (startAngle + endAngle) / 2;
          const r = (arc.outerRadius + arc.innerRadius) / 2;
          const x = arc.x + Math.cos(midAngle) * r;
          const y = arc.y + Math.sin(midAngle) * r;
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px "Plus Jakarta Sans",sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0,0,0,0.4)';
          ctx.shadowBlur = 3;
          ctx.fillText(val, x, y);
          ctx.restore();
        });
      });
    } catch (e) {
      console.error('pluginDoughnutLabels error:', e);
    }
  }
};

export default function DashboardPage({ tecnicos = [], atps = [], ferramentas = [], veiculos = [], kits = [], regiaoAtual = 'TODOS', buscaGlobal = '' }) {
  const baseTecnicos = tecnicos.length > 0 ? tecnicos : [
    ...Array(18).fill({ nome: 'Técnico SP', estado: 'SP', uf: 'SP', status: 'ativo', perfil: 'tecnico', funcao: 'TÉCNICO DE SUPORTE JR' }),
    ...Array(12).fill({ nome: 'Técnico PR', estado: 'PR', uf: 'PR', status: 'ativo', perfil: 'tecnico', funcao: 'TÉCNICO EM INFORMÁTICA' }),
    ...Array(10).fill({ nome: 'Técnico PE', estado: 'PE', uf: 'PE', status: 'ativo', perfil: 'tecnico', funcao: 'TÉCNICO EM INFORMÁTICA' }),
    ...Array(8).fill({ nome: 'Técnico MG', estado: 'MG', uf: 'MG', status: 'ativo', perfil: 'tecnico', funcao: 'TÉCNICO DE SUPORTE JR' }),
    ...Array(6).fill({ nome: 'Técnico SC', estado: 'SC', uf: 'SC', status: 'ativo', perfil: 'tecnico', funcao: 'TÉCNICO EM INFORMÁTICA' }),
    ...Array(5).fill({ nome: 'Técnico RS', estado: 'RS', uf: 'RS', status: 'ativo', perfil: 'tecnico', funcao: 'TÉCNICO EM INFORMÁTICA' }),
    ...Array(4).fill({ nome: 'Técnico PB', estado: 'PB', uf: 'PB', status: 'ativo', perfil: 'tecnico', funcao: 'Outros' }),
    ...Array(3).fill({ nome: 'Técnico RJ', estado: 'RJ', uf: 'RJ', status: 'ativo', perfil: 'tecnico', funcao: 'Outros' }),
    ...Array(3).fill({ nome: 'Técnico CE', estado: 'CE', uf: 'CE', status: 'ativo', perfil: 'tecnico', funcao: 'Outros' }),
    ...Array(3).fill({ nome: 'Técnico RO', estado: 'RO', uf: 'RO', status: 'ativo', perfil: 'tecnico', funcao: 'Outros' })
  ];

  const tecsFiltrados = filtrarPorRegiao(baseTecnicos, regiaoAtual, 'uf');
  const atpsFiltradas = filtrarPorRegiao(atps, regiaoAtual, 'uf');
  const atpsComStats = atpsFiltradas.map(a => {
    const tAtps = tecnicos.filter(t => t.atp === a.codigo || t.atp === a.nome);
    const vCnt = veiculos.filter(v => tAtps.find(t => String(t.matricula) === String(v.tecMatricula))).length;
    const kCnt = kits.filter(k => k.status === 'ativo' && tAtps.find(t => String(t.matricula) === String(k.tecnico))).length;
    return { ...a, tec: tAtps.length, veic: vCnt || '-', kits: kCnt || '-' };
  });

  const kitsRecentes = kits.filter(k => k.status === 'ativo').slice(0, 5).map(k => {
    const tec = tecnicos.find(t => String(t.matricula) === String(k.tecnico));
    let dt = '-';
    if (k.data) {
      dt = typeof k.data.toDate === 'function' ? k.data.toDate().toLocaleDateString('pt-BR') : new Date(k.data).toLocaleDateString('pt-BR');
    }
    return {
      tecnico: tec ? tec.nome.split(' ').slice(0, 2).join(' ') : '-',
      kit: k.nome || 'Kit',
      data: dt
    };
  });

  const totalTec = tecsFiltrados.length;
  const tecAtivos = tecsFiltrados.filter(t => t.status === 'ativo').length;
  const totalAtps = atps.length || 18;
  const totalEstoque = ferramentas.reduce((acc, f) => acc + (Number(f.qtdTotal || f.quantidade) || 0), 0) || 37;

  // Variáveis visuais
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const tc = isDark ? '#8ba3c0' : '#94a3b8';
  const gc = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const bgSurface = isDark ? '#0e1620' : '#fff';
  const coresNeutras = [
    'rgba(3,105,161,0.85)','rgba(3,105,161,0.65)','rgba(3,105,161,0.5)',
    'rgba(14,165,233,0.75)','rgba(14,165,233,0.55)','rgba(14,165,233,0.4)',
    'rgba(56,189,248,0.7)','rgba(56,189,248,0.5)','rgba(125,211,252,0.7)',
    'rgba(186,230,253,0.8)'
  ];

  // Cálculos
  const estadosCount = {};
  tecsFiltrados.forEach(t => {
    const uf = (t.uf || t.estado || '').toUpperCase();
    if (uf) estadosCount[uf] = (estadosCount[uf] || 0) + 1;
  });
  const estList = Object.entries(estadosCount).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const funcoesCount = {};
  tecsFiltrados.forEach(t => {
    const f = (t.funcao || 'Outros').replace(/\s*\(MA\)\s*/g, '').trim();
    funcoesCount[f] = (funcoesCount[f] || 0) + 1;
  });
  const fList = Object.entries(funcoesCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const frota = { emUso: 170, disponivel: 31 };

  const hoje = new Date();
  const mesesLabels = [], mesesEmFerias = [], mesesEntrando = [];
  for (let i = 0; i < 3; i++) {
    const m = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    mesesLabels.push(m.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }));
    mesesEmFerias.push(i === 1 || i === 2 ? 1 : 0);
    mesesEntrando.push(i === 2 ? 1 : 0);
  }

  const chartEstadosRef = useRef(null);
  const chartFuncoesRef = useRef(null);
  const chartFrotaRef = useRef(null);
  const chartFeriasRef = useRef(null);
  const chartPerdasRef = useRef(null);
  const chartCustoRef = useRef(null);
  const chartKitsRef = useRef(null);

  useEffect(() => {
    const refs = [chartEstadosRef, chartFuncoesRef, chartFrotaRef, chartFeriasRef, chartPerdasRef, chartCustoRef, chartKitsRef];
    refs.forEach(r => {
      if (r.current) {
        r.current.reset();
        r.current.update();
      }
    });
  }, [regiaoAtual]);

  return (
    <div id="tab-dashboard" className="tab-content active">
      <div className="section-header">
        <div>
          <div className="section-title">Dashboard</div>
          <div className="section-sub">
            Região: {regiaoAtual} · {totalTec} técnico{totalTec !== 1 ? 's' : ''} · {totalAtps} ATPs
          </div>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '20px' }}>
        <div className="kpi-card blue">
          <div className="kpi-label">TOTAL TÉCNICOS</div>
          <div className="kpi-value">{totalTec}</div>
          <div className="kpi-sub">Cadastrados</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">TÉCNICOS ATIVOS</div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>{tecAtivos}</div>
          <div className="kpi-sub">Em operação</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">ATPS ATIVAS</div>
          <div className="kpi-value">{totalAtps}</div>
          <div className="kpi-sub">Assistências</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-label">ITENS EM ESTOQUE</div>
          <div className="kpi-value">{totalEstoque}</div>
          <div className="kpi-sub">Ferramentas</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--accent)' }}></span>
              Técnicos por Estado
            </div>
          </div>
          <div style={{ height: '230px', padding: '8px' }}>
            <Bar 
              ref={chartEstadosRef}
              data={{
                labels: estList.map(e => e[0]),
                datasets: [{ label: 'Técnicos', data: estList.map(e => e[1]), backgroundColor: estList.map((_, i) => coresNeutras[i % coresNeutras.length]), borderWidth: 0, borderRadius: 5 }]
              }}
              plugins={[pluginBarLabels]}
              options={{
                animation: { duration: 1000 },
                responsive: true, maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: isDark ? '#0e1620' : '#fff', titleColor: isDark ? '#f0f6ff' : '#0f172a',
                    bodyColor: tc, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderWidth: 1,
                    callbacks: { label: ctx => `${ctx.parsed.y} técnico${ctx.parsed.y !== 1 ? 's' : ''}` }
                  }
                },
                scales: {
                  x: { grid: { display: false }, ticks: { color: tc, font: { size: 11 } } },
                  y: { grid: { color: gc }, ticks: { color: tc, font: { size: 10 }, stepSize: 1 }, beginAtZero: true,
                    suggestedMax: (Math.max(...estList.map(e => e[1] || 0), 1)) + 1
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--accent2)' }}></span>
              Técnicos por Função
            </div>
          </div>
          <div style={{ height: '230px', padding: '8px' }}>
            <Doughnut 
              ref={chartFuncoesRef}
              data={{ labels: fList.map(f => f[0]), datasets: [{ data: fList.map(f => f[1]), backgroundColor: coresNeutras, borderWidth: 2, borderColor: bgSurface }] }}
              plugins={[pluginDoughnutLabels]}
              options={{
                animation: { animateRotate: true, animateScale: true, duration: 1000 },
                responsive: true, maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: tc, font: { size: 11 }, boxWidth: 10, padding: 10 } },
                  tooltip: { backgroundColor: isDark ? '#0e1620' : '#fff', titleColor: isDark ? '#f0f6ff' : '#0f172a', bodyColor: tc, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderWidth: 1 }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--success)' }}></span>
              Status da Frota
            </div>
          </div>
          <div style={{ height: '230px', padding: '8px' }}>
            <Doughnut 
              ref={chartFrotaRef}
              data={{
                labels: ['Em uso', 'Disponível'],
                datasets: [{ data: [frota.emUso, frota.disponivel], backgroundColor: ['rgba(14,165,233,0.8)', 'rgba(148,163,184,0.35)'], borderWidth: 2, borderColor: bgSurface }]
              }}
              plugins={[pluginDoughnutLabels]}
              options={{
                animation: { animateRotate: true, animateScale: true, duration: 1000 },
                responsive: true, maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: tc, font: { size: 11 }, boxWidth: 10, padding: 10 } },
                  tooltip: { backgroundColor: isDark ? '#0e1620' : '#fff', titleColor: isDark ? '#f0f6ff' : '#0f172a', bodyColor: tc, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderWidth: 1 }
                }
              }}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <span className="dot" style={{ background: 'var(--warning)' }}></span>
              Férias | Próximos 60 dias
            </div>
          </div>
          <div style={{ height: '230px', padding: '8px' }}>
            <Bar 
              ref={chartFeriasRef}
              data={{
                labels: mesesLabels,
                datasets: [
                  { label: 'Em férias no mês', data: mesesEmFerias, backgroundColor: 'rgba(14,165,233,0.7)', borderRadius: 5, borderWidth: 0 },
                  { label: 'Iniciam no mês', data: mesesEntrando, backgroundColor: 'rgba(245,158,11,0.65)', borderRadius: 5, borderWidth: 0 }
                ]
              }}
              plugins={[pluginBarLabels]}
              options={{
                animation: { duration: 1000 },
                responsive: true, maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: tc, font: { size: 11 }, boxWidth: 10, padding: 10 } }
                },
                scales: {
                  x: { grid: { display: false }, ticks: { color: tc, font: { size: 12 } } },
                  y: { grid: { color: gc }, ticks: { color: tc, font: { size: 10 }, stepSize: 1 }, beginAtZero: true }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot"></span>Comparativo de ATPs</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ATP</th>
                  <th>UF</th>
                  <th>TÉCNICOS</th>
                  <th>VEÍCULOS</th>
                  <th>KITS</th>
                </tr>
              </thead>
              <tbody>
                {atpsComStats.length > 0 ? atpsComStats.map((a, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text)' }}>{a.nome.slice(0,32)}</td>
                    <td><span className="badge badge-gray">{a.uf}</span></td>
                    <td><span className="badge badge-blue">{a.tec}</span></td>
                    <td className="mono">{a.veic}</td>
                    <td className="mono">{a.kits}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="empty">Nenhuma ATP encontrada</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot" style={{ background: 'var(--danger)' }}></span>Perdas & Prejuízos | Últimos 6 Meses</div>
          </div>
          <div style={{ height: '230px', padding: '8px' }}>
            <Line 
              ref={chartPerdasRef}
              data={{
                labels: ['mar. de 26', 'abr. de 26', 'mai. de 26', 'jun. de 26', 'jul. de 26', 'ago. de 26'],
                datasets: [{ data: [0,0,0,0,0,0], borderColor: 'rgba(14,165,233,0.8)', backgroundColor: 'transparent' }]
              }}
              options={{
                animation: { duration: 1000 },
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { color: tc, font: { size: 10 } } },
                  y: { grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }, ticks: { color: tc }, beginAtZero: true }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot" style={{ background: 'var(--warning)' }}></span>Custo por ATP</div>
          </div>
          <div style={{ height: '230px', padding: '8px' }}>
            <Bar 
              ref={chartCustoRef}
              data={{
                labels: ['ICLIENT INFORMATICA', 'POSITIVO TECNOLOGIA', 'POSITIVO BARUERI'],
                datasets: [
                  { label: 'Em campo', data: [0, 0, 0], backgroundColor: 'rgba(3,105,161,0.75)', borderRadius: 4, borderWidth: 0 },
                  { label: 'Prejuízo', data: [0, 0, 0], backgroundColor: 'rgba(220,38,38,0.65)', borderRadius: 4, borderWidth: 0 }
                ]
              }}
              options={{
                animation: { duration: 1000 },
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: tc, font: { size: 11 }, boxWidth: 10, padding: 10 } } },
                scales: {
                  x: { grid: { display: false }, ticks: { color: tc } },
                  y: { grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }, ticks: { color: tc }, beginAtZero: true }
                }
              }}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot"></span>Kits Vinculados Recentes</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ height: '160px', marginTop: '10px' }}>
              <Doughnut 
                ref={chartKitsRef}
                data={{
                  labels: ['Ativos', 'Devolvidos', 'Perda/Furto'],
                  datasets: [{ data: [2, 2, 0], backgroundColor: ['#0284c7', '#cbd5e1', '#ef4444'], borderWidth: 2, borderColor: bgSurface }]
                }}
                plugins={[pluginDoughnutLabels]}
                options={{
                  animation: { animateRotate: true, animateScale: true, duration: 1000 },
                  responsive: true, maintainAspectRatio: false, cutout: '65%',
                  plugins: { legend: { position: 'bottom', labels: { color: tc, font: { size: 10 }, boxWidth: 8, padding: 10 } } }
                }}
              />
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>TÉCNICO</th>
                    <th>KIT</th>
                    <th>DT.</th>
                  </tr>
                </thead>
                <tbody>
                  {kitsRecentes.length > 0 ? kitsRecentes.map((k, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, fontSize: '11px' }}>{k.tecnico}</td>
                      <td>{k.kit}</td>
                      <td className="mono">{k.data}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="empty">Nenhum kit ativo</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
