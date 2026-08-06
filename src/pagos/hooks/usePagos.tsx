import { useState, useEffect } from 'react';
import { usePagoApi } from '../api/pagoApi';
import type { SocioPlan } from '../../shared/types';

export const usePagos = (soloMisPagos = true) => {
    const [pagos, setPagos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados de paginación
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const { obtenerMisPagos, obtenerTodosLosPagos, buscarPlanesPendientesPorDni, registrarPagoEfectivo } = usePagoApi();

    const cargarPagos = async (paginaActual = page, tamanioPagina = size) => {
        try {
            setCargando(true);
            setError(null);

            const data = soloMisPagos
                ? await obtenerMisPagos()
                : await obtenerTodosLosPagos(paginaActual, tamanioPagina);

            const responseData = (data as any)?.data ? (data as any).data : data;

            if (responseData && typeof responseData === 'object' && 'content' in responseData) {
                setPagos(responseData.content);
                setTotalPages(responseData.totalPages || 0);
                setTotalElements(responseData.totalElements || 0);
            } else if (Array.isArray(responseData)) {
                setPagos(responseData);
                setTotalPages(1);
                setTotalElements(responseData.length);
            } else {
                setPagos([]);
            }
        } catch (err: any) {
            const mensajeBackend = err.response?.data?.mensaje || err.response?.data?.message || err.message;
            setError(mensajeBackend || 'Error al cargar los pagos');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarPagos(page, size);
    }, [soloMisPagos, page, size]);

    const cambiarPagina = (nuevaPagina: number) => {
        if (nuevaPagina >= 0 && nuevaPagina < totalPages) {
            setPage(nuevaPagina);
        }
    };

    const buscarPlanesPendientes = async (dni: number): Promise<SocioPlan[]> => {
        try {
            const data = await buscarPlanesPendientesPorDni(dni);
            const resultado = (data as any)?.data ? (data as any).data : data;
            return resultado as SocioPlan[]; // <-- Acá está la corrección de TypeScript
        } catch (err: any) {
            const mensajeBackend = err.response?.data?.mensaje || err.response?.data?.message || 'Error al buscar socio por DNI';
            throw new Error(mensajeBackend);
        }
    };

    const cobrarEfectivo = async (socioPlanId: number, montoPago: number) => {
        try {
            await registrarPagoEfectivo(socioPlanId, montoPago);
            await cargarPagos(page, size);
        } catch (err: any) {
            const mensajeBackend = err.response?.data?.mensaje || err.response?.data?.message || 'Error al registrar el pago';
            throw new Error(mensajeBackend);
        }
    };

    return {
        pagos,
        cargando,
        error,
        page,
        size,
        totalPages,
        totalElements,
        setPage: cambiarPagina,
        setSize,
        recargarPagos: () => cargarPagos(page, size),
        buscarPlanesPendientes,
        cobrarEfectivo
    };
};