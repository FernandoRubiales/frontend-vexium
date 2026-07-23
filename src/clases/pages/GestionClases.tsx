import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import { useClases } from '../hooks/useClases';

const GestionClases = () => {
    const { clases, cargando } = useClases();

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Gestión de Clases
            </h1>

            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 text-left">Actividad</th>
                            <th className="px-6 py-4 text-left">Día</th>
                            <th className="px-6 py-4 text-left">Horario</th>
                            <th className="px-6 py-4 text-left">Cupos</th>
                            <th className="px-6 py-4 text-left">Reserva</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {clases.map(clase => (
                            <tr key={clase.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {clase.nombreTipoActividad}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {clase.diaSemana}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {clase.horaInicio} - {clase.horaFin}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {clase.cuposDisponibles} / {clase.cupoMaximo}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${clase.requiereReserva
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {clase.requiereReserva ? 'Requiere reserva' : 'Libre'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default GestionClases;