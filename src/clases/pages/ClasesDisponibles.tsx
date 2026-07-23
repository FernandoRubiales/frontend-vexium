import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { useClases } from '../hooks/useClases';
import { useReservaApi } from '../../reservas/api/reservaApi';
import { useState } from 'react';

const ClasesDisponibles = () => {
    const { clases, cargando, error, recargar } = useClases(true);
    const { reservar } = useReservaApi();
    const [reservando, setReservando] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const handleReservar = async (claseId: number) => {
        try {
            setReservando(claseId);
            await reservar(claseId);
            setMensaje('¡Reserva realizada!');
            recargar();
        } catch (e: any) {
            setMensaje(e.response?.data?.mensaje || 'Error al reservar');
        } finally {
            setReservando(null);
            setTimeout(() => setMensaje(null), 3000);
        }
    };

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Clases Disponibles Hoy
            </h1>
            <p className="text-gray-500 mb-6">
                Reservá tu lugar para las clases de hoy.
            </p>

            {error && <ErrorMessage mensaje={error} />}

            {mensaje && (
                <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm">
                    {mensaje}
                </div>
            )}

            {clases.length === 0 ? (
                <p className="text-gray-400">
                    No hay clases disponibles para hoy.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clases.map(clase => (
                        <div key={clase.id}
                            className="bg-white rounded-2xl p-6 shadow flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {clase.nombreTipoActividad}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {clase.horaInicio} - {clase.horaFin}
                                </p>
                                <p className="text-sm text-gray-400 mt-0.5">
                                    {clase.cuposDisponibles} cupos disponibles
                                </p>
                            </div>
                            <button
                                onClick={() => handleReservar(clase.id)}
                                disabled={reservando === clase.id}
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {reservando === clase.id ? 'Reservando...' : 'Reservar'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default ClasesDisponibles;