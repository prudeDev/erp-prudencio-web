import { useState, type CSSProperties, type ReactNode } from 'react';
import type { ApiError } from '../../lib/api';
import type { Consulta } from '../../lib/useConsulta';

export function Icono({ d, size = 16, stroke = 2, style }: { d: string; size?: number; stroke?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none', ...style }}>
      <path d={d} />
    </svg>
  );
}

export const ICONO = {
  mas: 'M12 5v14M5 12h14',
  buscar: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  calendario: 'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2M14 18h6M18 14h2v2',
  alerta: 'M12 4l9 16H3zM12 10v4M12 17h.01',
  check: 'M5 12l5 5 9-10',
  reloj: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  cerrar: 'M6 6l12 12M18 6L6 18',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5',
  docCheck: 'M7 3h7l5 5v13H7zM10 13l2 2 4-4',
  recibo: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
  reciboCheck: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 11l2 2 4-4',
  cartera: 'M3 7h18v12H3zM3 11h18M7 15h4',
  subir: 'M12 16V4M7 9l5-5 5 5M4 20h16',
  edificio: 'M3 21h18M6 21V8l6-4 6 4v13',
  camara: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  pin: 'M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  atras: 'M15 6l-6 6 6 6',
};

/** Rotación de colores de avatar del diseño: ámbar, negro, azul. */
export const AVATARES: [string, string][] = [['#E29C25', '#1E1E1F'], ['#0C0F11', '#FFFFFF'], ['#2F577E', '#FFFFFF']];
export const avatarDe = (i: number) => AVATARES[i % 3];

export function Avatar({ ini, i = 0, size = 40, cuadrado = false, colores }: { ini: string; i?: number; size?: number; cuadrado?: boolean; colores?: [string, string] }) {
  const [bg, fg] = colores ?? avatarDe(i);
  return (
    <span className={'avatar' + (cuadrado ? ' cuadrado' : '')}
      style={{ width: size, height: size, background: bg, color: fg, fontSize: Math.max(11, Math.round(size / 3.1)) }}>
      {ini}
    </span>
  );
}

export function Estado({ tono, children, punto = true }: { tono: string; children: ReactNode; punto?: boolean }) {
  return <span className={`estado ${tono}${punto ? '' : ' sin-punto'}`}>{children}</span>;
}

export function Badge({ tono, children, style }: { tono: string; children: ReactNode; style?: CSSProperties }) {
  return <span className={`badge ${tono}`} style={style}>{children}</span>;
}

export function Barra({ valor, color, alto = 8 }: { valor: number; color?: string; alto?: number }) {
  return (
    <div className="barra" style={{ height: alto }}>
      <div style={{ width: `${Math.min(100, valor)}%`, background: color }} />
    </div>
  );
}

type Variante = 'blanca' | 'oscura' | 'ambar';
export function Kpi({ label, valor, nota, variante = 'blanca', extra, valorColor }: {
  label: string; valor: ReactNode; nota?: ReactNode; variante?: Variante; extra?: ReactNode; valorColor?: string;
}) {
  return (
    <div className={'kpi' + (variante === 'oscura' ? ' oscura' : variante === 'ambar' ? ' ambar' : '')}>
      <div className="kpi-top"><span className="kpi-label">{label}</span>{extra}</div>
      <div className="kpi-valor" style={{ color: valorColor }}>{valor}</div>
      {nota && <div className="kpi-nota">{nota}</div>}
    </div>
  );
}

export function Encabezado({ titulo, sub, children, centro }: { titulo: ReactNode; sub?: ReactNode; children?: ReactNode; centro?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-title">{titulo}</h1>
        {sub && <div className="page-sub">{sub}</div>}
      </div>
      {centro}
      {children && <div className="acciones">{children}</div>}
    </header>
  );
}

export function Buscador({ placeholder }: { placeholder: string }) {
  return (
    <label className="buscador">
      <Icono d={ICONO.buscar} size={18} />
      <input type="search" aria-label={placeholder} placeholder={placeholder} />
    </label>
  );
}

export function Filtros({ items, sm = false }: { items: string[]; sm?: boolean }) {
  return (
    <>
      {items.map((f) => <button key={f} className={'filtro' + (sm ? ' sm' : '')}>{f} ▾</button>)}
    </>
  );
}

export function Tabs<T extends string>({ items, activo, onChange, label }: {
  items: { id: T; texto: string; conteo?: number }[]; activo: T; onChange: (id: T) => void; label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="tabs">
      {items.map((t) => (
        <button key={t.id} role="tab" aria-selected={t.id === activo} className={'tab' + (t.id === activo ? ' activo' : '')} onClick={() => onChange(t.id)}>
          {t.texto}
          {t.conteo !== undefined && <span className="conteo">{t.conteo}</span>}
        </button>
      ))}
    </div>
  );
}

export function LineaTiempo({ items }: { items: { fecha: string; titulo: string; meta: string; icono?: string; oscuro?: boolean; color?: string }[] }) {
  return (
    <div>
      {items.map((e, i) => (
        <div className="tl-item" key={i}>
          <div className="tl-eje">
            {e.icono ? (
              <span className="icono-circulo" style={{ width: 36, height: 36, background: e.oscuro ? '#0C0F11' : '#E29C25', color: e.oscuro ? '#fff' : '#1E1E1F' }}>
                <Icono d={e.icono} stroke={2.2} />
              </span>
            ) : (
              <span style={{ width: 14, height: 14, borderRadius: '50%', border: `3px solid ${e.color}`, background: '#fff', marginTop: 3 }} />
            )}
            <span className="tl-linea" />
          </div>
          <div className="tl-cuerpo">
            {e.fecha && <div className="tl-fecha">{e.fecha}</div>}
            <div style={{ fontSize: e.icono ? 13 : 14, fontWeight: 700, marginTop: 2 }}>{e.titulo}</div>
            <div className="meta">{e.meta}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const POR_PAGINA = 15;

/** Pagina una lista en el cliente. Si la lista cambia de tamaño (p. ej. otra pestaña), la página se ajusta. */
export function usePaginacion<T>(items: T[], porPagina = POR_PAGINA) {
  const [pagina, setPagina] = useState(1);
  const paginas = Math.max(1, Math.ceil(items.length / porPagina));
  const actual = Math.min(pagina, paginas);
  const inicio = (actual - 1) * porPagina;
  return {
    filas: items.slice(inicio, inicio + porPagina),
    pagina: actual,
    paginas,
    desde: items.length ? inicio + 1 : 0,
    hasta: Math.min(inicio + porPagina, items.length),
    total: items.length,
    inicio,
    ir: setPagina,
  };
}

export function Paginacion({ pagina, paginas, ir, children }: { pagina: number; paginas: number; ir: (p: number) => void; children: ReactNode }) {
  return (
    <div className="pie-tabla">
      <span>{children}</span>
      <div className="paginas">
        <button aria-label="Página anterior" disabled={pagina === 1} onClick={() => ir(pagina - 1)}>‹</button>
        {Array.from({ length: paginas }, (_, k) => k + 1).map((n) => (
          <button key={n} className={n === pagina ? 'activo' : ''} aria-current={n === pagina ? 'page' : undefined} onClick={() => ir(n)}>{n}</button>
        ))}
        <button aria-label="Página siguiente" disabled={pagina === paginas} onClick={() => ir(pagina + 1)}>›</button>
      </div>
    </div>
  );
}

/** Muestra carga o error de una consulta; con datos, delega en `children`. */
export function Cargador<T>({ consulta, children, error }: {
  consulta: Consulta<T>;
  children: (datos: T) => ReactNode;
  error?: (e: ApiError) => ReactNode;
}) {
  if (consulta.estado === 'cargando') {
    return <div className="consulta-estado"><div className="auth-cargando" aria-label="Cargando" /></div>;
  }
  if (consulta.estado === 'error') {
    return error ? error(consulta.error) : <div className="card consulta-estado">{consulta.error.message}</div>;
  }
  return children(consulta.datos);
}
