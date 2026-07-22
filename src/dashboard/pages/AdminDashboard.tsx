import { useAuth0 } from '@auth0/auth0-react';

export const AdminDashboard = () => {
    const { user } = useAuth0();
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Panel General</h1>
            <p className="text-gray-600">Bienvenido al sistema, <strong>{user?.name || user?.email}</strong>.</p>
        </div>
    );
};