import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

const MOCK_VEICULOS = [
  { placa: 'ABC1D23', modelo: 'Fiat Strada 1.4', uf: 'PR', atp: 'ATP Curitiba', tecNome: 'Carlos Eduardo Silva', tecMatricula: '1001', hodometro: 45820, ipva: '2026-10-15', seguro: '2026-12-01', licenciamento: '2026-11-20', status: 'uso' },
  { placa: 'XYZ9876', modelo: 'VW Saveiro 1.6', uf: 'SP', atp: 'ATP Campinas', tecNome: 'Mariana Costa', tecMatricula: '1002', hodometro: 28140, ipva: '2026-09-10', seguro: '2026-11-15', licenciamento: '2026-10-05', status: 'uso' },
  { placa: 'KLR4567', modelo: 'Renault Kangoo', uf: 'SC', atp: 'ATP Florianópolis', tecNome: '', tecMatricula: '', hodometro: 62400, ipva: '2026-05-12', seguro: '2026-06-20', licenciamento: '2026-07-01', status: 'livre' },
  { placa: 'MNO3E45', modelo: 'Chevrolet Montana', uf: 'PR', atp: 'ATP Londrina', tecNome: 'Roberto Almeida', tecMatricula: '1003', hodometro: 19500, ipva: '2026-11-30', seguro: '2027-01-10', licenciamento: '2026-12-15', status: 'uso' }
];

const MOCK_MANUTENCOES = [
  { id: 'm1', placa: 'ABC1D23', modelo: 'Fiat Strada 1.4', tipo: 'troca_oleo', dataRealiz: '2026-04-10', proximaPrev: '2026-08-01', km: 45000, valor: 350.00, status: 'vencida' },
  { id: 'm2', placa: 'XYZ9876', modelo: 'VW Saveiro 1.6', tipo: 'revisao', dataRealiz: '2026-06-15', proximaPrev: '2026-08-25', km: 28000, valor: 890.00, status: 'proximo' },
  { id: 'm3', placa: 'KLR4567', modelo: 'Renault Kangoo', tipo: 'pneu', dataRealiz: '2026-07-01', proximaPrev: '2026-12-01', km: 60000, valor: 1200.00, status: 'ok' }
];

export async function getVeiculos() {
  try {
    const snap = await getDocs(collection(db, 'veiculos'));
    if (!snap.empty) {
      const list = [];
      snap.forEach(d => list.push({ placa: d.id, ...d.data() }));
      return list;
    }
  } catch (err) {
    console.warn('Usando dados locais de fallback para veículos:', err.message);
  }
  return MOCK_VEICULOS;
}

export async function saveVeiculo(veiculo) {
  try {
    await setDoc(doc(db, 'veiculos', veiculo.placa), {
      ...veiculo,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error('Erro ao salvar veículo:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteVeiculo(placa) {
  try {
    await deleteDoc(doc(db, 'veiculos', placa));
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function transferirVeiculo(placa, novoTecnicoMat, novoTecnicoNome, adminUsuario) {
  try {
    const veicRef = doc(db, 'veiculos', placa);
    await setDoc(veicRef, {
      tecMatricula: novoTecnicoMat,
      tecNome: novoTecnicoNome,
      status: novoTecnicoMat ? 'uso' : 'livre'
    }, { merge: true });

    await addDoc(collection(db, 'movimentacoes_veiculos'), {
      placa,
      tecAtual: novoTecnicoNome,
      tecMatricula: novoTecnicoMat,
      data: new Date().toISOString(),
      registradoPor: adminUsuario || 'Admin'
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getManutencoes() {
  try {
    const snap = await getDocs(collection(db, 'manutencoes'));
    if (!snap.empty) {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    }
  } catch (err) {
    console.warn('Usando dados de fallback para manutenções:', err.message);
  }
  return MOCK_MANUTENCOES;
}

export async function saveManutencao(manutencao) {
  try {
    await addDoc(collection(db, 'manutencoes'), {
      ...manutencao,
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
