import { useConsulta } from '../../lib/useConsulta';
import { obtenerPeriodoActual } from './api';

export const usePeriodoActual = () => useConsulta(obtenerPeriodoActual, []);
