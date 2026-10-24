import { useState } from 'react';
import { Cargador, Filtros, Icono, ICONO, Tabs } from '../../components/ui';
import { numero } from '../../lib/format';
import { useEvidencias } from './hooks';
import type { Evidencias } from './tipos';

const RAYAS_ANTES = 'repeating-linear-gradient(135deg, rgba(0,0,0,0.05) 0 12px, transparent 12px 24px)';
const RAYAS_DESPUES = 'repeating-linear-gradient(135deg, rgba(47,87,126,0.07) 0 12px, transparent 12px 24px)';
const ETIQUETA = { fontSize: 11, fontWeight: 800, borderRadius: 8, padding: '5px 10px', position: 'absolute' as const, top: 14 };

export default function EvidenciasPage() {
  const evidencias = useEvidencias();
  return <Cargador consulta={evidencias}>{(e) => <VistaEvidencias {...e} />}</Cargador>;
}

function VistaEvidencias({ proyecto, totalFotos, etapas, comparativa: c, galeria }: Evidencias) {
  const [tab, setTab] = useState('Antes / después');
  const [modo, setModo] = useState<'lado' | 'slider'>('lado');
  const [pos, setPos] = useState(50);
  const fotos = tab === 'Todas' || tab === 'Antes / después' ? galeria : galeria.filter((g) => g.etapa === tab);

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Evidencias</h1>
          <div className="page-sub">{proyecto} · {numero(totalFotos)} fotografías · {etapas.length} etapas</div>
        </div>
        <button className="btn btn-primario"><Icono d={ICONO.subir} stroke={2.2} />Subir fotos</button>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <Tabs label="Etapas" items={['Todas', 'Antes / después', ...etapas].map((t) => ({ id: t, texto: t }))} activo={tab} onChange={setTab} />
        <div style={{ display: 'flex', gap: 8 }}><Filtros items={['Área: todas', 'Sep 2026']} /></div>
      </div>

      <div className="card" style={{ borderRadius: 26, gap: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <div className="card-title">Comparativa antes / después</div>
            <div className="card-sub">{c.descripcion}</div>
          </div>
          <div role="group" aria-label="Modo de comparación" className="segmentado">
            <button className={modo === 'lado' ? 'activo' : ''} onClick={() => setModo('lado')}>Lado a lado</button>
            <button className={modo === 'slider' ? 'activo' : ''} onClick={() => setModo('slider')}>Deslizador</button>
          </div>
        </div>

        {modo === 'lado' ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ flex: '1 1 300px', height: 320, borderRadius: 20, backgroundColor: '#D7DADD', backgroundImage: RAYAS_ANTES, position: 'relative' }}>
              <span style={{ ...ETIQUETA, left: 14, background: '#0C0F11', color: '#fff' }}>ANTES · {c.antes}</span>
              <span style={{ position: 'absolute', left: 14, bottom: 14, fontSize: 12, fontWeight: 700, color: '#4F4F52' }}>Foto antes · {c.lugar}</span>
            </div>
            <div style={{ flex: '1 1 300px', height: 320, borderRadius: 20, backgroundColor: '#DDE6EF', backgroundImage: RAYAS_DESPUES, position: 'relative' }}>
              <span style={{ ...ETIQUETA, left: 14, background: '#E29C25', color: '#1E1E1F' }}>DESPUÉS · {c.despues}</span>
              <span style={{ position: 'absolute', left: 14, bottom: 14, fontSize: 12, fontWeight: 700, color: '#2F577E' }}>Foto después · {c.lugar}</span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ position: 'relative', height: 320, borderRadius: 20, overflow: 'hidden', backgroundColor: '#DDE6EF', backgroundImage: RAYAS_DESPUES }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pos}%`, backgroundColor: '#D7DADD', backgroundImage: RAYAS_ANTES, borderRight: '4px solid #fff' }} />
              <span style={{ ...ETIQUETA, left: 14, background: '#0C0F11', color: '#fff' }}>ANTES · {c.antes}</span>
              <span style={{ ...ETIQUETA, right: 14, background: '#E29C25', color: '#1E1E1F' }}>DESPUÉS · {c.despues}</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, fontWeight: 700, color: '#4F4F52' }}>Comparar
              <input type="range" min={5} max={95} value={pos} onChange={(e) => setPos(Number(e.target.value))} style={{ flex: 1, accentColor: '#0C0F11' }} />
            </label>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="card-head">
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Galería · septiembre 2026</h2>
          <a href="#" style={{ fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Ver todas las etapas</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {fotos.map((g) => (
            <div key={g.titulo} style={{ background: '#fff', borderRadius: 20, padding: 8 }}>
              <div className="foto" style={{ height: 130, borderRadius: 14 }} />
              <div style={{ padding: '10px 6px 4px' }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{g.titulo}</div>
                <div style={{ fontSize: 11, color: '#626265' }}>{g.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
