import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ApiError } from '../lib/api';
import { Icono } from '../components/ui';
import { MarcoAuth, CampoPassword } from './MarcoAuth';

export default function Login() {
  const { estado, login } = useAuth();
  const navigate = useNavigate();
  const desde = (useLocation().state as { desde?: string } | null)?.desde ?? '/';
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (estado.fase === 'autenticado') {
    return <Navigate to={estado.usuario.primerInicio ? '/cambiar-password' : desde} replace />;
  }
  const aviso = estado.fase === 'anonimo' ? estado.aviso : undefined;

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const u = await login(usuario.trim(), password);
      navigate(u.primerInicio ? '/cambiar-password' : desde, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión');
      setPassword('');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <MarcoAuth titulo="Iniciar sesión" subtitulo="Accede al sistema de gestión de obras">
      {aviso && !error && <div className="auth-aviso">{aviso}</div>}
      {error && <div className="auth-error" role="alert">{error}</div>}
      <form onSubmit={enviar} className="auth-form" noValidate>
        <label className="auth-campo">
          <span>Usuario</span>
          <div className="auth-input">
            <Icono d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" size={18} />
            <input value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" autoFocus
              required maxLength={40} placeholder="nombre de usuario" />
          </div>
        </label>
        <CampoPassword etiqueta="Contraseña" valor={password} onChange={setPassword} autoComplete="current-password" />
        <button className="btn btn-primario auth-boton" disabled={enviando || !usuario.trim() || !password}>
          {enviando ? 'Verificando…' : 'Entrar'}
        </button>
      </form>
      <p className="auth-nota">La sesión se cierra tras 30 minutos sin actividad.</p>
    </MarcoAuth>
  );
}
