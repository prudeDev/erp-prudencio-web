/** Forma de los datos tal como los entregará /api/empleados. */

export type EstatusEmpleado = 'Activo' | 'Vacaciones' | 'Incapacidad';
export type Contrato = 'Planta' | 'Obra determinada';

export interface Empleado {
  num: string;
  ini: string;
  nombre: string;
  puesto: string;
  area: string;
  contrato: Contrato;
  asistencia30: number;
  estatus: EstatusEmpleado;
  /** clave: id de proyecto, "OC" (oficina central) o "MULTI". */
  asignacion: { clave: string; texto: string };
  supervisor: { num: string; nombre: string; corto: string } | null;
}

/** Datos mínimos de un empleado cuando aparece dentro de otro recurso (asistencia, nómina…). */
export interface EmpleadoRef {
  num: string;
  ini: string;
  nombre: string;
  corto: string;
  puesto: string;
}

export interface Plantilla {
  total: number;
  activos: number;
  vacaciones: number;
  incapacidades: number;
  planta: number;
  obraDeterminada: number;
  bajasMes: number;
  altasTrimestre: number;
  regresanSemana: number;
  incapacidadRiesgo: number;
  presentesHoy: number;
  porcentajeHoy: number;
}

export type EstadoDocumento = 'Vigente' | 'Por vencer' | 'Faltante';

export interface DetalleExpediente {
  contratacion: string;
  telefono: string;
  correo: string;
  asignacionDetalle: string;
  diasAsistidos: number;
  diasHabiles: number;
  faltas: number;
  retardos: number;
  vacacionesDisponibles: number;
  /** Últimas 12 semanas. */
  horasOrdinarias: number[];
  horasExtra: number[];
  importeHorasExtra: number;
  documentos: { nombre: string; meta: string; estado: EstadoDocumento }[];
  historial: { titulo: string; meta: string; actual: boolean }[];
}

export interface Expediente {
  empleado: Empleado;
  salarioMensual: number | null;
  /** null mientras el expediente no tenga historial cargado. */
  detalle: DetalleExpediente | null;
}

export const ESTATUS_TONO: Record<EstatusEmpleado, string> = {
  Activo: 't-ok',
  Vacaciones: 't-info',
  Incapacidad: 't-warn',
};

export const DOCUMENTO_TONO: Record<EstadoDocumento, string> = {
  Vigente: 't-ok',
  'Por vencer': 't-warn',
  Faltante: 't-bad',
};
