import { useState } from 'react';
import { usePlanes } from '../hooks/usePlanes';
import { useTipoActividad } from '../../actividades/hooks/useTipoActividad';
import { useSocio } from '../../socios/context/SocioContext';
import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import ConfirmModal from '../../shared/components/ConfirmModal';
import Modal from '../../shared/components/Modal';
import { Table } from '../../shared/components/Table';
import type { Plan } from '../../shared/types';

const GestionPlanes = () => {
    const { planes, cargando, error, crearNuevoPlan, actualizar, darDeBaja } = usePlanes();
    const { tiposActividad } = useTipoActividad();

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
        tiposActividadesIds: [] as number[] // <-- ARREGLO
    });

    const abrirModalCrear = () => {
        setPlanEditandoId(null);
        setFormulario({ nombrePlan: '', descripcion: '', precio: '', diasPorSemana: '', tiposActividadesIds: [] });
        setModalAbierto(true);
    };

    const abrirModalEditar = (plan: Plan) => {
        setPlanEditandoId(plan.id);

        // Magia: Mapear los nombres devueltos por el backend con los IDs correspondientes para tildar los checkboxes
        const idsSeleccionados = plan.tiposActividades
            ?.map(nombre => tiposActividad.find(a => a.nombreTipoActividad === nombre)?.id)
            .filter(id => id !== undefined) as number[] || [];

        setFormulario({
            nombrePlan: plan.nombrePlan,
            descripcion: plan.descripcion,
            precio: plan.precio.toString(),
            diasPorSemana: plan.diasPorSemana.toString(),
            tiposActividadesIds: idsSeleccionados
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

    // Función para manejar cuando tildan/destildan un checkbox
    const handleActividadToggle = (actividadId: number) => {
        setFormulario(prev => {
            const idsActuales = prev.tiposActividadesIds;
            if (idsActuales.includes(actividadId)) {
                return { ...prev, tiposActividadesIds: idsActuales.filter(id => id !== actividadId) };
            } else {
                return { ...prev, tiposActividadesIds: [...idsActuales, actividadId] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formulario.tiposActividadesIds.length === 0) {
                alert('Por favor, seleccioná al menos un tipo de actividad.');
                return;
            }

            const dataRequest = {
                nombrePlan: formulario.nombrePlan,
                descripcion: formulario.descripcion,
                precio: Number(formulario.precio),
                diasPorSemana: Number(formulario.diasPorSemana),
                tiposActividadesIds: formulario.tiposActividadesIds
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

    const columnas = [
        {
            header: 'Nombre',
            accessor: (plan: Plan) => (
                <span className="font-semibold text-gray-900">{plan.nombrePlan}</span>
            )
        },
        { header: 'Descripción', accessor: 'descripcion' as keyof Plan },
        {
            header: 'Actividades Incluidas',
            accessor: (plan: Plan) => (
                <div className="flex flex-wrap gap-1">
                    {plan.tiposActividades && plan.tiposActividades.length > 0 ? (
                        plan.tiposActividades.map((act, index) => (
                            <span key={index} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-indigo-100">
                                {act}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 text-xs italic">Sin actividades</span>
                    )}
                </div>
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

            {isAdmin && (
                <>
                    <Modal
                        isOpen={modalAbierto}
                        title={planEditandoId !== null ? 'Editar Plan' : 'Crear Nuevo Plan'}
                        onClose={() => setModalAbierto(false)}
                    >
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

                            {/* NUEVO BLOQUE DE CHECKBOXES PARA ACTIVIDADES */}
                            <div className="pt-2">
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                                    Actividades Incluidas
                                </label>
                                <div className="grid grid-cols-2 gap-3 border border-gray-200 rounded-xl p-4 bg-gray-50 max-h-48 overflow-y-auto">
                                    {tiposActividad.map(act => (
                                        <div key={act.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`act-${act.id}`}
                                                checked={formulario.tiposActividadesIds.includes(act.id)}
                                                onChange={() => handleActividadToggle(act.id)}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                            />
                                            <label htmlFor={`act-${act.id}`} className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                                {act.nombreTipoActividad}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {formulario.tiposActividadesIds.length === 0 && (
                                    <p className="text-xs text-red-500 mt-1">Debe seleccionar al menos una actividad.</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
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
                        message="¿Desea dar de baja este plan?"
                        onConfirm={confirmarBaja}
                        onClose={() => setModalBajaAbierto(false)}
                    />
                </>
            )}
        </Layout>
    );
};

export default GestionPlanes;