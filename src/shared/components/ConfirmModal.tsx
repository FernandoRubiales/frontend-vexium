interface ConfirmModalProps {
    isOpen: boolean;
    message?: string;
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmModal = ({
    isOpen,
    message = '¿Desea dar de baja?',
    onConfirm,
    onClose
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl text-center">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                    ⚠️
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmar acción</h3>
                <p className="text-sm text-gray-500 mb-6">{message}</p>
                <div className="flex justify-center space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;