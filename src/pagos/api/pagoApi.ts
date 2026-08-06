import { useApi } from '../../shared/hooks/useApi';
import type { SocioPlan } from '../../shared/types';

export const usePagoApi = () => {
    const { callApi } = useApi();

    const buscarPlanesPendientesPorDni = (dni: number) =>
        callApi<SocioPlan[]>('GET', `/socio_plan/pendientes/dni/${dni}`);

    const registrarPagoEfectivo = (socioPlanId: number, montoPago: number) =>
        callApi('POST', '/pagos/efectivo', { socioPlanId, montoPago });

    const obtenerMisPagos = () =>
        callApi<any[]>('GET', '/pagos/mis-pagos');

    const obtenerTodosLosPagos = (page = 0, size = 10) =>
        callApi<any>('GET', `/pagos/todos?page=${page}&size=${size}`);

    return { buscarPlanesPendientesPorDni, registrarPagoEfectivo, obtenerMisPagos, obtenerTodosLosPagos };
};