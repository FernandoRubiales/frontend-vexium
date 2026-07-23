import { useState, useEffect } from 'react';
import type { Clase } from '../../shared/types';
import { useClaseApi } from '../api/claseApi';

export const useClases = (soloDisponibles = false) => {
    const [clases, setClases] = useState<Clase[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { obtenerDisponiblesHoy, obtenerTodas } = useClaseApi();

    const cargar = async () => {
        try {
            const res = soloDisponibles
                ? await obtenerDisponiblesHoy()
                : await obtenerTodas();
            setClases(res.data);
        } catch {
            setError('Error al cargar las clases');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    return { clases, cargando, error, recargar: cargar };
};