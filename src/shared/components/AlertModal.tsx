interface AlertModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onClose: () => void;
}

const AlertModal = ({ isOpen, title = 'Aviso', message, onClose }: AlertModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-6">{message}</p>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
};

export default AlertModal;