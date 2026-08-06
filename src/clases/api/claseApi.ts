import { useApi } from '../../shared/hooks/useApi';
import type { Clase } from '../../shared/types';

export const useClaseApi = () => {
    const { callApi } = useApi();

    const obtenerDisponiblesHoy = () =>
        callApi<Clase[]>('GET', '/clases/disponibles');

    const obtenerTodas = () =>
        callApi<Clase[]>('GET', '/clases/todas');

    const crearClase = (data: any) =>
        callApi<Clase>('POST', '/clases', data);

    const actualizarClase = (id: number, data: any) =>
        callApi<Clase>('PUT', `/clases/${id}`, data);

    const darDeBajaClase = (id: number) =>
        callApi<void>('DELETE', `/clases/${id}`);

    const obtenerClasesDelDia = (diaSemana: string) =>
        callApi('GET', `/clases/dia/${diaSemana}`);

    return {
        obtenerDisponiblesHoy,
        obtenerTodas,
        crearClase,
        actualizarClase,
        darDeBajaClase,
        obtenerClasesDelDia
    };
};