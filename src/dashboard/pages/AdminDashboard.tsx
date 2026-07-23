import { Link } from 'react-router-dom';
import Layout from '../../shared/components/Layout';
import { useSocio } from '../../socios/context/SocioContext';

const AdminDashboard = () => {
    const { socio } = useSocio();

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Panel de Administración
            </h1>
            <p className="text-gray-500 mb-8">
                Bienvenido, {socio?.nombre}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/socios"
                    className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Gestión de Socios
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Ver y administrar socios
                    </p>
                </Link>
                <Link to="/admin/planes"
                    className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Gestión de Planes
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Crear y editar planes
                    </p>
                </Link>
                <Link to="/admin/clases"
                    className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Gestión de Clases
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Administrar el horario de clases
                    </p>
                </Link>
            </div>
        </Layout>
    );
};

export default AdminDashboard;