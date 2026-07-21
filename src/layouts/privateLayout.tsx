import { Outlet, Link } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';

const Layout = () => {
    const { user, logout } = useAuth0();

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* ⬅️ Menú Lateral (Sidebar) */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 text-center font-bold text-2xl border-b border-gray-700 tracking-widest">
                    VEXIUM
                </div>
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700 transition">Inicio</Link>
                    <Link to="/dashboard/planes" className="block px-4 py-2 rounded hover:bg-gray-700 transition">Planes</Link>
                    <Link to="/dashboard/actividades" className="block px-4 py-2 rounded hover:bg-gray-700 transition">Actividades</Link>
                </nav>

                {/* Info del usuario y Logout */}
                <div className="p-4 border-t border-gray-700 bg-gray-800">
                    <p className="text-xs text-gray-400 mb-1">Conectado como:</p>
                    <p className="text-sm font-bold mb-4 truncate">{user?.email}</p>
                    <button
                        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-bold transition"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* ➡️ Contenido Principal (Acá adentro va el Dashboard o las tablas) */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

// Exportamos el layout ya blindado por Auth0
export const PrivateLayout = withAuthenticationRequired(Layout, {
    onRedirecting: () => (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-bold">
            Verificando seguridad de Vexium...
        </div>
    ),
});