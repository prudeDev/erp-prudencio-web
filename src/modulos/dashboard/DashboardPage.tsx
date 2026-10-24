import { Link } from 'react-router-dom';
import { iniciales, useUsuario } from '../../auth/AuthContext';
import { Avatar, AVATARES, Badge, Barra, Buscador, Cargador, Icono, ICONO, Kpi } from '../../components/ui';
import { millones, pesos } from '../../lib/format';
import { useDashboard } from './hooks';
import type { Dashboard } from './tipos';

const ESCALA = 24; // máximo del eje de la gráfica (millones)
const ALTO = 162;

export default function DashboardPage() {
  const dashboard = useDashboard();
  return <Cargador consulta={dashboard}>{(d) => <VistaDashboard {...d} />}</Cargador>;
}

function VistaDashboard(d: Dashboard) {
  const usuario = useUsuario();
  const { cartera, asistencia, facturas, meses, rentabilidad } = d;
  const pctEjercido = Math.round((cartera.ejercido / cartera.contratado) * 100);
  const circ = 2 * Math.PI * 86;
  const arcoEjercido = (cartera.ejercido / cartera.contratado) * circ;
  const arcoComprometido = (cartera.comprometido / cartera.contratado) * circ;
  const puntosMargen = meses.map((m, i) => `${(i + 0.5) * 100},${ALTO - ((m.facturado - m.gastos) / ESCALA) * ALTO}`).join(' ');
  const difMeta = rentabilidad.valor - rentabilidad.meta;

  const indicadores = [
    { label: 'Terminados', valor: String(d.terminados), icono: ICONO.check, oscuro: true },
    { label: 'Próximos a iniciar', valor: String(d.porIniciar), icono: ICONO.reloj, oscuro: true },
    { label: 'Obras retrasadas', valor: String(d.retrasadas), icono: ICONO.alerta, rojo: true },
    { label: 'Facturas pendientes', valor: String(facturas.pendientes + facturas.vencidas), icono: ICONO.recibo, oscuro: true },
    { label: 'Facturas pagadas', valor: String(facturas.pagadas), icono: ICONO.reciboCheck, oscuro: true },
    { label: 'Por cobrar', valor: millones(facturas.totalPorCobrar), icono: ICONO.cartera, ambar: true },
  ];

  return (
    <>
      <header className="page-header" style={{ gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar ini={iniciales(usuario.nombre)} size={40} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.2 }}>Bienvenido, {usuario.nombre.split(' ')[0]}</div>
            <div className="page-sub" style={{ fontSize: 12 }}>{d.fechaTexto} · {d.enEjecucion} obras en ejecución</div>
          </div>
        </div>
        <Buscador placeholder="Buscar proyecto, empleado, factura…" />
        <div className="acciones" style={{ gap: 8 }}>
          <button className="btn btn-sm"><Icono d={ICONO.calendario} size={15} />Sep 2026</button>
          <Link to="/proyectos" className="btn btn-sm btn-primario"><Icono d={ICONO.mas} size={15} stroke={2.4} />Nuevo proyecto</Link>
        </div>
      </header>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
        <Kpi variante="oscura" label="Presupuesto contratado" valor={millones(cartera.contratado)}
          extra={<Badge tono="t-ok">{cartera.obras} obras</Badge>}
          nota={`Ejercido ${millones(cartera.ejercido)} · Por ejercer ${millones(cartera.porEjercer)}`} />
        <Kpi label="Rentabilidad acumulada" valor={`${rentabilidad.valor.toFixed(1)} %`}
          extra={<Badge tono={difMeta < 0 ? 't-bad' : 't-ok'}>{difMeta < 0 ? '−' : '+'}{Math.abs(difMeta).toFixed(1)} pts</Badge>}
          nota={`Meta anual ${rentabilidad.meta.toFixed(1)}% · ejercicio 2026`} />
        <Kpi label="Proyectos activos" valor={d.enEjecucion} nota={`de ${cartera.obras} en cartera`} />
        <Kpi variante="ambar" label="Personal en obra hoy"
          valor={<>{asistencia.presentes} <span style={{ fontSize: 16 }}>/ {asistencia.programados} programados</span></>}
          extra={<Badge tono="" style={{ background: '#fff' }}>{asistencia.porcentaje}%</Badge>}
          nota={`${asistencia.aTiempo} a tiempo · ${asistencia.retardos} retardos · ${asistencia.faltas} faltas · ${asistencia.permisos} permisos`} />
      </div>

      <div className="dash-ind" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 10 }}>
        {indicadores.map((k) => (
          <div key={k.label} style={{ height: 50, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
            <span className="icono-circulo" style={{ width: 32, height: 32, background: k.rojo ? '#F8D4D4' : k.ambar ? '#E29C25' : '#0C0F11', color: k.rojo ? '#A8302F' : k.ambar ? '#1E1E1F' : '#fff' }}>
              <Icono d={k.icono} size={15} />
            </span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 11.5, fontWeight: 700, lineHeight: 1.2 }}>{k.label}</span>
            <span style={{ fontSize: 17, fontWeight: 800, whiteSpace: 'nowrap', color: k.rojo ? '#A8302F' : undefined }}>{k.valor}</span>
          </div>
        ))}
      </div>

      <div className="dash-grid" style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, minmax(min-content, 1fr))', gap: 12 }}>
        <div className="card-sm">
          <div>
            <div className="card-title">Facturado vs. gastos</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 6, fontSize: 11, color: '#626265', fontWeight: 600 }}>
              <span>Millones MXN · 2026</span>
              <span style={{ display: 'flex', gap: 10 }}>
                <span className="leyenda"><i style={{ background: '#E29C25' }} />Facturado</span>
                <span className="leyenda"><i style={{ background: '#2F577E' }} />Gastos</span>
                <span className="leyenda"><i style={{ width: 12, height: 3, background: '#0C0F11' }} />Margen</span>
              </span>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 6 }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 168, marginTop: -6, fontSize: 10, color: '#626265', fontWeight: 600, textAlign: 'right', width: 18 }}>
              {[24, 18, 12, 6, 0].map((v) => <span key={v}>{v}</span>)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ position: 'relative', height: ALTO, backgroundImage: 'linear-gradient(#E9EBED 1px, transparent 1px)', backgroundSize: `100% ${ALTO / 4}px`, borderBottom: '1px solid #D9DCDF' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: 5 }}>
                  {meses.map((m) => (
                    <div key={m.mes} title={`${m.mes}: facturado ${millones(m.facturado)} · gastos ${millones(m.gastos)}`} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2, height: '100%' }}>
                      <div style={{ width: '40%', maxWidth: 12, borderRadius: '4px 4px 0 0', background: '#E29C25', height: (m.facturado / ESCALA) * ALTO }} />
                      <div style={{ width: '40%', maxWidth: 12, borderRadius: '4px 4px 0 0', background: '#2F577E', height: (m.gastos / ESCALA) * ALTO }} />
                    </div>
                  ))}
                </div>
                <svg viewBox={`0 0 900 ${ALTO}`} preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
                  <polyline points={puntosMargen} fill="none" stroke="#0C0F11" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
                {meses.map((m) => <div key={m.mes} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#626265', fontWeight: 600 }}>{m.mes}</div>)}
              </div>
            </div>
          </div>
        </div>

        <div className="card-sm">
          <div>
            <div className="card-title">Avance de obra</div>
            <div className="card-sub">Mayores contratos en ejecución</div>
          </div>
          {d.avance.map((p) => (
            <div key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12, fontWeight: 600 }}><span>{p.nombre}</span><span style={{ fontWeight: 800 }}>{p.avance}%</span></div>
              <div style={{ marginTop: 4, display: 'flex' }}><Barra valor={p.avance} alto={6} color={p.retrasado ? '#D46A6A' : undefined} /></div>
            </div>
          ))}
        </div>

        <div className="card-sm">
          <div className="card-head">
            <div className="card-title">Incidencias recientes</div>
            <Link to="/bitacora" className="link-sec">Ver todas</Link>
          </div>
          {d.incidencias.map((i) => (
            <div key={i.folio} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="icono-circulo" style={{ width: 34, height: 34, background: !i.abierta ? '#E8EAEC' : i.prioridad === 'Alta' ? '#0C0F11' : '#E29C25', color: !i.abierta ? '#4F4F52' : i.prioridad === 'Alta' ? '#fff' : '#1E1E1F' }}>
                <Icono d={i.abierta ? ICONO.alerta : ICONO.check} size={15} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.25 }}>{i.titulo}</div>
                <div style={{ fontSize: 10.5, color: '#626265' }}>{i.proyecto} · {i.cuando} · {i.quien}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: i.abierta ? undefined : '#626265' }}>{i.abierta ? i.prioridad : 'Cerrada'}</span>
            </div>
          ))}
        </div>

        <div className="card-sm" style={{ gap: 8 }}>
          <div>
            <div className="card-title">Presupuesto utilizado</div>
            <div className="card-sub">Cartera vigente · {millones(cartera.contratado)}</div>
          </div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 150, height: 150, flex: 'none' }}>
              <svg width="150" height="150" viewBox="0 0 230 230" role="img" aria-label={`Presupuesto de cartera: ${pctEjercido}% ejercido`}>
                <circle cx="115" cy="115" r="86" fill="none" stroke="#ECEEF0" strokeWidth="30" />
                <circle cx="115" cy="115" r="86" fill="none" stroke="#E29C25" strokeWidth="30" strokeDasharray={`${arcoComprometido} ${circ}`} strokeDashoffset={-arcoEjercido} transform="rotate(-90 115 115)" />
                <circle cx="115" cy="115" r="86" fill="none" stroke="#0C0F11" strokeWidth="30" strokeDasharray={`${arcoEjercido} ${circ}`} transform="rotate(-90 115 115)" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 24, fontWeight: 800 }}>{pctEjercido}%</span>
                <span style={{ fontSize: 11, color: '#626265', fontWeight: 600 }}>ejercido</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, fontWeight: 600 }}>
              {[['Ejercido', cartera.ejercido, '#0C0F11'], ['Comprometido', cartera.comprometido, '#E29C25'], ['Disponible', cartera.disponible, '#E1E4E7']].map(([t, v, c]) => (
                <div key={t as string}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4F4F52' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: c as string }} />{t}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, paddingLeft: 16 }}>{millones(v as number)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-sm" style={{ gap: 8 }}>
          <div className="card-head">
            <div className="card-title">Obras con retraso</div>
            <Link to="/proyectos" className="link-sec">Ver todas</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 76px 40px', gap: 8, padding: '0 10px', fontSize: 9.5, fontWeight: 800, color: '#626265', letterSpacing: 0.5 }}>
            <span>PROYECTO</span><span>RESPONSABLE</span><span className="der">DÍAS</span>
          </div>
          {d.retrasados.map((p) => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 76px 40px', gap: 8, alignItems: 'center', background: '#F7F8F9', borderRadius: 14, padding: '8px 10px' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.25 }}>{p.nombre}</div>
                <div style={{ fontSize: 10.5, color: '#626265' }}>{p.cliente}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{p.responsable}</span>
              <span className="t-bad" style={{ justifySelf: 'end', fontSize: 11, fontWeight: 800, borderRadius: 8, padding: '3px 6px' }}>+{p.diasRetraso}d</span>
            </div>
          ))}
        </div>

        <div className="card-sm" style={{ gap: 8 }}>
          <div className="card-head">
            <div className="card-title">Facturas por vencer <span style={{ fontSize: 11, color: '#626265' }}>· 7 días</span></div>
            <Link to="/facturacion" className="link-sec">Ver todas</Link>
          </div>
          {d.porVencer.map((r, i) => {
            const [bg, fg] = AVATARES[i % 3];
            return (
              <div key={r.folio} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F7F8F9', borderRadius: 14, padding: '6px 10px 6px 6px' }}>
                <div style={{ width: 38, height: 38, flex: 'none', borderRadius: 11, background: bg, color: fg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.05 }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>{r.dia}</span><span style={{ fontSize: 8, fontWeight: 800 }}>SEP</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{r.cliente}</div>
                  <div className="trunc" style={{ fontSize: 10.5, color: '#626265' }}>{r.folio} · {r.proyecto}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>{pesos(r.total)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
