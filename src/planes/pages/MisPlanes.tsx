import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage'; // Opcional si lo usás en otro lado
import Modal from '../../shared/components/Modal';
import Button from '../../shared/components/Button';
import { usePlanes } from '../hooks/usePlanes';
import { useState } from 'react';

const MisPlanes = () => {
    const { planes, misPlanes, cargando, error, seleccionarPlanPendiente, pagarConMercadoPago, recargarMisPlanes } = usePlanes();
    const [procesandoId, setProcesandoId] = useState<number | null>(null);

    // Estado para controlar el modal de selección de pago
    const [planSeleccionadoId, setPlanSeleccionadoId] = useState<number | null>(null);
    const [nombrePlanSeleccionado, setNombrePlanSeleccionado] = useState<string>('');

    // Estado para controlar el pop-up de éxito en efectivo
    const [modalExitoEfectivoOpen, setModalExitoEfectivoOpen] = useState(false);

    // Estado para controlar el pop-up / modal genérico de ERROR
    const [modalErrorOpen, setModalErrorOpen] = useState(false);
    const [mensajeError, setMensajeError] = useState<string>('');

    const handleAbrirModal = (planId: number, nombrePlan: string) => {
        setPlanSeleccionadoId(planId);
        setNombrePlanSeleccionado(nombrePlan);
    };

    const handlePagarMp = async () => {
        if (!planSeleccionadoId) return;
        try {
            setProcesandoId(planSeleccionadoId);
            const socioPlanId = await seleccionarPlanPendiente(planSeleccionadoId);
            await pagarConMercadoPago(socioPlanId);
        } catch (e: any) {
            setPlanSeleccionadoId(null); // Cerramos el modal de pago
            setMensajeError(e.message || 'Error al procesar el pago con Mercado Pago');
            setModalErrorOpen(true); // Abrimos el pop-up de error genérico
        } finally {
            setProcesandoId(null);
        }
    };

    const handlePagarEfectivo = async () => {
        if (!planSeleccionadoId) return;
        try {
            setProcesandoId(planSeleccionadoId);
            await seleccionarPlanPendiente(planSeleccionadoId);
            setPlanSeleccionadoId(null); // Cierra el modal de selección de pago
            setModalExitoEfectivoOpen(true); // Abre el modal de éxito
            await recargarMisPlanes();
        } catch (e: any) {
            setPlanSeleccionadoId(null); // Cerramos el modal de pago
            setMensajeError(e.message || 'Error al registrar el plan pendiente');
            setModalErrorOpen(true); // Abrimos el pop-up de error genérico
        } finally {
            setProcesandoId(null);
        }
    };

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Planes
            </h1>

            {/* Si querés conservar el error global del hook por las dudas */}
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
                                {plan.diasPorSemana} días/semana
                            </p>
                            <p className="text-xl font-bold text-blue-600 mt-2 mb-4">
                                ${plan.precio.toLocaleString('es-AR')}
                            </p>
                            <Button
                                onClick={() => handleAbrirModal(plan.id, plan.nombrePlan)}
                                disabled={procesandoId === plan.id}
                                variant="primary"
                                fullWidth
                                className="mt-auto bg-blue-600 hover:bg-blue-700"
                            >
                                Elegir plan
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* MODAL 1: SELECCIÓN DE MÉTODO DE PAGO */}
            <Modal
                isOpen={!!planSeleccionadoId}
                title="Método de pago"
                onClose={() => setPlanSeleccionadoId(null)}
            >
                <p className="text-sm text-gray-500 mb-6">
                    Plan seleccionado: <span className="font-semibold text-gray-800">{nombrePlanSeleccionado}</span>
                </p>

                <div className="space-y-3">
                    <Button
                        onClick={handlePagarMp}
                        fullWidth
                        variant="primary"
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
                        onClick={() => setPlanSeleccionadoId(null)}
                        variant="secondary"
                        fullWidth
                        className="bg-transparent text-gray-400 hover:text-gray-600 shadow-none hover:bg-transparent"
                    >
                        Cancelar
                    </Button>
                </div>
            </Modal>

            {/* MODAL 2: AVISO DE ÉXITO (EFECTIVO PENDIENTE) */}
            <Modal
                isOpen={modalExitoEfectivoOpen}
                title="¡Plan seleccionado con éxito!"
                onClose={() => setModalExitoEfectivoOpen(false)}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Tu plan <span className="font-semibold text-gray-800">{nombrePlanSeleccionado}</span> quedó en estado <span className="font-semibold text-yellow-600">PENDIENTE</span>.
                    </p>
                    <p className="text-sm text-gray-600">
                        Acercate por la recepción del gimnasio para abonar en efectivo y activarlo.
                    </p>

                    <div className="pt-2">
                        <Button
                            onClick={() => setModalExitoEfectivoOpen(false)}
                            fullWidth
                            variant="primary"
                            className="bg-blue-600 text-white hover:bg-blue-700 p-3 rounded-xl"
                        >
                            Entendido
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* MODAL 3: POP-UP GENÉRICO DE ERROR (Reemplaza la barra roja) */}
            <Modal
                isOpen={modalErrorOpen}
                title="Atención"
                onClose={() => setModalErrorOpen(false)}
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                        <span className="text-red-500 text-xl">⚠️</span>
                        <p className="text-sm text-red-700 font-medium">
                            {mensajeError}
                        </p>
                    </div>

                    <div className="pt-2">
                        <Button
                            onClick={() => setModalErrorOpen(false)}
                            fullWidth
                            variant="primary"
                            className="bg-gray-800 text-white hover:bg-gray-900 p-3 rounded-xl"
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default MisPlanes;