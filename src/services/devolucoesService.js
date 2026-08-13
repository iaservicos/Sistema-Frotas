import { db } from '../config/firebase';
import { collection, getDocs, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';

const MOCK_DEVOLUCOES = [
  {
    id: 'dev1',
    placa: 'KLR4567',
    tecNome: 'Fernando Dias',
    tecMatricula: '1004',
    data: '2026-08-01 16:20',
    hodometro: 62400,
    motivo: 'desligamento',
    observacoes: 'Devolução com pneu reserva ok, macaco e chave de roda presentes.',
    gpsLat: -25.4284,
    gpsLng: -49.2733,
    fotoFrente: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=60',
    fotoTraseira: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?w=500&auto=format&fit=crop&q=60',
    fotoEsq: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=60',
    fotoDir: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&auto=format&fit=crop&q=60',
    fotoPainel: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&auto=format&fit=crop&q=60'
  }
];

export async function getDevolucoes() {
  try {
    const snap = await getDocs(collection(db, 'devolucoes_veiculos'));
    if (!snap.empty) {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    }
  } catch (err) {
    console.warn('Usando dados de fallback para devoluções:', err.message);
  }
  return MOCK_DEVOLUCOES;
}

export async function saveDevolucao(devolucao) {
  try {
    const docRef = await addDoc(collection(db, 'devolucoes_veiculos'), {
      ...devolucao,
      createdAt: serverTimestamp()
    });

    // Atualiza status do veículo para 'livre' e desvincula técnico
    await setDoc(doc(db, 'veiculos', devolucao.placa), {
      status: 'livre',
      tecNome: '',
      tecMatricula: '',
      hodometro: Number(devolucao.hodometro || 0)
    }, { merge: true });

    return { success: true, id: docRef.id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
