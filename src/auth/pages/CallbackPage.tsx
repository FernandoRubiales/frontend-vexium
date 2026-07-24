import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useSocio } from '../../socios/context/SocioContext';
import Spinner from '../../shared/components/Spinner';

const CallbackPage = () => {
    const { isAuthenticated, isLoading, error } = useAuth0();
    const { socio, cargando } = useSocio();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            navigate('/login');
            return;
        }

        if (isLoading || cargando) return;

        if (isAuthenticated && socio) {
            // TypeScript ya reconoce 'nombreRol' gracias a la interfaz Socio
            const rolNombre = socio.nombreRol ? socio.nombreRol.toUpperCase() : '';

            if (rolNombre === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (rolNombre === 'RECEPCIONISTA') {
                navigate('/recepcion/dashboard');
            } else {
                navigate('/socio/dashboard');
            }
        } else if (!isLoading && !cargando) {
            navigate('/login');
        }
    }, [isAuthenticated, isLoading, socio, cargando, error, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Spinner size="lg" />
        </div>
    );
};

export default CallbackPage;