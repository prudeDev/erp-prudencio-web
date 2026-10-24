import { Link } from 'react-router-dom';
import { Badge, Cargador, Icono, ICONO, LineaTiempo } from '../../components/ui';
import { useBitacoraDia } from './hooks';
import { ACTIVIDAD_TONO, type BitacoraDia, type TipoEvento } from './tipos';

const ICONO_EVENTO: Record<TipoEvento, string> = {
  ok: 'M5 12l5 5 9-10',
  alerta: 'M12 4l9 16H3zM12 10v4M12 17h.01',
  caja: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
  camara: 'M4 8h3l2-3h6l2 3h3v11H4z',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5',
};

export default function BitacoraPage() {
  const dia = useBitacoraDia();
  return <Cargador consulta={dia}>{(b) => <VistaBitacora {...b} />}</Cargador>;
}

function VistaBitacora(B: BitacoraDia) {
  const abiertas = B.incidenciasAbiertas;
  const hoy = [
    { k: 'Personal presente', v: `${B.personal.presentes} / ${B.personal.asignados}` },
    { k: 'Avance reportado', v: `${B.proyecto.avance}%` },
    { k: 'Material consumido', v: `${B.partidasMaterial} partidas` },
    { k: 'Incidencias', v: `${abiertas} abierta${abiertas === 1 ? '' : 's'}` },
  ];

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Bitácora de obra</h1>
        <button className="btn btn-outline">{B.proyecto.nombre} ▾</button>
        <div className="acciones">
          <button className="btn">Exportar bitácora</button>
          <Link to="/campo/bitacora" className="btn btn-primario"><Icono d={ICONO.mas} stroke={2.4} />Nuevo registro</Link>
        </div>
      </header>

      <div className="dos-col">
        <section className="col-principal">
          <div className="oscura" style={{ borderRadius: 26, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: '#E29C25', color: '#1E1E1F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{B.dia}</span><span style={{ fontSize: 11, fontWeight: 800 }}>SEP</span>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>Registro de hoy</div>
                <div style={{ fontSize: 13, color: '#D0D0D3' }}>{B.supervisor} · {B.horario} · clima {B.clima}</div>
              </div>
              <Badge tono="t-warn" style={{ fontSize: 12, padding: '5px 12px' }}>Borrador</Badge>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {hoy.map((t) => (
                <div key={t.k} style={{ flex: '1 1 130px', background: '#1E252B', borderRadius: 18, padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, color: '#D0D0D3', fontWeight: 600 }}>{t.k}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, whiteSpace: 'nowrap' }}>{t.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Actividades realizadas</div>
            {B.actividades.map((a) => {
              const terminada = a.estado === 'Terminada';
              return (
                <div key={a.titulo} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#F7F8F9', borderRadius: 16, padding: '12px 14px' }}>
                  <span className="icono-circulo" style={{ width: 40, height: 40, background: terminada ? '#0C0F11' : '#E29C25', color: terminada ? '#fff' : '#1E1E1F' }}><Icono d={ICONO.edificio} size={18} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{a.titulo}</div>
                    <div className="meta">{a.meta}</div>
                  </div>
                  <span className={'estado sin-punto ' + ACTIVIDAD_TONO[a.estado]}>{a.estado}</span>
                </div>
              );
            })}
          </div>

          <div className="card" style={{ gap: 14 }}>
            <div className="card-head">
              <div className="card-title">Evidencias del día · {B.fotos.length} fotos</div>
              <span className="meta" style={{ fontWeight: 600 }}>Arrastra fotos para adjuntarlas</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {B.fotos.map((f) => <div key={f} className="foto" style={{ flex: '1 1 140px', height: 110 }}>{f}</div>)}
            </div>
          </div>

          <div className="card">
            <label htmlFor="obs" className="card-title">Observaciones y problemas</label>
            <textarea id="obs" rows={3} defaultValue={B.observaciones}
              style={{ border: 0, background: '#F7F8F9', borderRadius: 16, padding: '14px 16px', font: 'inherit', fontSize: 13, lineHeight: 1.55, color: '#1E1E1F', resize: 'vertical' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-md btn-outline">Guardar borrador</button>
              <button className="btn btn-md btn-ambar">Firmar y cerrar día</button>
            </div>
          </div>
        </section>

        <aside className="col-lateral card" style={{ borderRadius: 26, padding: 24, gap: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Línea de tiempo</div>
            <button className="filtro sm">Filtrar ▾</button>
          </div>
          <LineaTiempo items={B.lineaTiempo.map(({ tipo, ...e }) => ({ ...e, icono: ICONO_EVENTO[tipo] }))} />
        </aside>
      </div>
    </>
  );
}
