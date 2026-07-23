import { useSocio } from '../../socios/context/SocioContext';
import Layout from '../../shared/components/Layout';
import { Link } from 'react-router-dom';

const SocioDashboard = () => {
    const { socio } = useSocio();

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Hola, {socio?.nombre}!
            </h1>
            <p className="text-gray-500 mb-8">
                Bienvenido a tu panel personal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/socio/planes"
                    className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Mis Planes
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Ver tus membresías activas
                    </p>
                </Link>
                <Link to="/socio/clases"
                    className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Clases Disponibles
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Reservar clases para hoy
                    </p>
                </Link>
                <Link to="/socio/reservas"
                    className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Mis Reservas
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Ver tus reservas de esta semana
                    </p>
                </Link>
            </div>
        </Layout>
    );
};

export default SocioDashboard;