import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as dashboardAPI from '../utils/dashboardApi';

const DashboardContext = createContext();

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

export const DashboardProvider = ({ children }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Obtener datos del dashboard para cliente
    const loadDashboardData = useCallback(async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardAPI.getDashboardData(userId);
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error cargando dashboard:', error);
            setError('Error al cargar los datos del dashboard');
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener órdenes del usuario
    const loadUserOrders = useCallback(async (userId, filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardAPI.getUserOrders(userId, filters);
            setOrders(response.data.orders);
            return response.data;
        } catch (error) {
            console.error('Error cargando órdenes:', error);
            setError('Error al cargar las órdenes');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener detalles de una orden
    const loadOrderDetails = useCallback(async (orderId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardAPI.getOrderDetails(orderId);
            setSelectedOrder(response.data);
            return response.data;
        } catch (error) {
            console.error('Error cargando detalles de orden:', error);
            setError('Error al cargar los detalles de la orden');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Para administradores - obtener todas las órdenes
    const loadAllOrders = useCallback(async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardAPI.getAllOrders(filters);
            setOrders(response.data.orders);
            return response.data;
        } catch (error) {
            console.error('Error cargando todas las órdenes:', error);
            setError('Error al cargar las órdenes');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Actualizar estado de orden (solo admin)
    const updateOrderStatus = useCallback(async (orderId, statusData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardAPI.updateOrderStatus(orderId, statusData);
            
            // Actualizar la orden en la lista local
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? response.data : order
                )
            );

            // Si es la orden seleccionada, actualizarla también
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(response.data);
            }

            return response.data;
        } catch (error) {
            console.error('Error actualizando estado de orden:', error);
            setError('Error al actualizar el estado de la orden');
            return null;
        } finally {
            setLoading(false);
        }
    }, [selectedOrder]);

    const clearError = useCallback(() => setError(null), []);

    const value = {
        dashboardData,
        orders,
        selectedOrder,
        loading,
        error,
        loadDashboardData,
        loadUserOrders,
        loadOrderDetails,
        loadAllOrders,
        updateOrderStatus,
        clearError,
        setSelectedOrder
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};
