import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApi } from '../../shared/hooks/useApi';
import type { Socio } from '../types/socio.types';

interface SocioContextType {
    socio: Socio | null;
    cargando: boolean;
    cargarPerfil: () => Promise<void>;
}

const SocioContext = createContext<SocioContextType | undefined>(undefined);

export const SocioProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth0();
    const { callApi } = useApi();
    const [socio, setSocio] = useState<Socio | null>(null);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        if (isAuthenticated) {
            cargarPerfil();
        } else if (!isLoading) {
            setCargando(false);
        }
    }, [isAuthenticated, isLoading]);

    const cargarPerfil = async () => {
        try {
            const response = await callApi<Socio>('GET', '/socios/perfil');
            setSocio(response.data);
        } catch (error) {
            console.error('Error al cargar perfil:', error);
            setCargando(false);
        }
    };

    return (
        <SocioContext.Provider value={{ socio, cargando, cargarPerfil }}>
            {children}
        </SocioContext.Provider>
    );
};

export const useSocio = (): SocioContextType => {
    const context = useContext(SocioContext);
    if (!context) throw new Error('useSocio debe usarse dentro de SocioProvider');
    return context;
};