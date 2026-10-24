/** Contadores de la barra lateral. Hoy resuelve con src/data/ (ver modulos/empleados/api.ts). */
import { resumenFacturas } from '../../data/finanzas';
import { incidenciasAbiertas } from '../../data/obra';
import type { ContadoresMenu } from './tipos';

/** GET /api/notificaciones/contadores */
export async function obtenerContadores(): Promise<ContadoresMenu> {
  return {
    facturasVencidas: resumenFacturas.vencidas,
    incidenciasAbiertas: incidenciasAbiertas.length,
    notificaciones: 12,
  };
}
