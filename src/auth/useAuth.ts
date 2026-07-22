import { useAuth0 } from '@auth0/auth0-react';

export const useAuth = () => {
    const {
        isAuthenticated,
        loginWithRedirect,
        logout,
        user,
        isLoading,
        getAccessTokenSilently
    } = useAuth0();

    return {
        isAuthenticated,
        isLoading,
        user,
        login: loginWithRedirect,
        logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
        getToken: () => getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE
            }
        })
    };
};