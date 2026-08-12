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
        <div className="min-h-screen flex flex-col bg-[#0F0F0F] text-white font-sans scroll-smooth selection:bg-[#E8A020] selection:text-[#0F0F0F]">

            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#1A1A1A]">
                <div className="flex items-center space-x-3">
                    <img
                        src="/logo.png"
                        alt="Logo Vexium"
                        className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(232,160,32,0.5)]"
                    />
                    <span className="text-2xl font-black tracking-tight text-white uppercase">
                        Vexium <span className="text-[#E8A020]">Gym</span>
                    </span>
                </div>

                {/* Links de navegación interna */}
                <div className="hidden md:flex space-x-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    <a href="#inicio" className="hover:text-[#FFBB45] transition-colors">Inicio</a>
                    <a href="#actividades" className="hover:text-[#FFBB45] transition-colors">Actividades</a>
                </div>

                <button
                    onClick={() => loginWithRedirect()}
                    disabled={isLoading}
                    className="bg-[#C8860A] hover:bg-[#FFBB45] text-[#0F0F0F] px-6 py-2.5 rounded-sm font-extrabold uppercase tracking-widest transition-all text-sm shadow-[0_0_15px_rgba(200,134,10,0.4)] hover:shadow-[0_0_25px_rgba(255,187,69,0.6)] disabled:opacity-70 cursor-pointer"
                >
                    {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                </button>
            </nav>

            {/* HERO SECTION (PORTADA OSCURA Y DORADA) */}
            <header
                id="inicio"
                className="relative min-h-[85vh] flex items-center justify-center px-6 pt-20 overflow-hidden bg-[#0F0F0F]"
            >
                {/* Background Image con tu archivo fondo.png y filtro oscuro */}
                <div
                    className="absolute inset-0 opacity-40 mix-blend-luminosity"
                    style={{
                        backgroundImage: 'url("/fondo.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed'
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F]/40 via-[#0F0F0F]/80 to-[#0F0F0F]"></div>

                <div className="relative z-10 text-center max-w-4xl mx-auto pt-10">
                    <span className="text-[#E8A020] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
                        Superá tus límites
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-xl uppercase tracking-tighter">
                        Entrená a <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8860A] via-[#E8A020] to-[#FFBB45]">otro nivel</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
                        Equipamiento premium, profesionales capacitados y una plataforma 100% digital para gestionar tus reservas y membresías.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button
                            onClick={() => loginWithRedirect()}
                            disabled={isLoading}
                            className="w-full sm:w-auto bg-gradient-to-r from-[#C8860A] to-[#E8A020] hover:from-[#E8A020] hover:to-[#FFBB45] text-[#0F0F0F] px-10 py-4 rounded-sm font-black uppercase tracking-widest text-lg transition-transform transform hover:scale-105 shadow-[0_0_30px_rgba(200,134,10,0.3)] cursor-pointer disabled:opacity-70"
                        >
                            Empezar ahora
                        </button>
                    </div>
                </div>
            </header>

            {/* SECCIÓN ACTIVIDADES (GRILLA ESTILO DARK/GOLD) */}
            <section id="actividades" className="py-24 px-6 max-w-7xl mx-auto flex-1 w-full bg-[#1A1A1A]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">Nuestras Actividades</h2>
                    <p className="text-gray-400 text-lg">Elegí tu disciplina. Nosotros te damos el espacio.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Tarjeta 1 */}
                    <div className="bg-[#0F0F0F] border border-[#2A2A2A] hover:border-[#E8A020] p-8 rounded-sm flex flex-col items-center text-center transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(232,160,32,0.15)] hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-[#1A1A1A] text-[#E8A020] group-hover:bg-[#C8860A] group-hover:text-[#0F0F0F] rounded-sm flex items-center justify-center mb-6 transition-all duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18M3 18h18"></path></svg>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">Musculación</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Equipamiento de última generación y profes siempre presentes.
                        </p>
                    </div>

                    {/* Tarjeta 2 */}
                    <div className="bg-[#0F0F0F] border border-[#2A2A2A] hover:border-[#E8A020] p-8 rounded-sm flex flex-col items-center text-center transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(232,160,32,0.15)] hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-[#1A1A1A] text-[#E8A020] group-hover:bg-[#C8860A] group-hover:text-[#0F0F0F] rounded-sm flex items-center justify-center mb-6 transition-all duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path></svg>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">Crossfit</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Entrenamiento de alta intensidad para desafiar tus límites.
                        </p>
                    </div>

                    {/* Tarjeta 3 */}
                    <div className="bg-[#0F0F0F] border border-[#2A2A2A] hover:border-[#E8A020] p-8 rounded-sm flex flex-col items-center text-center transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(232,160,32,0.15)] hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-[#1A1A1A] text-[#E8A020] group-hover:bg-[#C8860A] group-hover:text-[#0F0F0F] rounded-sm flex items-center justify-center mb-6 transition-all duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">Spinning</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Quema calorías al ritmo de la mejor música de la ciudad.
                        </p>
                    </div>

                    {/* Tarjeta 4 */}
                    <div className="bg-[#0F0F0F] border border-[#2A2A2A] hover:border-[#E8A020] p-8 rounded-sm flex flex-col items-center text-center transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(232,160,32,0.15)] hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-[#1A1A1A] text-[#E8A020] group-hover:bg-[#C8860A] group-hover:text-[#0F0F0F] rounded-sm flex items-center justify-center mb-6 transition-all duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">Zumba</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Diversión y cardio en una sola actividad interactiva.
                        </p>
                    </div>

                    {/* Tarjeta 5 */}
                    <div className="bg-[#0F0F0F] border border-[#2A2A2A] hover:border-[#E8A020] p-8 rounded-sm flex flex-col items-center text-center transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(232,160,32,0.15)] hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-[#1A1A1A] text-[#E8A020] group-hover:bg-[#C8860A] group-hover:text-[#0F0F0F] rounded-sm flex items-center justify-center mb-6 transition-all duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">Funcional</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Mejora tu movilidad y fuerza aplicada a la vida diaria.
                        </p>
                    </div>

                    {/* Tarjeta 6 */}
                    <div className="bg-[#0F0F0F] border border-[#2A2A2A] hover:border-[#E8A020] p-8 rounded-sm flex flex-col items-center text-center transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(232,160,32,0.15)] hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-[#1A1A1A] text-[#E8A020] group-hover:bg-[#C8860A] group-hover:text-[#0F0F0F] rounded-sm flex items-center justify-center mb-6 transition-all duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">Pilates</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Control, respiración y fortalecimiento del core.
                        </p>
                    </div>

                    {/* Tarjeta 7 */}
                    <div className="bg-[#0F0F0F] border border-[#2A2A2A] hover:border-[#E8A020] p-8 rounded-sm flex flex-col items-center text-center transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(232,160,32,0.15)] hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-[#1A1A1A] text-[#E8A020] group-hover:bg-[#C8860A] group-hover:text-[#0F0F0F] rounded-sm flex items-center justify-center mb-6 transition-all duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">Localizada</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Tonificación específica para cada grupo muscular.
                        </p>
                    </div>

                    {/* Tarjeta 8 */}
                    <div className="bg-[#0F0F0F] border border-[#2A2A2A] hover:border-[#E8A020] p-8 rounded-sm flex flex-col items-center text-center transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(232,160,32,0.15)] hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-[#1A1A1A] text-[#E8A020] group-hover:bg-[#C8860A] group-hover:text-[#0F0F0F] rounded-sm flex items-center justify-center mb-6 transition-all duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">GAP</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Glúteos, Abdominales y Piernas en máxima potencia.
                        </p>
                    </div>

                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#0F0F0F] text-gray-500 py-12 px-6 border-t border-[#1A1A1A] mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 pb-8 border-b border-[#1A1A1A]">
                    <div className="flex items-center space-x-3 mb-6 md:mb-0">
                        <img
                            src="/logo.png"
                            alt="Logo Vexium"
                            className="w-10 h-10 object-contain filter drop-shadow-md grayscale hover:grayscale-0 transition-all"
                        />
                        <span className="font-extrabold tracking-widest uppercase text-gray-300 text-lg">Vexium Gym</span>
                    </div>

                    <div className="flex space-x-6">
                        <button onClick={() => loginWithRedirect()} className="text-gray-400 text-sm uppercase tracking-wider font-bold hover:text-[#E8A020] transition-colors cursor-pointer">Ingreso de Socios</button>
                    </div>
                </div>
                <div className="text-center text-xs font-medium uppercase tracking-widest text-[#3A3A3A]">
                    &copy; {new Date().getFullYear()} Proyecto Final - Ingeniería en Sistemas. Todos los derechos reservados.
                </div>
            </footer>

        </div>
    );
};

export default LoginPage;