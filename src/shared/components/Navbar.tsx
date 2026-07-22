interface NavbarProps {
    title: string;
}

export const Navbar = ({ title }: NavbarProps) => {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </header>
    );
};