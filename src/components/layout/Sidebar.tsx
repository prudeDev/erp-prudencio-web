import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Icono } from '../ui';
import type { ContadoresMenu } from '../../modulos/notificaciones/tipos';
import { useContadores } from '../../modulos/notificaciones/hooks';

export interface Modulo {
  ruta: string;
  texto: string;
  icono: string;
  contador?: keyof ContadoresMenu;
  listo?: boolean; // tiene vista diseñada
}

export const MODULOS: Modulo[] = [
  { ruta: '/', texto: 'Dashboard', icono: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z', listo: true },
  { ruta: '/proyectos', texto: 'Proyectos', icono: 'M3 21h18M6 21V8l6-4 6 4v13M10 21v-5h4v5M9 11h.01M15 11h.01', listo: true },
  { ruta: '/empleados', texto: 'Empleados', icono: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 12 0v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6', listo: true },
  { ruta: '/asistencias', texto: 'Asistencias', icono: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', listo: true },
  { ruta: '/nomina', texto: 'Nómina', icono: 'M3 7h18v12H3zM3 11h18M7 15h4', listo: true },
  { ruta: '/clientes', texto: 'Clientes', icono: 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 7h18v13H3zM3 13h18' },
  { ruta: '/proveedores', texto: 'Proveedores', icono: 'M2 6h12v10H2zM14 10h4l3 3v3h-7M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
  { ruta: '/cotizaciones', texto: 'Cotizaciones', icono: 'M6 3h12v18H6zM9 7h6M9 11h6M9 15h2M14 15h1M14 18h1M9 18h2' },
  { ruta: '/facturacion', texto: 'Facturación', icono: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3', contador: 'facturasVencidas', listo: true },
  { ruta: '/compras', texto: 'Compras y gastos', icono: 'M3 4h2l2.4 11h11L21 7H6.2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z' },
  { ruta: '/inventario', texto: 'Inventario', icono: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10' },
  { ruta: '/actividades', texto: 'Actividades', icono: 'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2' },
  { ruta: '/bitacora', texto: 'Bitácora de obra', icono: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11', listo: true },
  { ruta: '/evidencias', texto: 'Evidencias', icono: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', listo: true },
  { ruta: '/incidencias', texto: 'Incidencias', icono: 'M12 4l9 16H3zM12 10v4M12 17h.01', contador: 'incidenciasAbiertas' },
  { ruta: '/calendario', texto: 'Calendario', icono: 'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4' },
  { ruta: '/reportes', texto: 'Reportes', icono: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { ruta: '/notificaciones', texto: 'Notificaciones', icono: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4', contador: 'notificaciones' },
  { ruta: '/usuarios', texto: 'Usuarios y permisos', icono: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4' },
  { ruta: '/configuracion', texto: 'Configuración', icono: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4' },
];

export function Sidebar() {
  const { logout } = useAuth();
  const contadores = useContadores();
  const contador = (m: Modulo) => (m.contador && contadores.estado === 'listo' ? contadores.datos[m.contador] : 0);
  return (
    <nav aria-label="Navegación principal" className="sidebar">
      <Link to="/" className="sidebar-logo" aria-label="Construcciones Prudencio · inicio">
        <img src="/logo-prudencio.jpg" alt="Construcciones Prudencio" />
      </Link>
      {MODULOS.map((m) => (
        <NavLink key={m.ruta} to={m.ruta} end={m.ruta === '/'} className={({ isActive }) => 'sidebar-item' + (isActive ? ' activo' : '')}>
          <Icono d={m.icono} size={18} stroke={1.9} />
          <span className="lbl">{m.texto}</span>
          {contador(m) ? <span className="sidebar-badge">{contador(m)}</span> : null}
        </NavLink>
      ))}
      <div style={{ flexGrow: 1, minHeight: 18 }} />
      <button type="button" onClick={() => logout()} className="sidebar-salir" aria-label="Cerrar sesión" title="Cerrar sesión">
        <Icono d="M14 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7M10 12h10M17 8l4 4-4 4" size={24} />
      </button>
    </nav>
  );
}
