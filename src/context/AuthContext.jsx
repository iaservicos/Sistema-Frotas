import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { MASTER, MASTERP, SK, TODOS_MODULOS } from '../utils/constants';
import { hash } from '../utils/hash';
import { seedAtpsBase } from '../services/firestoreService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminAtual, setAdminAtual] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const saved = localStorage.getItem(SK);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.usuario === MASTER) {
            setAdminAtual({ usuario: MASTER, nome: 'Master Admin', tipo: 'master', modulos: TODOS_MODULOS });
          } else if (parsed?.usuario) {
            const snap = await getDoc(doc(db, 'admins', parsed.usuario));
            if (snap.exists()) {
              setAdminAtual({ ...snap.data() });
            } else {
              localStorage.removeItem(SK);
            }
          }
        }
      } catch (err) {
        console.warn('Erro ao restaurar sessão:', err);
      } finally {
        setLoading(false);
      }
    };

    seedAtpsBase();
    initAuth();
  }, []);

  // Heartbeat de presença no Firestore (ignora se for o master estático)
  useEffect(() => {
    if (!adminAtual?.usuario || adminAtual.usuario === MASTER) return;

    try {
      const ref = doc(db, 'admins', adminAtual.usuario);
      setDoc(ref, { online: true, ultimoAcesso: serverTimestamp() }, { merge: true });

      const interval = setInterval(() => {
        setDoc(ref, { online: true, ultimoAcesso: serverTimestamp() }, { merge: true });
      }, 60000);

      const handleUnload = () => {
        setDoc(ref, { online: false }, { merge: true });
      };

      window.addEventListener('beforeunload', handleUnload);

      return () => {
        clearInterval(interval);
        window.removeEventListener('beforeunload', handleUnload);
      };
    } catch (err) {
      console.warn('Heartbeat Firestore warning:', err);
    }
  }, [adminAtual]);

  const login = async (usuario, senha) => {
    const u = usuario.trim();
    const p = senha;

    if (!u || !p) {
      return { success: false, error: 'Preencha usuário e senha.' };
    }

    // 1. Verificação primária da conta Master Admin oficial (index.legacy.html: line 2755)
    if (u === MASTER && p === MASTERP) {
      const userMaster = { usuario: MASTER, nome: 'Master Admin', tipo: 'master', modulos: TODOS_MODULOS };
      setAdminAtual(userMaster);
      localStorage.setItem(SK, JSON.stringify(userMaster));
      return { success: true };
    }

    // 2. Consulta no Firestore real para usuários admins secundários
    try {
      const snap = await getDoc(doc(db, 'admins', u));
      if (!snap.exists()) {
        if (u === MASTER) {
          return { success: false, error: 'Senha incorreta para a conta Master Admin. A senha correta é 123hg330' };
        }
        return { success: false, error: 'Usuário não encontrado.' };
      }
      const data = snap.data();

      if (data.senhaTempAtiva && p === data.senhaTemp) {
        const userData = { ...data };
        setAdminAtual(userData);
        localStorage.setItem(SK, JSON.stringify(userData));
        return { success: true, aviso: 'Senha temporária detectada. Redefina sua senha.' };
      }

      if (data.senha !== hash(p)) {
        return { success: false, error: 'Senha incorreta.' };
      }

      const userData = { ...data };
      setAdminAtual(userData);
      localStorage.setItem(SK, JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      if (u === MASTER) {
        return { success: false, error: 'Senha incorreta para a conta Master Admin. A senha oficial é: 123hg330' };
      }
      return { success: false, error: `Erro na conexão com o Firestore: ${err.message}` };
    }
  };

  const logout = () => {
    if (adminAtual?.usuario && adminAtual.usuario !== MASTER) {
      try {
        setDoc(doc(db, 'admins', adminAtual.usuario), { online: false }, { merge: true });
      } catch (e) {}
    }
    setAdminAtual(null);
    localStorage.removeItem(SK);
  };

  return (
    <AuthContext.Provider value={{ adminAtual, loading, login, logout, isAuthenticated: !!adminAtual }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
