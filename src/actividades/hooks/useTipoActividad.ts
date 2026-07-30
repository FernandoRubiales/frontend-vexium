import { useState, useEffect } from 'react';
import { useTipoActividadApi } from '../api/tipoActividadApi';

export const useTipoActividad = () => {
    const [tiposActividad, setTiposActividad] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { obtenerTodas } = useTipoActividadApi();

    const cargarTipos = async () => {
        try {
            setCargando(true);
            setError(null);
            const data = await obtenerTodas();
            const lista = (data as any)?.data ? (data as any).data : data;
            setTiposActividad(lista);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los tipos de actividad');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarTipos();
    }, []);

    return {
        tiposActividad,
        cargando,
        error,
        recargarTipos: cargarTipos
    };
};