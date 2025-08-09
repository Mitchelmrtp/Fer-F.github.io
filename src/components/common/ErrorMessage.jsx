import React from 'react';

const ErrorMessage = ({ error, onRetry }) => {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
                <svg className="h-6 w-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                        Error
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                        {error || 'Ha ocurrido un error inesperado'}
                    </p>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="ml-3 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                        Reintentar
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;
