/** Acceso a datos de asistencias. Hoy resuelve con src/data/ (ver modulos/empleados/api.ts). */
import { asistenciaHoy, asistenciaPorSitio, horasTrabajadas, marcasCalendario, METODOS_ASISTENCIA, plazaAltariaHoy, registroPlazaAltaria } from '../../data/asistencias';
import { HOY } from '../../data/proyectos';
import { refEmpleado } from '../empleados/api';
import type { AsistenciaDia, RegistroAsistencia, ResumenAsistencia, SitioDia } from './tipos';

/** GET /api/asistencias/dia */
export async function obtenerAsistenciaDia(): Promise<AsistenciaDia> {
  return {
    corte: { dia: HOY.dia, mes: HOY.mes, hora: HOY.horaCorte },
    resumen: await resumenAsistenciaHoy(),
    porSitio: asistenciaPorSitio.map((s) => ({ ...s })),
    metodos: METODOS_ASISTENCIA,
    sitio: await sitioSupervisor(),
    registros: await registrosSitio(),
    calendario: marcasCalendario,
  };
}

/** GET /api/asistencias/resumen */
export async function resumenAsistenciaHoy(): Promise<ResumenAsistencia> {
  const a = asistenciaHoy;
  return { programados: a.programados, presentes: a.presentes, aTiempo: a.aTiempo, retardos: a.retardos, faltas: a.faltas, permisos: a.permisos, porcentaje: a.porcentaje };
}

/** GET /api/asistencias/sitio (el del supervisor en sesión). */
export async function sitioSupervisor(): Promise<SitioDia> {
  const s = plazaAltariaHoy;
  return { id: s.id, nombre: s.nombre, supervisor: 'J. Salas', asignados: s.asignados, presentes: s.presentes, retardos: s.retardos, faltas: s.faltas, permisos: s.permisos };
}

/** GET /api/asistencias/sitio/registros */
export async function registrosSitio(): Promise<RegistroAsistencia[]> {
  return registroPlazaAltaria.map((r) => ({
    empleado: refEmpleado(r.num),
    entrada: r.entrada, comida: r.comida, regreso: r.regreso, salida: r.salida,
    horas: horasTrabajadas(r), estado: r.estado, metodo: r.metodo,
  }));
}
