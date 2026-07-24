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
            setPlanes(res.data);
        } catch {
            setError('Error al cargar los planes');
        }
    };

    const cargarMisPlanes = async () => {
        try {
            const res = await obtenerMisPlanes();
            setMisPlanes(res.data);
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
            // 1. Creamos la relación Socio-Plan
            const res = await elegirPlan(planId);
            const socioPlanId = res.data.id;

            // 2. Solicitamos el link de pago a Mercado Pago
            const urlPago = await iniciarPagoMp(socioPlanId);

            // 3. Redirigimos al checkout utilizando la propiedad .data que trae el string de la URL
            const urlCheckout = urlPago.data;
            if (urlCheckout) {
                window.location.href = urlCheckout;
            } else {
                setError('No se pudo obtener la URL de pago');
            }
        } catch (err) {
            console.error('Error al contratar plan:', err);
            setError('Error al procesar la contratación y el pago');
        }
    };

    useEffect(() => {
        cargarPlanes();
        cargarMisPlanes();
    }, []);

    return { planes, misPlanes, cargando, error, contratarPlan };
};