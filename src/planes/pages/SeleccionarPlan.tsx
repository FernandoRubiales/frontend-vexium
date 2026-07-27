import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { usePlanes } from '../hooks/usePlanes';
import { useState } from 'react';

const SeleccionarPlan = () => {
    const { planes, cargando, error, contratarPlan } = usePlanes();
    const [procesandoId, setProcesandoId] = useState<number | null>(null);

    const handleContratar = async (planId: number) => {
        try {
            setProcesandoId(planId);
            await contratarPlan(planId); // Llama a tu función que crea el socio-plan y redirige a MP
        } catch (e) {
            setProcesandoId(null);
        }
    };

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Planes Disponibles
            </h1>
            <p className="text-gray-500 mb-6">
                Elegí tu plan y aboná de forma segura con Mercado Pago.
            </p>

            {error && <ErrorMessage mensaje={error} />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {planes.map(plan => (
                    <div key={plan.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                                {plan.tipoActividad}
                            </span>
                            <h3 className="text-xl font-bold text-gray-800 mt-3">
                                {plan.nombrePlan}
                            </h3>
                            <p className="text-2xl font-black text-gray-900 mt-2">
                                ${plan.precio}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Clases incluidas: {plan.clasesIncluidas}
                            </p>
                        </div>

                        <button
                            onClick={() => handleContratar(plan.id)}
                            disabled={procesandoId === plan.id}
                            className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 text-center"
                        >
                            {procesandoId === plan.id ? 'Redirigiendo a MP...' : 'Pagar con Mercado Pago'}
                        </button>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default SeleccionarPlan;