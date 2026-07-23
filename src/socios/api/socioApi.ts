import { useApi } from '../../shared/hooks/useApi';
import type { Socio } from '../../shared/types';

export const useSocioApi = () => {
    const { callApi } = useApi();

    const obtenerTodos = () =>
        callApi<Socio[]>('GET', '/socios');

    const cambiarRol = (id: number, rol: string) =>
        callApi<void>('PATCH', `/socios/${id}/rol?rol=${rol}`);

    return { obtenerTodos, cambiarRol };
};