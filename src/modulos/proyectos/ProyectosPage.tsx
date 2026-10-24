import { useState } from 'react';
import { Avatar, Barra, Buscador, Cargador, Estado, Filtros, Icono, ICONO, Paginacion, usePaginacion } from '../../components/ui';
import { millones } from '../../lib/format';
import { useCartera } from './hooks';
import { enEjecucion, ESTADO_PROYECTO, porArrancar, type Cartera } from './tipos';

type Tab = 'cartera' | 'ejec' | 'ret' | 'plan' | 'term';

export default function ProyectosPage() {
  const cartera = useCartera();
  return <Cargador consulta={cartera}>{(c) => <VistaProyectos {...c} />}</Cargador>;
}

function VistaProyectos({ proyectos, contratado, terminados }: Cartera) {
  const [tab, setTab] = useState<Tab>('cartera');
  const ejec = proyectos.filter(enEjecucion);
  const ret = proyectos.filter((p) => p.estado === 'retrasado');
  const plan = proyectos.filter(porArrancar);
  const tabs: { id: Tab; texto: string; conteo: number }[] = [
    { id: 'cartera', texto: 'Cartera vigente', conteo: proyectos.length },
    { id: 'ejec', texto: 'En ejecución', conteo: ejec.length },
    { id: 'ret', texto: 'Retrasados', conteo: ret.length },
    { id: 'plan', texto: 'Por iniciar / planeación', conteo: plan.length },
    { id: 'term', texto: 'Terminados', conteo: terminados.total },
  ];
  const lista = { cartera: proyectos, ejec, ret, plan, term: [] }[tab];
  const actual = tabs.find((t) => t.id === tab)!;
  const pagProy = usePaginacion(lista);
  const pagTerm = usePaginacion(terminados.recientes);
  const pag = tab === 'term' ? pagTerm : pagProy;
  const cambiarTab = (t: Tab) => { setTab(t); pagProy.ir(1); pagTerm.ir(1); };

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Proyectos</h1>
          <div className="page-sub">{proyectos.length} en cartera · {millones(contratado)} contratados · {terminados.total} terminados</div>
        </div>
        <Buscador placeholder="Buscar proyecto o cliente…" />
        <div className="acciones">
          <button className="btn">Exportar</button>
          <button className="btn btn-primario"><Icono d={ICONO.mas} stroke={2.4} />Nuevo proyecto</button>
        </div>
      </header>

      <div role="tablist" aria-label="Estado de proyectos" style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        {tabs.map((t) => {
          const activo = t.id === tab;
          return (
            <button key={t.id} role="tab" aria-selected={activo} onClick={() => cambiarTab(t.id)}
              style={{ flex: '1 1 160px', minHeight: 104, borderRadius: 24, border: activo ? 0 : '1px solid transparent', padding: '18px 20px', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8, background: activo ? '#0C0F11' : '#fff', color: activo ? '#fff' : '#1E1E1F' }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{t.texto}</span>
              <span style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: !activo && t.id === 'ret' ? '#A8302F' : undefined }}>{t.conteo}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{actual.texto} · {actual.conteo}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}><Filtros items={['Tipo de proyecto', 'Cliente', 'Responsable', 'Ciudad']} /></div>
      </div>

      <div className="tabla-wrap">
        <div className="tabla">
          <div className="tabla-head t-proy">
            <span>Proyecto / cliente</span><span className="c-sm">Tipo / ubicación</span><span className="c-md">Responsable</span><span>{tab === 'term' ? 'Periodo' : 'Avance'}</span><span className="der">Contrato</span><span>Estado</span><span />
          </div>
          {tab !== 'term' && pagProy.filas.map((p, k) => {
            const i = pagProy.inicio + k;
            const resp = p.responsable;
            const est = ESTADO_PROYECTO[p.estado];
            return (
              <div key={p.id} className="tabla-fila t-proy">
                <div className="persona">
                  <Avatar ini={p.clave} i={i} size={42} cuadrado />
                  <div style={{ minWidth: 0 }}>
                    <div className="persona-nombre trunc">{p.nombre}</div>
                    <div className="meta">{p.cliente} · {p.fechas}</div>
                  </div>
                </div>
                <div className="c-sm"><div className="trunc">{p.tipo}</div><div className="meta trunc">{p.ciudad}</div></div>
                <div className="c-md" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar ini={resp.ini} size={30} colores={['#E9EBED', '#1E1E1F']} />
                  <span className="trunc">{resp.nombre.split(' ').slice(0, 2).join(' ')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Barra valor={p.avance} color={p.estado === 'retrasado' ? '#D46A6A' : undefined} />
                  <span style={{ fontSize: 12, fontWeight: 800, width: 34, textAlign: 'right' }}>{p.avance}%</span>
                </div>
                <span className="der" style={{ fontSize: 14, fontWeight: 800 }}>{millones(p.contrato)}</span>
                <span>
                  <Estado tono={est.tono}>{est.texto}</Estado>
                  {p.diasRetraso && <div style={{ fontSize: 11, fontWeight: 800, color: '#A8302F', marginTop: 3, paddingLeft: 2 }}>+{p.diasRetraso} días</div>}
                </span>
                <button aria-label="Más acciones" style={{ width: 32, height: 32, border: 0, borderRadius: 10, background: 'transparent', color: '#4F4F52', cursor: 'pointer' }}>⋮</button>
              </div>
            );
          })}
          {tab === 'term' && pagTerm.filas.map((p, k) => {
            const i = pagTerm.inicio + k;
            const resp = p.responsable;
            return (
              <div key={p.clave} className="tabla-fila t-proy">
                <div className="persona">
                  <Avatar ini={p.clave} i={i} size={42} cuadrado />
                  <div style={{ minWidth: 0 }}>
                    <div className="persona-nombre trunc">{p.nombre}</div>
                    <div className="meta">{p.cliente}</div>
                  </div>
                </div>
                <div className="c-sm"><div className="trunc">{p.tipo}</div><div className="meta trunc">{p.ciudad}</div></div>
                <div className="c-md" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar ini={resp.ini} size={30} colores={['#E9EBED', '#1E1E1F']} />
                  <span className="trunc">{resp.nombre.split(' ').slice(0, 2).join(' ')}</span>
                </div>
                <span className="gris3">{p.fechas}</span>
                <span className="der" style={{ fontSize: 14, fontWeight: 800 }}>{millones(p.contrato)}</span>
                <span><Estado tono="t-mute">Entregado</Estado></span>
                <span />
              </div>
            );
          })}
        </div>
      </div>

      <Paginacion pagina={pag.pagina} paginas={pag.paginas} ir={pag.ir}>
        {pag.desde}–{pag.hasta} de {pag.total} {tab === 'term' ? 'recientes' : 'proyectos'}
      </Paginacion>
    </>
  );
}
