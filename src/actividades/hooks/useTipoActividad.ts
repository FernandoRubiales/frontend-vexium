import { useState, useEffect } from 'react';
import { useTipoActividadApi } from '../api/tipoActividadApi';

export const useTipoActividad = () => {
    const [tiposActividad, setTiposActividad] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { obtenerTodas, crearActividad, actualizarActividad, darDeBajaActividad } = useTipoActividadApi();

    const cargarTipos = async () => {
        try {
            setCargando(true);
            setError(null);
            const data = await obtenerTodas();
            const lista = (data as any)?.data ? (data as any).data : data;
            setTiposActividad(Array.isArray(lista) ? lista : []);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los tipos de actividad');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarTipos();
    }, []);

    const crear = async (formData: any) => {
        await crearActividad(formData);
        await cargarTipos();
    };

    const actualizar = async (id: number, formData: any) => {
        await actualizarActividad(id, formData);
        await cargarTipos();
    };

    const darDeBaja = async (id: number) => {
        await darDeBajaActividad(id);
        await cargarTipos();
    };

    return {
        tiposActividad,
        cargando,
        error,
        recargarTipos: cargarTipos,
        crearActividad: crear,
        actualizarActividad: actualizar,
        darDeBajaActividad: darDeBaja
    };
};