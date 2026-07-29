import { useState, useEffect } from 'react';
import type { Reserva } from '../../shared/types';
import { useReservaApi } from '../api/reservaApi';

export const useReservas = () => {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { obtenerMisReservas, reservar, cancelarReserva } = useReservaApi();

    const cargarReservas = async () => {
        try {
            setCargando(true);
            const res = await obtenerMisReservas();
            const data = (res as any)?.data ? (res as any).data : res;
            setReservas(data);
        } catch {
            setError('Error al cargar las reservas');
        } finally {
            setCargando(false);
        }
    };

    const hacerReserva = async (claseId: number) => {
        setError(null);
        await reservar(claseId);
        await cargarReservas();
    };

    const anularReserva = async (reservaId: number) => {
        setError(null);
        await cancelarReserva(reservaId);
        await cargarReservas();
    };

    useEffect(() => {
        cargarReservas();
    }, []);

    return { reservas, cargando, error, hacerReserva, anularReserva };
};