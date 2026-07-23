import { useNavigate } from 'react-router-dom';

const NoAutorizadoPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-2xl shadow text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-2">
                    Acceso denegado
                </h1>
                <p className="text-gray-500 mb-6">
                    No tenés permisos para ver esta página.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Volver
                </button>
            </div>
        </div>
    );
};

export default NoAutorizadoPage;