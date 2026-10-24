/** Forma de los datos tal como los entregará /api/proyectos. */

export type EstadoProyecto = 'ejecucion' | 'retrasado' | 'por_iniciar' | 'planeacion';

export interface Responsable {
  num: string;
  ini: string;
  nombre: string;
}

export interface Proyecto {
  id: string;
  clave: string;
  nombre: string;
  cliente: string;
  fechas: string;
  tipo: string;
  ciudad: string;
  responsable: Responsable;
  avance: number;
  /** Montos en millones de pesos. */
  contrato: number;
  estado: EstadoProyecto;
  diasRetraso?: number;
}

export interface ProyectoTerminado {
  clave: string;
  nombre: string;
  cliente: string;
  fechas: string;
  tipo: string;
  ciudad: string;
  responsable: Responsable;
  contrato: number;
}

export interface Cartera {
  proyectos: Proyecto[];
  /** Millones de pesos contratados en la cartera vigente. */
  contratado: number;
  terminados: { total: number; recientes: ProyectoTerminado[] };
}

export const enEjecucion = (p: Proyecto) => p.estado === 'ejecucion' || p.estado === 'retrasado';
export const porArrancar = (p: Proyecto) => p.estado === 'por_iniciar' || p.estado === 'planeacion';

export const ESTADO_PROYECTO: Record<EstadoProyecto, { texto: string; tono: string }> = {
  ejecucion: { texto: 'En ejecución', tono: 't-ok' },
  retrasado: { texto: 'Retrasado', tono: 't-bad' },
  por_iniciar: { texto: 'Por iniciar', tono: 't-info' },
  planeacion: { texto: 'Planeación', tono: 't-mute' },
};
