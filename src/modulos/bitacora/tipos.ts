/** Forma de los datos tal como los entregará /api/bitacora. */

export type EstadoActividad = 'Terminada' | 'En progreso' | 'Pendiente';
export type TipoEvento = 'ok' | 'alerta' | 'caja' | 'camara' | 'doc';

export interface BitacoraDia {
  proyecto: { id: string; nombre: string; avance: number };
  dia: number;
  supervisor: string;
  horario: string;
  clima: string;
  personal: { presentes: number; asignados: number };
  partidasMaterial: number;
  incidenciasAbiertas: number;
  actividades: { titulo: string; meta: string; estado: EstadoActividad }[];
  fotos: string[];
  observaciones: string;
  lineaTiempo: { fecha: string; titulo: string; meta: string; tipo: TipoEvento; oscuro: boolean }[];
}

export const ACTIVIDAD_TONO: Record<EstadoActividad, string> = {
  Terminada: 't-ok',
  'En progreso': 't-info',
  Pendiente: 't-mute',
};
