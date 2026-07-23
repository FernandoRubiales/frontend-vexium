import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocio } from '../../socios/context/SocioContext';

const LoginPage = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const { socio } = useSocio();
    const navigate = useNavigate();

    // Redirigir según rol si ya está autenticado
    useEffect(() => {
        if (isAuthenticated && socio) {
            if (socio.rol === 'ADMIN') navigate('/admin/dashboard');
            else if (socio.rol === 'RECEPCIONISTA') navigate('/recepcion/dashboard');
            else navigate('/socio/dashboard');
        }
    }, [isAuthenticated, socio]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Sistema de Gimnasio
                </h1>
                <p className="text-gray-500 mb-8">
                    Iniciá sesión para continuar
                </p>
                <button
                    onClick={() => loginWithRedirect()}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition shadow-sm"
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Iniciar sesión con Google
                </button>
            </div>
        </div>
    );
};

export default LoginPage;