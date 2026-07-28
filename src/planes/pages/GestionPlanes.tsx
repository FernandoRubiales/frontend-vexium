import { usePlanes } from '../hooks/usePlanes';
import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import ConfirmModal from '../../shared/components/ConfirmModal';
import { useState } from 'react';
import type { Plan } from '../../shared/types';

const AdminPlanesPage = () => {
    const { planes, cargando, error, crearNuevoPlan, actualizar, darDeBaja } = usePlanes();
    const [modalAbierto, setModalAbierto] = useState(false);
    const [planEditandoId, setPlanEditandoId] = useState<number | null>(null);

    // Estado para el modal genérico de baja
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
            tipoActividadId: (plan as any).tipoActividadId || ''
        });
        setModalAbierto(true);
    };

    const abrirModalBaja = (plan: Plan) => {
        setPlanAEliminar(plan);
        setModalBajaAbierto(true);
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

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Planes</h1>
                    <p className="text-sm text-gray-500">Creá, editá y administrá los planes activos</p>
                </div>
                <button
                    onClick={abrirModalCrear}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition shadow-sm text-sm"
                >
                    + Nuevo Plan
                </button>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Descripción</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Días / Clases</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                        {planes.map(plan => (
                            <tr key={plan.id} className="hover:bg-gray-50/50 transition">
                                <td className="p-4 font-semibold text-gray-900">{plan.nombrePlan}</td>
                                <td className="p-4 text-gray-500">{plan.descripcion}</td>
                                <td className="p-4 font-medium text-gray-900">${plan.precio.toLocaleString('es-AR')}</td>
                                <td className="p-4">{plan.diasPorSemana} días <span className="text-xs text-gray-400">({plan.clasesIncluidas} clases)</span></td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => abrirModalEditar(plan)}
                                        className="bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-xl font-medium transition text-xs"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => abrirModalBaja(plan)}
                                        className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-xl font-medium transition text-xs"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL CREAR / EDITAR PLAN */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            {planEditandoId !== null ? 'Editar Plan' : 'Crear Nuevo Plan'}
                        </h2>
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
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">ID Tipo Actividad</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                    value={formulario.tipoActividadId}
                                    onChange={e => setFormulario({ ...formulario, tipoActividadId: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalAbierto(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                                >
                                    {planEditandoId !== null ? 'Guardar Cambios' : 'Crear Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL GENÉRICO DE BAJA */}
            <ConfirmModal
                isOpen={modalBajaAbierto}
                message="¿Desea dar de baja?"
                onConfirm={confirmarBaja}
                onClose={() => setModalBajaAbierto(false)}
            />
        </Layout>
    );
};

export default AdminPlanesPage;