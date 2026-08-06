import { useState } from 'react';
import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import Modal from '../../shared/components/Modal';
import ConfirmModal from '../../shared/components/ConfirmModal';
import { Table } from '../../shared/components/Table';
import { useSocios } from '../hooks/useSocios';
// IMPORTAMOS EL CONTEXTO PARA SABER EL ROL DEL USUARIO ACTUAL
import { useSocio } from '../context/SocioContext';

const GestionSocios = () => {
    const { socios, cargando, error, crearSocio, actualizarSocio, actualizarRol, eliminarSocio } = useSocios();

    // OBTENEMOS AL USUARIO LOGUEADO
    const { socio: usuarioActual } = useSocio();
    const isAdmin = usuarioActual?.nombreRol === 'ADMIN';

    const [modalAbierto, setModalAbierto] = useState(false);
    const [socioEditandoId, setSocioEditandoId] = useState<number | null>(null);

    const [modalBajaAbierto, setModalBajaAbierto] = useState(false);
    const [socioAEliminar, setSocioAEliminar] = useState<any | null>(null);

    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        auth0Id: 'auth0|temporal-admin-creado'
    });

    const abrirModalCrear = () => {
        setSocioEditandoId(null);
        setFormulario({
            nombre: '',
            apellido: '',
            dni: '',
            email: '',
            telefono: '',
            fechaNacimiento: '',
            auth0Id: 'auth0|temporal-' + Date.now()
        });
        setModalAbierto(true);
    };

    const abrirModalEditar = (socio: any) => {
        setSocioEditandoId(socio.id);
        setFormulario({
            nombre: socio.nombre || '',
            apellido: socio.apellido || '',
            dni: socio.dni?.toString() || '',
            email: socio.email || '',
            telefono: socio.telefono || '',
            fechaNacimiento: socio.fechaNacimiento || '',
            auth0Id: socio.auth0Id || 'auth0|temporal'
        });
        setModalAbierto(true);
    };

    const confirmarBaja = async () => {
        if (!socioAEliminar) return;
        try {
            await eliminarSocio(socioAEliminar.id);
            setModalBajaAbierto(false);
            setSocioAEliminar(null);
        } catch (err: any) {
            alert(err.message || 'Error al eliminar el socio');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataRequest = {
                nombre: formulario.nombre,
                apellido: formulario.apellido,
                dni: Number(formulario.dni),
                email: formulario.email,
                telefono: formulario.telefono,
                fechaNacimiento: formulario.fechaNacimiento ? formulario.fechaNacimiento : null,
                auth0Id: formulario.auth0Id
            };

            if (socioEditandoId !== null) {
                await actualizarSocio(socioEditandoId, dataRequest);
            } else {
                await crearSocio(dataRequest);
            }
            setModalAbierto(false);
        } catch (err: any) {
            alert(err.message || 'Error al guardar el socio');
        }
    };

    const handleRolChange = async (socioId: number, nuevoRol: string) => {
        try {
            await actualizarRol(socioId, nuevoRol);
        } catch (err: any) {
            alert(err.message || 'Error al cambiar el rol');
        }
    };

    if (cargando) return <Spinner />;

    const columnas = [
        {
            header: 'Nombre y Apellido',
            accessor: (socio: any) => (
                <span className="font-semibold text-gray-900">
                    {socio.nombre || 'Sin nombre'} {socio.apellido || ''}
                </span>
            )
        },
        { header: 'DNI', accessor: 'dni' as keyof any },
        { header: 'Email', accessor: 'email' as keyof any },
        {
            header: 'Teléfono',
            accessor: (socio: any) => socio.telefono || '-'
        },
        {
            header: 'Rol',
            accessor: (socio: any) => (
                // SI ES ADMIN, MUESTRA EL SELECTOR, SI NO, SOLO MUESTRA TEXTO
                isAdmin ? (
                    <select
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200 bg-white cursor-pointer ${socio.nombreRol === 'ADMIN' ? 'text-purple-700 bg-purple-50'
                                : socio.nombreRol === 'RECEPCIONISTA' ? 'text-blue-700 bg-blue-50'
                                    : 'text-gray-700 bg-gray-50'
                            }`}
                        value={socio.nombreRol || 'SOCIO'}
                        onChange={(e) => handleRolChange(socio.id, e.target.value)}
                    >
                        <option value="SOCIO">SOCIO</option>
                        <option value="RECEPCIONISTA">RECEPCIONISTA</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                ) : (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200 ${socio.nombreRol === 'ADMIN' ? 'text-purple-700 bg-purple-50'
                            : socio.nombreRol === 'RECEPCIONISTA' ? 'text-blue-700 bg-blue-50'
                                : 'text-gray-700 bg-gray-50'
                        }`}>
                        {socio.nombreRol || 'SOCIO'}
                    </span>
                )
            )
        },
        {
            header: 'Acciones',
            className: 'text-right',
            accessor: (socio: any) => (
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => abrirModalEditar(socio)}
                        className="bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-xl font-medium transition text-xs cursor-pointer"
                    >
                        Editar
                    </button>

                    {/* EL BOTÓN DE ELIMINAR SOLO SE RENDERIZA SI ES ADMIN */}
                    {isAdmin && (
                        <button
                            onClick={() => {
                                setSocioAEliminar(socio);
                                setModalBajaAbierto(true);
                            }}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-xl font-medium transition text-xs cursor-pointer"
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Socios y Usuarios</h1>
                </div>
                <button
                    onClick={abrirModalCrear}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition shadow-sm text-sm cursor-pointer"
                >
                    + Nuevo Socio
                </button>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            {socios.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400 text-sm">
                    No hay socios registrados todavía.
                </div>
            ) : (
                <Table
                    columns={columnas}
                    data={socios}
                    keyExtractor={socio => socio.id}
                />
            )}

            {/* Modal de Crear / Editar Socio */}
            <Modal
                isOpen={modalAbierto}
                title={socioEditandoId !== null ? 'Editar Socio' : 'Registrar Nuevo Socio'}
                onClose={() => setModalAbierto(false)}
            >
                {/* ... (tu formulario se mantiene exactamente igual) ... */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nombre</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                value={formulario.nombre}
                                onChange={e => setFormulario({ ...formulario, nombre: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Apellido</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                value={formulario.apellido}
                                onChange={e => setFormulario({ ...formulario, apellido: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">DNI</label>
                            <input
                                type="number"
                                required
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                value={formulario.dni}
                                onChange={e => setFormulario({ ...formulario, dni: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Teléfono</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                value={formulario.telefono}
                                onChange={e => setFormulario({ ...formulario, telefono: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            value={formulario.email}
                            onChange={e => setFormulario({ ...formulario, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={formulario.fechaNacimiento}
                            onChange={e => setFormulario({ ...formulario, fechaNacimiento: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setModalAbierto(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm cursor-pointer"
                        >
                            {socioEditandoId !== null ? 'Guardar Cambios' : 'Registrar Socio'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={modalBajaAbierto}
                message={`¿Estás seguro de eliminar al socio ${socioAEliminar?.nombre || ''} ${socioAEliminar?.apellido || ''}?`}
                onConfirm={confirmarBaja}
                onClose={() => setModalBajaAbierto(false)}
            />
        </Layout>
    );
};

export default GestionSocios;