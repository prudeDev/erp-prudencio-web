/** Acceso a datos de la bitácora de obra. Hoy resuelve con src/data/ (ver modulos/empleados/api.ts). */
import { plazaAltariaHoy } from '../../data/asistencias';
import { actividadesHoy, bitacoraHoy, fotosHoy, ICONOS, incidencias, lineaTiempo } from '../../data/obra';
import { HOY, proyecto } from '../../data/proyectos';
import type { BitacoraDia, EstadoActividad, TipoEvento } from './tipos';

/** GET /api/bitacora/{proyecto}/dia */
export async function obtenerBitacoraDia(): Promise<BitacoraDia> {
  const B = bitacoraHoy;
  const p = proyecto(B.proyecto);
  const tipoDe = (icono: string) => (Object.keys(ICONOS) as TipoEvento[]).find((k) => ICONOS[k] === icono)!;
  return {
    proyecto: { id: p.id, nombre: p.nombre, avance: p.avance },
    dia: HOY.dia,
    supervisor: B.supervisor,
    horario: B.horario,
    clima: B.clima,
    personal: { presentes: plazaAltariaHoy.presentes, asignados: plazaAltariaHoy.asignados },
    partidasMaterial: B.partidasMaterial,
    incidenciasAbiertas: incidencias.filter((i) => i.proyecto === B.proyecto && i.abierta).length,
    actividades: actividadesHoy.map((a) => ({ titulo: a.titulo, meta: a.meta, estado: a.estado as EstadoActividad })),
    fotos: fotosHoy,
    observaciones: B.observaciones,
    lineaTiempo: lineaTiempo.map((e) => ({ fecha: e.fecha, titulo: e.titulo, meta: e.meta, tipo: tipoDe(e.icono), oscuro: e.oscuro })),
  };
}
