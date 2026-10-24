import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ApiError } from '../lib/api';
import { Icono, ICONO } from '../components/ui';
import { CampoPassword, MarcoAuth } from './MarcoAuth';

/** Mismas reglas que el backend (PasswordService): mínimo 10 caracteres y máximo 72 bytes (bcrypt). */
const MIN_CARACTERES = 10;
const MAX_BYTES = 72;
const bytes = (s: string) => new TextEncoder().encode(s).length;

export default function CambiarPassword() {
  const { estado, cambiarPassword, logout } = useAuth();
  const navigate = useNavigate();
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (estado.fase !== 'autenticado') return <Navigate to="/login" replace />;
  const obligatorio = estado.usuario.primerInicio;

  const reglas = [
    { ok: [...nueva].length >= MIN_CARACTERES, texto: `Al menos ${MIN_CARACTERES} caracteres` },
    { ok: nueva.length > 0 && bytes(nueva) <= MAX_BYTES, texto: `Máximo ${MAX_BYTES} bytes (los acentos y la ñ cuentan doble)` },
    { ok: nueva.length > 0 && nueva !== actual, texto: 'Distinta de la contraseña actual' },
    { ok: confirmacion.length > 0 && nueva === confirmacion, texto: 'Las dos contraseñas coinciden' },
  ];
  const valida = reglas.every((r) => r.ok) && actual.length > 0;

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!valida) return;
    setError('');
    setEnviando(true);
    try {
      await cambiarPassword(actual, nueva);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cambiar la contraseña');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <MarcoAuth
      titulo={obligatorio ? 'Crea tu contraseña' : 'Cambiar contraseña'}
      subtitulo={obligatorio
        ? `Hola, ${estado.usuario.nombre.split(' ')[0]}. Antes de continuar reemplaza la contraseña temporal que te asignaron.`
        : 'Al cambiarla se cerrarán todas tus sesiones abiertas.'}>
      {error && <div className="auth-error" role="alert">{error}</div>}
      <form onSubmit={enviar} className="auth-form" noValidate>
        <CampoPassword etiqueta={obligatorio ? 'Contraseña temporal' : 'Contraseña actual'} valor={actual} onChange={setActual} autoComplete="current-password" autoFocus />
        <CampoPassword etiqueta="Nueva contraseña" valor={nueva} onChange={setNueva} autoComplete="new-password" />
        <CampoPassword etiqueta="Confirma la nueva contraseña" valor={confirmacion} onChange={setConfirmacion} autoComplete="new-password" />
        <ul className="auth-reglas">
          {reglas.map((r) => (
            <li key={r.texto} className={r.ok ? 'ok' : ''}>
              <Icono d={r.ok ? ICONO.check : 'M12 12h.01'} size={14} stroke={r.ok ? 2.6 : 4} />{r.texto}
            </li>
          ))}
        </ul>
        <button className="btn btn-primario auth-boton" disabled={!valida || enviando}>
          {enviando ? 'Guardando…' : 'Guardar contraseña'}
        </button>
        <button type="button" className="auth-enlace" onClick={() => logout()}>Cerrar sesión</button>
      </form>
    </MarcoAuth>
  );
}
