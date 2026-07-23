import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import { usePlanes } from '../hooks/usePlanes';

const GestionPlanes = () => {
    const { planes, cargando } = usePlanes();

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Gestión de Planes
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {planes.map(plan => (
                    <div key={plan.id}
                        className="bg-white rounded-2xl p-6 shadow">
                        <h3 className="font-semibold text-gray-800 mb-1">
                            {plan.nombrePlan}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                            {plan.tipoActividad}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                            {plan.diasPorSemana} días/semana
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                            {plan.clasesIncluidas} clases/mes
                        </p>
                        <p className="text-lg font-bold text-blue-600 mt-2">
                            ${plan.precio.toLocaleString('es-AR')}
                        </p>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default GestionPlanes;