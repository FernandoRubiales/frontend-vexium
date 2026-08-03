import { useApi } from '../../shared/hooks/useApi';
import type { Socio } from '../../shared/types';

export const useSocioApi = () => {
    const { callApi } = useApi();

    const obtenerTodos = () =>
        callApi<Socio[]>('GET', '/socios');

    const crearSocio = (data: any) =>
        callApi<Socio>('POST', '/socios/create', data);

    const actualizarSocio = (id: number, data: any) =>
        callApi<Socio>('PUT', `/socios/${id}`, data);

    const cambiarRol = (id: number, nuevoRol: string) =>
        callApi<void>('PATCH', `/socios/${id}/cambiar-rol?nuevoRol=${nuevoRol}`);

    const eliminarSocio = (id: number) =>
        callApi<void>('DELETE', `/socios/${id}`);

    return { obtenerTodos, crearSocio, actualizarSocio, cambiarRol, eliminarSocio };
};