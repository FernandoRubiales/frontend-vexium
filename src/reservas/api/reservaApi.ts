import { useApi } from '../../shared/hooks/useApi';
import type { Reserva } from '../../shared/types';
export const useReservaApi = () => {
    const { callApi } = useApi();

    // Obtener las reservas del socio logueado
    const obtenerMisReservas = () =>
        callApi<Reserva[]>('GET', '/reservas/mis-reservas');

    // Realizar una reserva nueva
    const reservar = (claseId: number) =>
        callApi('POST', `/reservas?claseId=${claseId}`);

    // Cancelar una reserva existente
    const cancelarReserva = (reservaId: number) =>
        callApi('DELETE', `/reservas/${reservaId}`);

    return { obtenerMisReservas, reservar, cancelarReserva };
};