import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import Modal from '../../shared/components/Modal';
import ConfirmModal from '../../shared/components/ConfirmModal';
import { useClases } from '../hooks/useClases';
import { useTipoActividad } from '../../actividades/hooks/useTipoActividad';
import { useState } from 'react';
import type { Clase } from '../../shared/types';

const GestionClases = () => {
    const { clases, cargando, error, crearClase, actualizarClase, darDeBajaClase } = useClases(false);
    const { tiposActividad } = useTipoActividad();

    const [modalAbierto, setModalAbierto] = useState(false);
    const [claseEditandoId, setClaseEditandoId] = useState<number | null>(null);

    const [modalBajaAbierto, setModalBajaAbierto] = useState(false);
    const [claseAEliminar, setClaseAEliminar] = useState<Clase | null>(null);

    const [formulario, setFormulario] = useState({
        diaSemana: '',
        horaInicioHora: '08',
        horaInicioMinuto: '00',
        horaFinHora: '09',
        horaFinMinuto: '00',
        cupoMaximo: '',
        tipoActividadId: ''
    });

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const horasOpciones = Array.from({ length: 18 }, (_, i) => String(i + 6).padStart(2, '0'));
    const minutosOpciones = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    const abrirModalCrear = () => {
        setClaseEditandoId(null);
        setFormulario({
            diaSemana: '',
            horaInicioHora: '08',
            horaInicioMinuto: '00',
            horaFinHora: '09',
            horaFinMinuto: '00',
            cupoMaximo: '',
            tipoActividadId: ''
        });
        setModalAbierto(true);
    };

    const abrirModalEditar = (clase: any) => {
        setClaseEditandoId(clase.id);

        let actividadIdEncontrada = clase.tipoActividadId?.toString() || '';

        if (!actividadIdEncontrada && clase.nombreTipoActividad) {
            const match = tiposActividad.find(
                act => act.nombreTipoActividad === clase.nombreTipoActividad
            );
            if (match) actividadIdEncontrada = match.id.toString();
        }

        const [hInicio = '08', mInicio = '00'] = (clase.horaInicio || '08:00').split(':');
        const [hFin = '09', mFin = '00'] = (clase.horaFin || '09:00').split(':');

        setFormulario({
            diaSemana: clase.diaSemana || '',
            horaInicioHora: hInicio,
            horaInicioMinuto: mInicio,
            horaFinHora: hFin,
            horaFinMinuto: mFin,
            cupoMaximo: clase.cupoMaximo?.toString() || '',
            tipoActividadId: actividadIdEncontrada
        });
        setModalAbierto(true);
    };

    const confirmarBaja = async () => {
        if (!claseAEliminar) return;
        try {
            await darDeBajaClase(claseAEliminar.id);
            setModalBajaAbierto(false);
            setClaseAEliminar(null);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataRequest = {
                diaSemana: formulario.diaSemana,
                horaInicio: `${formulario.horaInicioHora}:${formulario.horaInicioMinuto}`,
                horaFin: `${formulario.horaFinHora}:${formulario.horaFinMinuto}`,
                cupoMaximo: Number(formulario.cupoMaximo),
                tipoActividadId: Number(formulario.tipoActividadId)
            };

            if (claseEditandoId !== null) {
                await actualizarClase(claseEditandoId, dataRequest);
            } else {
                await crearClase(dataRequest);
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
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Clases</h1>
                    <p className="text-sm text-gray-500">Creá, editá y administrá los horarios y cupos de las clases</p>
                </div>
                <button
                    onClick={abrirModalCrear}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition shadow-sm text-sm"
                >
                    + Nueva Clase
                </button>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 text-left">Actividad</th>
                            <th className="px-6 py-4 text-left">Día</th>
                            <th className="px-6 py-4 text-left">Hora Inicio</th>
                            <th className="px-6 py-4 text-left">Hora Fin</th>
                            <th className="px-6 py-4 text-left">Cupo Máximo</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {clases.map(clase => (
                            <tr key={clase.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {clase.nombreTipoActividad}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {clase.diaSemana}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {clase.horaInicio}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {clase.horaFin}
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-semibold">
                                    {clase.cupoMaximo}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => abrirModalEditar(clase)}
                                        className="bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-xl font-medium transition text-xs"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setClaseAEliminar(clase);
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
                title={claseEditandoId !== null ? 'Editar Clase' : 'Crear Nueva Clase'}
                onClose={() => setModalAbierto(false)}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Tipo de Actividad</label>
                        <select
                            required
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={formulario.tipoActividadId}
                            onChange={e => setFormulario({ ...formulario, tipoActividadId: e.target.value })}
                        >
                            <option value="">Seleccione una actividad...</option>
                            {tiposActividad.map(act => (
                                <option key={act.id} value={act.id}>
                                    {act.nombreTipoActividad}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Día de la semana</label>
                        <select
                            required
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={formulario.diaSemana}
                            onChange={e => setFormulario({ ...formulario, diaSemana: e.target.value })}
                        >
                            <option value="">Seleccione un día...</option>
                            {diasSemana.map(dia => (
                                <option key={dia} value={dia}>{dia}</option>
                            ))}
                        </select>
                    </div>

                    {/* Grilla para ordenar Horario Inicio, Horario Fin y Cupo Máximo en paralelo */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Hora Inicio</label>
                            <div className="flex items-center space-x-1">
                                <select
                                    className="w-full border border-gray-200 rounded-xl px-1.5 py-2 text-xs text-center focus:ring-2 focus:ring-indigo-500 bg-white"
                                    value={formulario.horaInicioHora}
                                    onChange={e => setFormulario({ ...formulario, horaInicioHora: e.target.value })}
                                >
                                    {horasOpciones.map(h => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                                <span className="text-gray-500 font-bold">:</span>
                                <select
                                    className="w-full border border-gray-200 rounded-xl px-1.5 py-2 text-xs text-center focus:ring-2 focus:ring-indigo-500 bg-white"
                                    value={formulario.horaInicioMinuto}
                                    onChange={e => setFormulario({ ...formulario, horaInicioMinuto: e.target.value })}
                                >
                                    {minutosOpciones.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Hora Fin</label>
                            <div className="flex items-center space-x-1">
                                <select
                                    className="w-full border border-gray-200 rounded-xl px-1.5 py-2 text-xs text-center focus:ring-2 focus:ring-indigo-500 bg-white"
                                    value={formulario.horaFinHora}
                                    onChange={e => setFormulario({ ...formulario, horaFinHora: e.target.value })}
                                >
                                    {horasOpciones.map(h => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                                <span className="text-gray-500 font-bold">:</span>
                                <select
                                    className="w-full border border-gray-200 rounded-xl px-1.5 py-2 text-xs text-center focus:ring-2 focus:ring-indigo-500 bg-white"
                                    value={formulario.horaFinMinuto}
                                    onChange={e => setFormulario({ ...formulario, horaFinMinuto: e.target.value })}
                                >
                                    {minutosOpciones.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Cupo Máximo</label>
                            <input
                                type="number"
                                required
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-center focus:ring-2 focus:ring-indigo-500"
                                value={formulario.cupoMaximo}
                                onChange={e => setFormulario({ ...formulario, cupoMaximo: e.target.value })}
                            />
                        </div>
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
                            {claseEditandoId !== null ? 'Guardar Cambios' : 'Crear Clase'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal de confirmación de baja */}
            <ConfirmModal
                isOpen={modalBajaAbierto}
                message="¿Desea dar de baja esta clase?"
                onConfirm={confirmarBaja}
                onClose={() => setModalBajaAbierto(false)}
            />
        </Layout>
    );
};

export default GestionClases;