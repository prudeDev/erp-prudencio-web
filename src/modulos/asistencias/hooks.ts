import { useConsulta } from '../../lib/useConsulta';
import { obtenerAsistenciaDia } from './api';

export const useAsistenciaDia = () => useConsulta(obtenerAsistenciaDia, []);
