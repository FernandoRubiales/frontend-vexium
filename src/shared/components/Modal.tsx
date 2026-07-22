import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',   // 448px
        md: 'max-w-lg',   // 512px
        lg: 'max-w-2xl',  // 672px
        xl: 'max-w-4xl',  // 896px
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity">
            <div className={`bg-vexium-dark rounded-2xl shadow-2xl border border-vexium-border w-full ${sizeClasses[size]} mx-4 overflow-hidden flex flex-col animate-modal`}>
                <div className="px-6 py-4.5 border-b border-vexium-border flex justify-between items-center bg-[#084d54]">
                    <h3 className="text-lg font-bold text-white font-display tracking-wide">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition duration-200 focus:outline-none"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 text-slate-700 bg-vexium-dark">
                    {children}
                </div>
            </div>
        </div>
    );
};