import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'procesando':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'enviado':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'entregado':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelado':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'pendiente': 'Pendiente',
            'procesando': 'Procesando',
            'enviado': 'Enviado',
            'entregado': 'Entregado',
            'cancelado': 'Cancelado'
        };
        return statusMap[status?.toLowerCase()] || status || 'Desconocido';
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
            {getStatusText(status)}
        </span>
    );
};

export default StatusBadge;
