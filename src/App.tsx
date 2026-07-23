import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0ProviderConfig } from './auth/Auth0ProviderConfig';
import ProtectedRoute from './auth/ProtectedRoute';
import { SocioProvider } from './socios/context/SocioContext';

// Páginas de Auth
import LoginPage from './auth/pages/LoginPage';
import CallbackPage from './auth/pages/CallbackPage';

// Dashboard Temp (Asegurate de que este archivo exista en tu proyecto)
import AdminDashboard from './dashboard/pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Auth0ProviderConfig>
        <SocioProvider>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/callback" element={<CallbackPage />} />

            {/* Rutas Privadas */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute rolesPermitidos={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </SocioProvider>
      </Auth0ProviderConfig>
    </BrowserRouter>
  );
}

export default App;