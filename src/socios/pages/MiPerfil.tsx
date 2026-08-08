import React, { useState, useEffect } from 'react';
import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { useSocioApi } from '../api/socioApi';
import { useSocio } from '../context/SocioContext';

const PerfilSocio = () => {
    const { obtenerMiPerfil, actualizarMiPerfil } = useSocioApi();
    const { socio } = useSocio();

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState(false);

    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        telefono: '',
        fechaNacimiento: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                const res = await obtenerMiPerfil();
                const datos = (res as any)?.data || res;

                setFormulario({
                    nombre: datos.nombre || '',
                    apellido: datos.apellido || '',
                    dni: datos.dni?.toString() || '',
                    email: datos.email || '',
                    telefono: datos.telefono || '',
                    fechaNacimiento: datos.fechaNacimiento || ''
                });
            } catch (err: any) {
                setError('Error al cargar tu perfil. Intenta nuevamente.');
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setGuardando(true);
            setError(null);
            setMensajeExito(false);

            const dataRequest = {
                ...formulario,
                dni: Number(formulario.dni),
                // 👇 ACÁ ESTÁ EL PARCHE: Engañamos a la validación @NotBlank del backend
                auth0Id: 'omitido-por-jwt'
            };

            await actualizarMiPerfil(dataRequest);

            setMensajeExito(true);
            setTimeout(() => setMensajeExito(false), 4000);

            if (socio && socio.nombre !== formulario.nombre) {
                setTimeout(() => window.location.reload(), 1500);
            }

        } catch (err: any) {
            setError(err.message || 'Error al guardar los cambios.');
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) return <Spinner />;

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
                    <p className="text-gray-500 mt-1">Mantené tus datos actualizados para poder inscribirte a planes y clases.</p>
                </div>

                {error && <ErrorMessage mensaje={error} />}

                {mensajeExito && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center font-medium shadow-sm">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        ¡Tus datos se actualizaron correctamente!
                    </div>
                )}

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Cuenta de Email (Sincronizada con tu ingreso)
                            </label>
                            <input
                                type="email"
                                value={formulario.email}
                                disabled
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={formulario.nombre}
                                    onChange={e => setFormulario({ ...formulario, nombre: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"

                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Apellido</label>
                                <input
                                    type="text"
                                    required
                                    value={formulario.apellido}
                                    onChange={e => setFormulario({ ...formulario, apellido: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"

                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">DNI</label>
                                <input
                                    type="number"
                                    required
                                    value={formulario.dni}
                                    onChange={e => setFormulario({ ...formulario, dni: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"

                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Teléfono</label>
                                <input
                                    type="text"
                                    required
                                    value={formulario.telefono}
                                    onChange={e => setFormulario({ ...formulario, telefono: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"

                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                required
                                value={formulario.fechaNacimiento}
                                onChange={e => setFormulario({ ...formulario, fechaNacimiento: e.target.value })}
                                className="w-full md:w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={guardando}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer"
                            >
                                {guardando ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default PerfilSocio;