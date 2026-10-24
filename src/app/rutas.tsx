import { Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import Proximamente from '../components/layout/Proximamente';
import { MODULOS } from '../components/layout/Sidebar';
import { RequireAuth } from '../auth/RequireAuth';
import LoginPage from '../auth/LoginPage';
import CambiarPasswordPage from '../auth/CambiarPasswordPage';
import DashboardPage from '../modulos/dashboard/DashboardPage';
import ProyectosPage from '../modulos/proyectos/ProyectosPage';
import EmpleadosPage from '../modulos/empleados/EmpleadosPage';
import PerfilEmpleadoPage from '../modulos/empleados/PerfilEmpleadoPage';
import AsistenciasPage from '../modulos/asistencias/AsistenciasPage';
import NominaPage from '../modulos/nomina/NominaPage';
import FacturacionPage from '../modulos/facturacion/FacturacionPage';
import BitacoraPage from '../modulos/bitacora/BitacoraPage';
import EvidenciasPage from '../modulos/evidencias/EvidenciasPage';
import { MovilBitacora, MovilPaseLista, TabletAsistencias } from '../modulos/campo/CampoPages';

export function Rutas() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="cambiar-password" element={<CambiarPasswordPage />} />
      <Route element={<RequireAuth><AppShell /></RequireAuth>}>
        <Route index element={<DashboardPage />} />
        <Route path="proyectos" element={<ProyectosPage />} />
        <Route path="empleados" element={<EmpleadosPage />} />
        <Route path="empleados/:num" element={<PerfilEmpleadoPage />} />
        <Route path="asistencias" element={<AsistenciasPage />} />
        <Route path="nomina" element={<NominaPage />} />
        <Route path="facturacion" element={<FacturacionPage />} />
        <Route path="bitacora" element={<BitacoraPage />} />
        <Route path="evidencias" element={<EvidenciasPage />} />
        {MODULOS.filter((m) => !m.listo).map((m) => <Route key={m.ruta} path={m.ruta} element={<Proximamente />} />)}
      </Route>
      <Route path="campo/tablet" element={<RequireAuth><TabletAsistencias /></RequireAuth>} />
      <Route path="campo/lista" element={<RequireAuth><MovilPaseLista /></RequireAuth>} />
      <Route path="campo/bitacora" element={<RequireAuth><MovilBitacora /></RequireAuth>} />
    </Routes>
  );
}
