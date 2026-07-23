interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    fullScreen?: boolean;
}

export const Spinner = ({
    size,
    color = 'text-blue-500',
    fullScreen = !size
}: SpinnerProps) => {
    const resolvedSize = size || 'md';
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-10 h-10 border-4',
        lg: 'w-12 h-12 border-4',
    };

    const containerClasses = fullScreen
        ? "flex items-center justify-center h-screen"
        : "flex items-center justify-center";

    return (
        <div className={containerClasses}>
            <div
                className={`${sizeClasses[resolvedSize]} ${color} border-current border-t-transparent rounded-full animate-spin`}
            />
        </div>
    );
};

export default Spinner;