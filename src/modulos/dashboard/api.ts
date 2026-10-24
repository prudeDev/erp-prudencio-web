/** Datos del dashboard ejecutivo. Hoy resuelve con src/data/ (ver modulos/empleados/api.ts). */
import { empleado } from '../../data/empleados';
import { META_RENTABILIDAD, meses, porVencer7Dias, rentabilidad } from '../../data/finanzas';
import { incidencias } from '../../data/obra';
import { cartera, carteraDisponible, carteraPorEjercer, enEjecucion, HOY, porArrancar, proyecto, proyectos, retrasados, TERMINADOS_TOTAL } from '../../data/proyectos';
import { resumenAsistenciaHoy } from '../asistencias/api';
import { resumenFacturacion } from '../facturacion/api';
import type { Dashboard } from './tipos';

/** GET /api/dashboard */
export async function obtenerDashboard(): Promise<Dashboard> {
  const [asistencia, f] = await Promise.all([resumenAsistenciaHoy(), resumenFacturacion()]);
  return {
    fechaTexto: HOY.texto,
    cartera: { obras: proyectos.length, ...cartera, disponible: carteraDisponible, porEjercer: carteraPorEjercer },
    enEjecucion: enEjecucion.length,
    terminados: TERMINADOS_TOTAL,
    porIniciar: porArrancar.length,
    retrasadas: retrasados.length,
    rentabilidad: { valor: rentabilidad, meta: META_RENTABILIDAD },
    asistencia,
    facturas: { pendientes: f.pendientes, vencidas: f.vencidas, pagadas: f.pagadas, totalPorCobrar: f.totalPorCobrar },
    meses: meses.map((m) => ({ ...m })),
    avance: [...enEjecucion].sort((a, b) => b.contrato - a.contrato).slice(0, 6)
      .map((p) => ({ id: p.id, nombre: p.nombre, avance: p.avance, retrasado: p.estado === 'retrasado' })),
    incidencias: incidencias.map((i) => ({ ...i, proyecto: proyecto(i.proyecto).corto })),
    retrasados: retrasados.map((p) => ({ id: p.id, nombre: p.nombre, cliente: p.cliente, responsable: empleado(p.responsable).corto, diasRetraso: p.diasRetraso ?? 0 })),
    porVencer: porVencer7Dias.map((r) => ({ folio: r.folio, cliente: r.cliente, proyecto: r.proyecto, dia: r.diaVence!, total: r.total })),
  };
}
