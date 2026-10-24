import { useState } from 'react';
import { Avatar, Badge, Cargador, Kpi } from '../../components/ui';
import { millones, numero, pesos, pesosCentavos } from '../../lib/format';
import { usePeriodoActual } from './hooks';
import type { PeriodoNomina } from './tipos';

const COLS = 'minmax(0, 2.1fr) minmax(0, 1fr) minmax(0, 0.45fr) repeat(3, minmax(0, 0.9fr)) minmax(0, 1fr)';

export default function NominaPage() {
  const periodo = usePeriodoActual();
  return <Cargador consulta={periodo}>{(p) => <VistaNomina {...p} />}</Cargador>;
}

function VistaNomina({ periodo, totales: t, lineas }: PeriodoNomina) {
  const [sel, setSel] = useState(0);
  const l = lineas[sel];
  const e = l.empleado;
  const recibo = [
    { k: `Salario base · ${l.dias} días`, v: l.base },
    ...(l.horasExtra ? [{ k: `Horas extra · ${l.horasExtra} h`, v: l.importeExtra }] : []),
    ...(l.bonos ? [{ k: 'Bono de puntualidad y productividad', v: l.bonos }] : []),
    ...l.deducciones.map((d) => ({ k: d.concepto, v: -d.importe })),
  ];

  return (
    <>
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 className="page-title">Nómina</h1>
            <div className="page-sub">Periodo {periodo.numero} · {periodo.texto}</div>
          </div>
          <Badge tono="t-warn" style={{ fontSize: 12, padding: '5px 12px' }}>{periodo.estado}</Badge>
        </div>
        <div className="acciones">
          <button className="btn">Generar recibos</button>
          <button className="btn btn-primario">Autorizar y timbrar</button>
        </div>
      </header>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
        <Kpi variante="oscura" label="Total a pagar" valor={millones(t.neto / 1e6)} nota={`Periodo ${periodo.numero} · ${periodo.dias} días`} />
        <Kpi label="Empleados en nómina" valor={t.empleados} nota={`${t.planta} planta · ${t.obraDeterminada} obra det.`} />
        <Kpi label="Horas extra" valor={`${numero(t.horasExtraHoras)} h`} nota={`${pesos(t.horasExtra)} en el periodo`} />
        <Kpi label="Deducciones" valor={pesos(t.deducciones)} nota="ISR, IMSS, préstamos, retardos" />
        <Kpi variante="ambar" label="Incidencias por revisar" valor={t.incidenciasPorRevisar} nota="faltas y retardos sin aplicar" />
      </div>

      <div className="dos-col" style={{ gap: 20 }}>
        <section className="col-principal" style={{ gap: 6 }}>
          <div className="tabla-wrap">
            <div className="tabla" style={{ minWidth: 640, gap: 6 }}>
              <div className="tabla-head" style={{ gridTemplateColumns: COLS, gap: 8, padding: '0 12px', fontSize: 11 }}>
                <span>Empleado</span><span className="der">Salario base</span><span className="der">Días</span><span className="der">H. extra</span><span className="der">Bonos</span><span className="der">Deducciones</span><span className="der">Neto</span>
              </div>
              {lineas.map((r, i) => {
                const emp = r.empleado;
                return (
                  <button key={emp.num} onClick={() => setSel(i)} className="tabla-fila"
                    style={{ gridTemplateColumns: COLS, gap: 8, border: `2px solid ${sel === i ? '#E29C25' : 'transparent'}`, borderRadius: 14, padding: '5px 10px', fontSize: 12, textAlign: 'left', cursor: 'pointer' }}>
                    <span className="persona" style={{ gap: 10 }}>
                      <Avatar ini={emp.ini} i={i} size={30} />
                      <span style={{ minWidth: 0 }}>
                        <span className="trunc" style={{ display: 'block', fontWeight: 700 }}>{emp.nombre}</span>
                        <span className="trunc" style={{ display: 'block', fontSize: 10.5, color: '#626265' }}>{emp.puesto}</span>
                      </span>
                    </span>
                    <span className="der">{pesos(r.base)}</span>
                    <span className="der">{r.dias}</span>
                    <span className="der">{pesos(r.importeExtra)}</span>
                    <span className="der">{pesos(r.bonos)}</span>
                    <span className="der" style={{ color: '#A8302F' }}>{pesos(r.totalDeducciones)}</span>
                    <span className="der" style={{ fontWeight: 800 }}>{pesos(r.neto)}</span>
                  </button>
                );
              })}
              <div className="tabla-fila tabla-total" style={{ gridTemplateColumns: COLS, gap: 8, borderRadius: 14, padding: '11px 12px', fontSize: 12, fontWeight: 700 }}>
                <span>Total periodo · {t.empleados} empleados</span>
                <span className="der">{pesos(t.base)}</span><span />
                <span className="der">{pesos(t.horasExtra)}</span><span className="der">{pesos(t.bonos)}</span><span className="der">{pesos(t.deducciones)}</span>
                <span className="der" style={{ fontWeight: 800 }}>{pesos(t.neto)}</span>
              </div>
            </div>
          </div>
          <div className="pie-tabla" style={{ marginTop: 6 }}><span>Mostrando {lineas.length} de {t.empleados} empleados · cuadrilla Plaza Altaria</span></div>
        </section>

        <aside className="col-lateral" style={{ background: '#fff', borderRadius: 26, overflow: 'hidden', gap: 0 }}>
          <div className="oscura" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Recibo de nómina</span>
              <span className="badge" style={{ background: '#E29C25', color: '#1E1E1F' }}>Vista previa · CFDI 4.0</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
              <Avatar ini={e.ini} size={48} colores={['#E29C25', '#1E1E1F']} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{e.nombre}</div>
                <div style={{ fontSize: 12, color: '#D0D0D3' }}>No. {e.num} · {e.puesto}</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '18px 22px 22px', display: 'flex', flexDirection: 'column' }}>
            {recibo.map((x) => (
              <div key={x.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ECEEF0', fontSize: 13, fontWeight: 600 }}>
                <span className="gris3">{x.k}</span><span style={{ color: x.v < 0 ? '#A8302F' : '#1E1E1F', fontWeight: 700 }}>{pesosCentavos(x.v)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#E29C25', borderRadius: 16, padding: '14px 16px', marginTop: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Neto a pagar</span><span style={{ fontSize: 22, fontWeight: 800 }}>{pesosCentavos(l.neto)}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-md btn-outline" style={{ flex: 1 }}>Descargar PDF</button>
              <button className="btn btn-md btn-primario" style={{ flex: 1 }}>Enviar</button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
