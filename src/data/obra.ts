/** Incidencias, bitácora y evidencias. */

export type Prioridad = 'Alta' | 'Media' | 'Baja';

export interface Incidencia {
  folio: string;
  titulo: string;
  proyecto: string; // id
  cuando: string;
  quien: string;
  prioridad: Prioridad;
  abierta: boolean;
}

export const incidencias: Incidencia[] = [
  { folio: 'INC-0412', titulo: 'Falta de cemento CPC-30R en frente 2', proyecto: 'PA', cuando: 'hoy 10:05', quien: 'J. Salas', prioridad: 'Alta', abierta: true },
  { folio: 'INC-0411', titulo: 'Retraso de proveedor en cancelería', proyecto: 'VS', cuando: 'hoy 08:40', quien: 'A. Mendoza', prioridad: 'Alta', abierta: true },
  { folio: 'INC-0409', titulo: 'Daño menor en piso terminado nivel 3', proyecto: 'RF', cuando: 'ayer', quien: 'A. Mendoza', prioridad: 'Media', abierta: true },
  { folio: 'INC-0408', titulo: 'Accidente leve — corte en mano', proyecto: 'TL', cuando: 'ayer', quien: 'Seguridad', prioridad: 'Media', abierta: false },
];

export const incidenciasAbiertas = incidencias.filter((i) => i.abierta);

/* ---------- Bitácora de Plaza Altaria · 16 sep ---------- */

export const bitacoraHoy = {
  proyecto: 'PA',
  supervisor: 'Julián Salas',
  horario: '07:15 – 18:00',
  clima: 'despejado, 27 °C',
  avanceAnterior: 76,
  partidasMaterial: 14,
  fotos: 4,
  observaciones:
    'Se detuvo el colado del frente 2 durante 40 min por falta de cemento CPC-30R; se completó con material de reserva y se reprogramó con el proveedor la entrega para mañana 06:30. Personal de la cuadrilla B reubicado a habilitado de acero. Se levantó la incidencia INC-0412.',
};

export const actividadesHoy = [
  { titulo: 'Colado de losa — frente 2, nivel 3', meta: 'Cuadrilla A · 12 personas · 06:00–13:00', estado: 'Terminada', tono: 't-ok', oscuro: true },
  { titulo: 'Habilitado de acero — zona norte', meta: 'Cuadrilla B · 9 personas · 07:00–16:00', estado: 'En progreso', tono: 't-info', oscuro: false },
  { titulo: 'Instalación eléctrica pasillo A', meta: 'H. Ibarra · 4 personas · 08:00–16:00', estado: 'En progreso', tono: 't-info', oscuro: false },
  { titulo: 'Aplanado de muros locales 12–18', meta: 'Cuadrilla C · 7 personas · reprogramada', estado: 'Pendiente', tono: 't-mute', oscuro: false },
];

export const fotosHoy = ['Frente 2 · losa nivel 3', 'Instalación eléctrica', 'Acabados pasillo A', 'Área de maniobras'];

export const ICONOS = {
  ok: 'M5 12l5 5 9-10',
  alerta: 'M12 4l9 16H3zM12 10v4M12 17h.01',
  caja: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
  camara: 'M4 8h3l2-3h6l2 3h3v11H4z',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5',
};

export const lineaTiempo = [
  { fecha: 'HOY · 16 SEP', titulo: 'Colado de losa frente 2 completado', meta: '38 presentes · 4 fotos · avance 76% → 78%', icono: ICONOS.ok, oscuro: false },
  { fecha: 'HOY · 16 SEP', titulo: 'Incidencia INC-0412 · falta de cemento', meta: 'Registrada por J. Salas · prioridad alta', icono: ICONOS.alerta, oscuro: true },
  { fecha: '14 SEP', titulo: 'Entrada de material: 240 sacos CPC-30R', meta: 'Proveedor Cemex Bajío · OC-1188', icono: ICONOS.caja, oscuro: true },
  { fecha: '12 SEP', titulo: 'Acabados pasillo central terminados', meta: 'Evidencia antes/después cargada · 18 fotos', icono: ICONOS.camara, oscuro: false },
  { fecha: '10 SEP', titulo: 'Inspección de supervisión externa', meta: 'DRO validó estructura nivel 2 · sin observaciones', icono: ICONOS.ok, oscuro: true },
  { fecha: '08 SEP', titulo: 'Ajuste de programa por lluvias', meta: '2 días de holgura consumidos', icono: ICONOS.alerta, oscuro: true },
  { fecha: '05 SEP', titulo: 'Estimación 7 enviada a cliente', meta: '$2,105,400 · factura F-2812', icono: ICONOS.doc, oscuro: false },
];

/* ---------- Evidencias ---------- */

export const ETAPAS = ['Preliminares', 'Obra civil', 'Instalaciones', 'Acabados'];
export const evidenciasResumen = { fotos: 1284 };

export const galeria = [
  { titulo: 'Losa nivel 3', meta: '16 sep · obra civil', etapa: 'Obra civil' },
  { titulo: 'Acero zona norte', meta: '16 sep · obra civil', etapa: 'Obra civil' },
  { titulo: 'Cableado pasillo A', meta: '16 sep · instalaciones', etapa: 'Instalaciones' },
  { titulo: 'Pasillo central', meta: '12 sep · acabados', etapa: 'Acabados' },
  { titulo: 'Locales 12–18', meta: '11 sep · acabados', etapa: 'Acabados' },
  { titulo: 'Área de maniobras', meta: '09 sep · preliminares', etapa: 'Preliminares' },
];
