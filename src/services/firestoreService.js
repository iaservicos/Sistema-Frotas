import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp,
  arrayUnion,
  query,
  orderBy
} from 'firebase/firestore';
import { ATPS_BASE } from '../utils/constants';

// Sementes automáticas caso a coleção de ATPs esteja vazia no Firestore
export async function seedAtpsBase() {
  try {
    const snap = await getDocs(collection(db, 'atps'));
    if (snap.empty) {
      for (const atp of ATPS_BASE) {
        await setDoc(doc(db, 'atps', atp.codigo), atp);
      }
    }
  } catch (err) {
    console.warn('Seed ATPs info:', err.message);
  }
}

// Inscrições em tempo real (onSnapshot) para todas as 11 coleções
export function subscribeCollection(collectionName, callback) {
  const ref = collection(db, collectionName);
  return onSnapshot(ref, (snap) => {
    const list = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    callback(list);
  }, (err) => {
    console.warn(`Erro listener em ${collectionName}:`, err.message);
    callback([]);
  });
}

// Operação Genérica de Salvar Documento com Merge
export async function saveDocument(collectionName, docId, data) {
  if (docId) {
    const ref = doc(db, collectionName, docId);
    await setDoc(ref, { ...data, atualizadoEm: serverTimestamp() }, { merge: true });
    return docId;
  } else {
    const ref = await addDoc(collection(db, collectionName), { ...data, criadoEm: serverTimestamp() });
    return ref.id;
  }
}

// Operação Genérica de Exclusão
export async function deleteDocument(collectionName, docId) {
  await deleteDoc(doc(db, collectionName, docId));
}

// Envio de Mensagens de Chat no PPCR
export async function addPpcrMessage(ppcrId, mensagemData) {
  const ref = doc(db, 'ppcr', ppcrId);
  await updateDoc(ref, {
    mensagens: arrayUnion(mensagemData),
    atualizadoEm: serverTimestamp()
  });
}
