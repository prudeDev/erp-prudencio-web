import { useConsulta } from '../../lib/useConsulta';
import { obtenerEvidencias } from './api';

export const useEvidencias = () => useConsulta(obtenerEvidencias, []);
