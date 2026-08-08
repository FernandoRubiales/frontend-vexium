import { useState, useEffect } from 'react';
import type { Socio } from '../../shared/types';
import { useSocioApi } from '../api/socioApi';

export const useSocios = () => {
    const [socios, setSocios] = useState<Socio[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Eliminamos crearSocio de aquí
    const { obtenerTodos, actualizarSocio, cambiarRol, eliminarSocio } = useSocioApi();

    const cargar = async () => {
        try {
            setCargando(true);
            setError(null);
            const res = await obtenerTodos();
            const lista = (res as any)?.data ? (res as any).data : res;
            setSocios(Array.isArray(lista) ? lista : []);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los socios');
        } finally {
            setCargando(false);
        }
    };

    const actualizar = async (id: number, formData: any) => {
        await actualizarSocio(id, formData);
        await cargar();
    };

    const actualizarRol = async (id: number, nuevoRol: string) => {
        await cambiarRol(id, nuevoRol);
        await cargar();
    };

    const eliminar = async (id: number) => {
        await eliminarSocio(id);
        await cargar();
    };

    useEffect(() => {
        cargar();
    }, []);

    return {
        socios,
        cargando,
        error,
        actualizarSocio: actualizar,
        actualizarRol,
        eliminarSocio: eliminar,
        recargarSocios: cargar
    };
};