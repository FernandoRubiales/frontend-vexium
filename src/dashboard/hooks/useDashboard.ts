import { useState, useEffect } from 'react';
import type { Clase, SocioPlan } from '../../shared/types';
import { usePagoApi } from '../../pagos/api/pagoApi';
import { useClaseApi } from '../../clases/api/claseApi';
import { useSocioApi } from '../../socios/api/socioApi';

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