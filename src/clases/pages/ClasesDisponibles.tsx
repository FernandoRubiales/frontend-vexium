import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { Table } from '../../shared/components/Table';
import Button from '../../shared/components/Button';
import ConfirmModal from '../../shared/components/ConfirmModal';
import AlertModal from '../../shared/components/AlertModal';
import SelectFilter from '../../shared/components/SelectFilter';
import { useClases } from '../hooks/useClases';
import { useReservaApi } from '../../reservas/api/reservaApi';
import { useState, useMemo, useEffect } from 'react';

const ClasesDisponibles = () => {
    // Traemos únicamente el cronograma general de clases
    const {
        clases: clasesTodas,
        cargando: cargandoClases,
        error: errorClases,
        recargar: recargarClases
    } = useClases(false);

    const { reservar, obtenerMisReservas } = useReservaApi();

    // Estados para los modales pop-up
    const [modalAccionAbierto, setModalAccionAbierto] = useState(false);
    const [claseSeleccionada, setClaseSeleccionada] = useState<any | null>(null);
    const [alerta, setAlerta] = useState({ isOpen: false, title: '', message: '' });

    // Estado para guardar los IDs de las clases ya reservadas de forma persistente
    const [clasesReservadasIds, setClasesReservadasIds] = useState<number[]>([]);
    const [cargandoReservas, setCargandoReservas] = useState(true);

    // Estados para los filtros generales
    const [filtroActividad, setFiltroActividad] = useState('');
    const [filtroDia, setFiltroDia] = useState('');

    // Cargar las reservas activas del socio al entrar a la vista
    useEffect(() => {
        const cargarReservasSocio = async () => {
            try {
                setCargandoReservas(true);
                const response = await obtenerMisReservas();
                const listaReservas = (response as any)?.data ? (response as any).data : response;

                if (Array.isArray(listaReservas)) {
                    const ids = listaReservas.map((r: any) => r.claseId);
                    setClasesReservadasIds(ids);
                }
            } catch (e) {
                console.error("Error al cargar las reservas del socio", e);
            } finally {
                setCargandoReservas(false);
            }
        };

        cargarReservasSocio();
    }, []);

    // Opciones únicas para el filtro de actividades basadas en el cronograma general
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

    // Clases filtradas según los selectores de actividad y día
    const clasesFiltradas = useMemo(() => {
        return clasesTodas.filter((clase: any) => {
            const cumpleActividad = filtroActividad ? clase.nombreTipoActividad === filtroActividad : true;
            const cumpleDia = filtroDia ? clase.diaSemana === filtroDia : true;
            return cumpleActividad && cumpleDia;
        });
    }, [clasesTodas, filtroActividad, filtroDia]);

    const abrirModalReservar = (clase: any) => {
        setClaseSeleccionada(clase);
        setModalAccionAbierto(true);
    };

    const ejecutarReserva = async () => {
        if (!claseSeleccionada) return;

        setModalAccionAbierto(false);

        try {
            await reservar(claseSeleccionada.id);

            // Actualizamos la lista local de ids reservados para reflejar el cambio al instante
            setClasesReservadasIds(prev => [...prev, claseSeleccionada.id]);

            recargarClases();
            setClaseSeleccionada(null);

            setAlerta({ isOpen: true, title: 'Éxito', message: '¡Reserva realizada con éxito!' });
        } catch (e: any) {
            setAlerta({
                isOpen: true,
                title: 'Error',
                message: e.response?.data?.mensaje || 'No se pudo realizar la reserva'
            });
        }
    };

    if (cargandoClases || cargandoReservas) return <Spinner />;

    // Columnas unificadas que incluyen la información completa y el botón interactivo de reserva
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

    return (
        <Layout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    Cartelera de Clases
                </h1>

                {/* Filtros generales unificados */}
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

            {errorClases && (
                <ErrorMessage mensaje="Hubo un error al cargar el cronograma de clases." />
            )}

            {clasesFiltradas.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-6 text-gray-400 border border-dashed border-gray-200 text-sm text-center">
                    No se encontraron clases con los filtros seleccionados.
                </div>
            ) : (
                <Table
                    columns={columnasClases}
                    data={clasesFiltradas}
                    keyExtractor={clase => clase.id}
                />
            )}

            {/* MODAL DE CONFIRMACIÓN */}
            <ConfirmModal
                isOpen={modalAccionAbierto}
                message={`¿Desea confirmar la reserva para la clase de ${claseSeleccionada?.nombreTipoActividad}?`}
                confirmText="Sí, reservar"
                onConfirm={ejecutarReserva}
                onClose={() => setModalAccionAbierto(false)}
            />

            {/* MODAL DE ALERTAS POP-UP */}
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