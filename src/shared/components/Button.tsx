import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyle = "flex justify-center items-center font-semibold text-sm py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
 
    const variants = {
        primary: "bg-gradient-to-r from-vexium-cyan to-[#008f96] hover:from-vexium-cyan-hover hover:to-vexium-cyan text-white shadow-sm hover:shadow transition-all duration-200",
        secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 transition-all duration-200",
        danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200 transition-all duration-200",
    };

    return (
        <button
            className={`${baseStyle} ${variants[variant]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? <Spinner size="sm" color={variant === 'primary' ? 'text-gray-900' : 'text-white'} /> : children}
            {isLoading && <span className="ml-2">Cargando...</span>}
        </button>
    );
};