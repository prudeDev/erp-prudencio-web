import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { alCerrarSesion, api } from '../lib/api';

export interface Usuario {
  id: number;
  nombreUsuario: string;
  nombre: string;
  rol: string;
  rolNombre: string;
  primerInicio: boolean;
}

type Estado =
  | { fase: 'cargando' }
  | { fase: 'anonimo'; aviso?: string }
  | { fase: 'autenticado'; usuario: Usuario };

interface Auth {
  estado: Estado;
  login: (usuario: string, password: string) => Promise<Usuario>;
  logout: () => Promise<void>;
  cambiarPassword: (actual: string, nueva: string) => Promise<void>;
}

const AuthCtx = createContext<Auth | null>(null);

/** Cada cuánto la pestaña confirma que sigue abierta (el backend cierra la sesión a los 90 s sin señal). */
const LATIDO_MS = 30_000;
const EVENTOS_ACTIVIDAD = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'] as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>({ fase: 'cargando' });

  // ¿Hay sesión al abrir la app? (si el JWT venció, api() lo renueva solo)
  useEffect(() => {
    api<Usuario>('/api/auth/me')
      .then((usuario) => setEstado({ fase: 'autenticado', usuario }))
      .catch(() => setEstado({ fase: 'anonimo' }));
  }, []);

  // El backend cerró la sesión (inactividad, presencia, reuso de token…): volver al login con el motivo.
  useEffect(() => alCerrarSesion((motivo) => setEstado({ fase: 'anonimo', aviso: motivo })), []);

  // Latido de presencia + actividad del usuario.
  const autenticado = estado.fase === 'autenticado';
  useEffect(() => {
    if (!autenticado) return;
    let huboActividad = false;
    const marcar = () => { huboActividad = true; };
    EVENTOS_ACTIVIDAD.forEach((e) => window.addEventListener(e, marcar, { passive: true }));
    const id = window.setInterval(() => {
      const actividad = huboActividad;
      huboActividad = false;
      api('/api/auth/latido', { method: 'POST', body: { actividad } }).catch(() => { /* el cierre llega por alCerrarSesion */ });
    }, LATIDO_MS);
    return () => {
      window.clearInterval(id);
      EVENTOS_ACTIVIDAD.forEach((e) => window.removeEventListener(e, marcar));
    };
  }, [autenticado]);

  const login = useCallback(async (usuario: string, password: string) => {
    const u = await api<Usuario>('/api/auth/login', { method: 'POST', body: { usuario, password } });
    setEstado({ fase: 'autenticado', usuario: u });
    return u;
  }, []);

  const logout = useCallback(async () => {
    await api('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    setEstado({ fase: 'anonimo' });
  }, []);

  const cambiarPassword = useCallback(async (actual: string, nueva: string) => {
    await api('/api/auth/cambiar-password', { method: 'POST', body: { actual, nueva } });
    // El backend cierra todas las sesiones al cambiar la contraseña.
    setEstado({ fase: 'anonimo', aviso: 'Contraseña actualizada. Inicia sesión con tu nueva contraseña.' });
  }, []);

  const valor = useMemo(() => ({ estado, login, logout, cambiarPassword }), [estado, login, logout, cambiarPassword]);
  return <AuthCtx.Provider value={valor}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

/** Usuario de la sesión actual (solo dentro de rutas protegidas). */
export function useUsuario() {
  const { estado } = useAuth();
  if (estado.fase !== 'autenticado') throw new Error('No hay sesión');
  return estado.usuario;
}

export const iniciales = (nombre: string) =>
  nombre.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join('');
