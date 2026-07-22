import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
}

export const Spinner = ({ size = 'md' }: SpinnerProps) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-4',
        lg: 'h-12 w-12 border-4'
    };

    return (
        <div className="flex justify-center items-center">
            <div className={`animate-spin rounded-full border-gray-300 border-t-[#00ADB5] ${sizeClasses[size]}`}></div>
        </div>
    );
};