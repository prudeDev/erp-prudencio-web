/** Forma de los datos tal como los entregará /api/facturacion. */

export type EstatusFactura = 'Pagada' | 'Pendiente' | 'Vencida' | 'Borrador';

export interface Factura {
  folio: string;
  ini: string;
  cliente: string;
  proyecto: string;
  concepto: string;
  emision: string;
  vence: string;
  total: number;
  estatus: EstatusFactura;
}

/** Ejercicio en curso. Montos en millones; los borradores no cuentan como emitidas. */
export interface ResumenFacturacion {
  emitidas: number;
  pagadas: number;
  pendientes: number;
  vencidas: number;
  borradores: number;
  facturado: number;
  cobrado: number;
  porCobrar: number;
  vencido: number;
  totalPorCobrar: number;
  recuperacion: number;
  clientesVencidos: number;
}

export interface Facturacion {
  resumen: ResumenFacturacion;
  /** Más recientes. */
  facturas: Factura[];
}

export const ESTATUS_FACTURA_TONO: Record<EstatusFactura, string> = {
  Pagada: 't-ok',
  Pendiente: 't-warn',
  Vencida: 't-bad',
  Borrador: 't-mute',
};
