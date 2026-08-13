import { db } from '../config/firebase';
import { collection, getDocs, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';

const MOCK_COMBUSTIVEL = [
  { id: 'c1', placa: 'ABC1D23', motorista: 'Carlos Eduardo Silva', matricula: '1001', data: '2026-08-05 14:30', quantidade: 45.2, valorTotal: 271.20, precoLitro: 6.00, hodometro: 45820, lat: -25.4284, lng: -49.2733, fotoHodometro: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=60', fotoStatus: 'pendente' },
  { id: 'c2', placa: 'XYZ9876', motorista: 'Mariana Costa', matricula: '1002', data: '2026-08-06 09:15', quantidade: 38.0, valorTotal: 224.20, precoLitro: 5.90, hodometro: 28140, lat: -23.5505, lng: -46.6333, fotoHodometro: null, fotoStatus: 'aprovado' },
  { id: 'c3', placa: 'ABC1D23', motorista: 'Carlos Eduardo Silva', matricula: '1001', data: '2026-07-28 10:10', quantidade: 42.0, valorTotal: 252.00, precoLitro: 6.00, hodometro: 45120, lat: -25.4290, lng: -49.2740, fotoHodometro: null, fotoStatus: 'aprovado' }
];

export async function getAbastecimentos() {
  try {
    const snap = await getDocs(collection(db, 'combustivel'));
    if (!snap.empty) {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    }
  } catch (err) {
    console.warn('Usando dados de fallback para combustível:', err.message);
  }
  return MOCK_COMBUSTIVEL;
}

export function calcularDesvioKm(registros) {
  const porTecnico = {};

  registros.forEach(r => {
    if (!r.matricula) return;
    const mat = String(r.matricula);
    if (!porTecnico[mat]) {
      porTecnico[mat] = {
        matricula: mat,
        motorista: r.motorista || '—',
        placa: r.placa || '—',
        hodometros: [],
        litros: 0,
        qtdAbastecimentos: 0
      };
    }
    if (r.hodometro > 0) porTecnico[mat].hodometros.push(r.hodometro);
    porTecnico[mat].litros += Number(r.quantidade || 0);
    porTecnico[mat].qtdAbastecimentos += 1;
  });

  return Object.values(porTecnico).map(t => {
    t.hodometros.sort((a, b) => a - b);
    const hodMin = t.hodometros[0] || 0;
    const hodMax = t.hodometros[t.hodometros.length - 1] || 0;
    const kmReal = hodMax - hodMin;
    const kmEsperado = (t.qtdAbastecimentos || 1) * 350; // Estimativa por tanque (350km)
    const desvio = kmReal - kmEsperado;
    const pctDesvio = kmEsperado > 0 ? (desvio / kmEsperado) * 100 : 0;
    const kmL = kmReal > 0 && t.litros > 0 ? (kmReal / t.litros).toFixed(1) : '—';

    let alerta = 'Normal';
    let alertaColor = 'green';
    if (pctDesvio > 50) {
      alerta = `Alto Desvio (${Math.round(pctDesvio)}%)`;
      alertaColor = 'red';
    } else if (pctDesvio > 20) {
      alerta = `Desvio Moderado (${Math.round(pctDesvio)}%)`;
      alertaColor = 'amber';
    }

    return {
      ...t,
      kmReal,
      kmEsperado,
      desvio,
      pctDesvio,
      kmL,
      alerta,
      alertaColor
    };
  });
}

export async function validarFotoHodometro(docId, decisao, adminUsuario) {
  try {
    const ref = doc(db, 'combustivel', docId);
    if (decisao === 'aprovado') {
      await setDoc(ref, {
        fotoHodometro: null,
        fotoStatus: 'aprovado',
        aprovadoPor: adminUsuario || 'Admin',
        aprovadoEm: serverTimestamp()
      }, { merge: true });
    } else {
      await setDoc(ref, {
        fotoStatus: 'rejeitado',
        rejeitadoPor: adminUsuario || 'Admin',
        rejeitadoEm: serverTimestamp()
      }, { merge: true });
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
