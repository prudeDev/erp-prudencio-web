/**
 * Acceso a datos del módulo de empleados.
 *
 * Mientras no existan los endpoints, cada función resuelve con los datos de ejemplo de
 * src/data/ ya convertidos a la forma de la API. Al conectar el backend solo cambia el
 * cuerpo de cada función por la llamada indicada (p. ej. `api<Empleado[]>('/api/empleados')`);
 * las vistas y los hooks no se tocan.
 */
import { ApiError } from '../../lib/api';
import { empleado as empleadoEjemplo, empleados as EJEMPLO, plantilla as PLANTILLA, type EmpleadoEjemplo } from '../../data/empleados';
import { asistenciaHoy } from '../../data/asistencias';
import { lineasNomina } from '../../data/nomina';
import { proyecto } from '../../data/proyectos';
import type { DetalleExpediente, Empleado, EmpleadoRef, Expediente, Plantilla } from './tipos';

/** GET /api/empleados */
export async function listarEmpleados(): Promise<Empleado[]> {
  return EJEMPLO.map(aEmpleado);
}

/** GET /api/empleados/resumen */
export async function resumenPlantilla(): Promise<Plantilla> {
  const p = PLANTILLA;
  return {
    total: p.total, activos: p.activos, vacaciones: p.vacaciones, incapacidades: p.incapacidades,
    planta: p.planta, obraDeterminada: p.obraDeterminada, bajasMes: p.bajasMes, altasTrimestre: p.altasTrimestre,
    regresanSemana: p.regresanSemana, incapacidadRiesgo: p.incapacidadRiesgo,
    presentesHoy: asistenciaHoy.presentes, porcentajeHoy: asistenciaHoy.porcentaje,
  };
}

/** GET /api/empleados/{num}/expediente */
export async function obtenerExpediente(num: string): Promise<Expediente> {
  const e = EJEMPLO.find((x) => x.num === num);
  if (!e) throw new ApiError(404, 'NO_ENCONTRADO', 'Empleado no encontrado.');
  const linea = lineasNomina.find((l) => l.num === num);
  return {
    empleado: aEmpleado(e),
    salarioMensual: linea ? Math.round((linea.base / linea.dias) * 15 / 50) * 50 * 2 : null,
    detalle: num === '0148' ? detalleSalas() : null,
  };
}

// --- Datos de ejemplo -------------------------------------------------------------------

/** Para las api.ts de otros módulos: así llega un empleado anidado en sus respuestas. */
export function refEmpleado(num: string): EmpleadoRef {
  const e = empleadoEjemplo(num);
  return { num: e.num, ini: e.ini, nombre: e.nombre, corto: e.corto, puesto: e.puesto };
}

function aEmpleado(e: EmpleadoEjemplo): Empleado {
  const sup = e.supervisor ? empleadoEjemplo(e.supervisor) : null;
  return {
    num: e.num, ini: e.ini, nombre: e.nombre, puesto: e.puesto, area: e.area,
    contrato: e.contrato, asistencia30: e.asistencia30, estatus: e.estatus,
    asignacion: {
      clave: e.asignacion,
      texto: e.asignacion === 'OC' ? 'Oficina central' : e.asignacion === 'MULTI' ? 'Multiproyecto' : proyecto(e.asignacion).corto,
    },
    supervisor: sup && { num: sup.num, nombre: sup.nombre, corto: sup.corto },
  };
}

/** Expediente detallado de ejemplo (solo J. Salas). */
function detalleSalas(): DetalleExpediente {
  const horasExtra = [4, 6, 8, 2, 5, 7, 6, 4, 8, 6, 7, 5];
  return {
    contratacion: '14 mar 2019',
    telefono: '442 118 4420',
    correo: 'jsalas@prudencio.mx',
    asignacionDetalle: 'Plaza Altaria · Local 118',
    diasAsistidos: 59,
    diasHabiles: 60,
    faltas: 1,
    retardos: 3,
    vacacionesDisponibles: 9,
    horasOrdinarias: [40, 40, 38, 40, 40, 40, 40, 38, 40, 40, 40, 40],
    horasExtra,
    importeHorasExtra: horasExtra.reduce((a, b) => a + b, 0) * 110,
    documentos: [
      { nombre: 'Contrato individual', meta: 'PDF · 1.2 MB · mar 2019', estado: 'Vigente' },
      { nombre: 'INE y CURP', meta: 'PDF · 640 KB', estado: 'Vigente' },
      { nombre: 'Alta IMSS', meta: 'PDF · 320 KB', estado: 'Vigente' },
      { nombre: 'DC-3 seguridad en obra', meta: 'PDF · 480 KB · vence oct 2026', estado: 'Por vencer' },
      { nombre: 'Examen médico anual', meta: 'Pendiente de carga', estado: 'Faltante' },
    ],
    historial: [
      { titulo: 'Plaza Altaria — Remodelación', meta: `Supervisor · ene 2026 – actual · avance ${proyecto('PA').avance}%`, actual: true },
      { titulo: 'Adecuación Local 118 — Andamar', meta: `Supervisor · ago 2026 – actual · avance ${proyecto('AN').avance}%`, actual: true },
      { titulo: 'Suc. Banorte Satélite', meta: 'Supervisor · sep 2025 – dic 2025 · entregada', actual: false },
      { titulo: 'Centro Comercial Vía Sur — Etapa 1', meta: 'Cabo de obra · feb 2025 – ago 2025 · entregada', actual: false },
      { titulo: 'Plaza Juriquilla — Locales', meta: 'Cabo de obra · mar 2024 – ene 2025 · entregada', actual: false },
    ],
  };
}
