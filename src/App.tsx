import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { PublicLayout } from './shared/layouts/PublicLayout';
import { PrivateLayout } from './shared/layouts/PrivateLayout';
import { LandingPage } from './landing/pages/LandingPage';
import { AdminDashboard } from './dashboard/pages/AdminDashboard';
import { GestionPlanes } from './planes/pages/GestionPlanes';
import { ProtectedRoute } from './auth/ProtectedRoute'; // 👈 1. Importamos el guardián

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Routes>
      {/* 🌐 RUTAS PÚBLICAS */}
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />
      </Route>

      {/* 🔐 RUTAS PRIVADAS */}
      <Route element={<PrivateLayout />}>
        {/* Al Dashboard entran todos los que estén logueados, no pide rol específico */}
        <Route path="/dashboard" element={<AdminDashboard />} />

        {/* 🛡️ RUTA BLINDADA: Solo para Administradores */}
        <Route
          path="/planes"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <GestionPlanes />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;