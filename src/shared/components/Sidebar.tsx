import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useSocio } from '../../socios/context/SocioContext';

export const Sidebar = () => {
    const { logout } = useAuth0();
    const { socio } = useSocio();

    // Estilo para el link activo vs inactivo
    const linkBaseClass = "block px-4 py-3 rounded transition-colors font-medium";
    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? `${linkBaseClass} bg-[#115E59] text-white border-l-4 border-[#00ADB5]`
            : `${linkBaseClass} text-gray-300 hover:bg-[#115E59] hover:text-white`;

    return (
        <aside className="w-64 bg-[#0F373A] min-h-screen flex flex-col shadow-xl flex-shrink-0">
            <div className="p-6 border-b border-[#115E59]">
                <h1 className="text-2xl font-black text-white tracking-widest">VEXIUM</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <NavLink to={`/dashboard/${socio?.rol.toLowerCase()}`} className={getLinkClass}>
                    Inicio
                </NavLink>

                {socio?.rol === 'ADMIN' && (
                    <>
                        <NavLink to="/socios" className={getLinkClass}>Gestión de Socios</NavLink>
                        <NavLink to="/planes" className={getLinkClass}>Gestión de Planes</NavLink>
                    </>
                )}

                {socio?.rol === 'SOCIO' && (
                    <>
                        <NavLink to="/mis-planes" className={getLinkClass}>Mis Planes</NavLink>
                        <NavLink to="/clases" className={getLinkClass}>Clases Disponibles</NavLink>
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-[#115E59] bg-[#0A2628]">
                <div className="mb-4">
                    <p className="text-xs text-gray-400">Rol: {socio?.rol}</p>
                    <p className="text-sm font-bold text-white truncate">{socio?.email}</p>
                </div>
                <button
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    className="w-full bg-[#00ADB5] hover:bg-[#00939B] text-white py-2 rounded font-bold transition-colors text-sm"
                >
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};