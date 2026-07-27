import { useApi } from '../../shared/hooks/useApi';
import type { Reserva } from '../../shared/types';

export const useReservaApi = () => {
    const { callApi } = useApi();

    // Obtener las reservas del socio logueado (GET /reservas/mis-reservas)
    const obtenerMisReservas = () =>
        callApi<Reserva[]>('GET', '/reservas/mis-reservas');

    // Realizar una reserva (POST /reservas?claseId=X)
    const reservar = (claseId: number) =>
        callApi('POST', `/reservas?claseId=${claseId}`);

    // Cancelar una reserva (DELETE /reservas/{id})
    const cancelarReserva = (reservaId: number) =>
        callApi('DELETE', `/reservas/${reservaId}`);

    return { obtenerMisReservas, reservar, cancelarReserva };
};