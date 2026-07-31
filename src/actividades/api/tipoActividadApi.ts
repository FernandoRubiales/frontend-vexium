import { useApi } from '../../shared/hooks/useApi';

export const useTipoActividadApi = () => {
    const { callApi } = useApi();

    const obtenerTodas = () =>
        callApi<any[]>('GET', '/tipo-actividad');

    const crearActividad = (data: any) =>
        callApi<any>('POST', '/tipo-actividad', data);

    const actualizarActividad = (id: number, data: any) =>
        callApi<any>('PUT', `/tipo-actividad/${id}`, data);

    const darDeBajaActividad = (id: number) =>
        callApi<void>('DELETE', `/tipo-actividad/${id}`);

    return { obtenerTodas, crearActividad, actualizarActividad, darDeBajaActividad };
};