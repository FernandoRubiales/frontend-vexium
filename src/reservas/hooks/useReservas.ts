import { useState, useEffect } from 'react';
import type { Reserva } from '../../shared/types';
import { useReservaApi } from '../api/reservaApi';

export const useMisReservas = () => {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { obtenerMisReservas } = useReservaApi();

    const cargar = async () => {
        try {
            setCargando(true);
            setError(null);
            const data = await obtenerMisReservas();
            const lista = (data as any)?.data ? (data as any).data : data;
            setReservas(Array.isArray(lista) ? lista : []);
        } catch (e) {
            setError('Error al cargar tus reservas');
            setReservas([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    return { reservas, cargando, error, recargar: cargar };
};