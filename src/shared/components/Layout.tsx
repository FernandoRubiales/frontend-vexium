import { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen flex bg-gray-50 w-full overflow-x-hidden">

            {/* Sidebar lateral dinámico */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            {/* Contenedor principal que se estira automáticamente cuando el sidebar se oculta */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Barra superior con el botón para abrir el sidebar si está cerrado */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        {!sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                title="Abrir barra lateral"
                                className="text-gray-600 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer flex items-center gap-1.5 text-sm font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <span>Abrir menú</span>
                            </button>
                        )}

                    </div>
                </header>

                <main className="p-6 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;