import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from '../shared/api/axios';

// Definimos qué datos va a guardar nuestro contexto
interface AuthContextType {
    dbRole: 'ADMIN' | 'SOCIO' | 'RECEPCIONISTA' | null;
    isLoadingRole: boolean;
}

const AuthContext = createContext<AuthContextType>({ dbRole: null, isLoadingRole: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user } = useAuth0();
    const [dbRole, setDbRole] = useState<AuthContextType['dbRole']>(null);
    const [isLoadingRole, setIsLoadingRole] = useState(true);

    useEffect(() => {
        const fetchRoleFromDB = async () => {
            if (isAuthenticated && user) {
                try {
                    // ⚠️ ACÁ ESTÁ EL PUENTE REAL HACIA JAVA (Comentado hasta que prendamos el backend)
                    // const respuesta = await api.get('/usuarios/mi-perfil');
                    // setDbRole(respuesta.data.rol);

                    // 🛠️ MODO SIMULACIÓN: Para que pruebes la interfaz hoy. 
                    // Cambiá 'SOCIO' por 'ADMIN' para ver cómo cambia el menú.
                    setTimeout(() => {
                        setDbRole('SOCIO');
                        setIsLoadingRole(false);
                    }, 1000); // Simulamos 1 segundo de carga de red

                } catch (error) {
                    console.error("Error buscando el rol en la BD:", error);
                    setIsLoadingRole(false);
                }
            } else {
                setDbRole(null);
                setIsLoadingRole(false);
            }
        };

        fetchRoleFromDB();
    }, [isAuthenticated, user]);

    return (
        <AuthContext.Provider value={{ dbRole, isLoadingRole }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar este contexto fácilmente
export const useDbAuth = () => useContext(AuthContext);