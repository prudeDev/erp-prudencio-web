import { useEffect, useState, type DependencyList } from 'react';
import { ApiError } from './api';

export type Consulta<T> =
  | { estado: 'cargando' }
  | { estado: 'listo'; datos: T }
  | { estado: 'error'; error: ApiError };

/**
 * Ejecuta una lectura async y expone su estado. Se vuelve a ejecutar cuando cambian `deps`;
 * si llega la respuesta de una ejecución anterior, se descarta.
 */
export function useConsulta<T>(cargar: () => Promise<T>, deps: DependencyList): Consulta<T> {
  const [consulta, setConsulta] = useState<Consulta<T>>({ estado: 'cargando' });

  useEffect(() => {
    let vigente = true;
    setConsulta({ estado: 'cargando' });
    cargar()
      .then((datos) => { if (vigente) setConsulta({ estado: 'listo', datos }); })
      .catch((e: unknown) => {
        if (!vigente) return;
        const error = e instanceof ApiError ? e : new ApiError(0, 'ERROR', 'Ocurrió un error');
        setConsulta({ estado: 'error', error });
      });
    return () => { vigente = false; };
  }, deps);

  return consulta;
}
