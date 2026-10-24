/**
 * Cliente de la API (erp-prudencio-api). Los tokens viajan en cookies HttpOnly: este código nunca los ve.
 *
 * - La URL del backend sale de VITE_API_BASE_URL (.env). Vacía = mismo origen (proxy inverso).
 * - `credentials: 'include'` hace que el navegador mande las cookies también a otro subdominio
 *   (app.prudencio.mx → api.prudencio.mx); el backend debe tener ese origen en CORS_ORIGINS.
 *
 * - Si una petición responde 401 NO_AUTENTICADO (JWT vencido), intenta una sola renovación
 *   (/api/auth/refresh) y repite la petición.
 * - Las renovaciones simultáneas se agrupan en una sola llamada.
 * - Si el backend cerró la sesión (SESION_CERRADA), se avisa a quien esté suscrito para
 *   mandar al usuario al login con el motivo.
 */

const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

if (import.meta.env.DEV && !BASE) {
  console.warn('VITE_API_BASE_URL no está definida: las peticiones irán al mismo origen. Revisa .env (ver .env.example).');
}

export class ApiError extends Error {
  readonly status: number;
  readonly codigo: string;

  constructor(status: number, codigo: string, mensaje: string) {
    super(mensaje);
    this.status = status;
    this.codigo = codigo;
  }
}

type OyenteCierre = (motivo: string) => void;
const oyentes = new Set<OyenteCierre>();

/** Suscribe una función que se llama cuando el backend cierra la sesión. Devuelve la baja. */
export function alCerrarSesion(fn: OyenteCierre) {
  oyentes.add(fn);
  return () => { oyentes.delete(fn); };
}

function avisarCierre(motivo: string) {
  oyentes.forEach((fn) => fn(motivo));
}

async function leerError(r: Response): Promise<ApiError> {
  try {
    const p = await r.json();
    return new ApiError(r.status, p.codigo ?? 'ERROR', p.detail ?? 'Ocurrió un error');
  } catch {
    return new ApiError(r.status, 'ERROR', 'No se pudo contactar al servidor');
  }
}

let renovacion: Promise<boolean> | null = null;

/** Renueva el JWT con el refresh token. true si se puede reintentar la petición original. */
function renovar(): Promise<boolean> {
  renovacion ??= (async () => {
    try {
      const r = await fetch(BASE + '/api/auth/refresh', { method: 'POST', credentials: 'include' });
      // 409: otra pestaña/petición ya renovó; las cookies nuevas ya están en el navegador.
      if (r.ok || r.status === 409) return true;
      const e = await leerError(r);
      if (e.codigo === 'SESION_CERRADA') avisarCierre(e.message);
      return false;
    } catch {
      return false;
    } finally {
      setTimeout(() => { renovacion = null; }, 0);
    }
  })();
  return renovacion;
}

export async function api<T = void>(ruta: string, opciones: { method?: string; body?: unknown } = {}, reintentar = true): Promise<T> {
  const { method = 'GET', body } = opciones;
  let r: Response;
  try {
    r = await fetch(BASE + ruta, {
      method,
      credentials: 'include',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'SIN_CONEXION', 'No se pudo contactar al servidor');
  }
  if (r.ok) {
    return (r.status === 204 ? undefined : await r.json()) as T;
  }
  const error = await leerError(r);
  if (r.status === 401 && error.codigo === 'NO_AUTENTICADO' && reintentar) {
    if (await renovar()) return api<T>(ruta, opciones, false);
  }
  if (error.codigo === 'SESION_CERRADA') avisarCierre(error.message);
  throw error;
}
