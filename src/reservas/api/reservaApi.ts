import { useApi } from '../../shared/hooks/useApi';
import type { Reserva } from '../../shared/types';

export const useReservaApi = () => {
    const { callApi } = useApi();

    const reservar = (claseId: number) =>
        callApi<Reserva>('POST', '/reservas', { claseId });

    const cancelar = (reservaId: number) =>
        callApi<void>('DELETE', `/reservas/${reservaId}`);

    const obtenerMisReservas = () =>
        callApi<Reserva[]>('GET', '/reservas/mis-reservas');

    return { reservar, cancelar, obtenerMisReservas };
};