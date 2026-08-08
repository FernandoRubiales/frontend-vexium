import { useApi } from '../../shared/hooks/useApi';
import type { DashboardAdmin } from '../../shared/types';

export const useDashboardApi = () => {
    const { callApi } = useApi();

    const obtenerDashboardAdmin = () =>
        callApi<DashboardAdmin>('GET', '/dashboard/admin');

    return { obtenerDashboardAdmin };
};