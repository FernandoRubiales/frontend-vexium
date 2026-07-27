import { useState, useEffect } from 'react';
import type { Plan, SocioPlan } from '../../shared/types';
import { usePlanApi } from '../api/planApi';

export const usePlanes = () => {
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [misPlanes, setMisPlanes] = useState<SocioPlan[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { obtenerTodos, elegirPlan, obtenerMisPlanes, iniciarPagoMp } = usePlanApi();

    const cargarPlanes = async () => {
        try {
            const res = await obtenerTodos();
            setPlanes((res as any)?.data ? (res as any).data : res);
        } catch {
            setError('Error al cargar los planes');
        }
    };

    const cargarMisPlanes = async () => {
        try {
            const res = await obtenerMisPlanes();
            setMisPlanes((res as any)?.data ? (res as any).data : res);
        } catch (err: any) {
            if (err?.response?.status === 404) {
                setMisPlanes([]);
            } else {
                setError('Error al cargar los planes propios');
            }
        } finally {
            setCargando(false);
        }
    };

    const contratarPlan = async (planId: number) => {
        try {
            setError(null);

            // 1. Creamos la relación Socio-Plan (POST /socio_plan)
            const resSocioPlan = await elegirPlan(planId);
            const socioPlanData = (resSocioPlan as any)?.data ? (resSocioPlan as any).data : resSocioPlan;
            const socioPlanId = socioPlanData?.id;

            if (!socioPlanId) {
                throw new Error('No se pudo obtener el ID del plan del socio creado');
            }

            // 2. Solicitamos el link de pago a Mercado Pago (POST /pagos/checkout/{socioPlanId})
            const resPago = await iniciarPagoMp(socioPlanId);
            const urlCheckout = (resPago as any)?.data ? (resPago as any).data : resPago;

            // 3. Redirigimos al checkout de Mercado Pago
            if (typeof urlCheckout === 'string' && urlCheckout.startsWith('http')) {
                window.location.href = urlCheckout;
            } else {
                throw new Error('La URL de pago devuelta por el servidor es inválida');
            }
        } catch (err: any) {
            console.error('Error detallado al contratar plan:', err);
            const mensajeBackend = err.response?.data?.mensaje || err.response?.data?.message || err.message;
            setError(`Error: ${mensajeBackend}`);
        }
    };

    useEffect(() => {
        cargarPlanes();
        cargarMisPlanes();
    }, []);

    return { planes, misPlanes, cargando, error, contratarPlan };
};