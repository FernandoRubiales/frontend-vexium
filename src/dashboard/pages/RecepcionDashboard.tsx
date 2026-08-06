import React from 'react';
import { useSocio } from '../../socios/context/SocioContext';
import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';

const RecepcionDashboard = () => {
    const { socio } = useSocio();
    const { ingresosHoy, vencimientos, clasesHoy, cargando, error } = useDashboard();

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Panel de Recepción</h1>
                <p className="text-gray-500 mt-1">Buen turno, {socio?.nombre}. Este es el resumen de hoy.</p>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            {/* SECCIÓN 1: ACCESOS RÁPIDOS Y CAJA DIARIA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* WIDGET CAJA DIARIA */}
                <div className="bg-emerald-600 rounded-3xl p-6 shadow-md shadow-emerald-200 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-emerald-100 font-semibold text-sm uppercase tracking-wider mb-1">Ingresos de Hoy (Caja)</h3>
                        <p className="text-4xl font-black">${ingresosHoy.toLocaleString('es-AR')}</p>
                    </div>
                    <div className="mt-4 text-emerald-100 text-xs font-medium">
                        Efectivo y MercadoPago
                    </div>
                </div>

                {/* ACCESO RÁPIDO: PAGOS */}
                <Link to="/recepcion/pagos" className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition group flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Registrar Cobro</h2>
                        <p className="text-sm text-gray-500 mt-1">Ingresar DNI para cobrar plan o check-in</p>
                    </div>
                </Link>

                {/* ACCESO RÁPIDO: CLASES */}
                <Link to="/recepcion/clases" className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-100 transition group flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Cartelera de Clases</h2>
                        <p className="text-sm text-gray-500 mt-1">Gestionar horarios, cupos y reservas</p>
                    </div>
                </Link>
            </div>

            {/* SECCIÓN 2: COLUMNAS DE DETALLE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* TIMELINE CLASES DE HOY */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Clases de Hoy</h3>
                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{clasesHoy.length} programadas</span>
                    </div>

                    {clasesHoy.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No hay clases registradas para hoy.</p>
                    ) : (
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                            {clasesHoy.map(clase => (
                                <div key={clase.id} className="flex items-center p-3 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                                    <div className="w-16 text-center">
                                        <p className="text-sm font-bold text-indigo-600">{clase.horaInicio ? clase.horaInicio.substring(0, 5) : ''}</p>
                                        <p className="text-xs font-medium text-gray-400">{clase.horaFin ? clase.horaFin.substring(0, 5) : ''}</p>
                                    </div>
                                    <div className="ml-4 pl-4 border-l-2 border-gray-200 flex-1">
                                        <p className="text-sm font-bold text-gray-800">{clase.nombreTipoActividad}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Cupos disponibles: <span className="font-semibold text-gray-700">{clase.cuposDisponibles !== undefined ? clase.cuposDisponibles : clase.cupoMaximo}</span> / {clase.cupoMaximo}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PRÓXIMOS VENCIMIENTOS Y RETENCIÓN */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Próximos Vencimientos</h3>
                        <span className="text-xs font-semibold bg-rose-50 text-rose-600 px-3 py-1 rounded-full">Requieren atención</span>
                    </div>

                    {vencimientos.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No hay planes por vencer pronto. ¡Todo al día!</p>
                    ) : (
                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                            {vencimientos.map(vencimiento => {
                                const esPorClases = vencimiento.clasesDisponibles <= 1;

                                return (
                                    <div key={vencimiento.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">
                                                {vencimiento.nombreSocio} {vencimiento.apellidoSocio}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 font-medium">
                                                Plan: {vencimiento.nombrePlan}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            {esPorClases ? (
                                                <span className="inline-block text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                                                    {vencimiento.clasesDisponibles} clases restantes
                                                </span>
                                            ) : (
                                                <span className="inline-block text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
                                                    Vence: {vencimiento.fechaVencimientoSocioPlan ? new Date(vencimiento.fechaVencimientoSocioPlan).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) : '-'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default RecepcionDashboard;