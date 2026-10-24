import { useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Avatar, Cargador, Icono, ICONO } from '../../components/ui';
import { ESTADO_ASISTENCIA_TONO } from '../asistencias/tipos';
import type { JornadaCampo } from './tipos';
import { useJornada } from './hooks';

/**
 * Vistas de campo para el supervisor (J. Salas, Plaza Altaria) a las 07:42.
 * A esa hora ya checaron entrada todos los presentes; aún no hay comidas ni salidas.
 */

function Marco({ children }: { children: ReactNode }) {
  return (
    <div className="campo-fondo">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/asistencias" className="campo-volver">← Volver al ERP</Link>
        <NavLink to="/campo/tablet" className="campo-volver">Tablet</NavLink>
        <NavLink to="/campo/lista" className="campo-volver">Móvil · pase de lista</NavLink>
        <NavLink to="/campo/bitacora" className="campo-volver">Móvil · bitácora</NavLink>
      </div>
      {children}
    </div>
  );
}

/** Marco + carga de la jornada; `children` recibe los datos ya cargados. */
function ConJornada({ children }: { children: (j: JornadaCampo) => ReactNode }) {
  const jornada = useJornada();
  return <Marco><Cargador consulta={jornada}>{children}</Cargador></Marco>;
}

const TABS_MOVIL = [
  { texto: 'Obra', icono: ICONO.edificio, ruta: '/campo/tablet' },
  { texto: 'Lista', icono: ICONO.reloj, ruta: '/campo/lista' },
  { texto: 'Bitácora', icono: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11', ruta: '/campo/bitacora' },
  { texto: 'Perfil', icono: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', ruta: '/empleados/0148' },
];

function NavMovil() {
  return (
    <nav aria-label="Navegación" style={{ margin: '12px 14px 14px', background: '#0C0F11', borderRadius: 24, padding: 8, display: 'flex', justifyContent: 'space-around' }}>
      {TABS_MOVIL.map((t) => (
        <NavLink key={t.texto} to={t.ruta} style={({ isActive }) => ({ flex: 1, height: 52, borderRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, textDecoration: 'none', fontSize: 10, fontWeight: 700, background: isActive ? '#E29C25' : 'transparent', color: isActive ? '#1E1E1F' : '#C9C9CC' })}>
          <Icono d={t.icono} size={18} />{t.texto}
        </NavLink>
      ))}
    </nav>
  );
}

/** Registros con entrada (presentes y retardos en la muestra matutina). */
const llegadas = (j: JornadaCampo) => j.registros.filter((r) => r.entrada !== '—');

export function TabletAsistencias() {
  return <ConJornada>{(j) => <Tablet {...j} />}</ConJornada>;
}

function Tablet(j: JornadaCampo) {
  const { supervisor: sup, obra, sitio, registros } = j;
  const retardos = llegadas(j).filter((r) => r.estado === 'Retardo').length;
  return (
    <div style={{ width: 834, maxWidth: '100%', height: 1050, padding: 14, background: '#0C0F11', borderRadius: 40, display: 'flex' }}>
      <div style={{ flex: 1, minWidth: 0, background: '#F4F5F6', borderRadius: 28, padding: 22, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Asistencias · {obra.corto}</div>
            <div className="meta">{j.fechaTexto} · {j.hora} hrs · supervisor {sup.corto}</div>
          </div>
          <Avatar ini={sup.ini} size={40} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
          {[
            { k: 'Presentes', v: `${sitio.presentes} / ${sitio.asignados}`, oscuro: true },
            { k: 'Retardos', v: sitio.retardos },
            { k: 'Faltas', v: sitio.faltas, rojo: true },
            { k: 'Permisos', v: sitio.permisos },
          ].map((x) => (
            <div key={x.k} style={{ borderRadius: 18, padding: 14, background: x.oscuro ? '#0C0F11' : '#fff', color: x.oscuro ? '#fff' : undefined }}>
              <div style={{ fontSize: 11, color: x.oscuro ? '#D0D0D3' : '#626265', fontWeight: 600 }}>{x.k}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: x.rojo ? '#A8302F' : undefined }}>{x.v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/campo/lista" className="btn btn-ambar" style={{ flex: 1, height: 54, borderRadius: 18 }}><Icono d={ICONO.qr} size={18} stroke={2.2} />Escanear QR</Link>
          <button className="btn" style={{ flex: 1, height: 54, borderRadius: 18, fontWeight: 800 }}>Registro manual</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Registros de hoy</div>
          <span className="meta">muestra de {registros.length} · {retardos} retardos</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {registros.map((r, i) => {
            const e = r.empleado;
            return (
              <div key={e.num} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 16, padding: '10px 14px' }}>
                <Avatar ini={e.ini} i={i} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{e.nombre}</div>
                  <div style={{ fontSize: 11, color: '#626265' }}>{e.puesto} · entrada {r.entrada}{r.metodo !== '—' ? ` · ${r.metodo}` : ''}</div>
                </div>
                <span className={ESTADO_ASISTENCIA_TONO[r.estado]} style={{ fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '4px 10px', minWidth: 72, textAlign: 'center' }}>{r.estado}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MovilPaseLista() {
  return <ConJornada>{(j) => <PaseLista {...j} />}</ConJornada>;
}

function PaseLista(j: JornadaCampo) {
  const { supervisor: sup, obra, sitio } = j;
  const ultimos = [...llegadas(j)].sort((a, b) => b.entrada.localeCompare(a.entrada)).slice(0, 3);
  return (
    <div className="movil">
      <div className="oscura" style={{ padding: '30px 20px 22px', borderRadius: '0 0 28px 28px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar ini={sup.ini} size={44} colores={['#E29C25', '#1E1E1F']} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#D0D0D3', fontWeight: 600 }}>Supervisor · {sup.corto}</div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{obra.corto}</div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#D0D0D3' }}>{j.hora}</span>
      </div>

      <div style={{ padding: '18px 18px 0', display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minHeight: 0 }}>
        <div style={{ background: '#fff', borderRadius: 26, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#4F4F52' }}>Escanea el gafete del trabajador</div>
          <div style={{ width: 150, height: 150, borderRadius: 24, background: '#F4F5F6', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0C0F11' }}>
            <Icono d={ICONO.qr + 'M6.5 6.5h1M16.5 6.5h1M6.5 16.5h1'} size={64} stroke={1.6} />
            <span style={{ position: 'absolute', left: 14, right: 14, top: '50%', height: 3, borderRadius: 2, background: '#E29C25' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#23703A' }}>
            <Icono d={ICONO.pin} size={14} stroke={2.4} />Dentro del perímetro de obra
          </div>
          <button className="btn btn-primario" style={{ width: '100%', height: 50, borderRadius: 16, fontSize: 15, fontWeight: 800 }}>Registrar entrada</button>
          <button style={{ border: 0, background: 'transparent', fontSize: 12, fontWeight: 700, color: '#2F577E', textDecoration: 'underline', cursor: 'pointer' }}>o captura el No. de empleado</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Últimos registros</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#626265' }}>{sitio.presentes} de {sitio.asignados} hoy</span>
        </div>
        {ultimos.map((r, i) => {
          const e = r.empleado;
          return (
            <div key={e.num} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 16, padding: '10px 12px' }}>
              <Avatar ini={e.ini} i={i} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{e.nombre.split(' ').slice(0, 2).join(' ')}</div>
                <div style={{ fontSize: 11, color: '#626265' }}>{r.entrada} · {r.metodo}</div>
              </div>
              <span className={'icono-circulo ' + (r.estado === 'Retardo' ? 't-warn' : 't-ok')} style={{ width: 26, height: 26 }}>
                <Icono d={r.estado === 'Retardo' ? ICONO.reloj : ICONO.check} size={14} stroke={3} />
              </span>
            </div>
          );
        })}
      </div>
      <NavMovil />
    </div>
  );
}

export function MovilBitacora() {
  return <ConJornada>{(j) => <NuevoRegistro {...j} />}</ConJornada>;
}

function NuevoRegistro({ obra, hora }: JornadaCampo) {
  const [avance, setAvance] = useState(obra.avance);
  return (
    <div className="movil">
      <div style={{ padding: '16px 24px 0', fontSize: 12, fontWeight: 800 }}>{hora}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px' }}>
        <Link to="/campo/lista" aria-label="Volver" className="icono-circulo" style={{ width: 42, height: 42, background: '#fff', color: '#1E1E1F' }}><Icono d={ICONO.atras} size={18} stroke={2.4} /></Link>
        <div style={{ fontSize: 17, fontWeight: 800 }}>Nuevo registro</div>
        <button className="btn btn-primario" style={{ height: 38, fontSize: 12, fontWeight: 800, padding: '0 14px' }}>Guardar</button>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '6px 18px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, fontWeight: 700, color: '#4F4F52' }}>Proyecto
          <span style={{ height: 48, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', fontSize: 14, fontWeight: 700, color: '#1E1E1F' }}>{obra.nombre} <span aria-hidden="true">▾</span></span>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, fontWeight: 700, color: '#4F4F52' }}>Actividad realizada
          <textarea rows={3} defaultValue="Colado de losa frente 2, nivel 3; habilitado de acero en zona norte…" style={{ border: 0, borderRadius: 16, background: '#fff', padding: '12px 14px', font: 'inherit', fontSize: 13, fontWeight: 500, color: '#1E1E1F', resize: 'none' }} />
        </label>

        <div className="oscura" style={{ borderRadius: 22, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, color: '#D0D0D3', fontWeight: 700 }}>Avance reportado de la obra</span>
            <span style={{ fontSize: 26, fontWeight: 800 }}>{avance}%</span>
          </div>
          <input type="range" min={0} max={100} value={avance} onChange={(e) => setAvance(Number(e.target.value))} aria-label="Avance reportado" style={{ width: '100%', marginTop: 10, accentColor: '#E29C25' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#4F4F52' }}>Evidencias</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
            <div className="foto" style={{ height: 84, fontSize: 11, padding: 8 }}>Foto 1</div>
            <div className="foto" style={{ height: 84, fontSize: 11, padding: 8 }}>Foto 2</div>
            <button className="btn-ambar" style={{ height: 84, borderRadius: 16, border: 0, fontSize: 12, fontWeight: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}>
              <Icono d={ICONO.camara} size={20} />Cámara
            </button>
          </div>
        </div>

        <button style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: 0, borderRadius: 18, padding: '12px 14px', textAlign: 'left', cursor: 'pointer' }}>
          <span className="icono-circulo t-bad" style={{ width: 38, height: 38 }}><Icono d={ICONO.alerta} size={18} /></span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 800 }}>Levantar incidencia</span>
            <span style={{ display: 'block', fontSize: 11, color: '#626265' }}>Falta de material, retraso o daño</span>
          </span>
          <span aria-hidden="true" style={{ fontWeight: 800 }}>›</span>
        </button>
      </div>

      <div style={{ padding: '14px 18px 20px' }}>
        <button className="btn btn-primario" style={{ width: '100%', height: 54, borderRadius: 18, fontSize: 15, fontWeight: 800 }}>Enviar registro del día</button>
      </div>
    </div>
  );
}
