/**
 * Datos de las vistas de campo del supervisor (tablet y móvil). Reúne su obra, su
 * cuadrilla y el registro del día; hoy resuelve con src/data/ (ver modulos/empleados/api.ts).
 */
import { HOY, proyecto } from '../../data/proyectos';
import { registrosSitio, sitioSupervisor } from '../asistencias/api';
import { refEmpleado } from '../empleados/api';
import type { JornadaCampo } from './tipos';

/** GET /api/campo/jornada (la del supervisor en sesión). */
export async function obtenerJornada(): Promise<JornadaCampo> {
  const p = proyecto('PA');
  return {
    fechaTexto: HOY.texto,
    hora: HOY.horaCampo,
    supervisor: refEmpleado('0148'),
    obra: { corto: p.corto, nombre: p.nombre, avance: p.avance },
    sitio: await sitioSupervisor(),
    registros: await registrosSitio(),
  };
}
