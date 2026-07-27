import { useApi } from '../../shared/hooks/useApi';
import type { Reserva } from '../../shared/types';

export const useReservaApi = () => {
    const { callApi } = useApi();

    const obtenerMisReservas = () =>
        callApi<Reserva[]>('GET', '/reservas/mis-reservas');

    // Realizar una reserva
    const reservar = (claseId: number) =>
        callApi('POST', '/reservas', { claseId });

    // Cancelar una reserva
    const cancelarReserva = (reservaId: number) =>
        callApi('DELETE', `/reservas/${reservaId}`);

    return { obtenerMisReservas, reservar, cancelarReserva };
};