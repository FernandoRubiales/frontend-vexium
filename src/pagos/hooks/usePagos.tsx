import { useState, useEffect } from 'react';
import { usePagoApi } from '../api/pagoApi';
export const usePagos = () => {
    const [pagos, setPagos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { obtenerMisPagos } = usePagoApi();

    const cargarHistorial = async () => {
        try {
            setCargando(true);
            setError(null);
            const data = await obtenerMisPagos();
            const pagosData = (data as any)?.data ? (data as any).data : data;
            setPagos(pagosData);
        } catch (err: any) {
            const mensajeBackend = err.response?.data?.mensaje || err.response?.data?.message || err.message;
            setError(mensajeBackend || 'Error al cargar el historial de pagos');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarHistorial();
    }, []);

    return {
        pagos,
        cargando,
        error,
        recargarHistorial: cargarHistorial
    };
};