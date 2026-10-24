import { useConsulta } from '../../lib/useConsulta';
import { obtenerContadores } from './api';

export const useContadores = () => useConsulta(obtenerContadores, []);
