import { useApi } from '../../shared/hooks/useApi';
import type { Clase } from '../../shared/types';

export const useClaseApi = () => {
    const { callApi } = useApi();

    const obtenerDisponiblesHoy = () =>
        callApi<Clase[]>('GET', '/clases/disponibles');

    const obtenerTodas = () =>
        callApi<Clase[]>('GET', '/clases/todas');

    return { obtenerDisponiblesHoy, obtenerTodas };
};