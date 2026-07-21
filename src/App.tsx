import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { PublicLayout } from './layouts/publicLayout';
import { PrivateLayout } from './layouts/privateLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Routes>
      {/* 🌐 ZONA PÚBLICA */}
      <Route element={<PublicLayout />}>
        {/* Si ya está logueado y va a la raíz, lo pateamos directo al dashboard */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />
      </Route>

      {/* 🔐 ZONA PRIVADA (Todo lo que esté acá adentro está protegido) */}
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Acá irás agregando tus futuras vistas: */}
        {/* <Route path="/dashboard/planes" element={<PlanesPage />} /> */}
        {/* <Route path="/dashboard/actividades" element={<ActividadesPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;