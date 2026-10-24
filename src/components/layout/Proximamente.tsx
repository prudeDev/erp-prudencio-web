import { useLocation } from 'react-router-dom';
import { Icono } from '../ui';
import { MODULOS } from './Sidebar';

export default function Proximamente() {
  const { pathname } = useLocation();
  const m = MODULOS.find((x) => x.ruta === pathname);
  return (
    <>
      <header className="page-header"><h1 className="page-title">{m?.texto ?? 'Módulo'}</h1></header>
      <div className="card" style={{ alignItems: 'center', textAlign: 'center', padding: 48 }}>
        {m && <span className="icono-circulo" style={{ width: 56, height: 56, background: '#E29C25' }}><Icono d={m.icono} size={24} /></span>}
        <div className="card-title">Vista pendiente de diseño</div>
        <div className="card-sub">Este módulo forma parte del ERP pero aún no tiene pantalla en el rediseño.</div>
      </div>
    </>
  );
}
