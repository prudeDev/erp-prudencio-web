import { useConsulta } from '../../lib/useConsulta';
import { obtenerCartera } from './api';

export const useCartera = () => useConsulta(obtenerCartera, []);
