import React, { useState } from 'react';
import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import Modal from '../../shared/components/Modal';
import AlertModal from '../../shared/components/AlertModal';
import { Table } from '../../shared/components/Table';
import { usePagos } from '../hooks/usePagos';
import type { SocioPlan } from '../../shared/types';

const GestionPagos = () => {
    const { pagos, cargando, error, buscarPlanesPendientes, cobrarEfectivo } = usePagos(false);

    // Estados para el Modal de Cobro principal
    const [modalAbierto, setModalAbierto] = useState(false);
    const [dniBusqueda, setDniBusqueda] = useState('');
    const [buscando, setBuscando] = useState(false);
    const [planesPendientes, setPlanesPendientes] = useState<SocioPlan[]>([]);

    // Estados para el formulario de pago
    const [planSeleccionadoId, setPlanSeleccionadoId] = useState<number | ''>('');
    const [monto, setMonto] = useState<string>('');

    // Estado para controlar tu AlertModal personalizado
    const [alerta, setAlerta] = useState({
        isOpen: false,
        title: '',
        message: ''
    });

    const mostrarAlerta = (title: string, message: string) => {
        setAlerta({ isOpen: true, title, message });
    };

    const cerrarAlerta = () => {
        setAlerta({ ...alerta, isOpen: false });
    };

    const handleBuscarSocio = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dniBusqueda) return;

        setBuscando(true);
        setPlanesPendientes([]);
        setPlanSeleccionadoId('');
        setMonto('');

        try {
            const pendientes = await buscarPlanesPendientes(Number(dniBusqueda));
            setPlanesPendientes(pendientes);

            if (pendientes.length === 0) {

                mostrarAlerta('Sin resultados', 'No se encontraron planes pendientes de pago para este Socio.');
            }
        } catch (err: any) {
            mostrarAlerta('Error de búsqueda', err.message);
        } finally {
            setBuscando(false);
        }
    };

    const handleCobrar = async () => {
        if (!planSeleccionadoId || !monto) {
            mostrarAlerta('Atención', 'Debe seleccionar un plan para cobrar.');
            return;
        }

        try {
            await cobrarEfectivo(Number(planSeleccionadoId), Number(monto));
            cerrarModal();
            mostrarAlerta('Éxito', 'Pago registrado');
        } catch (err: any) {
            mostrarAlerta('Error al cobrar', err.message);
        }
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setDniBusqueda('');
        setPlanesPendientes([]);
        setPlanSeleccionadoId('');
        setMonto('');
    };

    if (cargando && !modalAbierto) return <Spinner />;

    const columnas = [
        {
            header: 'Socio',
            accessor: (pago: any) => (
                <span className="font-semibold text-gray-900">
                    {pago.nombreSocio || pago.nombre || 'Sin nombre'} {pago.apellidoSocio || pago.apellido || ''}
                </span>
            )
        },
        {
            header: 'Plan Abonado',
            accessor: 'nombrePlan' as keyof any
        },
        {
            header: 'Monto',
            accessor: (pago: any) => (
                <span className="font-bold text-emerald-600">
                    ${Number(pago.montoPago).toLocaleString('es-AR')}
                </span>
            )
        },
        {
            header: 'Método',
            accessor: (pago: any) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pago.metodoAbonado === 'Efectivo'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-blue-50 text-blue-700'
                    }`}>
                    {pago.metodoAbonado}
                </span>
            )
        },
        {
            header: 'Fecha de Pago',
            accessor: (pago: any) => (
                <span className="text-gray-500 text-xs">
                    {pago.fechaHoraPago ? new Date(pago.fechaHoraPago).toLocaleDateString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : '-'}
                </span>
            )
        }
    ];

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Control de Pagos</h1>
                <button
                    onClick={() => setModalAbierto(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition shadow-sm text-sm cursor-pointer"
                >
                    + Registrar Pago
                </button>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            {pagos.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400 text-sm">
                    No hay pagos registrados todavía.
                </div>
            ) : (
                <Table columns={columnas} data={pagos} keyExtractor={pago => pago.id} />
            )}

            {/* MODAL PRINCIPAL: BÚSQUEDA Y COBRO */}
            <Modal
                isOpen={modalAbierto}
                title="Registrar Pago en Caja"
                onClose={cerrarModal}
            >
                <div className="space-y-5">
                    <form onSubmit={handleBuscarSocio} className="flex space-x-2">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Buscar DNI del Socio</label>
                            <input
                                type="number"
                                required
                                placeholder="Ej: 12345678"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                value={dniBusqueda}
                                onChange={(e) => setDniBusqueda(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={buscando}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm disabled:opacity-50 cursor-pointer"
                            >
                                {buscando ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>
                    </form>

                    {planesPendientes.length > 0 && (
                        <div className="border-t border-gray-100 pt-5 mt-2 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                    Seleccionar Plan Pendiente
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {planesPendientes.map((planPendiente) => {
                                        const nombreAVisualizar = planPendiente.nombrePlan || 'Plan Genérico';
                                        const precioAVisualizar = planPendiente.precio || 0;
                                        const isSelected = planSeleccionadoId === planPendiente.id;

                                        return (
                                            <div
                                                key={planPendiente.id}
                                                onClick={() => {
                                                    setPlanSeleccionadoId(planPendiente.id);
                                                    setMonto(precioAVisualizar.toString());
                                                }}
                                                className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-200 border-2 ${isSelected
                                                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                                    : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-0.5 animate-bounce">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    </div>
                                                )}

                                                <h3 className={`font-bold text-lg pr-6 ${isSelected ? 'text-emerald-900' : 'text-gray-800'}`}>
                                                    {nombreAVisualizar}
                                                </h3>

                                                <div className="mt-2 text-2xl font-black text-emerald-600">
                                                    ${Number(precioAVisualizar).toLocaleString('es-AR')}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {planSeleccionadoId && (
                                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 animate-fade-in mt-4">
                                    <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                        Resumen de cobro
                                    </h4>

                                    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-5 border border-emerald-100">
                                        <span className="text-gray-600 font-bold">Total a cobrar en caja:</span>
                                        <span className="text-3xl font-black text-emerald-600">
                                            ${Number(monto).toLocaleString('es-AR')}
                                        </span>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={cerrarModal}
                                            className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCobrar}
                                            className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center"
                                        >
                                            Confirmar Pago
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Modal>


            <AlertModal
                isOpen={alerta.isOpen}
                title={alerta.title}
                message={alerta.message}
                onClose={cerrarAlerta}
            />
        </Layout>
    );
};

export default GestionPagos;