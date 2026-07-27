import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { useMisReservas } from '../hooks/useReservas';
import { useReservaApi } from '../api/reservaApi';
import { useState } from 'react';

const MisReservas = () => {
    const { reservas, cargando, error, recargar } = useMisReservas();
    const { cancelarReserva } = useReservaApi();
    const [cancelando, setCancelando] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const handleCancelar = async (reservaId: number) => {
        try {
            setCancelando(reservaId);
            await cancelarReserva(reservaId);
            setMensaje('Reserva cancelada con éxito.');
            recargar();
        } catch (e: any) {
            setMensaje(e.response?.data?.mensaje || 'Error al cancelar la reserva');
        } finally {
            setCancelando(null);
            setTimeout(() => setMensaje(null), 3000);
        }
    };

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Mis Reservas
            </h1>


            {error && <ErrorMessage mensaje={error} />}

            {mensaje && (
                <div className="mb-6 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm">
                    {mensaje}
                </div>
            )}

            {reservas.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-6 text-gray-400 border border-dashed border-gray-200 text-sm">
                    No tenés ninguna reserva realizada todavía.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reservas.map(reserva => (
                        <div key={reserva.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                                    Reservado
                                </span>
                                <h3 className="font-semibold text-gray-800 mt-2">
                                    {reserva.tipoActividad || 'Clase de Gimnasio'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Día: {reserva.diaSemana} ({reserva.horaInicio} - {reserva.horaFin})
                                </p>
                            </div>
                            <button
                                onClick={() => handleCancelar(reserva.id)}
                                disabled={cancelando === reserva.id}
                                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition disabled:opacity-50 border border-red-200"
                            >
                                {cancelando === reserva.id ? 'Cancelando...' : 'Cancelar'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default MisReservas;