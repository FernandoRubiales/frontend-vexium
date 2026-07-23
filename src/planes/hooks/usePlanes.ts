import { useState, useEffect } from 'react';
import { Plan, SocioPlan } from '../../shared/types';
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
        } catch {
            setError('Error al cargar tus planes');
        } finally {
            setCargando(false);
        }
    };

    const contratarPlan = async (planId: number) => {
        const res = await elegirPlan(planId);
        // Con el socioPlanId recién creado iniciamos el pago
        const socioPlanId = res.data.id;
        const urlPago = await iniciarPagoMp(socioPlanId);
        // Redirigimos al socio a MercadoPago
        window.location.href = urlPago.data;
    };

    useEffect(() => {
        cargarPlanes();
        cargarMisPlanes();
    }, []);

    return { planes, misPlanes, cargando, error, contratarPlan };
};