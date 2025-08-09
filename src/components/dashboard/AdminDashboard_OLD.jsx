import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import StatusBadge from '../common/StatusBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import Pagination from '../common/Pagination';
import QuestionnaireResponses from '../QuestionnaireResponses';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const {
        orders,
        loading,
        error,
        loadAllOrders,
        updateOrderStatus,
        clearError
    } = useDashboard();

    const [activeTab, setActiveTab] = useState('orders');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        search: ''
    });
    const [paginationData, setPaginationData] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const loadOrders = useCallback(async () => {
        const result = await loadAllOrders({
            page: currentPage,
            limit: 10,
            ...filters
        });
        if (result) {
            setPaginationData(result.pagination);
        }
    }, [currentPage, filters, loadAllOrders]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        try {
            await updateOrderStatus(orderId, { 
                status: newStatus,
                updatedBy: user.id 
            });
        } catch (error) {
            console.error('Error al actualizar estado:', error);
        } finally {
            setUpdatingOrderId(null);
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

    const getOrderStats = () => {
        if (!orders.length) return { total: 0, pendientes: 0, entregadas: 0, canceladas: 0 };
        
        return {
            total: orders.length,
            pendientes: orders.filter(o => o.status === 'pendiente').length,
            entregadas: orders.filter(o => o.status === 'entregado').length,
            canceladas: orders.filter(o => o.status === 'cancelado').length
        };
    };

    const stats = getOrderStats();

    if (loading && !orders.length) {
        return <LoadingSpinner text="Cargando dashboard de administrador..." />;
    }

    if (error) {
        return <ErrorMessage error={error} onRetry={() => { clearError(); loadOrders(); }} />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Dashboard de Administrador
                </h1>
                <p className="text-gray-600">
                    Gestiona todas las órdenes del sistema y respuestas del cuestionario
                </p>
            </div>

            {/* Pestañas de navegación */}
            <div className="mb-8">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'orders'
                                ? 'border-pink-500 text-pink-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Órdenes
                    </button>
                    <button
                        onClick={() => setActiveTab('questionnaires')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'questionnaires'
                                ? 'border-pink-500 text-pink-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Cuestionarios
                    </button>
                </nav>
            </div>

            {/* Contenido de las pestañas */}
            {activeTab === 'orders' && (
                <>
                    {/* Estadísticas generales */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Total de Órdenes</p>
                            <p className="text-2xl font-semibold text-gray-900">{paginationData?.totalItems || stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Pendientes</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.pendientes}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Entregadas</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.entregadas}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Canceladas</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.canceladas}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filtrar y Buscar Órdenes</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar
                        </label>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="ID, cliente, email..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                            <option value="">Todos los estados</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="procesando">Procesando</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Desde
                        </label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hasta
                        </label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Lista de órdenes */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Todas las Órdenes</h3>
                </div>
                </>
            )}

                {loading ? (
                    <LoadingSpinner text="Cargando órdenes..." />
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay órdenes</h3>
                        <p className="mt-1 text-sm text-gray-500">No se encontraron órdenes con los filtros aplicados.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Orden
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Productos
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.User?.nombre || 'Usuario desconocido'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.User?.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    disabled={updatingOrderId === order.id}
                                                    className="text-sm border-0 bg-transparent focus:ring-2 focus:ring-pink-500 rounded"
                                                >
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="procesando">Procesando</option>
                                                    <option value="enviado">Enviado</option>
                                                    <option value="entregado">Entregado</option>
                                                    <option value="cancelado">Cancelado</option>
                                                </select>
                                                {updatingOrderId === order.id && (
                                                    <div className="mt-1">
                                                        <div className="animate-spin h-4 w-4 border-2 border-pink-500 border-t-transparent rounded-full"></div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatPrice(order.total)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.OrderItems?.length || 0} productos
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => navigate(`/order-details/${order.id}`)}
                                                    className="text-pink-600 hover:text-pink-900 font-medium"
                                                >
                                                    Ver detalles
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {paginationData && (
                            <Pagination
                                currentPage={paginationData.currentPage}
                                totalPages={paginationData.totalPages}
                                totalItems={paginationData.totalItems}
                                onPageChange={handlePageChange}
                                itemsPerPage={paginationData.limit}
                            />
                        )}
                    </>
                )}
                
                {/* Pestaña de cuestionarios */}
                {activeTab === 'questionnaires' && (
                    <QuestionnaireResponses />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
