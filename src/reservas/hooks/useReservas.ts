import { useState, useEffect } from 'react';
import type { Reserva } from '../../shared/types';
import { useReservaApi } from '../api/reservaApi';

export const useReservas = () => {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { obtenerMisReservas, cancelar } = useReservaApi();

    const cargar = async () => {
        try {
            const res = await obtenerMisReservas();
            setReservas(res.data);
        } catch {
            setError('Error al cargar tus reservas');
        } finally {
            setCargando(false);
        }
    };

    const cancelarReserva = async (reservaId: number) => {
        await cancelar(reservaId);
        await cargar();
    };

    useEffect(() => { cargar(); }, []);

    return { reservas, cargando, error, cancelarReserva };
};