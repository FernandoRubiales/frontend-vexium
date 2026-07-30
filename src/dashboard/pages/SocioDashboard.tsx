import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import { useSocio } from '../../socios/context/SocioContext';
import { usePlanes } from '../../planes/hooks/usePlanes';
import { useReservas } from '../../reservas/hooks/useReservas';

// Mapeo numérico de los días para ordenar las reservas cronológicamente
const diasMap: Record<string, number> = {
    'Lunes': 1,
    'Martes': 2,
    'Miercoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sabado': 6,
    'Sábado': 6,
    'Domingo': 7
};

const SocioDashboard = () => {
    const navigate = useNavigate();
    const { socio } = useSocio();
    const { misPlanes, cargando: cargandoPlanes } = usePlanes();
    const { reservas, cargando: cargandoReservas } = useReservas();

    // 1. Filtrar solo los planes activos
    const planesActivos = useMemo(() => {
        return misPlanes?.filter((p: any) => p.estadoSocioPlan === 'Activo') || [];
    }, [misPlanes]);

    // 2. Encontrar el plan activo que vence más pronto usando fechaVencimientoSocioPlan
    const proximoPlanAVencer = useMemo(() => {
        if (!planesActivos || planesActivos.length === 0) return null;

        const planesOrdenados = [...planesActivos].sort((a: any, b: any) => {
            if (!a.fechaVencimientoSocioPlan) return 1;
            if (!b.fechaVencimientoSocioPlan) return -1;
            return new Date(a.fechaVencimientoSocioPlan).getTime() - new Date(b.fechaVencimientoSocioPlan).getTime();
        });

        return planesOrdenados[0];
    }, [planesActivos]);

    // 3. Encontrar la próxima reserva real ordenada por día y hora actual
    const proximaReserva = useMemo(() => {
        if (!reservas || reservas.length === 0) return null;

        const jsDay = new Date().getDay();
        const diaActualNum = jsDay === 0 ? 7 : jsDay;
        const horaActualStr = new Date().toTimeString().slice(0, 5);

        const reservasOrdenadas = [...reservas].sort((a: any, b: any) => {
            const diaA = diasMap[a.diaSemana] || 0;
            const diaB = diasMap[b.diaSemana] || 0;

            let diffA = diaA - diaActualNum;
            let diffB = diaB - diaActualNum;

            if (diffA < 0 || (diffA === 0 && a.horaInicio < horaActualStr)) {
                diffA += 7;
            }
            if (diffB < 0 || (diffB === 0 && b.horaInicio < horaActualStr)) {
                diffB += 7;
            }

            if (diffA !== diffB) {
                return diffA - diffB;
            }

            return a.horaInicio.localeCompare(b.horaInicio);
        });

        return reservasOrdenadas[0];
    }, [reservas]);

    if (cargandoPlanes || cargandoReservas) return <Spinner />;

    return (
        <Layout>
            {/* Mensaje de bienvenida */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    ¡Hola, {socio?.nombre || 'Socio'}! 👋
                </h1>
                <p className="text-gray-500 mt-1">
                    Bienvenido a tu panel personal. Aquí tenés un resumen rápido de tu actividad.
                </p>
            </div>

            {/* Grid de Secciones Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* TARJETA 1: Mis Planes Activos (Listado detallado) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span>💳</span> Mis Planes Activos
                        </h2>

                        {planesActivos.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">No tenés planes activos en este momento.</p>
                        ) : (
                            <div className="space-y-3">
                                {planesActivos.map((plan: any) => (
                                    <div key={plan.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-800 text-sm">{plan.nombrePlan || plan.tipoActividad}</h3>
                                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                                {plan.estadoSocioPlan}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-600 flex justify-between">
                                            <span>Clases disponibles:</span>
                                            <strong className="text-gray-900">{plan.clasesDisponibles} / {plan.clasesIncluidas}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/socio/mis-planes')}
                        className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 text-left transition flex items-center gap-1 cursor-pointer"
                    >
                        Ver todos mis planes &rarr;
                    </button>
                </div>

                {/* TARJETA 2: Próximo Plan a Vencer */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span>⏳</span> Plan por Vencer
                        </h2>

                        {!proximoPlanAVencer ? (
                            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 text-sm">
                                No hay planes activos próximos a vencer.
                            </div>
                        ) : (
                            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium inline-block mb-2">
                                    Vence pronto
                                </span>
                                <h3 className="font-bold text-gray-900 text-base">
                                    {proximoPlanAVencer.nombrePlan || proximoPlanAVencer.tipoActividad}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    <strong>Vencimiento:</strong> {proximoPlanAVencer.fechaVencimientoSocioPlan ? new Date(proximoPlanAVencer.fechaVencimientoSocioPlan).toLocaleDateString() : 'No especificada'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Clases restantes:</strong> {proximoPlanAVencer.clasesDisponibles} / {proximoPlanAVencer.clasesIncluidas}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/socio/mis-planes')}
                        className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 text-left transition flex items-center gap-1 cursor-pointer"
                    >
                        Revisar detalles &rarr;
                    </button>
                </div>

                {/* TARJETA 3: Próxima Clase Reservada */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span>📅</span> Próxima Clase
                        </h2>

                        {!proximaReserva ? (
                            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 text-sm">
                                No tenés clases reservadas próximamente.
                            </div>
                        ) : (
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium inline-block mb-2">
                                    Reservada
                                </span>
                                <h3 className="font-bold text-gray-900 text-base">{proximaReserva.tipoActividad}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    <strong>Día:</strong> {proximaReserva.diaSemana}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Horario:</strong> {proximaReserva.horaInicio} - {proximaReserva.horaFin} hs
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/socio/clases')}
                        className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 text-left transition flex items-center gap-1 cursor-pointer"
                    >
                        Gestionar reservas &rarr;
                    </button>
                </div>

            </div>

            {/* SECCIÓN 4: Accesos Rápidos */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Accesos Rápidos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/socio/clases')}
                        className="p-4 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 border border-gray-100 transition text-left group cursor-pointer"
                    >
                        <h3 className="font-semibold text-gray-800 group-hover:text-emerald-700">Ver Cartelera de Clases</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Explorá turnos disponibles y reservá tu lugar.</p>
                    </button>

                    <button
                        onClick={() => navigate('/socio/mis-planes')}
                        className="p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-100 transition text-left group cursor-pointer"
                    >
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-700">Gestionar Mis Planes</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Consultá tus membresías y estados de pago.</p>
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default SocioDashboard;