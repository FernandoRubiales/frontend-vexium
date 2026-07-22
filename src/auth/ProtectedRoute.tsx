import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useSocio } from '../socios/context/SocioContext';
import { Spinner } from '../shared/components/Spinner';

interface ProtectedRouteProps {
    allowedRoles?: Array<'ADMIN' | 'RECEPCIONISTA' | 'SOCIO'>;
}

// Usamos Outlet para que envuelva las rutas hijas en el App.tsx
export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading: authLoading } = useAuth0();
    const { socio, cargando: perfilLoading } = useSocio();

    if (authLoading) return <div className="flex justify-center p-20"><Spinner /></div>;
    if (!isAuthenticated) return <Navigate to="/" replace />;

    if (perfilLoading) return <div className="flex justify-center p-20"><Spinner /></div>;
    if (!socio) return <Navigate to="/" replace />;

    if (allowedRoles && !allowedRoles.includes(socio.rol)) {
        if (socio.rol === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
        if (socio.rol === 'RECEPCIONISTA') return <Navigate to="/dashboard/recepcion" replace />;
        return <Navigate to="/dashboard/socio" replace />;
    }

    return <Outlet />;
};