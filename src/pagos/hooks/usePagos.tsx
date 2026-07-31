import { useState, useEffect } from 'react';
import { usePagoApi } from '../api/pagoApi';

export const usePagos = (soloMisPagos = true) => {
    const [pagos, setPagos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados de paginación
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const { obtenerMisPagos, obtenerTodosLosPagos } = usePagoApi();

    const cargarPagos = async (paginaActual = page, tamanioPagina = size) => {
        try {
            setCargando(true);
            setError(null);

            // Si es para admin, le pasamos page y size al endpoint
            const data = soloMisPagos
                ? await obtenerMisPagos()
                : await obtenerTodosLosPagos(paginaActual, tamanioPagina);

            const responseData = (data as any)?.data ? (data as any).data : data;

            // Verificamos si la respuesta viene paginada (objeto con .content) o es una lista plana
            if (responseData && typeof responseData === 'object' && 'content' in responseData) {
                setPagos(responseData.content);
                setTotalPages(responseData.totalPages || 0);
                setTotalElements(responseData.totalElements || 0);
            } else if (Array.isArray(responseData)) {
                // Por si el endpoint de socio devuelve lista plana
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

    // Recargar cuando cambie la opción de vista o la página actual
    useEffect(() => {
        cargarPagos(page, size);
    }, [soloMisPagos, page, size]);

    const cambiarPagina = (nuevaPagina: number) => {
        if (nuevaPagina >= 0 && nuevaPagina < totalPages) {
            setPage(nuevaPagina);
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
        recargarPagos: () => cargarPagos(page, size)
    };
};