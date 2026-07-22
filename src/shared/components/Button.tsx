import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    isLoading?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    isLoading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = "px-4 py-2 rounded font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm";

    const variants = {
        primary: "bg-[#00ADB5] hover:bg-[#00939B] text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
        outline: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Spinner size="sm" />}
            {children}
        </button>
    );
};