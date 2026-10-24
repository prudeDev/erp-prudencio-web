import { suma } from '../lib/format';

export type EstadoAsistencia = 'En obra' | 'Retardo' | 'Falta' | 'Permiso';

export const ESTADO_ASISTENCIA_TONO: Record<EstadoAsistencia, string> = {
  'En obra': 't-ok',
  Retardo: 't-warn',
  Falta: 't-bad',
  Permiso: 't-mute',
};

/** Personal programado y presente hoy por centro de trabajo (solo empleados activos). */
export const asistenciaPorSitio = [
  { id: 'PA', nombre: 'Plaza Altaria', asignados: 42, presentes: 38 },
  { id: 'RF', nombre: 'Corporativo Reforma 212', asignados: 31, presentes: 29 },
  { id: 'TL', nombre: 'Torre Lomas', asignados: 28, presentes: 25 },
  { id: 'KN', nombre: 'Nave Industrial Kronos', asignados: 18, presentes: 17 },
  { id: 'RG', nombre: 'Residencial Los Robles E2', asignados: 16, presentes: 15 },
  { id: 'VS', nombre: 'Centro Comercial Vía Sur', asignados: 11, presentes: 8 },
  { id: 'CM', nombre: 'Clínica MediSur', asignados: 10, presentes: 9 },
  { id: 'OC', nombre: 'Oficina central', asignados: 10, presentes: 10 },
  { id: 'BP', nombre: 'Sucursal Banorte Polanco', asignados: 6, presentes: 6 },
  { id: 'OS', nombre: 'Oficinas Santander', asignados: 5, presentes: 5 },
  { id: 'EC', nombre: 'Escuela Cumbres', asignados: 5, presentes: 4 },
  { id: 'HA', nombre: 'Hospital Ángeles', asignados: 4, presentes: 4 },
  { id: 'QR', nombre: 'Mantenimiento Qro', asignados: 4, presentes: 3 },
  { id: 'AN', nombre: 'Local 118 Andamar', asignados: 4, presentes: 4 },
  { id: 'FS', nombre: 'Farmacias del Sol', asignados: 3, presentes: 3 },
];

const programados = suma(asistenciaPorSitio, (s) => s.asignados);
const presentes = suma(asistenciaPorSitio, (s) => s.presentes);
const retardos = 8;
const faltas = 9;

/** Resumen global del día. presentes = a tiempo + retardos; programados = presentes + faltas + permisos. */
export const asistenciaHoy = {
  programados,
  presentes,
  retardos,
  aTiempo: presentes - retardos,
  faltas,
  permisos: programados - presentes - faltas,
  get porcentaje(): number { return Math.round((this.presentes / this.programados) * 100); },
};

export const sitio = (id: string) => asistenciaPorSitio.find((s) => s.id === id)!;

/** Desglose de Plaza Altaria hoy. */
export const plazaAltariaHoy = { ...sitio('PA'), retardos: 3, faltas: 2, get permisos(): number { return this.asignados - this.presentes - this.faltas; } };

/** Muestra del registro del día en Plaza Altaria (corte 18:10). */
export const registroPlazaAltaria: {
  num: string; entrada: string; comida: string; regreso: string; salida: string; estado: EstadoAsistencia; metodo: string;
}[] = [
  { num: '0298', entrada: '06:49', comida: '12:45', regreso: '13:45', salida: '16:00', estado: 'En obra', metodo: 'QR' },
  { num: '0433', entrada: '06:55', comida: '13:00', regreso: '13:58', salida: '16:05', estado: 'En obra', metodo: 'QR' },
  { num: '0417', entrada: '06:58', comida: '13:00', regreso: '14:00', salida: '16:10', estado: 'En obra', metodo: 'QR' },
  { num: '0604', entrada: '07:02', comida: '13:00', regreso: '14:02', salida: '16:00', estado: 'En obra', metodo: 'No. empleado' },
  { num: '0471', entrada: '07:05', comida: '13:00', regreso: '14:00', salida: '16:00', estado: 'En obra', metodo: 'App móvil' },
  { num: '0512', entrada: '07:34', comida: '13:10', regreso: '14:05', salida: '16:00', estado: 'Retardo', metodo: 'QR' },
  { num: '0486', entrada: '07:40', comida: '13:05', regreso: '14:10', salida: '16:00', estado: 'Retardo', metodo: 'Geolocalización' },
  { num: '0455', entrada: '—', comida: '—', regreso: '—', salida: '—', estado: 'Falta', metodo: '—' },
  { num: '0522', entrada: '—', comida: '—', regreso: '—', salida: '—', estado: 'Permiso', metodo: '—' },
];

const minutos = (h: string) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };

/** Horas efectivas: (comida − entrada) + (salida − regreso). */
export const horasTrabajadas = (r: { entrada: string; comida: string; regreso: string; salida: string }) =>
  r.entrada === '—' ? 0 : (minutos(r.comida) - minutos(r.entrada) + minutos(r.salida) - minutos(r.regreso)) / 60;

/** Calendario de septiembre de Plaza Altaria: días con incidencias de asistencia del equipo. */
export const marcasCalendario: Record<number, 'r' | 'f' | 'p'> = { 4: 'r', 9: 'f', 11: 'p', 15: 'r' };

export const METODOS_ASISTENCIA = ['Código QR', 'App móvil', 'Geolocalización', 'No. empleado'];
