import { useNavigate } from 'react-router-dom';

const PagoPendiente = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-2xl shadow text-center">
                <div className="text-5xl mb-4">⏳</div>
                <h1 className="text-2xl font-bold text-yellow-600 mb-2">
                    Pago pendiente
                </h1>
                <p className="text-gray-500 mb-6">
                    Tu pago está siendo procesado. Te avisaremos cuando se confirme.
                </p>
                <button
                    onClick={() => navigate('/socio/dashboard')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Ir al inicio
                </button>
            </div>
        </div>
    );
};

export default PagoPendiente;