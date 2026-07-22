import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { Auth0ProviderConfig } from './auth/Auth0ProviderConfig';
import { AxiosInterceptor } from './shared/api/AxiosInterceptor';
import { AuthProvider } from './auth/AuthContext';
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Auth0ProviderConfig>
                <AxiosInterceptor>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </AxiosInterceptor>
            </Auth0ProviderConfig>
        </BrowserRouter>
    </React.StrictMode>,
);