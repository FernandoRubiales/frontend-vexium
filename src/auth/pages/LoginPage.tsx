import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useSocio } from '../../socios/context/SocioContext';

const LoginPage = () => {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
    const { socio } = useSocio();
    const navigate = useNavigate();

    // LÓGICA DE REDIRECCIÓN INTELIGENTE
    useEffect(() => {
        if (isAuthenticated && socio) {
            const rolNombre = socio.nombreRol ? socio.nombreRol.toUpperCase() : '';

            if (rolNombre === 'ADMIN') navigate('/admin/dashboard');
            else if (rolNombre === 'RECEPCIONISTA') navigate('/recepcion/dashboard');
            else navigate('/socio/dashboard');
        }
    }, [isAuthenticated, socio, navigate]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">

            {/* NAVBAR */}
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#00ADB5] rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xl leading-none">V</span>
                    </div>
                    <span className="text-2xl font-black text-[#0F373A] tracking-widest">VEXIUM</span>
                </div>
                <button
                    onClick={() => loginWithRedirect()}
                    disabled={isLoading}
                    className="bg-[#0F373A] hover:bg-[#154d52] text-white px-6 py-2 rounded-xl font-bold transition-colors text-sm shadow-sm cursor-pointer disabled:opacity-70"
                >
                    {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                </button>
            </nav>

            {/* HERO SECTION (PORTADA) */}
            <header className="bg-[#0F373A] text-white py-20 px-6 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                        La evolución en la gestión de <span className="text-[#00ADB5]">tu Gimnasio</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
                        Centralizá tus clases, automatizá tus cobros y ofreceles a tus socios una experiencia digital de primer nivel.
                    </p>
                    <button
                        onClick={() => loginWithRedirect()}
                        disabled={isLoading}
                        className="bg-[#00ADB5] hover:bg-[#0b6b70] text-white px-8 py-4 rounded-xl font-bold text-lg transition-transform transform hover:scale-105 shadow-lg cursor-pointer disabled:opacity-70"
                    >
                        Ingresar al Sistema
                    </button>
                </div>

                {/* Decoración de fondo */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#00ADB5] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 -right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                </div>
            </header>

            {/* FEATURES SECTION (CARACTERÍSTICAS) */}
            <section className="py-20 px-6 max-w-6xl mx-auto flex-1">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-[#0F373A] mb-4">Todo lo que necesitás en un solo lugar</h2>
                    <p className="text-gray-500">Diseñado específicamente para optimizar el tiempo de administradores y socios.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Tarjeta 1 */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-teal-50 text-[#00ADB5] rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Gestión de Socios</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Administrá perfiles, historiales y roles (Admin, Recepción, Socio) con un control de acceso seguro.
                        </p>
                    </div>

                    {/* Tarjeta 2 */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Reserva de Clases</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Cartelera de horarios interactiva. Los socios pueden inscribirse a sus clases favoritas respetando los cupos máximos.
                        </p>
                    </div>

                    {/* Tarjeta 3 */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Control de Pagos</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Integración con MercadoPago, seguimiento de vencimientos de planes y reportes de ingresos mensuales.
                        </p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm font-medium text-gray-400 mt-auto">
                <div className="flex justify-center items-center space-x-2 mb-2">
                    <span className="w-5 h-5 bg-[#00ADB5] rounded flex items-center justify-center text-white text-[10px] font-bold">V</span>
                    <span className="text-[#0F373A] font-bold tracking-wider">VEXIUM</span>
                </div>
                &copy; {new Date().getFullYear()} Proyecto Final - Ingeniería en Sistemas. Todos los derechos reservados.
            </footer>

        </div>
    );
};

export default LoginPage;