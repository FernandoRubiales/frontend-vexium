import { withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';


export const ProtectedRoute = ({ component }: { component: React.ComponentType<object> }) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => (
            <div className="p-4 text-center text-gray-500 font-bold">
                Verificando credenciales de seguridad...
            </div>
        ),
    });

    return <Component />;
};