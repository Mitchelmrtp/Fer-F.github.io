import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import StatusBadge from '../common/StatusBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        selectedOrder,
        loading,
        error,
        loadOrderDetails,
        updateOrderStatus,
        clearError
    } = useDashboard();

    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        if (orderId) {
            loadOrderDetails(orderId);
        }
    }, [orderId]);

    const handleStatusChange = async (newStatus) => {
        if (!selectedOrder || !user) return;
        
        setUpdatingStatus(true);
        try {
            await updateOrderStatus(selectedOrder.id, {
                status: newStatus,
                updatedBy: user.id
            });
        } catch (error) {
            console.error('Error al actualizar estado:', error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const canUpdateStatus = () => {
        return user?.tipo === 'admin';
    };

    const getStatusHistory = () => {
        if (!selectedOrder) return [];
        
        const history = [
            {
                status: 'pendiente',
                date: selectedOrder.createdAt,
                description: 'Orden creada'
            }
        ];

        if (selectedOrder.updatedAt !== selectedOrder.createdAt) {
            history.push({
                status: selectedOrder.status,
                date: selectedOrder.updatedAt,
                description: `Estado actualizado a ${selectedOrder.status}`
            });
        }

        return history;
    };

    if (loading) {
        return <LoadingSpinner text="Cargando detalles de la orden..." />;
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ErrorMessage 
                    error={error} 
                    onRetry={() => { clearError(); loadOrderDetails(orderId); }} 
                />
            </div>
        );
    }

    if (!selectedOrder) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Orden no encontrada</h2>
                    <p className="mt-2 text-gray-600">La orden que buscas no existe o no tienes permisos para verla.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Orden #{selectedOrder.id}
                        </h1>
                        <p className="text-gray-600">
                            Creada el {formatDate(selectedOrder.createdAt)}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        ← Volver
                    </button>
                </div>
            </div>

            {/* Información general */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Estado y acciones */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de la Orden</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Estado actual:</span>
                            <StatusBadge status={selectedOrder.status} />
                        </div>
                        
                        {canUpdateStatus() && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cambiar estado:
                                </label>
                                <select
                                    value={selectedOrder.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    disabled={updatingStatus}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="procesando">Procesando</option>
                                    <option value="enviado">Enviado</option>
                                    <option value="entregado">Entregado</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                                {updatingStatus && (
                                    <p className="mt-2 text-sm text-gray-500">Actualizando estado...</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Información del cliente */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h3>
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Nombre:</span>
                            <p className="text-sm text-gray-900">{selectedOrder.user?.nombres} {selectedOrder.user?.apellidos || 'No disponible'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Email:</span>
                            <p className="text-sm text-gray-900">{selectedOrder.user?.correo || 'No disponible'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                            <p className="text-sm text-gray-900">{selectedOrder.user?.telefono || 'No disponible'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Dirección:</span>
                            <p className="text-sm text-gray-900">{selectedOrder.deliveryAddress || 'No disponible'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productos de la orden */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Productos Ordenados</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {selectedOrder.items?.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start space-x-4">
                                    {item.product?.image && (
                                        <img
                                            src={item.product.image}
                                            alt={item.product.title}
                                            className="w-20 h-20 object-cover rounded-md border"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900 mb-1">
                                                    {item.product?.title || 'Producto no disponible'}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {item.product?.description || 'Sin descripción'}
                                                </p>
                                                <div className="text-sm text-gray-500">
                                                    <span className="font-medium">Categoría:</span> {item.product?.category || 'No especificada'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <span className="font-medium">Precio unitario:</span> {item.product?.price || 'No disponible'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-pink-600 mb-1">
                                                    Cantidad: {item.quantity}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.totalPrice !== 'NaN' ? formatPrice(item.totalPrice) : 'Precio especial'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Sorpresa especial del producto */}
                                        {item.product?.surprise && (
                                            <div className="mt-3 p-3 bg-pink-50 border-l-4 border-pink-400 rounded-r-md">
                                                <h5 className="text-sm font-medium text-pink-800 mb-1">💝 Sorpresa especial:</h5>
                                                <p className="text-sm text-pink-700">{item.product.surprise}</p>
                                            </div>
                                        )}
                                        
                                        {/* Snapshot del producto al momento de la compra */}
                                        {item.productSnapshot && (
                                            <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
                                                <h5 className="text-sm font-medium text-blue-800 mb-1">📸 Estado al momento de la compra:</h5>
                                                <div className="text-sm text-blue-700">
                                                    <p><strong>Título:</strong> {item.productSnapshot.title}</p>
                                                    <p><strong>Descripción:</strong> {item.productSnapshot.description}</p>
                                                    {item.productSnapshot.surprise && (
                                                        <p><strong>Sorpresa:</strong> {item.productSnapshot.surprise}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Resumen de costos */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Resumen de Costos</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal:</span>
                            <span className="text-gray-900">
                                {selectedOrder.items?.some(item => item.totalPrice !== 'NaN') 
                                    ? formatPrice(selectedOrder.items?.reduce((sum, item) => sum + (item.totalPrice !== 'NaN' ? parseFloat(item.totalPrice) : 0), 0) || 0)
                                    : 'Precio especial'
                                }
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Impuestos:</span>
                            <span className="text-gray-900">$0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Envío:</span>
                            <span className="text-gray-900">Gratis</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                            <div className="flex justify-between text-lg font-semibold">
                                <span className="text-gray-900">Total:</span>
                                <span className="text-gray-900">
                                    {selectedOrder.total !== 'NaN' ? formatPrice(selectedOrder.total) : 'Invaluable 💖'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Historial de estados */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Historial de Estados</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {getStatusHistory().map((event, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {event.description}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(event.date)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
