import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { useReservas } from '../hooks/useReservas';
import { useState } from 'react';

const MisReservas = () => {
    const { reservas, cargando, error, cancelarReserva } = useReservas();
    const [cancelando, setCancelando] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const handleCancelar = async (id: number) => {
        try {
            setCancelando(id);
            await cancelarReserva(id);
            setMensaje('Reserva cancelada correctamente');
        } catch (e: any) {
            setMensaje(e.response?.data?.mensaje || 'Error al cancelar');
        } finally {
            setCancelando(null);
            setTimeout(() => setMensaje(null), 3000);
        }
    };

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Mis Reservas
            </h1>

            {error && <ErrorMessage mensaje={error} />}

            {mensaje && (
                <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm">
                    {mensaje}
                </div>
            )}

            {reservas.length === 0 ? (
                <p className="text-gray-400">
                    No tenés reservas esta semana.
                </p>
            ) : (
                <div className="space-y-3">
                    {reservas.map(reserva => (
                        <div key={reserva.id}
                            className="bg-white rounded-2xl p-5 shadow flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {reserva.tipoActividad}
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {reserva.diaSemana} · {reserva.horaInicio} - {reserva.horaFin}
                                </p>
                            </div>
                            <button
                                onClick={() => handleCancelar(reserva.id)}
                                disabled={cancelando === reserva.id}
                                className="text-red-500 hover:text-red-700 text-sm font-medium transition disabled:opacity-50"
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