import { useAuth } from '../../auth/useAuth';
import { Button } from '../../shared/components/Button';

export const LandingPage = () => {
    const { login, isLoading } = useAuth();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F373A]">
            <div className="bg-white p-12 rounded-xl shadow-2xl max-w-md w-full text-center border-t-4 border-[#00ADB5]">
                <h1 className="text-5xl font-black text-[#115E59] tracking-widest mb-4">
                    VEXIUM
                </h1>
                <p className="text-gray-500 mb-10 font-medium text-lg">
                    Sistema de Gestión Integral para tu Gimnasio
                </p>

                <Button
                    onClick={() => login()}
                    isLoading={isLoading}
                    className="w-full py-4 text-lg font-bold shadow-md"
                >
                    Ingresar al Sistema
                </Button>
            </div>

            <footer className="mt-12 text-[#00ADB5] font-medium opacity-80">
                &copy; 2026 Vexium Fit. Todos los derechos reservados.
            </footer>
        </div>
    );
};