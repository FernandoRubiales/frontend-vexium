import React from 'react';
import ReactDOM from 'react-dom/client';
//import { BrowserRouter } from 'react-router-dom';
import App from './App';
//import { Auth0ProviderConfig } from './auth/Auth0ProviderConfig';
import './index.css';

/*ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <Auth0ProviderConfig>
                <App />
            </Auth0ProviderConfig>
        </BrowserRouter>
    </React.StrictMode>
);*/



ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);