import axios from 'axios';

const API_URL = 'http://localhost:3003';

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Dashboard API functions

// Obtener datos del dashboard para cliente
export const getDashboardData = async (userId) => {
    try {
        const response = await api.get(`/dashboard/client/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting dashboard data:', error);
        throw error;
    }
};

// Obtener órdenes del usuario con filtros y paginación
export const getUserOrders = async (userId, filters = {}) => {
    try {
        const params = new URLSearchParams();
        
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        const response = await api.get(`/dashboard/client/${userId}/orders?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error getting user orders:', error);
        throw error;
    }
};

// Obtener detalles de una orden específica
export const getOrderDetails = async (orderId) => {
    try {
        const response = await api.get(`/dashboard/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting order details:', error);
        throw error;
    }
};

// Para administradores - obtener todas las órdenes
export const getAllOrders = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.search) params.append('search', filters.search);

        const response = await api.get(`/dashboard/admin/orders?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error getting all orders:', error);
        throw error;
    }
};

// Actualizar estado de orden (solo admin)
export const updateOrderStatus = async (orderId, statusData) => {
    try {
        const response = await api.put(`/dashboard/admin/order/${orderId}/status`, statusData);
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

export default api;
