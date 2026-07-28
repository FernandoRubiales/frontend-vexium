import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import Modal from '../../shared/components/Modal';
import Button from '../../shared/components/Button';
import { usePlanes } from '../hooks/usePlanes';
import { useState } from 'react';

const MisPlanes = () => {
    const { planes, misPlanes, cargando, error, seleccionarPlanPendiente, pagarConMercadoPago, recargarMisPlanes } = usePlanes();
    const [procesandoId, setProcesandoId] = useState<number | null>(null);

    // Estado para controlar el modal de selección de pago
    const [planCreadoId, setPlanCreadoId] = useState<number | null>(null);
    const [nombrePlanSeleccionado, setNombrePlanSeleccionado] = useState<string>('');

    const handleElegirPlan = async (planId: number, nombrePlan: string) => {
        try {
            setProcesandoId(planId);
            const socioPlanId = await seleccionarPlanPendiente(planId);
            setPlanCreadoId(socioPlanId);
            setNombrePlanSeleccionado(nombrePlan);
        } catch (e: any) {
            alert(e.message || 'Error al seleccionar el plan');
        } finally {
            setProcesandoId(null);
        }
    };

    const handlePagarMp = async () => {
        if (!planCreadoId) return;
        await pagarConMercadoPago(planCreadoId);
    };

    const handlePagarEfectivo = async () => {
        alert(`¡Plan "${nombrePlanSeleccionado}" seleccionado con éxito!\n\nTu plan quedó en estado PENDIENTE. Acercate por la recepción del gimnasio para abonar en efectivo y activarlo.`);
        setPlanCreadoId(null);
        await recargarMisPlanes();
    };

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Planes
            </h1>

            {error && <ErrorMessage mensaje={error} />}

            {/* Sección de Planes Activos y Pendientes */}
            <section className="mb-10">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Mis Planes
                </h2>

                {misPlanes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {misPlanes.map(sp => (
                            <div key={sp.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-gray-800">
                                        {sp.nombrePlan}
                                    </h3>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sp.estadoSocioPlan === 'Activo'
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
                                        Vence: {new Date(sp.fechaVencimientoSocioPlan).toLocaleDateString('es-AR')}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-6 shadow-sm text-gray-500 text-sm border border-gray-100">
                        No tenés planes activos ni pendientes actualmente. ¡Elegí uno de los planes disponibles abajo para empezar!
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
                        <div key={plan.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
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
                            <Button
                                onClick={() => handleElegirPlan(plan.id, plan.nombrePlan)}
                                disabled={procesandoId === plan.id}
                                variant="primary"
                                fullWidth
                                className="mt-auto bg-blue-600 hover:bg-blue-700"
                            >
                                {procesandoId === plan.id ? 'Generando...' : 'Elegir plan'}
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* MODAL REUTILIZABLE DE SELECCIÓN DE MÉTODO DE PAGO */}
            <Modal
                isOpen={!!planCreadoId}
                title="Método de pago"
                onClose={() => setPlanCreadoId(null)}
            >
                <p className="text-sm text-gray-500 mb-6">
                    Plan seleccionado: <span className="font-semibold text-gray-800">{nombrePlanSeleccionado}</span>
                </p>

                <div className="space-y-3">
                    <Button
                        onClick={handlePagarMp}
                        fullWidth
                        className="bg-sky-600 text-white hover:bg-sky-700 p-4 rounded-2xl"
                    >
                        Pagar Online (Mercado Pago)
                    </Button>

                    <Button
                        onClick={handlePagarEfectivo}
                        fullWidth
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 p-4 rounded-2xl"
                    >
                        Pagar en Efectivo (En Recepción)
                    </Button>
                </div>

                <div className="mt-4">
                    <Button
                        onClick={() => setPlanCreadoId(null)}
                        variant="secondary"
                        fullWidth
                        className="bg-transparent text-gray-400 hover:text-gray-600 shadow-none hover:bg-transparent"
                    >
                        Cancelar
                    </Button>
                </div>
            </Modal>
        </Layout>
    );
};

export default MisPlanes;