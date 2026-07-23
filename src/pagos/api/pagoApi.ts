import { useApi } from '../../shared/hooks/useApi';
import type { SocioPlan } from '../../shared/types';

export const usePagoApi = () => {
    const { callApi } = useApi();

    const buscarPlanesPendientesPorDni = (dni: number) =>
        callApi<SocioPlan[]>('GET', `/socio-plan/pendientes/dni/${dni}`);

    const registrarPagoEfectivo = (socioPlanId: number, montoPago: number) =>
        callApi('POST', '/pagos/efectivo', { socioPlanId, montoPago });

    return { buscarPlanesPendientesPorDni, registrarPagoEfectivo };
};