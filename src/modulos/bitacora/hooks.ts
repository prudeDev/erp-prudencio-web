import { useConsulta } from '../../lib/useConsulta';
import { obtenerBitacoraDia } from './api';

export const useBitacoraDia = () => useConsulta(obtenerBitacoraDia, []);
