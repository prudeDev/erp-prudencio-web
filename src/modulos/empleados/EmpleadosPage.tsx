import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Badge, Barra, Buscador, Cargador, Estado, Filtros, Icono, ICONO, Kpi, Paginacion, usePaginacion } from '../../components/ui';
import { useDirectorio } from './hooks';
import { ESTATUS_TONO, type Empleado, type Plantilla } from './tipos';

export default function EmpleadosPage() {
  const directorio = useDirectorio();
  return <Cargador consulta={directorio}>{(d) => <Directorio {...d} />}</Cargador>;
}

function Directorio({ empleados, plantilla }: { empleados: Empleado[]; plantilla: Plantilla }) {
  const [vista, setVista] = useState<'tabla' | 'tarjetas'>('tabla');
  const pag = usePaginacion(empleados);

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Empleados</h1>
          <div className="page-sub">{plantilla.total} en plantilla · {plantilla.activos} activos · {plantilla.planta} planta / {plantilla.obraDeterminada} obra determinada</div>
        </div>
        <Buscador placeholder="Nombre o número de empleado…" />
        <button className="btn btn-primario"><Icono d={ICONO.mas} stroke={2.4} />Alta de empleado</button>
      </header>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
        <Kpi variante="oscura" label="Plantilla total" valor={plantilla.total} nota={<Badge tono="t-ok">+{plantilla.altasTrimestre} este trimestre</Badge>} />
        <Kpi variante="ambar" label="Activos" valor={plantilla.activos} nota={`${plantilla.presentesHoy} en obra hoy (${plantilla.porcentajeHoy}%)`} />
        <Kpi label="Vacaciones" valor={plantilla.vacaciones} nota={`${plantilla.regresanSemana} regresan esta semana`} />
        <Kpi label="Incapacidades" valor={plantilla.incapacidades} nota={`${plantilla.incapacidadRiesgo} por riesgo de trabajo`} />
        <Kpi label="Bajas del mes" valor={plantilla.bajasMes} nota={`Rotación ${((plantilla.bajasMes / plantilla.total) * 100).toFixed(1)}%`} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}><Filtros items={['Área', 'Puesto', 'Proyecto', 'Supervisor', 'Estatus']} /></div>
        <div role="group" aria-label="Vista" className="segmentado">
          <button className={vista === 'tabla' ? 'activo' : ''} onClick={() => setVista('tabla')}>Tabla</button>
          <button className={vista === 'tarjetas' ? 'activo' : ''} onClick={() => setVista('tarjetas')}>Tarjetas</button>
        </div>
      </div>

      {vista === 'tabla' ? (
        <div className="tabla-wrap">
          <div className="tabla">
            <div className="tabla-head t-emp">
              <span>Empleado</span><span>Puesto</span><span className="c-md">Área</span><span className="c-sm">Asignación</span><span className="c-md">Supervisor</span><span className="c-sm">Asistencia 30 d</span><span>Estatus</span>
            </div>
            {pag.filas.map((e, k) => { const i = pag.inicio + k; return (
              <div key={e.num} className="tabla-fila t-emp" style={{ padding: '11px 18px' }}>
                <div className="persona">
                  <Avatar ini={e.ini} i={i} />
                  <div style={{ minWidth: 0 }}>
                    <Link to={`/empleados/${e.num}`} className="persona-nombre trunc" style={{ textDecoration: 'none', display: 'block' }}>{e.nombre}</Link>
                    <div className="meta">No. {e.num} · {e.contrato}</div>
                  </div>
                </div>
                <span>{e.puesto}</span>
                <span className="gris3 c-md">{e.area}</span>
                <span className="gris3 c-sm">{e.asignacion.texto}</span>
                <span className="gris3 c-md">{e.supervisor?.corto ?? '—'}</span>
                <div className="c-sm" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Barra valor={e.asistencia30} color={e.asistencia30 < 85 ? '#D46A6A' : undefined} />
                  <span style={{ fontSize: 12, fontWeight: 800, width: 36, textAlign: 'right' }}>{e.asistencia30}%</span>
                </div>
                <span><Estado tono={ESTATUS_TONO[e.estatus]}>{e.estatus}</Estado></span>
              </div>
            ); })}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14 }}>
          {pag.filas.map((e, k) => { const i = pag.inicio + k; return (
            <Link key={e.num} to={`/empleados/${e.num}`} className="card" style={{ textDecoration: 'none', color: 'inherit', gap: 10 }}>
              <div className="persona">
                <Avatar ini={e.ini} i={i} size={44} />
                <div style={{ minWidth: 0 }}>
                  <div className="persona-nombre trunc">{e.nombre}</div>
                  <div className="meta">{e.puesto}</div>
                </div>
              </div>
              <div className="meta">No. {e.num} · {e.asignacion.texto}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Estado tono={ESTATUS_TONO[e.estatus]}>{e.estatus}</Estado>
                <span style={{ fontSize: 12, fontWeight: 800 }}>{e.asistencia30}% asist.</span>
              </div>
            </Link>
          ); })}
        </div>
      )}

      <Paginacion pagina={pag.pagina} paginas={pag.paginas} ir={pag.ir}>
        {pag.desde}–{pag.hasta} de {pag.total} empleados
      </Paginacion>
    </>
  );
}
