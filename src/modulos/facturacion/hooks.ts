import { useConsulta } from '../../lib/useConsulta';
import { obtenerFacturacion } from './api';

export const useFacturacion = () => useConsulta(obtenerFacturacion, []);
