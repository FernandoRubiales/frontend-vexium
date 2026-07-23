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

        // Si alguna de las dos cosas está procesando, nos quedamos quietos
        if (isLoading || cargando) return;

        // Si ya cargó todo y estamos logueados, entramos
        if (isAuthenticated && socio) {
            if (socio.rol === 'ADMIN') navigate('/admin/dashboard');
            else if (socio.rol === 'RECEPCIONISTA') navigate('/recepcion/dashboard');
            else navigate('/socio/dashboard');
        } else {
            // Si algo falló y no hay usuario, volvemos a empezar
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