import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useSocio } from '../../socios/context/SocioContext';

interface NavItem {
    label: string;
    path: string;
}

const navItemsSocio: NavItem[] = [
    { label: 'Inicio', path: '/socio/dashboard' },
    { label: 'Mis Planes', path: '/socio/planes' },
    { label: 'Clases Disponibles', path: '/socio/clases' },
    { label: 'Mis Reservas', path: '/socio/reservas' },
];

const navItemsAdmin: NavItem[] = [
    { label: 'Inicio', path: '/admin/dashboard' },
    { label: 'Socios', path: '/admin/socios' },
    { label: 'Planes', path: '/admin/planes' },
    { label: 'Clases', path: '/admin/clases' },
];

const navItemsRecepcion: NavItem[] = [
    { label: 'Inicio', path: '/recepcion/dashboard' },
    { label: 'Registrar Pago', path: '/recepcion/pagos' },
];

export const Sidebar = () => {
    const { logout } = useAuth0();
    const { socio } = useSocio();

    const navItems =
        socio?.rol === 'ADMIN' ? navItemsAdmin :
            socio?.rol === 'RECEPCIONISTA' ? navItemsRecepcion :
                navItemsSocio;

    return (
        <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-xl font-bold">🏋️ Gimnasio</h1>
                <p className="text-sm text-gray-400 mt-1">
                    {socio?.nombre} {socio?.apellido}
                </p>
                <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {socio?.rol}
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800'
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={() => logout({
                        logoutParams: { returnTo: window.location.origin + '/login' }
                    })}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition"
                >
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;