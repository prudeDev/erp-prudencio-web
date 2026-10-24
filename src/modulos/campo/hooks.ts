import { useConsulta } from '../../lib/useConsulta';
import { obtenerJornada } from './api';

export const useJornada = () => useConsulta(obtenerJornada, []);
