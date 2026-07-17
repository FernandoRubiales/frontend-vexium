import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from './features/auth/components/LoginButton';
import { LogoutButton } from './features/auth/components/LogoutButton';

function App() {
  const { isAuthenticated, user, isLoading } = useAuth0();

  // 1. Pantalla de carga profesional mientras Auth0 verifica la sesión
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-lg font-semibold text-gray-600 animate-pulse">
          Cargando sistema Vexium...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8 border border-gray-100">

        {/* Cabecera principal */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Vexium Frontend
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Entrena sin límites
          </p>
        </header>

        <hr className="border-gray-200 my-6" />

        {/* 2. Renderizado condicional según el estado del usuario */}
        {isAuthenticated ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-green-900 mb-4">
                ¡Bienvenido de vuelta!
              </h3>

              {user?.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-20 h-20 rounded-full mx-auto shadow-sm border-2 border-green-400 mb-4"
                />
              )}

              <div className="text-left bg-white p-4 rounded-md border border-green-100 space-y-2 text-sm text-gray-700">
                <p><strong>Usuario:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
              </div>
            </div>

            <div className="flex justify-center">
              <LogoutButton />
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">

            <div className="flex justify-center">
              <LoginButton />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;