import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const MOCK_ALERTAS_SLA = [
  { id: 'a1', chamado: 'CH-98120', pep: 'PEP-PR-04', tecNome: 'Carlos Eduardo Silva', tecMat: '1001', atp: 'ATP Curitiba', dataLimite: '2026-08-09', atraso: 1, tipo: 'perdido', disparadoEm: { seconds: Date.now()/1000 } },
  { id: 'a2', chamado: 'CH-98214', pep: 'PEP-SP-12', tecNome: 'Mariana Costa', tecMat: '1002', atp: 'ATP Campinas', dataLimite: '2026-08-10', atraso: 0, tipo: '1dia', disparadoEm: { seconds: Date.now()/1000 } },
  { id: 'a3', chamado: 'CH-98305', pep: 'PEP-SC-08', tecNome: 'Roberto Almeida', tecMat: '1003', atp: 'ATP Florianópolis', dataLimite: '2026-08-12', atraso: -2, tipo: '2dias', disparadoEm: { seconds: Date.now()/1000 } }
];

export async function getAlertasSLA() {
  try {
    const q = query(collection(db, 'alertas_sla'), orderBy('disparadoEm', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    }
  } catch (err) {
    console.warn('Usando fallback para alertas SLA:', err.message);
  }
  return MOCK_ALERTAS_SLA;
}
