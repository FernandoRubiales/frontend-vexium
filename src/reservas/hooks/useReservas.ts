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
        try {
            setError(null);
            await reservar(claseId);
            await cargarReservas();
            alert('¡Clase reservada con éxito!');
        } catch (err: any) {
            const mensajeBackend = err.response?.data?.mensaje || err.response?.data?.message || err.message;
            alert(`Error al reservar: ${mensajeBackend}`);
        }
    };

    const anularReserva = async (reservaId: number) => {
        if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;
        try {
            setError(null);
            await cancelarReserva(reservaId);
            await cargarReservas();
            alert('Reserva cancelada correctamente');
        } catch (err: any) {
            const mensajeBackend = err.response?.data?.mensaje || err.response?.data?.message || err.message;
            alert(`Error al cancelar: ${mensajeBackend}`);
        }
    };

    useEffect(() => {
        cargarReservas();
    }, []);

    return { reservas, cargando, error, hacerReserva, anularReserva };
};