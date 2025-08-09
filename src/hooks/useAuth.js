import { useState, useEffect } from 'react';
import { getCurrentUser, logout as authLogout } from '../utils/auth';

export const useAuth = () => {
  
  const initialUser = getCurrentUser();
  const [user, setUser] = useState(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialUser);
  const [loading, setLoading] = useState(false);

  const loadUser = () => {
    try {
      const currentUser = getCurrentUser();
      console.log('useAuth loadUser - found user:', currentUser);
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };
  useEffect(() => {
    
    if (!initialUser) {
      loadUser();
    }
    
    const handleAuthChange = () => {
      console.log('Auth change event detected');
      loadUser();
    };
    
    const interval = setInterval(() => {
      const currentUser = getCurrentUser();
      const currentlyAuthenticated = !!currentUser;
      if (currentlyAuthenticated !== isAuthenticated) {
        console.log('Auth state mismatch detected, reloading user');
        loadUser();
      }
    }, 2000);

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [isAuthenticated]);
  const login = (userData) => {
    try {
      setLoading(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('usuario', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      
      window.dispatchEvent(new Event('authChange'));
      return true;
    } catch (error) {
      console.error('Error in login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    try {
      setLoading(true);
      authLogout();
      setUser(null);
      setIsAuthenticated(false);
      window.dispatchEvent(new Event('authChange'));
      return true;
    } catch (error) {
      console.error('Error in logout:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refresh: loadUser
  };
};

