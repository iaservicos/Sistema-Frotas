import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyASoshFf58eAGq7rwmuELWnFhVCUTtRcPM",
  authDomain: "sistemarastreio-e9734.firebaseapp.com",
  projectId: "sistemarastreio-e9734",
  storageBucket: "sistemarastreio-e9734.firebasestorage.app",
  messagingSenderId: "621240013789",
  appId: "1:621240013789:web:fd6f02b4ee0d4e339b5c34"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
