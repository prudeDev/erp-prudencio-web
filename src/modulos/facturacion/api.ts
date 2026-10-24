/** Acceso a datos de facturación. Hoy resuelve con src/data/ (ver modulos/empleados/api.ts). */
import { facturas, resumenFacturas } from '../../data/finanzas';
import type { Facturacion, ResumenFacturacion } from './tipos';

/** GET /api/facturacion */
export async function obtenerFacturacion(): Promise<Facturacion> {
  return {
    resumen: await resumenFacturacion(),
    facturas: facturas.map(({ diaVence: _, ...f }) => f),
  };
}

/** GET /api/facturacion/resumen */
export async function resumenFacturacion(): Promise<ResumenFacturacion> {
  const r = resumenFacturas;
  return {
    emitidas: r.emitidas, pagadas: r.pagadas, pendientes: r.pendientes, vencidas: r.vencidas, borradores: r.borradores,
    facturado: r.facturado, cobrado: r.cobrado, porCobrar: r.porCobrar, vencido: r.vencido, totalPorCobrar: r.totalPorCobrar,
    recuperacion: r.recuperacion, clientesVencidos: r.clientesVencidos,
  };
}
