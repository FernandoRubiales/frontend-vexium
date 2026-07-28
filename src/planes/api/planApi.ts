import { useApi } from '../../shared/hooks/useApi';
import type { Plan, SocioPlan } from '../../shared/types';

export const usePlanApi = () => {
    const { callApi } = useApi();

    const obtenerTodos = () =>
        callApi<Plan[]>('GET', '/planes');

    const elegirPlan = (planId: number) => {
        return callApi<SocioPlan>('POST', '/socio_plan', { planId });
    };

    const obtenerMisPlanes = () =>
        callApi<SocioPlan[]>('GET', '/socio_plan/activos');

    const iniciarPagoMp = (socioPlanId: number) =>
        callApi<string>('POST', `/pagos/checkout/${socioPlanId}`);

    const crearPlan = (planRequest: any) =>
        callApi<Plan>('POST', '/planes', planRequest);

    const darDeBajaPlan = (id: number) =>
        callApi<void>('DELETE', `/planes/${id}`);

    const actualizarPlan = (id: number, planRequest: any) =>
        callApi<Plan>('PUT', `/planes/${id}`, planRequest);

    return { obtenerTodos, elegirPlan, obtenerMisPlanes, iniciarPagoMp, crearPlan, darDeBajaPlan, actualizarPlan };
};