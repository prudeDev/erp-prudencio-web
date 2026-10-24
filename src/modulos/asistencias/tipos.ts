/** Forma de los datos tal como los entregará /api/asistencias. */
import type { EmpleadoRef } from '../empleados/tipos';

export type EstadoAsistencia = 'En obra' | 'Retardo' | 'Falta' | 'Permiso';

/** presentes = a tiempo + retardos; programados = presentes + faltas + permisos. */
export interface ResumenAsistencia {
  programados: number;
  presentes: number;
  aTiempo: number;
  retardos: number;
  faltas: number;
  permisos: number;
  porcentaje: number;
}

export interface SitioDia {
  id: string;
  nombre: string;
  supervisor: string;
  asignados: number;
  presentes: number;
  retardos: number;
  faltas: number;
  permisos: number;
}

export interface RegistroAsistencia {
  empleado: EmpleadoRef;
  /** "HH:MM" o "—" si no checó. */
  entrada: string;
  comida: string;
  regreso: string;
  salida: string;
  horas: number;
  estado: EstadoAsistencia;
  metodo: string;
}

export interface AsistenciaDia {
  corte: { dia: number; mes: string; hora: string };
  resumen: ResumenAsistencia;
  porSitio: { id: string; nombre: string; asignados: number; presentes: number }[];
  metodos: string[];
  /** Sitio del supervisor con su registro del día. */
  sitio: SitioDia;
  registros: RegistroAsistencia[];
  /** Incidencias del equipo en el mes, por día: r = retardo, f = falta, p = permiso. */
  calendario: Record<number, 'r' | 'f' | 'p'>;
}

export const ESTADO_ASISTENCIA_TONO: Record<EstadoAsistencia, string> = {
  'En obra': 't-ok',
  Retardo: 't-warn',
  Falta: 't-bad',
  Permiso: 't-mute',
};
