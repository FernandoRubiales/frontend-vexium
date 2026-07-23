import { useApi } from '../../shared/hooks/useApi';
import { Plan, SocioPlan } from '../../shared/types';

export const usePlanApi = () => {
    const { callApi } = useApi();

    const obtenerTodos = () =>
        callApi<Plan[]>('GET', '/planes');

    const elegirPlan = (planId: number) =>
        callApi<SocioPlan>('POST', '/socio-plan', { planId });

    const obtenerMisPlanes = () =>
        callApi<SocioPlan[]>('GET', '/socio-plan/activos');

    const iniciarPagoMp = (socioPlanId: number) =>
        callApi<string>('POST', `/pagos/checkout/${socioPlanId}`);

    return { obtenerTodos, elegirPlan, obtenerMisPlanes, iniciarPagoMp };
};