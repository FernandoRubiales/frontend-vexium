import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import Modal from '../../shared/components/Modal';
import ConfirmModal from '../../shared/components/ConfirmModal';
import AlertModal from '../../shared/components/AlertModal';
import { useClases } from '../hooks/useClases';
import { useTipoActividad } from '../../actividades/hooks/useTipoActividad';
import { useReservas } from '../../reservas/hooks/useReservas';
import { useState } from 'react';
import type { Clase, Reserva } from '../../shared/types';

const GestionClases = () => {
    const { clases, cargando, error, crearClase, actualizarClase, darDeBajaClase } = useClases(false);
    const { tiposActividad } = useTipoActividad();
    const { cargarReservasDeClase } = useReservas();

    // Estados para Alertas
    const [alerta, setAlerta] = useState({ isOpen: false, title: '', message: '' });
    const mostrarAlerta = (title: string, message: string) => setAlerta({ isOpen: true, title, message });
    const cerrarAlerta = () => setAlerta({ ...alerta, isOpen: false });

    // Estados para crear/editar
    const [modalAbierto, setModalAbierto] = useState(false);
    const [claseEditandoId, setClaseEditandoId] = useState<number | null>(null);

    // Estados para eliminar
    const [modalBajaAbierto, setModalBajaAbierto] = useState(false);
    const [claseAEliminar, setClaseAEliminar] = useState<Clase | null>(null);

    // Estados para ver inscriptos
    const [modalReservasAbierto, setModalReservasAbierto] = useState(false);
    const [inscriptosClase, setInscriptosClase] = useState<Reserva[]>([]);
    const [cargandoInscriptos, setCargandoInscriptos] = useState(false);

    // ESTADOS PARA LOS FILTROS
    const [filtroActividad, setFiltroActividad] = useState('Todas');
    const [filtroDia, setFiltroDia] = useState('Todos');

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

    // LÓGICA DE FILTRADO EN TIEMPO REAL
    const clasesFiltradas = clases.filter(clase => {
        const pasaFiltroActividad = filtroActividad === 'Todas' || clase.nombreTipoActividad === filtroActividad;
        const pasaFiltroDia = filtroDia === 'Todos' || clase.diaSemana === filtroDia;
        return pasaFiltroActividad && pasaFiltroDia;
    });

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
            mostrarAlerta('Éxito', 'La clase fue dada de baja correctamente.');
        } catch (err: any) {
            mostrarAlerta('Error al eliminar', err.message);
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
                mostrarAlerta('Éxito', 'La clase fue actualizada correctamente.');
            } else {
                await crearClase(dataRequest);
                mostrarAlerta('Éxito', 'La nueva clase fue creada correctamente.');
            }
            setModalAbierto(false);
        } catch (err: any) {
            mostrarAlerta('Error al guardar', err.message);
        }
    };

    const abrirModalReservas = async (claseId: number) => {
        setCargandoInscriptos(true);
        setModalReservasAbierto(true);
        try {
            const reservas = await cargarReservasDeClase(claseId);
            setInscriptosClase(reservas);
        } catch (err: any) {
            setModalReservasAbierto(false);
            mostrarAlerta('Error', err.message);
        } finally {
            setCargandoInscriptos(false);
        }
    };

    if (cargando) return <Spinner />;

    return (
        <Layout>
            {/* TÍTULO PRINCIPAL Y BOTÓN */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold text-[#1e293b]">Gestión de Clases</h1>
                <button
                    onClick={abrirModalCrear}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm text-sm cursor-pointer"
                >
                    + Nueva Clase
                </button>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            {/* SUBTÍTULO Y FILTROS ALINEADOS A LA DERECHA */}
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Cartelera de Clases</h2>

                <div className="flex space-x-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Actividad
                        </label>
                        <select
                            className="bg-white border border-gray-200 text-gray-700 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer min-w-[130px] shadow-sm"
                            value={filtroActividad}
                            onChange={(e) => setFiltroActividad(e.target.value)}
                        >
                            <option value="Todas">Todas</option>
                            {tiposActividad.map((act) => (
                                <option key={act.id} value={act.nombreTipoActividad}>
                                    {act.nombreTipoActividad}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Día
                        </label>
                        <select
                            className="bg-white border border-gray-200 text-gray-700 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer min-w-[130px] shadow-sm"
                            value={filtroDia}
                            onChange={(e) => setFiltroDia(e.target.value)}
                        >
                            <option value="Todos">Todos</option>
                            {diasSemana.map((dia) => (
                                <option key={dia} value={dia}>{dia}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* TABLA DE CLASES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold">Actividad</th>
                            <th className="px-6 py-4 text-left font-semibold">Día</th>
                            <th className="px-6 py-4 text-left font-semibold">Horario</th>
                            <th className="px-6 py-4 text-left font-semibold">Cupos</th>
                            <th className="px-6 py-4 text-right font-semibold">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {clasesFiltradas.length > 0 ? (
                            clasesFiltradas.map(clase => (
                                <tr key={clase.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-800">
                                        {clase.nombreTipoActividad}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {clase.diaSemana}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {clase.horaInicio} - {clase.horaFin}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {clase.cuposDisponibles !== undefined ? clase.cuposDisponibles : clase.cupoMaximo} / {clase.cupoMaximo}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                        <button
                                            onClick={() => abrirModalReservas(clase.id)}
                                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-xl font-medium transition text-xs cursor-pointer"
                                        >
                                            Inscriptos
                                        </button>
                                        <button
                                            onClick={() => abrirModalEditar(clase)}
                                            className="bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-xl font-medium transition text-xs cursor-pointer"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => {
                                                setClaseAEliminar(clase);
                                                setModalBajaAbierto(true);
                                            }}
                                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-xl font-medium transition text-xs cursor-pointer"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                                    No hay clases que coincidan con los filtros aplicados.
                                </td>
                            </tr>
                        )}
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
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm cursor-pointer"
                        >
                            {claseEditandoId !== null ? 'Guardar Cambios' : 'Crear Clase'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* MODAL DE INSCRIPTOS */}
            <Modal
                isOpen={modalReservasAbierto}
                title="Lista de Inscriptos a la Clase"
                onClose={() => setModalReservasAbierto(false)}
            >
                <div className="space-y-4">
                    {cargandoInscriptos ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : inscriptosClase.length === 0 ? (
                        <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                            Aún no hay socios inscriptos en esta clase.
                        </div>
                    ) : (
                        <div className="border border-gray-100 rounded-xl overflow-hidden">
                            <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                                {inscriptosClase.map((reserva, index) => (
                                    <li key={reserva.id} className="p-4 hover:bg-gray-50 flex items-center justify-between transition">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">
                                                    {reserva.nombreSocio} {reserva.apellidoSocio}
                                                </p>

                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="bg-gray-50 p-3 text-right text-xs font-semibold text-gray-500 border-t border-gray-100">
                                Total Inscriptos: {inscriptosClase.length}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={() => setModalReservasAbierto(false)}
                            className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de confirmación de baja */}
            <ConfirmModal
                isOpen={modalBajaAbierto}
                message="¿Desea dar de baja esta clase?"
                onConfirm={confirmarBaja}
                onClose={() => setModalBajaAbierto(false)}
            />

            {/* ALERT MODAL para mensajes de éxito/error */}
            <AlertModal
                isOpen={alerta.isOpen}
                title={alerta.title}
                message={alerta.message}
                onClose={cerrarAlerta}
            />
        </Layout>
    );
};

export default GestionClases;