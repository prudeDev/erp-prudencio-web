/**
 * Datos de ejemplo de empleados. El módulo src/modulos/empleados los lee solo a través de su
 * api.ts; las vistas aún no migradas (dashboard, asistencias, nómina…) siguen usando
 * `empleado(num)` directamente.
 */
import type { Contrato, EstatusEmpleado } from '../modulos/empleados/tipos';

export interface EmpleadoEjemplo {
  num: string;
  ini: string;
  nombre: string;
  corto: string; // "J. Salas"
  puesto: string;
  area: string;
  asignacion: string; // id de proyecto u "OC" (oficina central) / "MULTI"
  supervisor: string; // número de empleado ('' si no aplica)
  contrato: Contrato;
  asistencia30: number;
  estatus: EstatusEmpleado;
}

/** Totales de plantilla. La lista de abajo es solo una muestra. */
export const plantilla = {
  activos: 197,
  vacaciones: 11,
  incapacidades: 6,
  get total(): number { return this.activos + this.vacaciones + this.incapacidades; },
  planta: 118,
  get obraDeterminada(): number { return this.total - this.planta; },
  bajasMes: 4,
  altasTrimestre: 12,
  regresanSemana: 3,
  incapacidadRiesgo: 2,
};

export const empleados: EmpleadoEjemplo[] = [
  { num: '0001', ini: 'RP', nombre: 'Ramiro Prudencio Garza', corto: 'R. Prudencio', puesto: 'Director general', area: 'Dirección', asignacion: 'OC', supervisor: '', contrato: 'Planta', asistencia30: 100, estatus: 'Activo' },
  { num: '0032', ini: 'AM', nombre: 'Ana Mendoza Cárdenas', corto: 'A. Mendoza', puesto: 'Directora de proyectos', area: 'Dirección', asignacion: 'MULTI', supervisor: '0001', contrato: 'Planta', asistencia30: 100, estatus: 'Activo' },
  { num: '0148', ini: 'JS', nombre: 'Julián Salas Bermúdez', corto: 'J. Salas', puesto: 'Supervisor de obra', area: 'Operación', asignacion: 'PA', supervisor: '0032', contrato: 'Planta', asistencia30: 98, estatus: 'Activo' },
  { num: '0091', ini: 'LF', nombre: 'Luis Ferreira Ortega', corto: 'L. Ferreira', puesto: 'Supervisor de obra', area: 'Operación', asignacion: 'TL', supervisor: '0032', contrato: 'Planta', asistencia30: 94, estatus: 'Activo' },
  { num: '0177', ini: 'EV', nombre: 'Ernesto Vidal Rangel', corto: 'E. Vidal', puesto: 'Supervisor de obra', area: 'Operación', asignacion: 'KN', supervisor: '0032', contrato: 'Planta', asistencia30: 97, estatus: 'Activo' },
  { num: '0204', ini: 'TG', nombre: 'Teresa Gallardo Mier', corto: 'T. Gallardo', puesto: 'Supervisora de obra', area: 'Operación', asignacion: 'CM', supervisor: '0032', contrato: 'Planta', asistencia30: 95, estatus: 'Activo' },
  { num: '0155', ini: 'MR', nombre: 'Mariana Ruiz Estrada', corto: 'M. Ruiz', puesto: 'Coordinadora de interiorismo', area: 'Diseño', asignacion: 'OS', supervisor: '0032', contrato: 'Planta', asistencia30: 96, estatus: 'Activo' },
  { num: '0208', ini: 'SP', nombre: 'Sandra Peña Villalobos', corto: 'S. Peña', puesto: 'Contadora general', area: 'Contabilidad', asignacion: 'OC', supervisor: '0001', contrato: 'Planta', asistencia30: 99, estatus: 'Activo' },
  { num: '0263', ini: 'RD', nombre: 'Rocío Domínguez Lara', corto: 'R. Domínguez', puesto: 'Coordinadora de RRHH', area: 'Recursos Humanos', asignacion: 'OC', supervisor: '0001', contrato: 'Planta', asistencia30: 97, estatus: 'Vacaciones' },
  { num: '0298', ini: 'NL', nombre: 'Norma Lizárraga Cruz', corto: 'N. Lizárraga', puesto: 'Almacenista', area: 'Almacén', asignacion: 'PA', supervisor: '0148', contrato: 'Planta', asistencia30: 100, estatus: 'Activo' },
  { num: '0417', ini: 'MA', nombre: 'Marco Antonio Ruelas', corto: 'M. Ruelas', puesto: 'Maestro albañil', area: 'Construcción', asignacion: 'PA', supervisor: '0148', contrato: 'Obra determinada', asistencia30: 96, estatus: 'Activo' },
  { num: '0433', ini: 'CZ', nombre: 'Carlos Zamudio Pérez', corto: 'C. Zamudio', puesto: 'Carpintero', area: 'Construcción', asignacion: 'PA', supervisor: '0148', contrato: 'Obra determinada', asistencia30: 95, estatus: 'Activo' },
  { num: '0455', ini: 'ÓV', nombre: 'Óscar Villanueva Mata', corto: 'Ó. Villanueva', puesto: 'Soldador', area: 'Construcción', asignacion: 'PA', supervisor: '0148', contrato: 'Obra determinada', asistencia30: 80, estatus: 'Activo' },
  { num: '0471', ini: 'DE', nombre: 'Daniel Espinoza Rojas', corto: 'D. Espinoza', puesto: 'Yesero', area: 'Construcción', asignacion: 'PA', supervisor: '0148', contrato: 'Obra determinada', asistencia30: 93, estatus: 'Activo' },
  { num: '0486', ini: 'RB', nombre: 'Ricardo Buendía Flores', corto: 'R. Buendía', puesto: 'Pintor', area: 'Construcción', asignacion: 'PA', supervisor: '0148', contrato: 'Obra determinada', asistencia30: 84, estatus: 'Activo' },
  { num: '0512', ini: 'HI', nombre: 'Héctor Ibarra Nava', corto: 'H. Ibarra', puesto: 'Electricista', area: 'Instalaciones', asignacion: 'PA', supervisor: '0148', contrato: 'Obra determinada', asistencia30: 86, estatus: 'Activo' },
  { num: '0522', ini: 'PS', nombre: 'Paola Serrano Ibáñez', corto: 'P. Serrano', puesto: 'Auxiliar de obra', area: 'Construcción', asignacion: 'PA', supervisor: '0148', contrato: 'Obra determinada', asistencia30: 90, estatus: 'Activo' },
  { num: '0604', ini: 'IQ', nombre: 'Iván Quintero Sosa', corto: 'I. Quintero', puesto: 'Ayudante general', area: 'Construcción', asignacion: 'PA', supervisor: '0148', contrato: 'Obra determinada', asistencia30: 91, estatus: 'Activo' },
  { num: '0389', ini: 'GP', nombre: 'Gerardo Ponce Aguilar', corto: 'G. Ponce', puesto: 'Plomero', area: 'Instalaciones', asignacion: 'VS', supervisor: '0032', contrato: 'Obra determinada', asistencia30: 78, estatus: 'Incapacidad' },
];

export const empleado = (num: string) => empleados.find((e) => e.num === num)!;
