import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0ProviderConfig } from './auth/Auth0ProviderConfig';
import ProtectedRoute from './auth/ProtectedRoute';
import { SocioProvider } from './socios/context/SocioContext';

// Páginas de Auth
import LoginPage from './auth/pages/LoginPage';
import CallbackPage from './auth/pages/CallbackPage';

// Dashboard por rol
import AdminDashboard from './dashboard/pages/AdminDashboard';
import SocioDashboard from './dashboard/pages/SocioDashboard';
import RecepcionDashboard from './dashboard/pages/RecepcionDashboard';

//Pagina de mis planes
import MisPlanes from './planes/pages/MisPlanes';
import GestionPlanes from './planes/pages/GestionPlanes';
//Pagina de clases
import ClasesDisponibles from './clases/pages/ClasesDisponibles';
import GestionClases from './clases/pages/GestionClases';
//Pagina de pagos
import HistorialPagos from './pagos/pages/HistorialPagos';
import GestionPagos from './pagos/pages/GestionPagos';
//Pagina de actividades
import GestionTipoActividad from './actividades/pages/GestionTipoActividad';
//Pagina de socios
import GestionSocios from './socios/pages/GestionSocios';



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
            <Route path="/recepcion/dashboard" element={
              <ProtectedRoute rolesPermitidos={['RECEPCIONISTA']}>
                <RecepcionDashboard />
              </ProtectedRoute>
            } />
            <Route path="/socio/dashboard" element={
              <ProtectedRoute rolesPermitidos={['SOCIO']}>
                <SocioDashboard />
              </ProtectedRoute>
            } />
            <Route path="/socio/mis-planes" element={
              <ProtectedRoute rolesPermitidos={['SOCIO']}>
                <MisPlanes />
              </ProtectedRoute>
            } />
            <Route path="/socio/clases" element={
              <ProtectedRoute rolesPermitidos={['SOCIO']}>
                <ClasesDisponibles />
              </ProtectedRoute>
            } />
            <Route path="/socio/pagos" element={
              <ProtectedRoute rolesPermitidos={['SOCIO']}>
                <HistorialPagos />
              </ProtectedRoute>
            } />
            <Route path="/admin/clases" element={
              <ProtectedRoute rolesPermitidos={['ADMIN']}>
                <GestionClases />
              </ProtectedRoute>
            } />
            <Route path="/admin/planes" element={
              <ProtectedRoute rolesPermitidos={['ADMIN']}>
                <GestionPlanes />
              </ProtectedRoute>
            } />
            <Route path="/admin/actividades" element={
              <ProtectedRoute rolesPermitidos={['ADMIN']}>
                <GestionTipoActividad />
              </ProtectedRoute>
            } />
            <Route path="/admin/pagos" element={
              <ProtectedRoute rolesPermitidos={['ADMIN']}>
                <GestionPagos />
              </ProtectedRoute>
            } />
            <Route path="/admin/socios" element={
              <ProtectedRoute rolesPermitidos={['ADMIN']}>
                <GestionSocios />
              </ProtectedRoute>
            } />

            {/* Ruta de No Autorizado */}
            <Route path="/no-autorizado" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-red-600 mb-2">Acceso No Autorizado</h1>
                  <p className="text-gray-600">No tenés permisos para ver esta sección.</p>
                </div>
              </div>
            } />
            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </SocioProvider>
      </Auth0ProviderConfig>
    </BrowserRouter>
  );
}

export default App;