import { Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { SocioProvider } from './socios/context/SocioContext';

// Importamos el dominio público
import { LandingPage } from './landing/pages/LandingPage';

// Importaciones temporales para que no rompa (hasta que armemos los archivos reales)
const AdminDashboard = () => <div className="p-10 text-2xl font-bold">Bienvenido, Administrador</div>;
const GestionSocios = () => <div>Gestión Socios</div>;

function App() {
  return (
    <Routes>
      {/* 🌐 RUTA PÚBLICA */}
      <Route path="/" element={<LandingPage />} />

      {/* 🔐 RUTAS PRIVADAS */}
      <Route element={<SocioProvider><Outlet /></SocioProvider>}>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/socios" element={<GestionSocios />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;