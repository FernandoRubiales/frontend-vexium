import { useAuth0 } from "@auth0/auth0-react";
import { api } from './config/axios';

function App() {
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect: login,
    logout: auth0Logout,
    user,
  } = useAuth0();

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) return <p>Loading...</p>;

  return isAuthenticated ? (
    <>
      <p>Logged in as {user?.email}</p>
      <h1>User Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={logout}>Logout</button>

      {/* ¡ACÁ INYECTAMOS NUESTRO COMPONENTE DE PRUEBA! 👇 */}
      <TestApiButton />
    </>
  ) : (
    <>
      {error && <p>Error: {error.message}</p>}
      <button onClick={signup}>Signup</button>
      <button onClick={() => login()}>Login</button>
    </>
  );
}

export default App;

// Tu componente de prueba sigue intacto acá abajo
export const TestApiButton = () => {
  const probarConexion = async () => {
    try {
      console.log("Enviando petición a la ruta inventada...");
      await api.get('/ruta-super-secreta-de-prueba');
      console.log("Petición enviada.");
    } catch (error) {
      console.log("La petición finalizó (Revisá la pestaña Red).");
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded mt-4">
      <h3 className="text-lg font-bold mb-2">Laboratorio de Pruebas Axios</h3>
      <button
        onClick={probarConexion}
        style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}
      >
        Disparar petición al Backend
      </button>
    </div>
  );
};