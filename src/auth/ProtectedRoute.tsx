import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDbAuth } from './AuthContext';
import { Spinner } from '../shared/components/Spinner';

interface ProtectedRouteProps {
    // Le pasamos un arreglo con los roles que tienen permitido entrar acá
    allowedRoles: Array<'ADMIN' | 'SOCIO' | 'RECEPCIONISTA'>;
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
    const { dbRole, isLoadingRole } = useDbAuth();

    // 1. Mientras va a preguntar a la base de datos, mostramos el Spinner
    if (isLoadingRole) {
        return (
            <div className="flex h-full min-h-[50vh] items-center justify-center">
                <Spinner size="lg" />
                <span className="ml-4 text-gray-600 font-bold">Verificando permisos...</span>
            </div>
        );
    }

    // 2. Si ya cargó y el rol NO está en la lista de permitidos, lo pateamos al Dashboard
    if (!dbRole || !allowedRoles.includes(dbRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    // 3. Si tiene permiso, renderizamos la pantalla que pidió (ej: GestionPlanes)
    return <>{children}</>;
};