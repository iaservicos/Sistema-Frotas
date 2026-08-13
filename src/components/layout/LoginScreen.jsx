import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [esqueciOpen, setEsqueciOpen] = useState(false);
  const [esqueciInput, setEsqueciInput] = useState('');
  const [esqueciResult, setEsqueciResult] = useState('');

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setErro('');
    setAviso('');
    const res = await login(usuario, senha);
    if (!res.success) {
      setErro(res.error);
    } else if (res.aviso) {
      setAviso(res.aviso);
    }
  };

  const handleEnviarEsqueci = () => {
    if (!esqueciInput.trim()) {
      setEsqueciResult('<div class="status-msg status-err">Informe a matrícula ou usuário.</div>');
      return;
    }
    setEsqueciResult('<div class="status-msg status-ok">Solicitação registrada com sucesso! O administrador responsável irá gerar uma senha temporária.</div>');
  };

  return (
    <div id="login-screen" className="login-screen">
      <div className="login-box">
        <div className="login-logo">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className="login-title">EnerFine</div>
        <div className="login-sub">Painel Administrativo</div>

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label className="form-label">Usuário</label>
            <input 
              type="text" 
              id="login-user" 
              placeholder="Seu usuário" 
              value={usuario} 
              onChange={(e) => setUsuario(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input 
              type="password" 
              id="login-pass" 
              placeholder="Sua senha" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '11px', justifyContent: 'center', fontSize: '13.5px' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Entrar
          </button>
        </form>

        {erro && <div id="login-err" className="status-msg status-err" style={{ marginTop: '10px' }}>{erro}</div>}
        {aviso && <div className="status-msg status-err" style={{ marginTop: '10px', color: 'var(--warning)' }}>{aviso}</div>}

        <button 
          onClick={() => setEsqueciOpen(!esqueciOpen)} 
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text3)',
            fontSize: '11px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            marginTop: '8px',
            width: '100%',
            textAlign: 'center'
          }}
        >
          Esqueci minha senha
        </button>

        {esqueciOpen && (
          <div id="area-esqueci" style={{ marginTop: '12px', padding: '14px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Solicitar nova senha</div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '10px' }}>Informe sua matrícula ou usuário. O administrador irá gerar uma senha temporária.</div>
            <input 
              type="text" 
              id="esqueci-usuario" 
              placeholder="Matrícula ou usuário" 
              value={esqueciInput} 
              onChange={(e) => setEsqueciInput(e.target.value)} 
              style={{ width: '100%', marginBottom: '8px', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)', fontSize: '12px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            />
            {esqueciResult && <div dangerouslySetInnerHTML={{ __html: esqueciResult }} style={{ marginBottom: '8px' }} />}
            <button 
              onClick={handleEnviarEsqueci} 
              style={{ width: '100%', padding: '9px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', fontWeight: 700 }}
            >
              Enviar Solicitação
            </button>
          </div>
        )}

        <div style={{ marginTop: '16px' }}>
          <button 
            onClick={toggleTheme} 
            style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto' }}
          >
            {theme === 'dark' ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            )}
            Alternar tema
          </button>
        </div>
      </div>
    </div>
  );
}
