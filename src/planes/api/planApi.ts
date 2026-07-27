import { useApi } from '../../shared/hooks/useApi';
import type { Plan, SocioPlan } from '../../shared/types';

export const usePlanApi = () => {
    const { callApi } = useApi();

    const obtenerTodos = () =>
        callApi<Plan[]>('GET', '/planes');

    const elegirPlan = (planId: number) => {
        console.log("URL que se va a disparar:", '/socio_plan');
        return callApi<SocioPlan>('POST', '/socio_plan', { planId });
    };

    const obtenerMisPlanes = () =>
        callApi<SocioPlan[]>('GET', '/socio_plan/activos');

    const iniciarPagoMp = (socioPlanId: number) =>
        callApi<string>('POST', `/pagos/checkout/${socioPlanId}`);

    return { obtenerTodos, elegirPlan, obtenerMisPlanes, iniciarPagoMp };
};