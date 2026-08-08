import React from 'react';
import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { Link } from 'react-router-dom';
import { useSocio } from '../../socios/context/SocioContext';
import { useAdminDashboard } from '../hooks/useDashboard';

const AdminDashboard = () => {
    const { socio } = useSocio();
    const { datos, cargando, error } = useAdminDashboard();

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            {datos && (
                <>
                    {/* SECCIÓN 1: KPIs (Grandes Números) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* KPI: Ingresos del Mes */}
                        <div className="bg-indigo-600 rounded-3xl p-6 shadow-md shadow-indigo-200 text-white flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <svg className="w-32 h-32 transform translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" /></svg>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-indigo-100 font-semibold text-sm uppercase tracking-wider mb-1">Ingresos del Mes</h3>
                                <p className="text-4xl font-black">${datos.ingresosDelMes?.toLocaleString('es-AR')}</p>
                            </div>

                        </div>

                        {/* KPI: Socios Activos */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 text-gray-900">
                                <svg className="w-32 h-32 transform translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wider mb-1">Socios con Plan Activo</h3>
                                <p className="text-4xl font-black text-gray-800">{datos.sociosActivos}</p>
                            </div>

                        </div>
                    </div>

                    {/* SECCIÓN 2: ACCIONES RÁPIDAS ESTRATÉGICAS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <Link to="/admin/planes" className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow hover:border-indigo-100 transition flex items-center space-x-4 group cursor-pointer">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                💲
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Precios y Planes</h4>
                                <p className="text-xs text-gray-500">Ajustar valores</p>
                            </div>
                        </Link>

                        <Link to="/admin/clases" className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow hover:border-amber-100 transition flex items-center space-x-4 group cursor-pointer">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                📅
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Gestión de Clases</h4>
                                <p className="text-xs text-gray-500">Administrar grilla</p>
                            </div>
                        </Link>

                        <Link to="/admin/socios" className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow hover:border-emerald-100 transition flex items-center space-x-4 group cursor-pointer">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                👥
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Gestión de Staff</h4>
                                <p className="text-xs text-gray-500">Cuentas y roles</p>
                            </div>
                        </Link>
                    </div>

                    {/* SECCIÓN 3: MÉTRICAS DETALLADAS (Columnas) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* DISTRIBUCIÓN DE INGRESOS */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Distribución de Ingresos</h3>

                            {datos.distribucionIngresos.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">Aún no hay ingresos registrados este mes.</p>
                            ) : (
                                <div className="space-y-4">
                                    {datos.distribucionIngresos.map((item, index) => {
                                        const porcentaje = datos.ingresosDelMes > 0
                                            ? Math.round((item.total / datos.ingresosDelMes) * 100)
                                            : 0;

                                        return (
                                            <div key={index} className="flex flex-col">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-sm font-bold text-gray-700">{item.metodo}</span>
                                                    <span className="text-sm font-black text-gray-900">${item.total.toLocaleString('es-AR')}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                    <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${porcentaje}%` }}></div>
                                                </div>
                                                <span className="text-[10px] text-gray-400 text-right mt-1">{porcentaje}% del total</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* RANKING DE CLASES */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Clases mas reservadas</h3>

                            {datos.rankingClases.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">No hay datos de reservas aún.</p>
                            ) : (
                                <div className="space-y-0">
                                    {datos.rankingClases.map((clase, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-xl transition">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm
                                                    ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                                        index === 1 ? 'bg-gray-200 text-gray-700' :
                                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                                                'bg-indigo-50 text-indigo-600'}`}>
                                                    #{index + 1}
                                                </div>
                                                <span className="text-sm font-bold text-gray-800">{clase.actividad}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-black text-indigo-600">{clase.cantidadReservas}</span>
                                                <span className="text-xs text-gray-400 ml-1">reservas</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </>
            )}
        </Layout>
    );
};

export default AdminDashboard;