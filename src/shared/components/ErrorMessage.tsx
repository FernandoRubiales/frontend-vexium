interface ErrorMessageProps {
    mensaje: string;
}

const ErrorMessage = ({ mensaje }: ErrorMessageProps) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {mensaje}
    </div>
);

export default ErrorMessage;