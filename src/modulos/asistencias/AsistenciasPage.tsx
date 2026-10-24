import { Link } from 'react-router-dom';
import { Avatar, Badge, Barra, Cargador, Estado, Filtros, Icono, ICONO } from '../../components/ui';
import { useAsistenciaDia } from './hooks';
import { ESTADO_ASISTENCIA_TONO, type AsistenciaDia } from './tipos';

const COLS = 'minmax(0, 2.2fr) repeat(4, minmax(0, 0.8fr)) minmax(0, 0.6fr) minmax(0, 1fr)';
const C = { a: '#3D9A55', r: '#D99A2B', f: '#C84444', p: '#2F577E', d: '#BDBDBA' };

function Calendario({ diaHoy, marcas }: { diaHoy: number; marcas: AsistenciaDia['calendario'] }) {
  const dias: { n: string; bg: string; fg: string; dot: string }[] = [{ n: '', bg: 'transparent', fg: '#1E1E1F', dot: 'transparent' }];
  for (let n = 1; n <= 30; n++) {
    const dow = (n + 1) % 7; // 0 = domingo (1 sep 2026 = martes)
    const hoy = n === diaHoy;
    let dot = 'transparent';
    if (n < diaHoy) dot = dow === 0 ? C.d : C[marcas[n] ?? 'a'];
    dias.push({ n: String(n), bg: hoy ? '#E29C25' : n < diaHoy ? '#F7F8F9' : 'transparent', fg: n > diaHoy ? '#8A8A8D' : '#1E1E1F', dot: hoy ? '#1E1E1F' : dot });
  }
  while (dias.length % 7) dias.push({ n: '', bg: 'transparent', fg: '#1E1E1F', dot: 'transparent' });
  return (
    <div className="card" style={{ borderRadius: 26, padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="card-title">Septiembre 2026</div>
          <div className="card-sub">Plaza Altaria · incidencias del equipo</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['‹', '›'].map((s) => <button key={s} aria-label={s === '‹' ? 'Mes anterior' : 'Mes siguiente'} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #E6E8EA', background: '#fff', cursor: 'pointer' }}>{s}</button>)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 6, textAlign: 'center' }}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, k) => <span key={k} style={{ fontSize: 11, fontWeight: 700, color: '#626265', paddingBottom: 4 }}>{d}</span>)}
        {dias.map((d, k) => (
          <div key={k} style={{ height: 38, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, fontSize: 12, fontWeight: 700, background: d.bg, color: d.fg }}>
            <span>{d.n}</span><span style={{ width: 5, height: 5, borderRadius: '50%', background: d.dot }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 14px', fontSize: 11, fontWeight: 600, color: '#4F4F52' }}>
        {[['Asistencia', C.a], ['Retardo', C.r], ['Falta', C.f], ['Permiso', C.p], ['Descanso', C.d]].map(([t, c]) => (
          <span key={t} className="leyenda"><i style={{ borderRadius: '50%', background: c }} />{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function AsistenciasPage() {
  const dia = useAsistenciaDia();
  return <Cargador consulta={dia}>{(d) => <VistaAsistencias {...d} />}</Cargador>;
}

function VistaAsistencias({ corte, resumen, porSitio, metodos, sitio, registros, calendario }: AsistenciaDia) {
  const kpis = [
    { label: 'Retardos', valor: resumen.retardos, icono: ICONO.reloj, tono: 't-warn' },
    { label: 'Faltas', valor: resumen.faltas, icono: ICONO.cerrar, tono: 't-bad' },
    { label: 'Permisos', valor: resumen.permisos, icono: ICONO.docCheck, tono: 't-info' },
  ];

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Asistencias</h1>
          <div className="page-sub">Corte {corte.dia} {corte.mes} · {corte.hora} hrs · {resumen.programados} empleados programados hoy</div>
        </div>
        <div className="acciones">
          <button className="btn">Exportar Excel</button>
          <Link to="/campo/tablet" className="btn">Vista tablet</Link>
          <Link to="/campo/lista" className="btn btn-primario"><Icono d={ICONO.qr} stroke={2.2} />Pase de lista QR</Link>
        </div>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <div className="oscura" style={{ flex: '1.3 1 220px', borderRadius: 24, padding: '22px 24px' }}>
          <div style={{ fontSize: 13, color: '#D0D0D3', fontWeight: 600 }}>Presentes hoy</div>
          <div style={{ fontSize: 38, fontWeight: 800, marginTop: 6 }}>{resumen.presentes} <span style={{ fontSize: 16, color: '#D0D0D3' }}>/ {resumen.programados}</span></div>
          <div style={{ fontSize: 12, color: '#D0D0D3' }}>{resumen.aTiempo} a tiempo + {resumen.retardos} con retardo · {resumen.porcentaje}%</div>
        </div>
        {kpis.map((k) => (
          <div key={k.label} style={{ flex: '1 1 150px', borderRadius: 24, padding: '22px 24px', background: '#fff', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className={'icono-circulo ' + k.tono} style={{ width: 48, height: 48 }}><Icono d={k.icono} size={20} /></span>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{k.valor}</div>
              <div style={{ fontSize: 12, color: '#626265', fontWeight: 600 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#4F4F52', marginRight: 4 }}>Métodos activos</span>
        {metodos.map((m) => (
          <span key={m} style={{ height: 36, borderRadius: 999, background: '#E29C25', padding: '0 14px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icono d={ICONO.check} size={14} stroke={2.6} />{m}
          </span>
        ))}
        <span style={{ flex: 1 }} />
        <Filtros sm items={[`Proyecto: ${sitio.nombre}`, `Fecha: ${corte.dia} sep 2026`, 'Área: todas', `Supervisor: ${sitio.supervisor}`, 'Turno: matutino']} />
      </div>

      <div className="dos-col">
        <section className="col-principal" style={{ gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Registro del día — {sitio.nombre}</h2>
              <div className="meta">{sitio.asignados} asignados · supervisor {sitio.supervisor} · {sitio.retardos} retardos · {sitio.faltas} faltas · {sitio.permisos} permisos</div>
            </div>
            <Badge tono="t-ok" style={{ fontSize: 12, padding: '5px 12px' }}>{sitio.presentes} presentes</Badge>
          </div>
          <div className="tabla-wrap">
            <div className="tabla" style={{ minWidth: 760, gap: 8 }}>
              <div className="tabla-head" style={{ gridTemplateColumns: COLS, gap: 10, padding: '0 16px' }}>
                <span>Empleado</span><span>Entrada</span><span>Comida</span><span>Regreso</span><span>Salida</span><span>Horas</span><span>Estado</span>
              </div>
              {registros.map((r, i) => {
                const e = r.empleado;
                return (
                  <div key={e.num} className="tabla-fila" style={{ gridTemplateColumns: COLS, gap: 10, padding: '10px 16px', borderRadius: 16 }}>
                    <div className="persona" style={{ gap: 10 }}>
                      <Avatar ini={e.ini} i={i} size={36} />
                      <div style={{ minWidth: 0 }}>
                        <div className="trunc" style={{ fontWeight: 700 }}>{e.nombre}</div>
                        <div style={{ fontSize: 11, color: '#626265' }}>{e.puesto}{r.metodo !== '—' ? ` · ${r.metodo}` : ''}</div>
                      </div>
                    </div>
                    <span>{r.entrada}</span><span className="gris3">{r.comida}</span><span className="gris3">{r.regreso}</span><span className="gris3">{r.salida}</span>
                    <span style={{ fontWeight: 800 }}>{r.horas.toFixed(1)}</span>
                    <span><Estado tono={ESTADO_ASISTENCIA_TONO[r.estado]}>{r.estado}</Estado></span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pie-tabla"><span>Mostrando {registros.length} de {sitio.asignados} asignados</span></div>
        </section>

        <aside className="col-lateral">
          <Calendario diaHoy={corte.dia} marcas={calendario} />
          <div className="card" style={{ borderRadius: 26, padding: 22, gap: 14 }}>
            <div className="card-head">
              <div className="card-title">Asistencia por obra · hoy</div>
              <span style={{ fontSize: 12, fontWeight: 800 }}>{resumen.presentes} / {resumen.programados}</span>
            </div>
            {porSitio.map((s) => (
              <div key={s.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}><span>{s.nombre}</span><span style={{ fontWeight: 800 }}>{s.presentes} / {s.asignados}</span></div>
                <div style={{ marginTop: 6, display: 'flex' }}><Barra valor={(s.presentes / s.asignados) * 100} color={s.presentes / s.asignados < 0.8 ? '#D46A6A' : undefined} /></div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
