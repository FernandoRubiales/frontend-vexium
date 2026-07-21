import { useAuth0 } from '@auth0/auth0-react';

export const DashboardPage = () => {
    const { user } = useAuth0();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Panel de Control General</h1>
            <p className="text-gray-600 mb-8">
                Bienvenido, <strong>{user?.name || user?.email}</strong>. Desde acá vas a poder administrar todo el sistema.
            </p>

            {/* Tarjetas de resumen de ejemplo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Socios Activos</h3>
                    <p className="text-3xl font-black mt-2">142</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Planes Vendidos</h3>
                    <p className="text-3xl font-black mt-2">85</p>
                </div>
            </div>
        </div>
    );
};