import { useState, useEffect } from 'react';
import type { Reserva } from '../../shared/types';
import { useReservaApi } from '../api/reservaApi';

export const useReservas = () => {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { obtenerMisReservas, obtenerReservasPorClase, reservar, cancelarReserva } = useReservaApi();

    const cargarReservas = async () => {
        try {
            setCargando(true);
            const res = await obtenerMisReservas();
            const data = (res as any)?.data ? (res as any).data : res;
            setReservas(Array.isArray(data) ? data : []);
        } catch {
            setError('Error al cargar las reservas');
        } finally {
            setCargando(false);
        }
    };

    const cargarReservasDeClase = async (claseId: number): Promise<Reserva[]> => {
        try {
            const res = await obtenerReservasPorClase(claseId);
            const resultado = (res as any)?.data ? (res as any).data : res;
            return resultado as Reserva[];
        } catch (err: any) {
            const msj = err.response?.data?.mensaje || 'Error al obtener las reservas de la clase';
            throw new Error(msj);
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

    return {
        reservas,
        cargando,
        error,
        hacerReserva,
        anularReserva,
        cargarReservasDeClase
    };
};