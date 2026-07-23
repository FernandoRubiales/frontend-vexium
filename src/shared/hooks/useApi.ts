import { useAuth0 } from '@auth0/auth0-react';
import api from '../api/axiosConfig.ts';
import type { AxiosResponse } from 'axios';

export const useApi = () => {
    const { getAccessTokenSilently } = useAuth0();

    const callApi = async <T>(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        url: string,
        data?: unknown
    ): Promise<AxiosResponse<T>> => {

        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE
            }
        });

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        switch (method) {
            case 'GET': return api.get<T>(url, config);
            case 'POST': return api.post<T>(url, data, config);
            case 'PUT': return api.put<T>(url, data, config);
            case 'PATCH': return api.patch<T>(url, data, config);
            case 'DELETE': return api.delete<T>(url, config);
        }
    };

    return { callApi };
};