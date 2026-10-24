/** Forma de los datos tal como los entregará /api/evidencias. */

export interface Evidencias {
  proyecto: string;
  totalFotos: number;
  etapas: string[];
  comparativa: { lugar: string; descripcion: string; antes: string; despues: string };
  galeria: { titulo: string; meta: string; etapa: string }[];
}
