import { suma } from '../lib/format';
import { plantilla } from './empleados';

export const periodo = { numero: 17, texto: '1–15 sep 2026', dias: 15, estado: 'En revisión' };

export interface LineaNomina {
  num: string;
  base: number; // salario devengado en el periodo
  dias: number;
  horasExtra: number;
  importeExtra: number;
  bonos: number;
  /** Deducciones con centavos */
  deducciones: { concepto: string; importe: number }[];
}

const isrImss = (isr: number, imss: number) => [
  { concepto: 'ISR retenido', importe: isr },
  { concepto: 'IMSS', importe: imss },
];

/** Muestra de la nómina del periodo (cuadrilla de Plaza Altaria). */
export const lineasNomina: LineaNomina[] = [
  { num: '0148', base: 14300, dias: 15, horasExtra: 11, importeExtra: 1210, bonos: 800, deducciones: [{ concepto: 'Retardos (3)', importe: 180 }, ...isrImss(1344, 420.6), { concepto: 'Préstamo personal 4/12', importe: 79 }] },
  { num: '0417', base: 9750, dias: 15, horasExtra: 20, importeExtra: 1640, bonos: 500, deducciones: isrImss(858.4, 323.6) },
  { num: '0512', base: 8900, dias: 15, horasExtra: 13, importeExtra: 980, bonos: 0, deducciones: [{ concepto: 'Retardos (2)', importe: 120 }, ...isrImss(892.2, 299.8)] },
  { num: '0433', base: 8400, dias: 15, horasExtra: 10, importeExtra: 720, bonos: 300, deducciones: isrImss(701.5, 282.5) },
  { num: '0298', base: 7600, dias: 15, horasExtra: 0, importeExtra: 0, bonos: 400, deducciones: isrImss(606.3, 255.7) },
  { num: '0455', base: 7975, dias: 13, horasExtra: 6, importeExtra: 440, bonos: 0, deducciones: [{ concepto: 'Préstamo personal 7/10', importe: 1200 }, ...isrImss(677.3, 268.7)] },
  { num: '0471', base: 8100, dias: 15, horasExtra: 14, importeExtra: 1080, bonos: 250, deducciones: isrImss(732.6, 271.4) },
  { num: '0604', base: 6450, dias: 15, horasExtra: 13, importeExtra: 860, bonos: 0, deducciones: isrImss(525.1, 216.9) },
  { num: '0486', base: 7900, dias: 15, horasExtra: 7, importeExtra: 520, bonos: 0, deducciones: [{ concepto: 'Retardos (2)', importe: 120 }, ...isrImss(782.8, 265.2)] },
  { num: '0522', base: 6440, dias: 14, horasExtra: 0, importeExtra: 0, bonos: 200, deducciones: isrImss(505.6, 216.4) },
];

export const totalDeducciones = (l: LineaNomina) => suma(l.deducciones, (d) => d.importe);
export const netoLinea = (l: LineaNomina) => l.base + l.importeExtra + l.bonos - totalDeducciones(l);

/** Totales del periodo completo (toda la plantilla). */
const base = 3350200;
const horasExtra = 184920;
const bonos = 96400;
const deducciones = 212870;
export const totalesPeriodo = {
  empleados: plantilla.total,
  base,
  horasExtra,
  horasExtraHoras: 1284,
  bonos,
  deducciones,
  neto: base + horasExtra + bonos - deducciones,
  incidenciasPorRevisar: 7,
};
