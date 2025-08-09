import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Cargando...' }) => {
    const getSizeClass = (size) => {
        switch (size) {
            case 'sm':
                return 'h-4 w-4';
            case 'lg':
                return 'h-8 w-8';
            case 'xl':
                return 'h-12 w-12';
            default:
                return 'h-6 w-6';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className={`animate-spin rounded-full border-b-2 border-pink-500 ${getSizeClass(size)}`}></div>
            {text && (
                <p className="mt-2 text-sm text-gray-600">{text}</p>
            )}
        </div>
    );
};

export default LoadingSpinner;
