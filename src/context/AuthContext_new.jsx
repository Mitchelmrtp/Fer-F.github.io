import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../utils/api.js';
import { 
  getCurrentUser, 
  saveAuthData, 
  clearAuthData, 
  isAuthenticated as checkIsAuthenticated 
} from '../utils/auth.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Inicializar estado desde localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = getCurrentUser();
        const isAuth = checkIsAuthenticated();
        
        console.log('🔍 Inicializando auth:', { savedUser, isAuth });
        
        // Solo establecer como autenticado si REALMENTE hay datos válidos
        if (savedUser && savedUser.id && isAuth) {
          setUser(savedUser);
          setIsAuthenticated(true);
          console.log('✅ Usuario autenticado encontrado:', savedUser.correo);
        } else {
          // Si no hay datos válidos, limpiar todo
          console.log('❌ No hay autenticación válida, limpiando datos');
          clearAuthData();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        clearAuthData();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Mapear campos del frontend a los esperados por el backend
      const backendCredentials = {
        correo: credentials.email,
        contrasena: credentials.password
      };
      
      console.log('🔑 Intentando login con:', { email: credentials.email });
      
      const response = await authAPI.login(backendCredentials);
      
      if (response.success) {
        const { user: userData } = response.data;
        console.log('✅ Login exitoso, datos del usuario:', userData);
        
        // Generar un token básico para esta sesión (simulado)
        const sessionToken = `session_${userData.id}_${Date.now()}`;
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Guardar tanto usuario como token
        saveAuthData(userData, sessionToken);
        
        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Error en el login');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Registro
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Mapear campos del frontend a los esperados por el backend
      const backendUserData = {
        nombres: userData.name,
        apellidos: userData.lastName,
        correo: userData.email,
        contrasena: userData.password,
        nroDocumento: userData.document,
        telefono: userData.phone,
        tipo: userData.type || 'cliente'
      };
      
      console.log('🔐 Registrando usuario:', { email: userData.email });
      
      const response = await authAPI.register(backendUserData);
      
      if (response.success) {
        const { user: newUser } = response.data;
        console.log('✅ Registro exitoso:', newUser);
        
        // Generar un token básico para esta sesión (simulado)
        const sessionToken = `session_${newUser.id}_${Date.now()}`;
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        // Guardar tanto usuario como token
        saveAuthData(newUser, sessionToken);
        
        return { success: true, user: newUser };
      } else {
        throw new Error(response.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    console.log('🚪 Cerrando sesión...');
    setUser(null);
    setIsAuthenticated(false);
    clearAuthData();
  };

  // Actualizar perfil
  const updateProfile = async (updatedData) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      
      const response = await userAPI.updateProfile(user.id, updatedData);
      
      if (response.success) {
        const updatedUser = response.data;
        setUser(updatedUser);
        saveAuthData(updatedUser);
        
        return { success: true, user: updatedUser };
      } else {
        throw new Error(response.message || 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
