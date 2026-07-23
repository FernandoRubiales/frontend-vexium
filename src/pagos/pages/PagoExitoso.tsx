import { useNavigate } from 'react-router-dom';

const PagoExitoso = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-2xl shadow text-center">
                <div className="text-5xl mb-4">✅</div>
                <h1 className="text-2xl font-bold text-green-600 mb-2">
                    ¡Pago exitoso!
                </h1>
                <p className="text-gray-500 mb-6">
                    Tu plan fue activado correctamente.
                </p>
                <button
                    onClick={() => navigate('/socio/planes')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Ver mis planes
                </button>
            </div>
        </div>
    );
};

export default PagoExitoso;