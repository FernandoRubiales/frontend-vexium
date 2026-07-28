import { useApi } from '../../shared/hooks/useApi';
import type { Reserva } from '../../shared/types';

export const useReservaApi = () => {
    const { callApi } = useApi();

    const obtenerMisReservas = () =>
        callApi<Reserva[]>('GET', '/reservas/mis-reservas');

    const reservar = (claseId: number) =>
        callApi('POST', '/reservas', { claseId });

    const cancelarReserva = (reservaId: number) =>
        callApi('DELETE', `/reservas/${reservaId}`);

    return { obtenerMisReservas, reservar, cancelarReserva };
};