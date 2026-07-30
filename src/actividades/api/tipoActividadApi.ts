import { useApi } from '../../shared/hooks/useApi';

export const useTipoActividadApi = () => {
    const { callApi } = useApi();

    const obtenerTodas = () =>
        callApi<any[]>('GET', '/tipo-actividad');

    return { obtenerTodas };
};