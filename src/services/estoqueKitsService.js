import { db } from '../config/firebase';
import { collection, getDocs, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { jsPDF } from 'jspdf';

const MOCK_ESTOQUE = [
  { id: 'f1', nome: 'Multímetro Digital Fluke 117', categoria: 'Equipamento Medição', patrimonio: 'PAT-8812', qtdTotal: 15, disponivel: 10, vinculada: 5 },
  { id: 'f2', nome: 'Alicate Amperímetro Hikari', categoria: 'Equipamento Medição', patrimonio: 'PAT-8815', qtdTotal: 20, disponivel: 12, vinculada: 8 },
  { id: 'f3', nome: 'Jogo de Chaves Isoladas 1000V', categoria: 'Ferramental Manual', patrimonio: 'PAT-7010', qtdTotal: 30, disponivel: 22, vinculada: 8 },
  { id: 'f4', nome: 'EPI Cinto de Segurança Paraquedista', categoria: 'Segurança / EPI', patrimonio: 'PAT-6102', qtdTotal: 25, disponivel: 18, vinculada: 7 }
];

const MOCK_KITS = [
  { id: 'k1', tecNome: 'Carlos Eduardo Silva', tecMatricula: '1001', nomeKit: 'Kit Padrão Campo Electric', dataVinculo: '2026-06-10', valorCampo: 1850.00, status: 'ativo' },
  { id: 'k2', tecNome: 'Mariana Costa', tecMatricula: '1002', nomeKit: 'Kit Medição Alta Precisão', dataVinculo: '2026-07-02', valorCampo: 2400.00, status: 'ativo' }
];

export async function getEstoque() {
  try {
    const snap = await getDocs(collection(db, 'ferramentas'));
    if (!snap.empty) {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    }
  } catch (err) {
    console.warn('Usando fallback para estoque:', err.message);
  }
  return MOCK_ESTOQUE;
}

export async function getKits() {
  try {
    const snap = await getDocs(collection(db, 'kits'));
    if (!snap.empty) {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    }
  } catch (err) {
    console.warn('Usando fallback para kits:', err.message);
  }
  return MOCK_KITS;
}

export function gerarTermoPDF(kit) {
  const docPdf = new jsPDF();
  
  docPdf.setFont('helvetica', 'bold');
  docPdf.setFontSize(16);
  docPdf.text('TERMO DE RESPONSABILIDADE E GUARDA DE EQUIPAMENTOS', 15, 20);

  docPdf.setFontSize(10);
  docPdf.setFont('helvetica', 'normal');
  docPdf.text(`Empresa: EnerFine Gestão de Campo & Frotas`, 15, 30);
  docPdf.text(`Data do Vínculo: ${kit.dataVinculo || new Date().toLocaleDateString('pt-BR')}`, 15, 36);

  docPdf.setLineWidth(0.5);
  docPdf.line(15, 42, 195, 42);

  docPdf.setFont('helvetica', 'bold');
  docPdf.text(`TÉCNICO RESPONSÁVEL: ${kit.tecNome?.toUpperCase() || '—'}`, 15, 50);
  docPdf.setFont('helvetica', 'normal');
  docPdf.text(`Matrícula: ${kit.tecMatricula || '—'}`, 15, 56);
  docPdf.text(`Identificação do Kit: ${kit.nomeKit || '—'}`, 15, 62);
  docPdf.text(`Valor Estimado em Campo: R$ ${Number(kit.valorCampo || 0).toFixed(2)}`, 15, 68);

  docPdf.text('Declaro ter recebido os equipamentos e ferramentas acima relacionados em perfeito estado de uso e conservação, comprometendo-me a zelar pela sua guarda e integridade.', 15, 80, { maxWidth: 180 });

  docPdf.line(25, 120, 95, 120);
  docPdf.text('Assinatura do Técnico', 35, 126);

  docPdf.line(115, 120, 185, 120);
  docPdf.text('Gestão de Frotas & Suprimentos', 120, 126);

  docPdf.save(`Termo_Responsabilidade_${kit.tecMatricula || 'Kit'}.pdf`);
}
