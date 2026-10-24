/** Forma de los datos tal como los entregará /api/dashboard. */
import type { ResumenAsistencia } from '../asistencias/tipos';
import type { ResumenFacturacion } from '../facturacion/tipos';

export interface Dashboard {
  fechaTexto: string;
  /** Cartera vigente, en millones. */
  cartera: { obras: number; contratado: number; ejercido: number; comprometido: number; disponible: number; porEjercer: number };
  enEjecucion: number;
  terminados: number;
  porIniciar: number;
  retrasadas: number;
  /** % acumulado del ejercicio y meta anual. */
  rentabilidad: { valor: number; meta: number };
  asistencia: ResumenAsistencia;
  facturas: Pick<ResumenFacturacion, 'pendientes' | 'vencidas' | 'pagadas' | 'totalPorCobrar'>;
  /** Facturado y gastos por mes del ejercicio, en millones. */
  meses: { mes: string; facturado: number; gastos: number }[];
  /** Mayores contratos en ejecución. */
  avance: { id: string; nombre: string; avance: number; retrasado: boolean }[];
  incidencias: { folio: string; titulo: string; proyecto: string; cuando: string; quien: string; prioridad: 'Alta' | 'Media' | 'Baja'; abierta: boolean }[];
  retrasados: { id: string; nombre: string; cliente: string; responsable: string; diasRetraso: number }[];
  /** Pendientes que vencen en los próximos 7 días. */
  porVencer: { folio: string; cliente: string; proyecto: string; dia: number; total: number }[];
}
