import { db } from '../config/firebase';
import { collection, getDocs, doc, setDoc, addDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';

const MOCK_PPCR = [
  {
    id: 'p1',
    chamado: 'CH-98120',
    peca: 'Sensor de Temperatura PT100',
    codigo: 'PEC-4412',
    urgencia: 'critica',
    status: 'pendente',
    tecNome: 'Carlos Eduardo Silva',
    tecMatricula: '1001',
    justificativa: 'Sensor danificado por surto na rede do cliente.',
    mensagens: [
      { autor: 'Carlos Eduardo Silva', texto: 'Preciso da substituição urgente para concluir o chamado.', data: '2026-08-08 11:20' },
      { autor: 'Admin', texto: 'Peça solicitada ao almoxarifado central.', data: '2026-08-08 14:00' }
    ]
  },
  {
    id: 'p2',
    chamado: 'CH-98214',
    peca: 'Cabo de Sinal 4-20mA Blindado 10m',
    codigo: 'PEC-3099',
    urgencia: 'alta',
    status: 'atendido',
    tecNome: 'Mariana Costa',
    tecMatricula: '1002',
    justificativa: 'Cabo rompido durante inspeção.',
    mensagens: [
      { autor: 'Mariana Costa', texto: 'Cabo retirado na ATP Campinas.', data: '2026-08-07 09:30' }
    ]
  }
];

export async function getSolicitacoesPPCR() {
  try {
    const snap = await getDocs(collection(db, 'ppcr'));
    if (!snap.empty) {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    }
  } catch (err) {
    console.warn('Usando fallback para PPCR:', err.message);
  }
  return MOCK_PPCR;
}

export async function enviarMensagemPPCR(docId, texto, autor) {
  try {
    const novaMsg = {
      autor: autor || 'Admin',
      texto,
      data: new Date().toLocaleString('pt-BR')
    };

    const ref = doc(db, 'ppcr', docId);
    await updateDoc(ref, {
      mensagens: arrayUnion(novaMsg)
    });
    return { success: true, novaMsg };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
