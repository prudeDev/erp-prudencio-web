import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, Badge, Cargador, Icono, ICONO, LineaTiempo, Tabs } from '../../components/ui';
import { numero, pesos } from '../../lib/format';
import { useExpediente } from './hooks';
import { DOCUMENTO_TONO, ESTATUS_TONO, type Expediente } from './tipos';

const TABS = ['Información', 'Asistencias', 'Historial de proyectos', 'Incidencias', 'Vacaciones y permisos', 'Nómina', 'Documentos'] as const;

export default function PerfilEmpleadoPage() {
  const { num = '0148' } = useParams();
  const expediente = useExpediente(num);
  return (
    <Cargador
      consulta={expediente}
      error={(e) => <div className="card">{e.message} <Link to="/empleados">Volver</Link></div>}
    >
      {(x) => <VistaExpediente {...x} />}
    </Cargador>
  );
}

function VistaExpediente({ empleado: e, salarioMensual, detalle: d }: Expediente) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Asistencias');

  const info = [
    ['Número', e.num], ['Puesto', e.puesto], ['Área', e.area],
    ...(d ? [['Contratación', d.contratacion]] : []),
    ['Tipo', e.contrato === 'Planta' ? 'Planta · indefinido' : 'Obra determinada'],
    ['Asignación', d ? d.asignacionDetalle : e.asignacion.texto],
    ['Supervisor', e.supervisor ? e.supervisor.nombre.split(' ').slice(0, 2).join(' ') : '—'],
    ...(d ? [['Teléfono', d.telefono], ['Correo', d.correo]] : []),
  ];

  return (
    <>
      <header className="page-header">
        <div style={{ fontSize: 14, fontWeight: 600, color: '#626265' }}>
          <Link to="/empleados" style={{ textDecoration: 'none' }}>Empleados</Link> <span aria-hidden="true">/</span>{' '}
          <span style={{ color: '#1E1E1F', fontWeight: 800, fontSize: 20 }}>{e.nombre}</span>
        </div>
        <div className="acciones">
          <button className="btn">Generar constancia</button>
          <button className="btn btn-primario">Editar expediente</button>
        </div>
      </header>

      <div className="dos-col">
        <aside className="col-lateral">
          <div className="oscura" style={{ borderRadius: 26, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avatar ini={e.ini} size={64} colores={['#E29C25', '#1E1E1F']} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{e.nombre}</div>
                <div style={{ fontSize: 13, color: '#D0D0D3' }}>{e.puesto} · No. {e.num}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Badge tono={ESTATUS_TONO[e.estatus]} style={{ fontSize: 12, padding: '4px 12px' }}>{e.estatus}</Badge>
              <Badge tono="" style={{ fontSize: 12, padding: '4px 12px', background: '#2C353D', color: '#fff' }}>{e.contrato}</Badge>
            </div>
            {salarioMensual !== null && (
              <div>
                <div style={{ fontSize: 12, color: '#D0D0D3' }}>Salario mensual</div>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{pesos(salarioMensual)}</div>
              </div>
            )}
          </div>

          <div className="card" style={{ gap: 0, padding: '14px 22px' }}>
            {info.map(([k, v]) => <div className="kv" key={k}><span>{k}</span><span>{v}</span></div>)}
          </div>

          {d && (
            <div className="card">
              <div className="card-title">Documentos</div>
              {d.documentos.map((doc) => (
                <div key={doc.nombre} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="icono-circulo" style={{ width: 40, height: 40, borderRadius: 12, background: '#F4F5F6', color: '#4F4F52' }}><Icono d={ICONO.doc} size={18} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{doc.nombre}</div>
                    <div style={{ fontSize: 11, color: '#626265' }}>{doc.meta}</div>
                  </div>
                  <span className={DOCUMENTO_TONO[doc.estado]} style={{ fontSize: 11, fontWeight: 800, borderRadius: 8, padding: '4px 8px' }}>{doc.estado}</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        <section className="col-principal">
          <Tabs label="Secciones del expediente" items={TABS.map((t) => ({ id: t, texto: t }))} activo={tab} onChange={setTab} />

          {d ? (
            <Detalle detalle={d} />
          ) : (
            <div className="card" style={{ alignItems: 'center', textAlign: 'center', padding: 40 }}>
              <Avatar ini={e.ini} i={Number(e.num)} size={56} />
              <div className="card-title">Expediente sin historial cargado</div>
              <div className="card-sub">Los datos de asistencias, horas y documentos de ejemplo solo están capturados para Julián Salas.</div>
              <Link to="/empleados/0148" className="btn btn-sm btn-primario">Ver expediente de ejemplo</Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Detalle({ detalle: d }: { detalle: NonNullable<Expediente['detalle']> }) {
  const totalOrd = d.horasOrdinarias.reduce((a, b) => a + b, 0);
  const totalExt = d.horasExtra.reduce((a, b) => a + b, 0);

  const stats = [
    { label: 'Asistencias', valor: String(d.diasAsistidos), nota: `de ${d.diasHabiles} días hábiles`, ambar: true },
    { label: 'Faltas', valor: String(d.faltas), nota: 'justificada' },
    { label: 'Retardos', valor: String(d.retardos), nota: 'últimos 90 días' },
    { label: 'Horas trabajadas', valor: String(totalOrd), nota: 'últimas 12 semanas' },
    { label: 'Horas extra', valor: String(totalExt), nota: `${pesos(d.importeHorasExtra)} acumulados` },
    { label: 'Vacaciones', valor: String(d.vacacionesDisponibles), nota: 'días disponibles' },
  ];

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ flex: '1 1 100px', borderRadius: 20, padding: '16px 16px', background: s.ambar ? '#E29C25' : '#fff' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: s.ambar ? '#1E1E1F' : '#626265' }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{s.valor}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: s.ambar ? '#1E1E1F' : '#626265' }}>{s.nota}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-head" style={{ alignItems: 'center' }}>
          <div>
            <div className="card-title">Horas trabajadas</div>
            <div className="card-sub">Últimas 12 semanas · ordinarias y extra</div>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#4F4F52', fontWeight: 600 }}>
            <span className="leyenda"><i style={{ width: 10, height: 10, background: '#2F577E' }} />Ordinarias · {numero(totalOrd)} h</span>
            <span className="leyenda"><i style={{ width: 10, height: 10, background: '#E29C25' }} />Extra · {totalExt} h</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 200, marginTop: 6, borderBottom: '1px solid #E6E8EA' }}>
          {d.horasOrdinarias.map((o, k) => (
            <div key={k} title={`S${k + 1}: ${o} h + ${d.horasExtra[k]} h extra`} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
              <div style={{ width: '70%', maxWidth: 26, borderRadius: '8px 8px 0 0', background: '#E29C25', height: d.horasExtra[k] * 3.6 }} />
              <div style={{ width: '70%', maxWidth: 26, background: '#2F577E', height: o * 3.6 }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {d.horasOrdinarias.map((_, k) => <div key={k} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#626265', fontWeight: 600 }}>S{k + 1}</div>)}
        </div>
      </div>

      <div className="card" style={{ gap: 4 }}>
        <div className="card-title" style={{ marginBottom: 10 }}>Historial de proyectos</div>
        <LineaTiempo items={d.historial.map((h) => ({ fecha: '', titulo: h.titulo, meta: h.meta, color: h.actual ? '#E29C25' : '#0C0F11' }))} />
      </div>
    </>
  );
}
