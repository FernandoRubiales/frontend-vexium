import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { usePlanes } from '../hooks/usePlanes';

const MisPlanes = () => {
    const { planes, misPlanes, cargando, error, contratarPlan } = usePlanes();

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Planes
            </h1>

            {error && <ErrorMessage mensaje={error} />}

            {/* Planes activos */}
            <section className="mb-10">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Planes activos
                </h2>

                {misPlanes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {misPlanes.map(sp => (
                            <div key={sp.id}
                                className="bg-white rounded-2xl p-6 shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-gray-800">
                                        {sp.nombrePlan}
                                    </h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sp.estadoSocioPlan === 'Activo'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {sp.estadoSocioPlan}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Actividad: {sp.tipoActividad}
                                </p>
                                <p className="text-sm text-gray-500 mb-1">
                                    Clases disponibles: {sp.clasesDisponibles} / {sp.clasesIncluidas}
                                </p>
                                {sp.fechaVencimientoSocioPlan && (
                                    <p className="text-sm text-gray-500">
                                        Vence: {new Date(sp.fechaVencimientoSocioPlan)
                                            .toLocaleDateString('es-AR')}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-6 shadow text-gray-500 text-sm border border-gray-100">
                        No tenés planes activos actualmente. ¡Elegí uno de los planes disponibles abajo para empezar!
                    </div>
                )}
            </section>

            {/* Planes disponibles para contratar */}
            <section>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Planes disponibles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {planes.map(plan => (
                        <div key={plan.id}
                            className="bg-white rounded-2xl p-6 shadow flex flex-col">
                            <h3 className="font-semibold text-gray-800 mb-1">
                                {plan.nombrePlan}
                            </h3>
                            <p className="text-sm text-gray-500 mb-1">
                                {plan.tipoActividad}
                            </p>
                            <p className="text-sm text-gray-500 mb-1">
                                {plan.diasPorSemana} días/semana · {plan.clasesIncluidas} clases/mes
                            </p>
                            <p className="text-xl font-bold text-blue-600 mt-2 mb-4">
                                ${plan.precio.toLocaleString('es-AR')}
                            </p>
                            <button
                                onClick={() => contratarPlan(plan.id)}
                                className="mt-auto bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition text-sm font-medium"
                            >
                                Elegir plan
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    );
};

export default MisPlanes;