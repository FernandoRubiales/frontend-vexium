import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { useClases } from '../hooks/useClases';
import { useReservaApi } from '../../reservas/api/reservaApi';
import { useState } from 'react';

const ClasesDisponibles = () => {
    // 1. Instancia para las clases de su plan (true)
    const {
        clases: clasesDisponibles,
        cargando: cargandoDisponibles,
        error: errorDisponibles,
        recargar: recargarDisponibles
    } = useClases(true);

    // 2. Instancia para el cronograma general de la semana (false)
    const {
        clases: clasesTodas,
        cargando: cargandoTodas,
        error: errorTodas
    } = useClases(false);

    const { reservar } = useReservaApi();
    const [reservando, setReservando] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const handleReservar = async (claseId: number) => {
        try {
            setReservando(claseId);
            await reservar(claseId);
            setMensaje('¡Reserva realizada con éxito!');
            recargarDisponibles();
        } catch (e: any) {
            setMensaje(e.response?.data?.mensaje || 'Error al realizar la reserva');
        } finally {
            setReservando(null);
            setTimeout(() => setMensaje(null), 3000);
        }
    };

    if (cargandoDisponibles || cargandoTodas) return <Spinner />;

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Cartelera de Clases
            </h1>


            {(errorDisponibles || errorTodas) && (
                <ErrorMessage mensaje="Hubo un error al cargar algunas secciones." />
            )}

            {mensaje && (
                <div className="mb-6 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm">
                    {mensaje}
                </div>
            )}

            {/* SECCIÓN 1: Clases que puede reservar por su plan */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Disponibles para hoy
                </h2>

                {clasesDisponibles.length === 0 ? (
                    <div className="bg-gray-50 rounded-2xl p-6 text-gray-400 border border-dashed border-gray-200 text-sm">
                        No tenés clases disponibles para hoy
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {clasesDisponibles.map(clase => (
                            <div key={clase.id} className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex justify-between items-center">
                                <div>
                                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                                        Apta para tu plan
                                    </span>
                                    <h3 className="font-semibold text-gray-800 mt-2">
                                        {clase.nombreTipoActividad}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {clase.horaInicio} - {clase.horaFin}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-0.5">
                                        Cupos disponibles: {clase.cuposDisponibles} / {clase.cupoMaximo}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleReservar(clase.id)}
                                    disabled={reservando === clase.id}
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50"
                                >
                                    {reservando === clase.id ? 'Reservando...' : 'Reservar'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECCIÓN 2: Cronograma general de todas las clases */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Cronograma general
                </h2>

                {clasesTodas.length === 0 ? (
                    <p className="text-gray-400">No hay clases registradas en el sistema.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {clasesTodas.map(clase => (
                            <div key={clase.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {clase.nombreTipoActividad} <span className="text-xs text-gray-400 font-normal">({clase.diaSemana})</span>
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {clase.horaInicio} - {clase.horaFin}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-0.5">
                                        Cupo máximo: {clase.cupoMaximo}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ClasesDisponibles;