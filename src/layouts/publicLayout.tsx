import { Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export const PublicLayout = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-2xl font-black text-blue-600">VEXIUM</h1>
                {!isAuthenticated && (
                    <button
                        onClick={() => loginWithRedirect()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Iniciar Sesión
                    </button>
                )}
            </header>

            {/* El Outlet inyecta la página que corresponda*/}
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};