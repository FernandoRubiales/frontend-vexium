export const LandingPage = () => {
    return (
        <div className="p-8 text-center mt-10">
            <h2 className="text-5xl font-extrabold mb-6 text-gray-800">Transformá tu cuerpo hoy</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                El sistema definitivo para gestionar tus entrenamientos. Conocé nuestras actividades y los planes diseñados especialmente para vos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8 text-left">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-2xl mb-4 text-blue-600">💪 Nuestras Actividades</h3>
                    <p className="text-gray-600">Crossfit, Musculación, Funcional, Yoga, y mucho más. Encontrá la disciplina perfecta.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-2xl mb-4 text-green-600">📋 Planes a tu medida</h3>
                    <p className="text-gray-600">Pases libres mensuales, trimestrales y anuales. Entrená sin límites.</p>
                </div>
            </div>
        </div>
    );
};