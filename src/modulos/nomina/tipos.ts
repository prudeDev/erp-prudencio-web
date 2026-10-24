/** Forma de los datos tal como los entregará /api/nomina. */
import type { EmpleadoRef } from '../empleados/tipos';

export interface LineaNomina {
  empleado: EmpleadoRef;
  /** Salario devengado en el periodo. */
  base: number;
  dias: number;
  horasExtra: number;
  importeExtra: number;
  bonos: number;
  /** Importes con centavos. */
  deducciones: { concepto: string; importe: number }[];
  totalDeducciones: number;
  neto: number;
}

export interface PeriodoNomina {
  periodo: { numero: number; texto: string; dias: number; estado: string };
  /** Totales del periodo completo (toda la plantilla). */
  totales: {
    empleados: number;
    planta: number;
    obraDeterminada: number;
    base: number;
    horasExtra: number;
    horasExtraHoras: number;
    bonos: number;
    deducciones: number;
    neto: number;
    incidenciasPorRevisar: number;
  };
  /** Muestra de líneas (cuadrilla de Plaza Altaria). */
  lineas: LineaNomina[];
}
