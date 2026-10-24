import { useState, type ReactNode } from 'react';
import { Icono } from '../components/ui';

/** Pantalla negra de marca con la tarjeta del formulario (login y cambio de contraseña). */
export function MarcoAuth({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: ReactNode }) {
  return (
    <div className="auth-fondo">
      <div className="auth-tarjeta">
        <div className="auth-logo"><img src="/logo-prudencio.jpg" alt="Construcciones Prudencio" /></div>
        <div>
          <h1 className="auth-titulo">{titulo}</h1>
          <p className="auth-subtitulo">{subtitulo}</p>
        </div>
        {children}
      </div>
      <p className="auth-pie">Construcciones Prudencio · ERP</p>
    </div>
  );
}

const OJO = 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';
const OJO_TACHADO = 'M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 5.4-1.6';

export function CampoPassword({ etiqueta, valor, onChange, autoComplete, autoFocus }: {
  etiqueta: string; valor: string; onChange: (v: string) => void; autoComplete: string; autoFocus?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="auth-campo">
      <span>{etiqueta}</span>
      <div className="auth-input">
        <Icono d="M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4" size={18} />
        <input type={visible ? 'text' : 'password'} value={valor} onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete} autoFocus={autoFocus} required />
        <button type="button" className="auth-ojo" onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
          <Icono d={visible ? OJO_TACHADO : OJO} size={18} />
        </button>
      </div>
    </label>
  );
}
