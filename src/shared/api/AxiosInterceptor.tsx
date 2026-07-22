import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from './axios';
import React from 'react';

export const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const interceptor = api.interceptors.request.use(
            async (config) => {
                try {
                    const token = await getAccessTokenSilently();
                    config.headers.Authorization = `Bearer ${token}`;
                } catch (error) {
                    console.error("Error obteniendo token:", error);
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        return () => api.interceptors.request.eject(interceptor);
    }, [getAccessTokenSilently]);

    return <>{children}</>;
};