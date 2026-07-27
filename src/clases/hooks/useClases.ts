import { useState, useEffect } from 'react';
import type { Clase } from '../../shared/types';
import { useClaseApi } from '../api/claseApi';

export const useClases = (soloDisponibles = true) => {
    const [clases, setClases] = useState<Clase[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { obtenerDisponiblesHoy, obtenerTodas } = useClaseApi();

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

    return { clases, cargando, error, recargar: cargar };
};