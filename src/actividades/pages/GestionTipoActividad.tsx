import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import Modal from '../../shared/components/Modal';
import ConfirmModal from '../../shared/components/ConfirmModal';
import { useTipoActividad } from '../hooks/useTipoActividad';
import { useState } from 'react';

const GestionTipoActividad = () => {
    const { tiposActividad, cargando, error, crearActividad, actualizarActividad, darDeBajaActividad } = useTipoActividad();

    const [modalAbierto, setModalAbierto] = useState(false);
    const [actividadEditandoId, setActividadEditandoId] = useState<number | null>(null);

    const [modalBajaAbierto, setModalBajaAbierto] = useState(false);
    const [actividadAEliminar, setActividadAEliminar] = useState<any | null>(null);

    const [formulario, setFormulario] = useState({
        nombreTipoActividad: '',
        descripcion: '',
        requiereReserva: false
    });

    const abrirModalCrear = () => {
        setActividadEditandoId(null);
        setFormulario({ nombreTipoActividad: '', descripcion: '', requiereReserva: false });
        setModalAbierto(true);
    };

    const abrirModalEditar = (actividad: any) => {
        setActividadEditandoId(actividad.id);
        setFormulario({
            nombreTipoActividad: actividad.nombreTipoActividad || '',
            descripcion: actividad.descripcion || '',
            requiereReserva: actividad.requiereReserva ?? false
        });
        setModalAbierto(true);
    };

    const confirmarBaja = async () => {
        if (!actividadAEliminar) return;
        try {
            await darDeBajaActividad(actividadAEliminar.id);
            setModalBajaAbierto(false);
            setActividadAEliminar(null);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataRequest = {
                nombreTipoActividad: formulario.nombreTipoActividad,
                descripcion: formulario.descripcion,
                requiereReserva: Boolean(formulario.requiereReserva)
            };

            if (actividadEditandoId !== null) {
                await actualizarActividad(actividadEditandoId, dataRequest);
            } else {
                await crearActividad(dataRequest);
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
                    <h1 className="text-2xl font-bold text-gray-800">Tipos de Actividad</h1>
                </div>
                <button
                    onClick={abrirModalCrear}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition shadow-sm text-sm"
                >
                    + Nueva Actividad
                </button>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 text-left">Nombre</th>
                            <th className="px-6 py-4 text-left">Descripción</th>
                            <th className="px-6 py-4 text-left">Reserva</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tiposActividad.map(act => (
                            <tr key={act.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    {act.nombreTipoActividad}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {act.descripcion}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${act.requiereReserva
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {act.requiereReserva ? 'Requiere reserva' : 'Libre'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => abrirModalEditar(act)}
                                        className="bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-xl font-medium transition text-xs"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActividadAEliminar(act);
                                            setModalBajaAbierto(true);
                                        }}
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

            {/* Modal de Crear / Editar */}
            <Modal
                isOpen={modalAbierto}
                title={actividadEditandoId !== null ? 'Editar Actividad' : 'Crear Nueva Actividad'}
                onClose={() => setModalAbierto(false)}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nombre</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            value={formulario.nombreTipoActividad}
                            onChange={e => setFormulario({ ...formulario, nombreTipoActividad: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Descripción</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            value={formulario.descripcion}
                            onChange={e => setFormulario({ ...formulario, descripcion: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center space-x-3 pt-1">
                        <input
                            type="checkbox"
                            id="requiereReserva"
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            checked={formulario.requiereReserva}
                            onChange={e => setFormulario({ ...formulario, requiereReserva: e.target.checked })}
                        />
                        <label htmlFor="requiereReserva" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                            Requiere reserva previa
                        </label>
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
                            {actividadEditandoId !== null ? 'Guardar Cambios' : 'Crear Actividad'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal de confirmación de baja */}
            <ConfirmModal
                isOpen={modalBajaAbierto}
                message="¿Desea dar de baja este tipo de actividad?"
                onConfirm={confirmarBaja}
                onClose={() => setModalBajaAbierto(false)}
            />
        </Layout>
    );
};

export default GestionTipoActividad;