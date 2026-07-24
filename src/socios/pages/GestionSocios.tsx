import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { useSocios } from '../hooks/useSocios';

const ROLES = ['SOCIO', 'RECEPCIONISTA', 'ADMIN'];

const GestionSocios = () => {
    const { socios, cargando, error, actualizarRol } = useSocios();

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Gestión de Socios
            </h1>

            {error && <ErrorMessage mensaje={error} />}

            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 text-left">Nombre</th>
                            <th className="px-6 py-4 text-left">Email</th>
                            <th className="px-6 py-4 text-left">DNI</th>
                            <th className="px-6 py-4 text-left">Rol</th>

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {socios.map(socio => (
                            <tr key={socio.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {socio.nombre} {socio.apellido}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {socio.email}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {socio.dni}
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={socio.nombreRol}
                                        onChange={e => actualizarRol(socio.id, e.target.value)}
                                        className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                    >
                                        {ROLES.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default GestionSocios;