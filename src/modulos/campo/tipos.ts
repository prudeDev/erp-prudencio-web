/** Forma de los datos tal como los entregará /api/campo. */
import type { RegistroAsistencia, SitioDia } from '../asistencias/tipos';
import type { EmpleadoRef } from '../empleados/tipos';

export interface JornadaCampo {
  fechaTexto: string;
  hora: string;
  supervisor: EmpleadoRef;
  obra: { corto: string; nombre: string; avance: number };
  sitio: SitioDia;
  registros: RegistroAsistencia[];
}
