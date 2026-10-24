import { r1, suma } from '../lib/format';

/** Facturado y gastos del ejercicio 2026 por mes, en millones. */
export const meses = [
  { mes: 'Ene', facturado: 13.2, gastos: 10.4 },
  { mes: 'Feb', facturado: 14.8, gastos: 11.6 },
  { mes: 'Mar', facturado: 16.1, gastos: 12.5 },
  { mes: 'Abr', facturado: 15.4, gastos: 11.9 },
  { mes: 'May', facturado: 17.9, gastos: 13.6 },
  { mes: 'Jun', facturado: 18.6, gastos: 14.1 },
  { mes: 'Jul', facturado: 16.8, gastos: 13.2 },
  { mes: 'Ago', facturado: 19.7, gastos: 14.9 },
  { mes: 'Sep', facturado: 16.1, gastos: 11.6 },
];

export const facturado2026 = r1(suma(meses, (m) => m.facturado));
export const gastos2026 = r1(suma(meses, (m) => m.gastos));
export const rentabilidad = ((facturado2026 - gastos2026) / facturado2026) * 100;
export const META_RENTABILIDAD = 26;

export type EstatusFactura = 'Pagada' | 'Pendiente' | 'Vencida' | 'Borrador';

export const ESTATUS_FACTURA_TONO: Record<EstatusFactura, string> = {
  Pagada: 't-ok',
  Pendiente: 't-warn',
  Vencida: 't-bad',
  Borrador: 't-mute',
};

/** Resumen de cartera de facturas emitidas en 2026 (los borradores no cuentan como emitidas). */
const porCobrar = 22.5; // vigente
const vencido = 4.2;
export const resumenFacturas = {
  pagadas: 61,
  pendientes: 17,
  vencidas: 6,
  borradores: 4,
  get emitidas(): number { return this.pagadas + this.pendientes + this.vencidas; },
  facturado: facturado2026,
  porCobrar,
  vencido,
  cobrado: r1(facturado2026 - porCobrar - vencido),
  clientesVencidos: 3,
  get recuperacion(): number { return Math.round((this.cobrado / this.facturado) * 100); },
  get totalPorCobrar(): number { return r1(this.porCobrar + this.vencido); },
};

export interface Factura {
  folio: string;
  ini: string;
  cliente: string;
  proyecto: string;
  concepto: string;
  emision: string;
  vence: string;
  diaVence?: number; // día de septiembre, para "por vencer"
  total: number;
  estatus: EstatusFactura;
}

/** Facturas más recientes. */
export const facturas: Factura[] = [
  { folio: 'F-2841', ini: 'AR', cliente: 'Andamar Retail', proyecto: 'Adecuación Local 118', concepto: 'Estimación 2 · acabados', emision: '02 sep', vence: '18 sep', diaVence: 18, total: 412300, estatus: 'Pendiente' },
  { folio: 'F-2836', ini: 'GS', cliente: 'Grupo Inmobiliario Sur', proyecto: 'Centro Comercial Vía Sur', concepto: 'Estimación 4 · obra civil', emision: '30 ago', vence: '20 sep', diaVence: 20, total: 1284000, estatus: 'Pendiente' },
  { folio: 'F-2829', ini: 'BN', cliente: 'Banorte', proyecto: 'Sucursal Banorte Polanco', concepto: 'Estimación 3 · adecuación', emision: '24 ago', vence: '22 sep', diaVence: 22, total: 268750, estatus: 'Pendiente' },
  { folio: 'F-2812', ini: 'AL', cliente: 'Altaria SA de CV', proyecto: 'Plaza Altaria', concepto: 'Estimación 7 · acabados', emision: '05 sep', vence: '23 sep', diaVence: 23, total: 2105400, estatus: 'Pendiente' },
  { folio: 'F-2805', ini: 'MS', cliente: 'MediSur', proyecto: 'Clínica MediSur', concepto: 'Estimación 2 · estructura', emision: '01 sep', vence: '01 oct', total: 1146000, estatus: 'Pendiente' },
  { folio: 'F-2798', ini: 'IB', cliente: 'Industrial Bajío', proyecto: 'Mantenimiento Parque Qro', concepto: 'Servicio mensual agosto', emision: '05 ago', vence: '04 sep', total: 186400, estatus: 'Vencida' },
  { folio: 'F-2793', ini: 'GS', cliente: 'Grupo Inmobiliario Sur', proyecto: 'Centro Comercial Vía Sur', concepto: 'Estimación 3 · obra civil', emision: '28 jul', vence: '27 ago', total: 1960000, estatus: 'Vencida' },
  { folio: 'F-2790', ini: 'DR', cliente: 'Desarrollos Reforma', proyecto: 'Corporativo Reforma 212', concepto: 'Estimación 9 · estructura', emision: '01 ago', vence: '31 ago', total: 3420900, estatus: 'Pagada' },
  { folio: 'F-2784', ini: 'KV', cliente: 'Kavak', proyecto: 'Interiorismo Oficinas Kavak Sur', concepto: 'Anticipo 30%', emision: '28 jul', vence: '27 ago', total: 1080000, estatus: 'Pagada' },
  { folio: 'F-2771', ini: 'GL', cliente: 'Grupo Lomas', proyecto: 'Torre Lomas', concepto: 'Estimación 3 · cimentación', emision: '20 jul', vence: '19 ago', total: 4760500, estatus: 'Pagada' },
  { folio: '—', ini: 'LU', cliente: 'Grupo Lumen', proyecto: 'Hotel Lumen — Remodelación', concepto: 'Anticipo 12% · cotización aprobada', emision: '—', vence: '—', total: 1340000, estatus: 'Borrador' },
];

/** Facturas pendientes que vencen en los próximos 7 días (16–23 sep). */
export const porVencer7Dias = facturas.filter((f) => f.estatus === 'Pendiente' && f.diaVence !== undefined && f.diaVence <= 23);
