/** Acceso a datos de nómina. Hoy resuelve con src/data/ (ver modulos/empleados/api.ts). */
import { plantilla } from '../../data/empleados';
import { lineasNomina, netoLinea, periodo, totalDeducciones, totalesPeriodo } from '../../data/nomina';
import { refEmpleado } from '../empleados/api';
import type { PeriodoNomina } from './tipos';

/** GET /api/nomina/periodos/actual */
export async function obtenerPeriodoActual(): Promise<PeriodoNomina> {
  return {
    periodo: { ...periodo },
    totales: { ...totalesPeriodo, planta: plantilla.planta, obraDeterminada: plantilla.obraDeterminada },
    lineas: lineasNomina.map((l) => ({
      empleado: refEmpleado(l.num),
      base: l.base, dias: l.dias, horasExtra: l.horasExtra, importeExtra: l.importeExtra, bonos: l.bonos,
      deducciones: l.deducciones.map((d) => ({ ...d })),
      totalDeducciones: totalDeducciones(l),
      neto: netoLinea(l),
    })),
  };
}
