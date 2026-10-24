import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/** Protege las vistas del ERP: sin sesión → login; con contraseña temporal → cambio obligatorio. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { estado } = useAuth();
  const { pathname } = useLocation();

  if (estado.fase === 'cargando') {
    return <div className="auth-fondo"><div className="auth-cargando" aria-label="Cargando" /></div>;
  }
  if (estado.fase === 'anonimo') {
    return <Navigate to="/login" replace state={{ desde: pathname }} />;
  }
  if (estado.usuario.primerInicio) {
    return <Navigate to="/cambiar-password" replace />;
  }
  return <>{children}</>;
}
