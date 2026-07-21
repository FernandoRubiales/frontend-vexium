import { auth0Config } from './config/auth0Config';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { AxiosInterceptor } from './components/axiosInterceptor';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider {...auth0Config}>
        <AxiosInterceptor>
          <App />
        </AxiosInterceptor>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>,
);