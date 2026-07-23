import { useSocio } from '../../socios/context/SocioContext';
import Layout from '../../shared/components/Layout';
import { Link } from 'react-router-dom';

const RecepcionDashboard = () => {
    const { socio } = useSocio();

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Panel de Recepción
            </h1>
            <p className="text-gray-500 mb-8">
                Bienvenido, {socio?.nombre}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/recepcion/pagos"
                    className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Registrar Pago en Efectivo
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Buscar socio y acreditar pago
                    </p>
                </Link>
            </div>
        </Layout>
    );
};

export default RecepcionDashboard;