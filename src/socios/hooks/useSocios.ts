import { useState, useEffect } from 'react';
import type { Socio } from '../../shared/types';
import { useSocioApi } from '../api/socioApi';

export const useSocios = () => {
    const [socios, setSocios] = useState<Socio[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { obtenerTodos, cambiarRol } = useSocioApi();

    const cargar = async () => {
        try {
            setCargando(true);
            const res = await obtenerTodos();
            setSocios(res.data);
        } catch {
            setError('Error al cargar los socios');
        } finally {
            setCargando(false);
        }
    };

    const actualizarRol = async (id: number, rol: string) => {
        await cambiarRol(id, rol);
        await cargar();
    };

    useEffect(() => { cargar(); }, []);

    return { socios, cargando, error, actualizarRol };
};