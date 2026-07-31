import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useSocio } from '../../socios/context/SocioContext';

interface NavItem {
    label: string;
    path: string;
}

const navItemsSocio: NavItem[] = [
    { label: 'Inicio', path: '/socio/dashboard' },
    { label: 'Planes', path: '/socio/mis-planes' },
    { label: 'Clases', path: '/socio/clases' },
    { label: 'Pagos', path: '/socio/pagos' },
];

const navItemsAdmin: NavItem[] = [
    { label: 'Inicio', path: '/admin/dashboard' },
    { label: 'Socios', path: '/admin/socios' },
    { label: 'Planes', path: '/admin/planes' },
    { label: 'Clases', path: '/admin/clases' },
    { label: 'Actividades', path: '/admin/actividades' },
    { label: 'Pagos', path: '/admin/pagos' },
];

const navItemsRecepcion: NavItem[] = [
    { label: 'Inicio', path: '/recepcion/dashboard' },
    { label: 'Registrar Pago', path: '/recepcion/pagos' },
];

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

export const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
    const { logout } = useAuth0();
    const { socio } = useSocio();

    const navItems =
        socio?.nombreRol === 'ADMIN' ? navItemsAdmin :
            socio?.nombreRol === 'RECEPCIONISTA' ? navItemsRecepcion :
                navItemsSocio;

    return (
        <aside
            className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${isOpen ? 'w-64' : 'w-0'
                }`}
        >
            {/* Contenedor interno con ancho fijo para mantener los elementos en su lugar */}
            <div className="w-64 flex flex-col h-full">

                {/* Logo, Rol y el botón estilo Claude para cerrar */}
                <div className="p-6 border-b border-gray-700 flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-bold">VEXIUM GIM</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {socio?.nombre} {socio?.apellido}
                        </p>
                        <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                            {socio?.nombreRol}
                        </span>
                    </div>

                    {/* Botón para cerrar barra lateral */}
                    <button
                        onClick={toggleSidebar}
                        title="Cerrar barra lateral"
                        className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
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
                        className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition cursor-pointer"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;