import { useState } from 'react';
import { usePlanes } from '../hooks/usePlanes';
import { useTipoActividad } from '../../actividades/hooks/useTipoActividad';
// IMPORTAMOS EL CONTEXTO
import { useSocio } from '../../socios/context/SocioContext';
import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import ConfirmModal from '../../shared/components/ConfirmModal';
import Modal from '../../shared/components/Modal';
import { Table } from '../../shared/components/Table';
import type { Plan } from '../../shared/types';

const GestionPlanes = () => { // O AdminPlanesPage, como lo llames
    const { planes, cargando, error, crearNuevoPlan, actualizar, darDeBaja } = usePlanes();
    const { tiposActividad } = useTipoActividad();

    // OBTENEMOS AL USUARIO LOGUEADO
    const { socio: usuarioActual } = useSocio();
    const isAdmin = usuarioActual?.nombreRol === 'ADMIN';

    const [modalAbierto, setModalAbierto] = useState(false);
    const [planEditandoId, setPlanEditandoId] = useState<number | null>(null);

    const [modalBajaAbierto, setModalBajaAbierto] = useState(false);
    const [planAEliminar, setPlanAEliminar] = useState<Plan | null>(null);

    const [formulario, setFormulario] = useState({
        nombrePlan: '',
        descripcion: '',
        precio: '',
        diasPorSemana: '',
        tipoActividadId: ''
    });

    const abrirModalCrear = () => {
        setPlanEditandoId(null);
        setFormulario({ nombrePlan: '', descripcion: '', precio: '', diasPorSemana: '', tipoActividadId: '' });
        setModalAbierto(true);
    };

    const abrirModalEditar = (plan: Plan) => {
        setPlanEditandoId(plan.id);
        setFormulario({
            nombrePlan: plan.nombrePlan,
            descripcion: plan.descripcion,
            precio: plan.precio.toString(),
            diasPorSemana: plan.diasPorSemana.toString(),
            tipoActividadId: (plan as any).tipoActividadId?.toString() || ''
        });
        setModalAbierto(true);
    };

    const confirmarBaja = async () => {
        if (!planAEliminar) return;
        try {
            await darDeBaja(planAEliminar.id);
            setModalBajaAbierto(false);
            setPlanAEliminar(null);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formulario.tipoActividadId) {
                alert('Por favor, seleccioná un tipo de actividad.');
                return;
            }

            const dataRequest = {
                nombrePlan: formulario.nombrePlan,
                descripcion: formulario.descripcion,
                precio: Number(formulario.precio),
                diasPorSemana: Number(formulario.diasPorSemana),
                tipoActividadId: Number(formulario.tipoActividadId)
            };

            if (planEditandoId !== null) {
                await actualizar(planEditandoId, dataRequest);
            } else {
                await crearNuevoPlan(dataRequest);
            }
            setModalAbierto(false);
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (cargando) return <Spinner />;

    // USAMOS SPREAD (...) PARA AGREGAR LA COLUMNA DE ACCIONES SOLO SI ES ADMIN
    const columnas = [
        {
            header: 'Nombre',
            accessor: (plan: Plan) => (
                <span className="font-semibold text-gray-900">{plan.nombrePlan}</span>
            )
        },
        { header: 'Descripción', accessor: 'descripcion' as keyof Plan },
        {
            header: 'Actividad',
            accessor: (plan: Plan) => (
                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium">
                    {plan.tipoActividad}
                </span>
            )
        },
        {
            header: 'Precio',
            accessor: (plan: Plan) => `$${plan.precio.toLocaleString('es-AR')}`
        },
        {
            header: 'Días',
            accessor: (plan: Plan) => `${plan.diasPorSemana}`
        },
        // SI ES ADMIN, RENDERIZA ESTA COLUMNA. SI NO, LA IGNORA.
        ...(isAdmin ? [{
            header: 'Acciones',
            className: 'text-right',
            accessor: (plan: Plan) => (
                <div className="space-x-2">
                    <button
                        onClick={() => abrirModalEditar(plan)}
                        className="bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-xl font-medium transition text-xs cursor-pointer"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => {
                            setPlanAEliminar(plan);
                            setModalBajaAbierto(true);
                        }}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-xl font-medium transition text-xs cursor-pointer"
                    >
                        Eliminar
                    </button>
                </div>
            )
        }] : [])
    ];

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isAdmin ? 'Gestión de Planes' : 'Lista de Planes'}
                    </h1>
                </div>
                {/* EL BOTÓN DE NUEVO PLAN SOLO APARECE PARA ADMIN */}
                {isAdmin && (
                    <button
                        onClick={abrirModalCrear}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition shadow-sm text-sm cursor-pointer"
                    >
                        + Nuevo Plan
                    </button>
                )}
            </div>

            {error && <ErrorMessage mensaje={error} />}

            <Table columns={columnas} data={planes} keyExtractor={plan => plan.id} />

            {/* LOS MODALES SOLO SE VAN A ABRIR SI ES ADMIN PORQUE LOS BOTONES ESTÁN OCULTOS, 
                PERO PODEMOS DEJAR EL CÓDIGO IGUAL */}
            {isAdmin && (
                <>
                    <Modal
                        isOpen={modalAbierto}
                        title={planEditandoId !== null ? 'Editar Plan' : 'Crear Nuevo Plan'}
                        onClose={() => setModalAbierto(false)}
                    >
                        {/* ... TODO EL FORMULARIO QUEDA EXACTAMENTE IGUAL ... */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                    value={formulario.nombrePlan}
                                    onChange={e => setFormulario({ ...formulario, nombrePlan: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Descripción</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                    value={formulario.descripcion}
                                    onChange={e => setFormulario({ ...formulario, descripcion: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Precio</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                        value={formulario.precio}
                                        onChange={e => setFormulario({ ...formulario, precio: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Días por semana</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                        value={formulario.diasPorSemana}
                                        onChange={e => setFormulario({ ...formulario, diasPorSemana: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Tipo de Actividad</label>
                                <select
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                                    value={formulario.tipoActividadId}
                                    onChange={e => setFormulario({ ...formulario, tipoActividadId: e.target.value })}
                                >
                                    <option value="">Seleccione un tipo de actividad...</option>
                                    {tiposActividad.map(act => (
                                        <option key={act.id} value={act.id}>
                                            {act.nombreTipoActividad}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalAbierto(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm cursor-pointer"
                                >
                                    {planEditandoId !== null ? 'Guardar Cambios' : 'Crear Plan'}
                                </button>
                            </div>
                        </form>
                    </Modal>

                    <ConfirmModal
                        isOpen={modalBajaAbierto}
                        message="¿Desea dar de baja?"
                        onConfirm={confirmarBaja}
                        onClose={() => setModalBajaAbierto(false)}
                    />
                </>
            )}
        </Layout>
    );
};

export default GestionPlanes;