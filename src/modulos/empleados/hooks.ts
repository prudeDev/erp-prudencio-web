import { useConsulta } from '../../lib/useConsulta';
import { listarEmpleados, obtenerExpediente, resumenPlantilla } from './api';

/** Lista de empleados junto con los totales de plantilla. */
export const useDirectorio = () =>
  useConsulta(async () => {
    const [empleados, plantilla] = await Promise.all([listarEmpleados(), resumenPlantilla()]);
    return { empleados, plantilla };
  }, []);

export const useExpediente = (num: string) => useConsulta(() => obtenerExpediente(num), [num]);
