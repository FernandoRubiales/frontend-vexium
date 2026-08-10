import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import Modal from '../../shared/components/Modal';
import ConfirmModal from '../../shared/components/ConfirmModal';
import { useTipoActividad } from '../hooks/useTipoActividad';
import { useState } from 'react';
// IMPORTAMOS EL CONTEXTO
import { useSocio } from '../../socios/context/SocioContext';

const GestionTipoActividad = () => {
    const { tiposActividad, cargando, error, crearActividad, actualizarActividad, darDeBajaActividad } = useTipoActividad();

    // OBTENEMOS AL USUARIO LOGUEADO
    const { socio: usuarioActual } = useSocio();
    const isAdmin = usuarioActual?.nombreRol === 'ADMIN';

    const [modalAbierto, setModalAbierto] = useState(false);
    const [actividadEditandoId, setActividadEditandoId] = useState<number | null>(null);

    const [modalBajaAbierto, setModalBajaAbierto] = useState(false);
    const [actividadAEliminar, setActividadAEliminar] = useState<any | null>(null);

    // 1. ELIMINADO EL CAMPO requiereReserva DEL ESTADO
    const [formulario, setFormulario] = useState({
        nombreTipoActividad: '',
        descripcion: ''
    });

    const abrirModalCrear = () => {
        setActividadEditandoId(null);
        setFormulario({ nombreTipoActividad: '', descripcion: '' });
        setModalAbierto(true);
    };

    const abrirModalEditar = (actividad: any) => {
        setActividadEditandoId(actividad.id);
        setFormulario({
            nombreTipoActividad: actividad.nombreTipoActividad || '',
            descripcion: actividad.descripcion || ''
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
            // 2. ELIMINADO EL CAMPO requiereReserva DEL REQUEST
            const dataRequest = {
                nombreTipoActividad: formulario.nombreTipoActividad,
                descripcion: formulario.descripcion
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
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isAdmin ? 'Tipos de Actividad' : 'Lista de Actividades'}
                    </h1>
                </div>
                {/* EL BOTÓN SOLO SE RENDERIZA SI ES ADMIN */}
                {isAdmin && (
                    <button
                        onClick={abrirModalCrear}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition shadow-sm text-sm"
                    >
                        + Nueva Actividad
                    </button>
                )}
            </div>

            {error && <ErrorMessage mensaje={error} />}

            <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 text-left">Nombre</th>
                            <th className="px-6 py-4 text-left">Descripción</th>
                            {/* 3. ELIMINAMOS LA CABECERA DE RESERVA */}
                            {isAdmin && <th className="px-6 py-4 text-right">Acciones</th>}
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
                                {/* 3. ELIMINAMOS LA CELDA QUE MOSTRABA SI REQUERÍA RESERVA */}

                                {/* CELDA OCULTA PARA NO ADMINS */}
                                {isAdmin && (
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
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* LOS MODALES PERMANECEN IGUAL YA QUE NO SE PODRÁN ABRIR SIN LOS BOTONES */}
            {isAdmin && (
                <>
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

                            {/* 4. ELIMINAMOS EL CHECKBOX DE REQUIERE RESERVA DEL FORMULARIO */}

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

                    <ConfirmModal
                        isOpen={modalBajaAbierto}
                        message="¿Desea dar de baja este tipo de actividad?"
                        onConfirm={confirmarBaja}
                        onClose={() => setModalBajaAbierto(false)}
                    />
                </>
            )}
        </Layout>
    );
};

export default GestionTipoActividad;