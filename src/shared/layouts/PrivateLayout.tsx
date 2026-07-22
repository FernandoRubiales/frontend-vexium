import { Outlet, Link } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useDbAuth } from '../../auth/AuthContext';

const Layout = () => {
    const { user, logout } = useAuth0();
    const { dbRole, isLoadingRole } = useDbAuth();

    return (
        <div className="min-h-screen flex bg-vexium-black text-slate-800">
            <aside className="w-64 bg-gradient-to-b from-[#083035] to-[#00adb5] text-white flex flex-col shadow-xl">
                <div className="p-6 text-center font-black text-2xl border-b border-white/10 tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                    VEXIUM
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <Link to="/dashboard" className="block px-4 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white font-medium transition duration-200">
                        Inicio
                    </Link>

                    {dbRole === 'ADMIN' && (
                        <Link to="/planes" className="block px-4 py-2.5 rounded-lg text-white bg-white/15 border-l-4 border-white font-bold transition duration-200">
                            Gestión de Planes
                        </Link>
                    )}

                    {dbRole === 'SOCIO' && (
                        <Link to="/mis-rutinas" className="block px-4 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white font-medium transition duration-200">
                            Mis Rutinas
                        </Link>
                    )}
                </nav>

                <div className="p-4 border-t border-white/10 bg-black/10">
                    <p className="text-xs text-white/60 mb-1 font-medium">
                        {isLoadingRole ? 'Cargando rol...' : `Rol: ${dbRole}`}
                    </p>
                    <p className="text-sm font-semibold mb-4 truncate text-white/95">{user?.email}</p>
                    <button
                        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                        className="w-full bg-white/15 hover:bg-white/25 text-white py-2 rounded-lg font-semibold transition duration-200 shadow-sm border border-white/10"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto bg-vexium-black">
                <Outlet />
            </main>
        </div>
    );
};

export const PrivateLayout = withAuthenticationRequired(Layout, {
    onRedirecting: () => <div className="p-8 text-center font-bold text-vexium-cyan">Iniciando sistema...</div>,
});