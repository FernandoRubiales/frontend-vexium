import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { Table } from '../../shared/components/Table';
import Button from '../../shared/components/Button';
import ConfirmModal from '../../shared/components/ConfirmModal';
import AlertModal from '../../shared/components/AlertModal';
import SelectFilter from '../../shared/components/SelectFilter';
import { useClases } from '../hooks/useClases';
import { useReservas } from '../../reservas/hooks/useReservas';
import { useState, useMemo, useEffect } from 'react';

const ClasesDisponibles = () => {
    // 1. Hook para el cronograma general de clases
    const {
        clases: clasesTodas,
        cargando: cargandoClases,
        error: errorClases,
        recargar: recargarClases
    } = useClases(false);

    // 2. Hook exclusivo de reservas
    const {
        reservas,
        cargando: cargandoReservas,
        error: errorReservas,
        hacerReserva,
        anularReserva
    } = useReservas();

    // Estados para los modales pop-up y alertas
    const [modalReservaAbierto, setModalReservaAbierto] = useState(false);
    const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
    const [claseSeleccionada, setClaseSeleccionada] = useState<any | null>(null);
    const [reservaACancelar, setReservaACancelar] = useState<any | null>(null);
    const [alerta, setAlerta] = useState({ isOpen: false, title: '', message: '' });

    // Estados para los filtros de la cartelera
    const [filtroActividad, setFiltroActividad] = useState('');
    const [filtroDia, setFiltroDia] = useState('');

    // Estados para la paginación de la tabla de clases
    const [paginaActual, setPaginaActual] = useState(1);
    const ELEMENTOS_POR_PAGINA = 5;

    // Opciones únicas para el filtro de actividades
    const actividadesOptions = useMemo(() => {
        const unicas = Array.from(new Set(clasesTodas.map((c: any) => c.nombreTipoActividad)));
        return unicas.map(act => ({ value: act, label: act }));
    }, [clasesTodas]);

    const diasOptions = [
        { value: 'Lunes', label: 'Lunes' },
        { value: 'Martes', label: 'Martes' },
        { value: 'Miercoles', label: 'Miércoles' },
        { value: 'Jueves', label: 'Jueves' },
        { value: 'Viernes', label: 'Viernes' },
        { value: 'Sabado', label: 'Sábado' },
        { value: 'Domingo', label: 'Domingo' },
    ];

    // IDs de las clases que ya están reservadas para poner el botón en gris ("Reservado")
    const clasesReservadasIds = useMemo(() => {
        return reservas.map((r: any) => r.claseId);
    }, [reservas]);

    // Clases filtradas según los selectores
    const clasesFiltradas = useMemo(() => {
        return clasesTodas.filter((clase: any) => {
            const cumpleActividad = filtroActividad ? clase.nombreTipoActividad === filtroActividad : true;
            const cumpleDia = filtroDia ? clase.diaSemana === filtroDia : true;
            return cumpleActividad && cumpleDia;
        });
    }, [clasesTodas, filtroActividad, filtroDia]);

    // Volver a la página 1 si se cambian los filtros
    useEffect(() => {
        setPaginaActual(1);
    }, [filtroActividad, filtroDia]);

    // Cálculo de la paginación
    const totalPaginas = Math.ceil(clasesFiltradas.length / ELEMENTOS_POR_PAGINA);
    const clasesPaginadas = useMemo(() => {
        const inicio = (paginaActual - 1) * ELEMENTOS_POR_PAGINA;
        return clasesFiltradas.slice(inicio, inicio + ELEMENTOS_POR_PAGINA);
    }, [clasesFiltradas, paginaActual]);

    // Manejo de Reserva
    const abrirModalReservar = (clase: any) => {
        setClaseSeleccionada(clase);
        setModalReservaAbierto(true);
    };

    const ejecutarReserva = async () => {
        if (!claseSeleccionada) return;
        setModalReservaAbierto(false);

        try {
            await hacerReserva(claseSeleccionada.id);
            recargarClases();
            setClaseSeleccionada(null);
            setAlerta({ isOpen: true, title: 'Éxito', message: '¡Clase reservada con éxito!' });
        } catch (e: any) {
            const mensajeBackend = e.response?.data?.mensaje || e.response?.data?.message || 'No se pudo realizar la reserva';
            setAlerta({
                isOpen: true,
                title: 'Error al reservar',
                message: mensajeBackend
            });
        }
    };

    // Manejo de Cancelación
    const abrirModalCancelar = (reserva: any) => {
        setReservaACancelar(reserva);
        setModalCancelarAbierto(true);
    };

    const ejecutarCancelacion = async () => {
        if (!reservaACancelar) return;
        setModalCancelarAbierto(false);

        try {
            await anularReserva(reservaACancelar.id);
            recargarClases();
            setReservaACancelar(null);
            setAlerta({ isOpen: true, title: 'Éxito', message: 'Reserva cancelada correctamente' });
        } catch (e: any) {
            const mensajeBackend = e.response?.data?.mensaje || e.response?.data?.message || 'No se pudo cancelar la reserva';
            setAlerta({
                isOpen: true,
                title: 'Error al cancelar',
                message: mensajeBackend
            });
        }
    };

    if (cargandoClases || cargandoReservas) return <Spinner />;

    // Columnas de la Tabla 1: Cartelera General
    const columnasClases = [
        {
            header: 'Actividad',
            accessor: (clase: any) => <div className="font-semibold text-gray-900">{clase.nombreTipoActividad}</div>
        },
        {
            header: 'Día',
            accessor: (clase: any) => clase.diaSemana || '-'
        },
        {
            header: 'Horario',
            accessor: (clase: any) => `${clase.horaInicio} - ${clase.horaFin}`
        },
        {
            header: 'Cupos',
            accessor: (clase: any) => clase.cupoMaximo ? `${clase.cuposDisponibles ?? '-'} / ${clase.cupoMaximo}` : '-'
        },
        {
            header: 'Acción',
            className: 'text-right',
            accessor: (clase: any) => {
                const yaReservada = clasesReservadasIds.includes(clase.id);
                return (
                    <Button
                        onClick={() => abrirModalReservar(clase)}
                        disabled={yaReservada}
                        variant={yaReservada ? 'secondary' : 'success'}
                        className={`ml-auto text-xs py-1.5 px-3 ${yaReservada ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                    >
                        {yaReservada ? 'Reservado' : 'Reservar'}
                    </Button>
                );
            }
        }
    ];

    // Columnas de la Tabla 2: Mis Reservas Activas
    const columnasReservas = [
        {
            header: 'Actividad',
            accessor: (reserva: any) => <span className="font-semibold text-gray-900">{reserva.tipoActividad}</span>
        },
        {
            header: 'Día',
            accessor: (reserva: any) => reserva.diaSemana || '-'
        },
        {
            header: 'Horario',
            accessor: (reserva: any) => `${reserva.horaInicio} - ${reserva.horaFin}`
        },
        {
            header: 'Acción',
            className: 'text-right',
            accessor: (reserva: any) => (
                <Button
                    onClick={() => abrirModalCancelar(reserva)}
                    variant="danger"
                    className="ml-auto text-xs py-1.5 px-3 bg-red-100 text-red-600 hover:bg-red-200 border border-red-200 shadow-none font-medium"
                >
                    Cancelar
                </Button>
            )
        }
    ];

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Gestión de Clases y Reservas
            </h1>

            {(errorClases || errorReservas) && (
                <ErrorMessage mensaje="Hubo un error al cargar la información." />
            )}

            {/* SECCIÓN 1: CARTELERA DE CLASES CON FILTROS Y PAGINACIÓN */}
            <div className="mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Cartelera de Clases
                    </h2>

                    <div className="flex space-x-3 w-full md:w-auto">
                        <SelectFilter
                            label="Actividad"
                            value={filtroActividad}
                            onChange={setFiltroActividad}
                            options={actividadesOptions}
                            allLabel="Todas"
                        />
                        <SelectFilter
                            label="Día"
                            value={filtroDia}
                            onChange={setFiltroDia}
                            options={diasOptions}
                            allLabel="Todos"
                        />
                    </div>
                </div>

                {clasesFiltradas.length === 0 ? (
                    <div className="bg-gray-50 rounded-2xl p-6 text-gray-400 border border-dashed border-gray-200 text-sm text-center">
                        No se encontraron clases con los filtros seleccionados.
                    </div>
                ) : (
                    <>
                        <Table
                            columns={columnasClases}
                            data={clasesPaginadas}
                            keyExtractor={clase => clase.id}
                        />

                        {/* CONTROLES DE PAGINACIÓN CON HTML NATIVO (GRIS Y VISIBLE) */}
                        {totalPaginas > 1 && (
                            <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-500">
                                <span>Página <strong className="text-gray-700">{paginaActual}</strong> de <strong className="text-gray-700">{totalPaginas}</strong></span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
                                        disabled={paginaActual === 1}
                                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition flex items-center justify-center cursor-pointer"
                                        title="Anterior"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
                                        disabled={paginaActual === totalPaginas}
                                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition flex items-center justify-center cursor-pointer"
                                        title="Siguiente"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* SECCIÓN 2: MIS RESERVAS */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Mis Reservas
                </h2>

                {reservas.length === 0 ? (
                    <div className="bg-gray-50 rounded-2xl p-6 text-gray-400 border border-dashed border-gray-200 text-sm text-center">
                        Aún no tenés ninguna reserva realizada.
                    </div>
                ) : (
                    <Table
                        columns={columnasReservas}
                        data={reservas}
                        keyExtractor={reserva => reserva.id}
                    />
                )}
            </div>

            {/* MODALES Y ALERTAS PERSONALIZADAS */}
            <ConfirmModal
                isOpen={modalReservaAbierto}
                message={`¿Desea confirmar la reserva para la clase de ${claseSeleccionada?.nombreTipoActividad}?`}
                confirmText="Sí, reservar"
                onConfirm={ejecutarReserva}
                onClose={() => setModalReservaAbierto(false)}
            />

            <ConfirmModal
                isOpen={modalCancelarAbierto}
                message={`¿Desea cancelar su reserva para la clase de ${reservaACancelar?.tipoActividad}?`}
                confirmText="Sí, cancelar"
                onConfirm={ejecutarCancelacion}
                onClose={() => setModalCancelarAbierto(false)}
            />

            <AlertModal
                isOpen={alerta.isOpen}
                title={alerta.title}
                message={alerta.message}
                onClose={() => setAlerta({ ...alerta, isOpen: false })}
            />
        </Layout>
    );
};

export default ClasesDisponibles;