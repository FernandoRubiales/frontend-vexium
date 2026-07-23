import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export const Auth0ProviderConfig = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    const onRedirectCallback = (appState: any) => {
        navigate(appState?.returnTo || window.location.pathname);
    };

    return (
        <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            authorizationParams={{
                // FORZAMOS EL ATERRIZAJE EN LA PÁGINA DE CALLBACK
                redirect_uri: `${window.location.origin}/callback`,
                audience: import.meta.env.VITE_AUTH0_AUDIENCE
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};