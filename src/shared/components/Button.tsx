import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
    fullWidth?: boolean;
}

const Button = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = "py-2.5 px-4 rounded-xl font-medium transition text-sm flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 cursor-pointer";

    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
        success: "bg-emerald-600 text-white hover:bg-emerald-700",
        outline: "border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-none"
    };

    return (
        <button
            {...props}
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;