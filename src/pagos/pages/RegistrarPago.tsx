import Layout from '../../shared/components/Layout';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { usePagoApi } from '../api/pagoApi';
import type { SocioPlan } from '../../shared/types';
import { useState } from 'react';

const RegistrarPago = () => {
    const [dni, setDni] = useState('');
    const [planes, setPlanes] = useState<SocioPlan[]>([]);
    const [buscando, setBuscando] = useState(false);
    const [pagando, setPagando] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<string | null>(null);
    const { buscarPlanesPendientesPorDni, registrarPagoEfectivo } = usePagoApi();

    const buscar = async () => {
        if (!dni) return;
        try {
            setBuscando(true);
            setError(null);
            const res = await buscarPlanesPendientesPorDni(Number(dni));
            setPlanes(res.data);
            if (res.data.length === 0) {
                setError('No hay planes pendientes para este DNI');
            }
        } catch {
            setError('Socio no encontrado');
            setPlanes([]);
        } finally {
            setBuscando(false);
        }
    };

    const pagar = async (socioPlanId: number, precio: number) => {
        try {
            setPagando(socioPlanId);
            await registrarPagoEfectivo(socioPlanId, precio);
            setExito('¡Pago registrado y plan activado!');
            setPlanes(prev => prev.filter(p => p.id !== socioPlanId));
        } catch (e: any) {
            setError(e.response?.data?.mensaje || 'Error al registrar el pago');
        } finally {
            setPagando(null);
            setTimeout(() => setExito(null), 3000);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Registrar Pago en Efectivo
            </h1>

            {/* Buscador por DNI */}
            <div className="bg-white rounded-2xl p-6 shadow mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar socio por DNI
                </label>
                <div className="flex gap-3">
                    <input
                        type="number"
                        value={dni}
                        onChange={e => setDni(e.target.value)}
                        placeholder="Ingresá el DNI"
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={buscar}
                        disabled={buscando}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {buscando ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            {exito && (
                <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                    {exito}
                </div>
            )}

            {/* Planes pendientes */}
            {planes.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Planes pendientes de pago
                    </h2>
                    {planes.map(plan => (
                        <div key={plan.id}
                            className="bg-white rounded-2xl p-5 shadow flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {plan.nombrePlan}
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {plan.tipoActividad} · {plan.clasesIncluidas} clases
                                </p>
                            </div>
                            <button
                                onClick={() => pagar(plan.id, 0)}
                                disabled={pagando === plan.id}
                                className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {pagando === plan.id ? 'Procesando...' : 'Registrar Pago'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default RegistrarPago;