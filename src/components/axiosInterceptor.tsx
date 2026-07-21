import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from '../config/axios';

export const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {

        const interceptor = api.interceptors.request.use(
            async (config) => {
                try {

                    const token = await getAccessTokenSilently();


                    config.headers.Authorization = `Bearer ${token}`;
                } catch (error) {
                    console.error("No se pudo obtener el token para la API:", error);
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );


        return () => api.interceptors.request.eject(interceptor);
    }, [getAccessTokenSilently]);


    return <>{children}</>;
};