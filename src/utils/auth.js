import { authAPI } from './api.js';

// Claves para localStorage
const STORAGE_KEYS = {
  USER: 'flower_shop_user',
  TOKEN: 'flower_shop_token'
};

// Obtener usuario actual del localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
};

// Obtener token actual del localStorage
export const getCurrentToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error al obtener token actual:', error);
    return null;
  }
};

// Guardar usuario y token en localStorage
export const saveAuthData = (user, token = null) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }
  } catch (error) {
    console.error('Error al guardar datos de autenticación:', error);
  }
};

// Limpiar datos de autenticación
export const clearAuthData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error al limpiar datos de autenticación:', error);
  }
};

// Función de login
export const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    
    if (response.success) {
      const { user, token } = response.data;
      saveAuthData(user, token);
      return { success: true, user, token };
    } else {
      throw new Error(response.message || 'Error en el login');
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Función de registro
export const register = async (userData) => {
  try {
    const response = await authAPI.register(userData);
    
    if (response.success) {
      const { user, token } = response.data;
      saveAuthData(user, token);
      return { success: true, user, token };
    } else {
      throw new Error(response.message || 'Error en el registro');
    }
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// Función de logout
export const logout = () => {
  try {
    clearAuthData();
    
    // Opcionalmente redirigir a la página de login
    // window.location.href = '/login';
    
    return { success: true, message: 'Sesión cerrada exitosamente' };
  } catch (error) {
    console.error('Error en logout:', error);
    return { success: false, message: 'Error al cerrar sesión' };
  }
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const user = getCurrentUser();
  const token = getCurrentToken();
  
  // Debe tener tanto usuario como token válidos
  const isValid = !!(user && user.id && token);
  
  console.log('🔍 Verificando autenticación:', {
    hasUser: !!user,
    userId: user?.id,
    hasToken: !!token,
    isValid
  });
  
  return isValid;
};

// Verificar token con el servidor (opcional, sin JWT por ahora)
export const verifyToken = async () => {
  try {
    const user = getCurrentUser();
    if (!user || !user.id) {
      return { success: false, message: 'No hay usuario autenticado' };
    }

    const response = await authAPI.verifyToken(`userId=${user.id}`);
    
    if (response.success) {
      // Actualizar datos del usuario si han cambiado
      saveAuthData(response.data.user);
      return { success: true, user: response.data.user };
    } else {
      // Token inválido, limpiar datos
      clearAuthData();
      return { success: false, message: response.message };
    }
  } catch (error) {
    console.error('Error al verificar token:', error);
    clearAuthData();
    return { success: false, message: 'Error al verificar autenticación' };
  }
};

// Obtener headers de autenticación para requests
export const getAuthHeaders = () => {
  const token = getCurrentToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Verificar si el usuario tiene un rol específico
export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  return user && user.tipo === requiredRole;
};

// Verificar si el usuario es admin
export const isAdmin = () => {
  return hasRole('admin');
};

// Verificar si el usuario es cliente
export const isClient = () => {
  return hasRole('cliente');
};

export default {
  getCurrentUser,
  getCurrentToken,
  saveAuthData,
  clearAuthData,
  login,
  register,
  logout,
  isAuthenticated,
  verifyToken,
  getAuthHeaders,
  hasRole,
  isAdmin,
  isClient
};
