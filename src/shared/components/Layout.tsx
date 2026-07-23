import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';

const Layout = ({ children }: { children: ReactNode }) => (
    <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
            {children}
        </main>
    </div>
);

export default Layout;