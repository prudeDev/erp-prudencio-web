/** Acceso a datos de proyectos. Hoy resuelve con src/data/ (ver modulos/empleados/api.ts). */
import { empleado } from '../../data/empleados';
import { cartera, proyectos, TERMINADOS_TOTAL, terminadosRecientes } from '../../data/proyectos';
import type { Cartera, Responsable } from './tipos';

/** GET /api/proyectos/cartera */
export async function obtenerCartera(): Promise<Cartera> {
  return {
    proyectos: proyectos.map((p) => ({
      id: p.id, clave: p.clave, nombre: p.nombre, cliente: p.cliente, fechas: p.fechas, tipo: p.tipo, ciudad: p.ciudad,
      responsable: responsable(p.responsable), avance: p.avance, contrato: p.contrato, estado: p.estado, diasRetraso: p.diasRetraso,
    })),
    contratado: cartera.contratado,
    terminados: {
      total: TERMINADOS_TOTAL,
      recientes: terminadosRecientes.map((t) => ({ ...t, responsable: responsable(t.responsable) })),
    },
  };
}

function responsable(num: string): Responsable {
  const e = empleado(num);
  return { num: e.num, ini: e.ini, nombre: e.nombre };
}
