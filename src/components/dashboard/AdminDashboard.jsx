import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { useFirstVisit } from '../../hooks/useFirstVisit';
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
        if (activeTab === 'orders') {
            loadOrders();
        }
    }, [loadOrders, activeTab]);

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

    if (loading && !orders.length && activeTab === 'orders') {
        return <LoadingSpinner text="Cargando dashboard de administrador..." />;
    }

    if (error && activeTab === 'orders') {
        return <ErrorMessage error={error} onRetry={() => { clearError(); loadOrders(); }} />;
    }

    const renderOrdersTab = () => (
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
                            placeholder="Buscar por nombre, email..."
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.User?.nombre || 'Usuario desconocido'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.User?.email || 'Sin email'}
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
                                                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
            </div>
        </>
    );

    // Función para renderizar la pestaña de debug
    const renderDebugTab = () => {
        const { isFirstVisit, hasCompletedQuestionnaire, questionnaireCount, resetFirstVisit } = useFirstVisit();
        
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado del Sistema</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-900">Primera Visita</h3>
                        <p className="text-blue-700">
                            {isFirstVisit === null ? 'Cargando...' : isFirstVisit ? 'Sí' : 'No'}
                        </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-900">Cuestionario Completado</h3>
                        <p className="text-green-700">
                            {hasCompletedQuestionnaire ? 'Sí' : 'No'}
                        </p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-medium text-purple-900">Veces Completado</h3>
                        <p className="text-purple-700">
                            {questionnaireCount} vez{questionnaireCount !== 1 ? 'es' : ''}
                        </p>
                    </div>
                </div>
                
                <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Datos localStorage</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono">
                        <div className="mb-2">
                            <strong>fer_has_visited:</strong> {localStorage.getItem('fer_has_visited') || 'null'}
                        </div>
                        <div className="mb-2">
                            <strong>fer_questionnaire_completed:</strong> {localStorage.getItem('fer_questionnaire_completed') || 'null'}
                        </div>
                        <div className="mb-2">
                            <strong>fer_questionnaire_count:</strong> {localStorage.getItem('fer_questionnaire_count') || '0'}
                        </div>
                    </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Acciones de Debug</h3>
                    <button
                        onClick={resetFirstVisit}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Resetear Estado (Simular Primera Visita)
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                        Esto borrará todos los datos del localStorage y simulará una primera visita
                    </p>
                </div>
            </div>
        );
    };

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
                    <button
                        onClick={() => setActiveTab('debug')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'debug'
                                ? 'border-pink-500 text-pink-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Debug
                    </button>
                </nav>
            </div>

            {/* Contenido de las pestañas */}
            {activeTab === 'orders' && renderOrdersTab()}
            
            {/* Pestaña de cuestionarios */}
            {activeTab === 'questionnaires' && (
                <QuestionnaireResponses />
            )}
            
            {/* Pestaña de debug */}
            {activeTab === 'debug' && renderDebugTab()}
        </div>
    );
};

export default AdminDashboard;
