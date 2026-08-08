import { useState, useEffect } from 'react';
import type { Clase, SocioPlan, DashboardAdmin } from '../../shared/types';
import { usePagoApi } from '../../pagos/api/pagoApi';
import { useClaseApi } from '../../clases/api/claseApi';
import { useSocioApi } from '../../socios/api/socioApi';
import { useDashboardApi } from '../api/dashboardApi';

// ==========================================
// 1. Hook para el Dashboard de RECEPCIÓN
// ==========================================
export const useDashboard = () => {

    const { obtenerIngresosHoy } = usePagoApi();
    const { obtenerClasesDelDia } = useClaseApi();
    const { obtenerVencimientosProximos } = useSocioApi();

    const [ingresosHoy, setIngresosHoy] = useState<number>(0);
    const [vencimientos, setVencimientos] = useState<SocioPlan[]>([]);
    const [clasesHoy, setClasesHoy] = useState<Clase[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const obtenerDiaActualString = () => {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dias[new Date().getDay()];
    };

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const diaHoy = obtenerDiaActualString();

            const [resIngresos, resVencimientos, resClases] = await Promise.all([
                obtenerIngresosHoy(),
                obtenerVencimientosProximos(),
                obtenerClasesDelDia(diaHoy)
            ]);

            setIngresosHoy(Number((resIngresos as any)?.data ?? resIngresos ?? 0));
            setVencimientos((resVencimientos as any)?.data ?? resVencimientos ?? []);
            setClasesHoy((resClases as any)?.data ?? resClases ?? []);

        } catch (err: any) {
            setError('Error al cargar la información del panel');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    return { ingresosHoy, vencimientos, clasesHoy, cargando, error, recargar: cargarDatos };
};

// ==========================================
// 2. Hook para el Dashboard de ADMINISTRADOR
// ==========================================
export const useAdminDashboard = () => {

    const { obtenerDashboardAdmin } = useDashboardApi();

    const [datos, setDatos] = useState<DashboardAdmin | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargarDatos = async () => {
        try {
            setCargando(true);

            const res = await obtenerDashboardAdmin();

            // Extraemos la data
            const info = (res as any)?.data ? (res as any).data : res;
            setDatos(info);
        } catch (err: any) {
            setError('Error al cargar la información del panel de administración');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    return { datos, cargando, error, recargar: cargarDatos };
};