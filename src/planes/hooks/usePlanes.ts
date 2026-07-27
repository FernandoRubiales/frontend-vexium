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

    // 1. Crea el SocioPlan en estado "Pendiente" 
    const seleccionarPlanPendiente = async (planId: number): Promise<number> => {
        try {
            setError(null);
            const resSocioPlan = await elegirPlan(planId);
            const socioPlanData = (resSocioPlan as any)?.data ? (resSocioPlan as any).data : resSocioPlan;
            const socioPlanId = socioPlanData?.id;

            if (!socioPlanId) {
                throw new Error('No se pudo obtener el ID del plan del socio creado');
            }
            return socioPlanId;
        } catch (err: any) {
            const mensajeBackend = err.response?.data?.mensaje || err.response?.data?.message || err.message;
            throw new Error(mensajeBackend);
        }
    };

    // 2. Solicita el link de pago y redirige a Mercado Pago
    const pagarConMercadoPago = async (socioPlanId: number) => {
        try {
            const resPago = await iniciarPagoMp(socioPlanId);
            const urlCheckout = (resPago as any)?.data ? (resPago as any).data : resPago;

            if (typeof urlCheckout === 'string' && urlCheckout.startsWith('http')) {
                window.location.href = urlCheckout;
            } else {
                throw new Error('La URL de pago devuelta por el servidor es inválida');
            }
        } catch (err: any) {
            const mensajeBackend = err.response?.data?.mensaje || err.response?.data?.message || err.message;
            setError(`Error al iniciar pago: ${mensajeBackend}`);
        }
    };

    useEffect(() => {
        cargarPlanes();
        cargarMisPlanes();
    }, []);

    return { planes, misPlanes, cargando, error, seleccionarPlanPendiente, pagarConMercadoPago };
};