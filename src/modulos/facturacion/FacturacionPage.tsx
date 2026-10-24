import { useState } from 'react';
import { Avatar, Barra, Cargador, Estado, Icono, ICONO, Tabs } from '../../components/ui';
import { millones, pesos } from '../../lib/format';
import { useFacturacion } from './hooks';
import { ESTATUS_FACTURA_TONO, type EstatusFactura, type Facturacion } from './tipos';

type Tab = 'Todas' | EstatusFactura;
const COLS = 'minmax(0, 0.7fr) minmax(0, 1.4fr) minmax(0, 1.8fr) repeat(2, minmax(0, 0.7fr)) minmax(0, 1fr) minmax(0, 0.9fr) minmax(0, 0.9fr)';

export default function FacturacionPage() {
  const facturacion = useFacturacion();
  return <Cargador consulta={facturacion}>{(f) => <VistaFacturacion {...f} />}</Cargador>;
}

function VistaFacturacion({ resumen: R, facturas }: Facturacion) {
  const [tab, setTab] = useState<Tab>('Todas');
  const tabs: { id: Tab; texto: string; conteo: number }[] = [
    { id: 'Todas', texto: 'Emitidas', conteo: R.emitidas },
    { id: 'Pendiente', texto: 'Pendientes', conteo: R.pendientes },
    { id: 'Vencida', texto: 'Vencidas', conteo: R.vencidas },
    { id: 'Pagada', texto: 'Pagadas', conteo: R.pagadas },
    { id: 'Borrador', texto: 'Borradores', conteo: R.borradores },
  ];
  const filas = facturas.filter((f) => (tab === 'Todas' ? f.estatus !== 'Borrador' : f.estatus === tab));
  const conteo = tabs.find((t) => t.id === tab)!.conteo;

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Facturación</h1>
          <div className="page-sub">Ejercicio 2026 · {R.emitidas} facturas emitidas</div>
        </div>
        <div className="acciones">
          <button className="btn">Conciliar pagos</button>
          <button className="btn btn-primario"><Icono d={ICONO.mas} stroke={2.4} />Nueva factura</button>
        </div>
      </header>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <div className="kpi oscura" style={{ justifyContent: 'space-between', minHeight: 170 }}>
          <div className="kpi-label">Total facturado 2026</div>
          <div className="kpi-valor" style={{ fontSize: 38 }}>{millones(R.facturado)}</div>
          <div className="kpi-nota">{R.emitidas} facturas emitidas</div>
        </div>
        <div className="kpi" style={{ justifyContent: 'space-between', minHeight: 170 }}>
          <div className="kpi-label">Total cobrado</div>
          <div className="kpi-valor" style={{ fontSize: 38 }}>{millones(R.cobrado)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Barra valor={R.recuperacion} color="#E29C25" alto={10} />
            <span style={{ fontSize: 12, fontWeight: 800 }}>{R.recuperacion}% de recuperación</span>
          </div>
        </div>
        <div className="kpi" style={{ justifyContent: 'space-between', minHeight: 170 }}>
          <div><div className="kpi-label">Por cobrar (vigente)</div><div className="kpi-valor">{millones(R.porCobrar)}</div></div>
          <span className="estado sin-punto t-warn" style={{ alignSelf: 'flex-start' }}>{R.pendientes} facturas pendientes</span>
        </div>
        <div className="kpi" style={{ justifyContent: 'space-between', minHeight: 170 }}>
          <div><div className="kpi-label">Vencidas</div><div className="kpi-valor" style={{ color: '#A8302F' }}>{millones(R.vencido)}</div></div>
          <span className="estado sin-punto t-bad" style={{ alignSelf: 'flex-start' }}>{R.vencidas} facturas · {R.clientesVencidos} clientes</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <Tabs label="Estatus de facturas" items={tabs} activo={tab} onChange={setTab} />
        <button className="filtro">Cliente: todos ▾</button>
      </div>

      <div className="tabla-wrap">
        <div className="tabla" style={{ minWidth: 1040 }}>
          <div className="tabla-head" style={{ gridTemplateColumns: COLS }}>
            <span>Folio</span><span>Cliente</span><span>Proyecto / concepto</span><span>Emisión</span><span>Vence</span><span className="der">Total</span><span>Estatus</span><span>Adjuntos</span>
          </div>
          {filas.map((r, i) => (
            <div key={r.folio + r.cliente} className="tabla-fila" style={{ gridTemplateColumns: COLS }}>
              <span style={{ fontWeight: 800 }}>{r.folio}</span>
              <div className="persona" style={{ gap: 10 }}>
                <Avatar ini={r.ini} i={i} size={34} />
                <span className="trunc" style={{ fontWeight: 700 }}>{r.cliente}</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="trunc" style={{ fontWeight: 700 }}>{r.proyecto}</div>
                <div style={{ fontSize: 11, color: '#626265' }}>{r.concepto}</div>
              </div>
              <span className="gris3">{r.emision}</span>
              <span className="gris3">{r.vence}</span>
              <span className="der" style={{ fontWeight: 800 }}>{pesos(r.total)}</span>
              <span><Estado tono={ESTATUS_FACTURA_TONO[r.estatus]}>{r.estatus}</Estado></span>
              <span style={{ display: 'flex', gap: 6 }}>
                {r.estatus === 'Borrador' ? <span className="meta">—</span> : ['PDF', 'XML'].map((a) => (
                  <a key={a} href="#" style={{ fontSize: 11, fontWeight: 800, color: '#1E1E1F', background: '#F4F5F6', borderRadius: 8, padding: '4px 8px', textDecoration: 'none' }}>{a}</a>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="pie-tabla"><span>Mostrando {filas.length} de {conteo} · más recientes</span></div>
    </>
  );
}
