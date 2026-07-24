import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useSocio } from '../socios/context/SocioContext';
import Spinner from '../shared/components/Spinner';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    rolesPermitidos?: ('ADMIN' | 'RECEPCIONISTA' | 'SOCIO')[];
}

const ProtectedRoute = ({ children, rolesPermitidos }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth0();
    const { socio, cargando } = useSocio();

    // Mientras carga auth0 o el perfil del socio
    if (isLoading || cargando) {
        return <Spinner />;
    }

    // Si no está autenticado → login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si hay roles requeridos verificamos el del socio
    if (rolesPermitidos && socio && !rolesPermitidos.includes(socio.nombreRol)) {
        return <Navigate to="/no-autorizado" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;