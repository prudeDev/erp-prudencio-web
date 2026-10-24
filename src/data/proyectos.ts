import { r1, suma } from '../lib/format';

export type EstadoProyecto = 'ejecucion' | 'retrasado' | 'por_iniciar' | 'planeacion';

export interface Proyecto {
  id: string;
  clave: string;
  nombre: string;
  corto: string;
  cliente: string;
  fechas: string;
  tipo: string;
  ciudad: string;
  responsable: string; // número de empleado
  avance: number; // %
  /** Montos en millones de pesos */
  contrato: number;
  ejercido: number;
  comprometido: number;
  estado: EstadoProyecto;
  diasRetraso?: number;
}

/** Fecha "hoy" de todos los datos de ejemplo. */
export const HOY = { dia: 16, mes: 'sep', anio: 2026, texto: 'Miércoles 16 de septiembre', horaCorte: '18:10', horaCampo: '07:42' };

/** Cartera vigente: 14 en ejecución (3 de ellos retrasados) + 5 por iniciar / en planeación. */
export const proyectos: Proyecto[] = [
  { id: 'PA', clave: 'PA', nombre: 'Plaza Altaria — Remodelación', corto: 'Plaza Altaria', cliente: 'Altaria SA de CV', fechas: '12 ene – 30 nov', tipo: 'Remodelación', ciudad: 'Querétaro', responsable: '0148', avance: 78, contrato: 24.6, ejercido: 18.1, comprometido: 2.4, estado: 'ejecucion' },
  { id: 'RF', clave: 'RF', nombre: 'Corporativo Reforma 212', corto: 'Reforma 212', cliente: 'Desarrollos Reforma', fechas: '04 mar – 22 dic', tipo: 'Obra nueva', ciudad: 'CDMX', responsable: '0032', avance: 54, contrato: 38.2, ejercido: 19.6, comprometido: 6.8, estado: 'ejecucion' },
  { id: 'TL', clave: 'TL', nombre: 'Torre Lomas · Obra nueva', corto: 'Torre Lomas', cliente: 'Grupo Lomas', fechas: '18 may – 15 ago 27', tipo: 'Obra nueva', ciudad: 'CDMX', responsable: '0091', avance: 31, contrato: 41.5, ejercido: 12.4, comprometido: 7.9, estado: 'ejecucion' },
  { id: 'BP', clave: 'BP', nombre: 'Sucursal Banorte Polanco', corto: 'Banorte Polanco', cliente: 'Banorte', fechas: '01 jul – 30 sep', tipo: 'Adecuación', ciudad: 'CDMX', responsable: '0032', avance: 92, contrato: 4.8, ejercido: 4.1, comprometido: 0.3, estado: 'ejecucion' },
  { id: 'KN', clave: 'KN', nombre: 'Nave Industrial Kronos', corto: 'Nave Kronos', cliente: 'Logística Kronos', fechas: '15 abr – 15 dic', tipo: 'Obra nueva', ciudad: 'Querétaro', responsable: '0177', avance: 61, contrato: 16.9, ejercido: 9.8, comprometido: 2.6, estado: 'ejecucion' },
  { id: 'RG', clave: 'RG', nombre: 'Residencial Los Robles · Etapa 2', corto: 'Los Robles E2', cliente: 'Inmobiliaria Robles', fechas: '10 feb – 30 ene 27', tipo: 'Obra nueva', ciudad: 'Querétaro', responsable: '0177', avance: 66, contrato: 14.2, ejercido: 9.1, comprometido: 1.7, estado: 'ejecucion' },
  { id: 'CM', clave: 'CM', nombre: 'Clínica MediSur — Ampliación', corto: 'Clínica MediSur', cliente: 'MediSur', fechas: '03 jun – 20 dic', tipo: 'Ampliación', ciudad: 'Puebla', responsable: '0204', avance: 44, contrato: 9.7, ejercido: 4.1, comprometido: 1.8, estado: 'ejecucion' },
  { id: 'OS', clave: 'OS', nombre: 'Oficinas Santander Insurgentes', corto: 'Santander Insurgentes', cliente: 'Santander', fechas: '20 jul – 30 oct', tipo: 'Interiorismo', ciudad: 'CDMX', responsable: '0155', avance: 70, contrato: 3.9, ejercido: 2.6, comprometido: 0.5, estado: 'ejecucion' },
  { id: 'EC', clave: 'EC', nombre: 'Escuela Cumbres — Rehabilitación', corto: 'Escuela Cumbres', cliente: 'Colegio Cumbres', fechas: '01 jun – 15 nov', tipo: 'Rehabilitación', ciudad: 'Monterrey', responsable: '0204', avance: 58, contrato: 3.4, ejercido: 1.9, comprometido: 0.4, estado: 'ejecucion' },
  { id: 'HA', clave: 'HA', nombre: 'Hospital Ángeles · Urgencias', corto: 'Hospital Ángeles', cliente: 'Grupo Ángeles', fechas: '15 ago – 28 feb 27', tipo: 'Remodelación', ciudad: 'CDMX', responsable: '0091', avance: 12, contrato: 6.8, ejercido: 0.9, comprometido: 1.2, estado: 'ejecucion' },
  { id: 'FS', clave: 'FS', nombre: 'Farmacias del Sol · 4 sucursales', corto: 'Farmacias del Sol', cliente: 'Farmacias del Sol', fechas: '01 sep – 30 nov', tipo: 'Adecuación', ciudad: 'Guadalajara', responsable: '0155', avance: 9, contrato: 2.2, ejercido: 0.2, comprometido: 0.3, estado: 'ejecucion' },
  { id: 'VS', clave: 'VS', nombre: 'Centro Comercial Vía Sur', corto: 'Vía Sur', cliente: 'Grupo Inmobiliario Sur', fechas: '10 feb – 28 oct', tipo: 'Reconstrucción', ciudad: 'Puebla', responsable: '0032', avance: 46, contrato: 21.4, ejercido: 11.6, comprometido: 2.9, estado: 'retrasado', diasRetraso: 14 },
  { id: 'QR', clave: 'QR', nombre: 'Mantenimiento Parque Ind. Qro', corto: 'Mantenimiento Qro', cliente: 'Industrial Bajío', fechas: '01 sep – 31 dic', tipo: 'Mantenimiento', ciudad: 'Querétaro', responsable: '0091', avance: 18, contrato: 2.1, ejercido: 0.4, comprometido: 0.2, estado: 'retrasado', diasRetraso: 9 },
  { id: 'AN', clave: 'AN', nombre: 'Adecuación Local 118 — Andamar', corto: 'Local 118 Andamar', cliente: 'Andamar Retail', fechas: '22 ago – 14 oct', tipo: 'Adecuación', ciudad: 'Veracruz', responsable: '0148', avance: 63, contrato: 1.9, ejercido: 1.1, comprometido: 0.2, estado: 'retrasado', diasRetraso: 4 },
  { id: 'KV', clave: 'KV', nombre: 'Interiorismo Oficinas Kavak Sur', corto: 'Kavak Sur', cliente: 'Kavak', fechas: '05 oct – 20 dic', tipo: 'Interiorismo', ciudad: 'CDMX', responsable: '0155', avance: 0, contrato: 3.6, ejercido: 0, comprometido: 0.4, estado: 'por_iniciar' },
  { id: 'DV', clave: 'DV', nombre: 'Departamentos Del Valle 14', corto: 'Del Valle 14', cliente: 'Inmobiliaria Robles', fechas: '12 oct – 15 may 27', tipo: 'Obra nueva', ciudad: 'CDMX', responsable: '0032', avance: 0, contrato: 9.8, ejercido: 0, comprometido: 0.6, estado: 'por_iniciar' },
  { id: 'HL', clave: 'HL', nombre: 'Hotel Lumen — Remodelación', corto: 'Hotel Lumen', cliente: 'Grupo Lumen', fechas: '15 oct – 28 feb 27', tipo: 'Remodelación', ciudad: 'Monterrey', responsable: '0155', avance: 0, contrato: 11.2, ejercido: 0, comprometido: 0, estado: 'planeacion' },
  { id: 'BC', clave: 'BC', nombre: 'Bodega CEDIS Tultitlán', corto: 'CEDIS Tultitlán', cliente: 'Logística Kronos', fechas: '03 nov – 30 jun 27', tipo: 'Obra nueva', ciudad: 'Edo. Méx.', responsable: '0177', avance: 0, contrato: 18.5, ejercido: 0, comprometido: 0, estado: 'planeacion' },
  { id: 'LV', clave: 'LV', nombre: 'Locales Plaza Valle', corto: 'Plaza Valle', cliente: 'Andamar Retail', fechas: '01 dic – 31 mar 27', tipo: 'Adecuación', ciudad: 'Veracruz', responsable: '0148', avance: 0, contrato: 2.4, ejercido: 0, comprometido: 0, estado: 'planeacion' },
];

/** Proyectos entregados (histórico). Solo se listan los más recientes. */
export const TERMINADOS_TOTAL = 38;
export const terminadosRecientes = [
  { clave: 'BS', nombre: 'Suc. Banorte Satélite', cliente: 'Banorte', fechas: 'sep 25 – dic 25', tipo: 'Adecuación', ciudad: 'Edo. Méx.', responsable: '0148', contrato: 5.2 },
  { clave: 'V1', nombre: 'Centro Comercial Vía Sur — Etapa 1', cliente: 'Grupo Inmobiliario Sur', fechas: 'feb 25 – ago 25', tipo: 'Obra nueva', ciudad: 'Puebla', responsable: '0032', contrato: 17.8 },
  { clave: 'LP', nombre: 'Laboratorios Pisa — Oficinas', cliente: 'Laboratorios Pisa', fechas: 'ene 26 – jun 26', tipo: 'Interiorismo', ciudad: 'Guadalajara', responsable: '0155', contrato: 4.6 },
  { clave: 'BN', nombre: 'Bodega Norte Kronos', cliente: 'Logística Kronos', fechas: 'jun 25 – mar 26', tipo: 'Obra nueva', ciudad: 'Querétaro', responsable: '0177', contrato: 12.9 },
  { clave: 'CA', nombre: 'Colegio Americano — Laboratorios', cliente: 'Colegio Americano', fechas: 'may 26 – ago 26', tipo: 'Remodelación', ciudad: 'Monterrey', responsable: '0204', contrato: 2.7 },
  { clave: 'TS', nombre: 'Torre Sigma — Fachada', cliente: 'Grupo Sigma', fechas: 'oct 25 – jul 26', tipo: 'Rehabilitación', ciudad: 'CDMX', responsable: '0091', contrato: 8.3 },
];

export const proyecto = (id: string) => proyectos.find((p) => p.id === id)!;

export const enEjecucion = proyectos.filter((p) => p.estado === 'ejecucion' || p.estado === 'retrasado');
export const retrasados = proyectos.filter((p) => p.estado === 'retrasado');
export const porArrancar = proyectos.filter((p) => p.estado === 'por_iniciar' || p.estado === 'planeacion');

export const cartera = {
  total: proyectos.length,
  contratado: r1(suma(proyectos, (p) => p.contrato)),
  ejercido: r1(suma(proyectos, (p) => p.ejercido)),
  comprometido: r1(suma(proyectos, (p) => p.comprometido)),
};
export const carteraDisponible = r1(cartera.contratado - cartera.ejercido - cartera.comprometido);
export const carteraPorEjercer = r1(cartera.contratado - cartera.ejercido);

export const ESTADO_PROYECTO: Record<EstadoProyecto, { texto: string; tono: string }> = {
  ejecucion: { texto: 'En ejecución', tono: 't-ok' },
  retrasado: { texto: 'Retrasado', tono: 't-bad' },
  por_iniciar: { texto: 'Por iniciar', tono: 't-info' },
  planeacion: { texto: 'Planeación', tono: 't-mute' },
};
