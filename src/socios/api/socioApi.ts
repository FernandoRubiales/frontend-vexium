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

    const obtenerVencimientosProximos = () =>
        callApi('GET', '/socio_plan/vencimientos_proximos');

    const obtenerMiPerfil = () =>
        callApi<Socio>('GET', '/socios/perfil');

    const actualizarMiPerfil = (data: any) =>
        callApi<Socio>('PUT', '/socios/perfil', data);

    return { obtenerTodos, crearSocio, actualizarSocio, cambiarRol, eliminarSocio, obtenerVencimientosProximos, obtenerMiPerfil, actualizarMiPerfil };
};