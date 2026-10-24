/** Acceso a datos de evidencias. Hoy resuelve con src/data/ (ver modulos/empleados/api.ts). */
import { ETAPAS, evidenciasResumen, galeria } from '../../data/obra';
import { proyecto } from '../../data/proyectos';
import type { Evidencias } from './tipos';

/** GET /api/evidencias/{proyecto} */
export async function obtenerEvidencias(): Promise<Evidencias> {
  return {
    proyecto: proyecto('PA').nombre,
    totalFotos: evidenciasResumen.fotos,
    etapas: ETAPAS,
    comparativa: {
      lugar: 'pasillo central',
      descripcion: 'Pasillo central · nivel 1 · etapa Acabados (terminada 12 sep)',
      antes: '04 abr 2026 · 09:12',
      despues: '12 sep 2026 · 17:40',
    },
    galeria: galeria.map((g) => ({ ...g })),
  };
}
