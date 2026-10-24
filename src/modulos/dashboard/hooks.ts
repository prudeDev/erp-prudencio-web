import { useConsulta } from '../../lib/useConsulta';
import { obtenerDashboard } from './api';

export const useDashboard = () => useConsulta(obtenerDashboard, []);
