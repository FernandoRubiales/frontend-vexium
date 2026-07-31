import { useState, useEffect } from 'react';
import type { Clase } from '../../shared/types';
import { useClaseApi } from '../api/claseApi';

export const useClases = (soloDisponibles = false) => {
    const [clases, setClases] = useState<Clase[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { obtenerDisponiblesHoy, obtenerTodas, crearClase, actualizarClase, darDeBajaClase } = useClaseApi();

    const cargar = async () => {
        try {
            setCargando(true);
            setError(null);

            const data = soloDisponibles
                ? await obtenerDisponiblesHoy()
                : await obtenerTodas();

            const lista = (data as any)?.data ? (data as any).data : data;
            setClases(Array.isArray(lista) ? lista : []);
        } catch (e) {
            setError('Error al cargar las clases');
            setClases([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
    }, [soloDisponibles]);

    const crear = async (formData: any) => {
        await crearClase(formData);
        await cargar();
    };

    const actualizar = async (id: number, formData: any) => {
        await actualizarClase(id, formData);
        await cargar();
    };

    const darDeBaja = async (id: number) => {
        await darDeBajaClase(id);
        await cargar();
    };

    return {
        clases,
        cargando,
        error,
        recargar: cargar,
        crearClase: crear,
        actualizarClase: actualizar,
        darDeBajaClase: darDeBaja
    };
};