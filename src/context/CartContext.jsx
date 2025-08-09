import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI, orderAPI } from '../utils/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Calcular totales
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.totalPrice) || 0);
  }, 0);
  
  const cartCount = cartItems.reduce((count, item) => {
    return count + (item.quantity || 0);
  }, 0);

  // Cargar carrito local desde localStorage
  const loadLocalCart = () => {
    try {
      const localCart = localStorage.getItem('localCart');
      if (localCart) {
        const parsedCart = JSON.parse(localCart);
        setCartItems(parsedCart);
        console.log('Carrito local cargado:', parsedCart);
      }
    } catch (error) {
      console.error('Error cargando carrito local:', error);
    }
  };

  // Guardar carrito local en localStorage
  const saveLocalCart = (items) => {
    try {
      localStorage.setItem('localCart', JSON.stringify(items));
      console.log('Carrito local guardado:', items);
    } catch (error) {
      console.error('Error guardando carrito local:', error);
    }
  };

  // Cargar carrito del servidor
  const loadCart = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await cartAPI.getCart(user.id);
      
      if (response.success && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
      setError('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Agregar producto al carrito
  const addToCart = async (product, quantity = 1) => {
    console.log('🛒 addToCart llamado con:', { product, quantity, isAuthenticated });
    
    if (!product || !product.id) {
      setError('Producto no válido');
      console.error('❌ Error: Producto no válido');
      return { success: false, error: 'Producto no válido' };
    }

    setLoading(true);
    setError(null);

    try {
      // Si el usuario está autenticado, usar el carrito del servidor
      if (isAuthenticated && user?.id) {
        console.log('📡 Usuario autenticado, agregando al carrito del servidor...');
        
        const response = await cartAPI.addToCart({
          userId: user.id,
          productId: product.id,
          quantity
        });

        console.log('Respuesta del backend:', response);

        if (response.success) {
          setCart(response.data);
          setCartItems(response.data.items || []);
          console.log('✅ Producto agregado exitosamente al servidor');
          return { success: true, message: 'Producto agregado al carrito' };
        } else {
          throw new Error(response.message || 'Error al agregar producto');
        }
      } else {
        // Usuario no autenticado - usar carrito local
        console.log('💾 Usuario no autenticado, usando carrito local...');
        
        // Verificar si el producto ya existe en el carrito local
        const existingItemIndex = cartItems.findIndex(item => item.productId === product.id);
        
        let newCartItems;
        if (existingItemIndex >= 0) {
          // Actualizar cantidad del producto existente
          newCartItems = [...cartItems];
          newCartItems[existingItemIndex].quantity += parseInt(quantity);
          newCartItems[existingItemIndex].totalPrice = newCartItems[existingItemIndex].quantity * parseFloat(product.price);
          console.log('📈 Cantidad actualizada para producto existente');
        } else {
          // Agregar nuevo producto al carrito
          const newItem = {
            id: Date.now(), // ID temporal para carrito local
            productId: product.id,
            quantity: parseInt(quantity),
            unitPrice: parseFloat(product.price),
            totalPrice: parseInt(quantity) * parseFloat(product.price),
            product: product
          };
          newCartItems = [...cartItems, newItem];
          console.log('➕ Nuevo producto agregado al carrito local');
        }
        
        setCartItems(newCartItems);
        saveLocalCart(newCartItems);
        console.log('✅ Carrito local actualizado:', newCartItems);
        
        return { success: true, message: 'Producto agregado al carrito local' };
      }
    } catch (error) {
      console.error('❌ Error agregando al carrito:', error);
      const errorMessage = error.message || 'Error al agregar producto al carrito';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad de un item
  const updateCartItem = async (cartItemId, quantity) => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setLoading(true);
      setError(null);

      const response = await cartAPI.updateCartItem(cartItemId, quantity);

      if (response.success) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        return { success: true, message: 'Cantidad actualizada' };
      } else {
        throw new Error(response.message || 'Error al actualizar cantidad');
      }
    } catch (error) {
      console.error('Error actualizando item:', error);
      const errorMessage = error.message || 'Error al actualizar cantidad';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Remover item del carrito
  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    setError(null);

    try {
      if (isAuthenticated && user?.id) {
        // Usuario autenticado - usar servidor
        const response = await cartAPI.removeFromCart(cartItemId);

        if (response.success) {
          setCart(response.data);
          setCartItems(response.data.items || []);
          return { success: true, message: 'Producto removido del carrito' };
        } else {
          throw new Error(response.message || 'Error al remover producto');
        }
      } else {
        // Usuario no autenticado - usar carrito local
        console.log('🗑️ Removiendo del carrito local, ID:', cartItemId);
        const newCartItems = cartItems.filter(item => item.id !== cartItemId && item.productId !== cartItemId);
        setCartItems(newCartItems);
        saveLocalCart(newCartItems);
        console.log('✅ Producto removido del carrito local');
        return { success: true, message: 'Producto removido del carrito' };
      }
    } catch (error) {
      console.error('Error removiendo del carrito:', error);
      const errorMessage = error.message || 'Error al remover producto del carrito';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Limpiar carrito
  const clearCart = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isAuthenticated && user?.id) {
        // Usuario autenticado - limpiar carrito del servidor
        const response = await cartAPI.clearCart(user.id);

        if (response.success) {
          setCart(null);
          setCartItems([]);
          return { success: true, message: 'Carrito limpiado' };
        } else {
          throw new Error(response.message || 'Error al limpiar carrito');
        }
      } else {
        // Usuario no autenticado - limpiar carrito local
        console.log('🧹 Limpiando carrito local...');
        setCartItems([]);
        localStorage.removeItem('localCart');
        console.log('✅ Carrito local limpiado');
        return { success: true, message: 'Carrito limpiado' };
      }
    } catch (error) {
      console.error('Error limpiando carrito:', error);
      const errorMessage = error.message || 'Error al limpiar carrito';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId);
  };

  // Crear orden desde el carrito (checkout)
  const createOrderFromCart = async (orderData = {}) => {
    console.log('🛒 Iniciando checkout...', { isAuthenticated, user, cartItems });
    
    // Verificar si el usuario está autenticado
    if (!isAuthenticated || !user?.id) {
      console.log('❌ Usuario no autenticado');
      throw new Error('Debes iniciar sesión para confirmar tu compra');
    }

    // Verificar que hay items en el carrito
    if (!cartItems || cartItems.length === 0) {
      console.log('❌ Carrito vacío');
      throw new Error('No hay productos en el carrito');
    }

    try {
      setLoading(true);
      setError(null);

      // Si el usuario se autenticó después de agregar productos al carrito local,
      // necesitamos transferir los items del carrito local al carrito del servidor
      if (!cart?.id) {
        console.log('📦 Transfiriendo carrito local al servidor...');
        
        // Primero crear/obtener el carrito del usuario en el servidor
        for (const item of cartItems) {
          await cartAPI.addToCart({
            userId: user.id,
            productId: item.productId,
            quantity: item.quantity
          });
        }
        
        // Recargar el carrito del servidor
        await loadCart();
        
        // Limpiar carrito local
        localStorage.removeItem('localCart');
      }

      const checkoutData = {
        userId: user.id,
        cartId: cart?.id,
        paymentMethod: orderData.paymentMethod || 'beso',
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice || item.product?.price
        }))
      };

      console.log('📤 Enviando datos de checkout:', checkoutData);
      const response = await orderAPI.checkout(checkoutData);

      if (response.success) {
        console.log('✅ Orden creada exitosamente:', response.data);
        // Limpiar carrito después del checkout exitoso
        setCart(null);
        setCartItems([]);
        localStorage.removeItem('localCart');
        return response.data;
      } else {
        throw new Error(response.message || 'Error al crear la orden');
      }
    } catch (error) {
      console.error('❌ Error en checkout:', error);
      setError(error.message || 'Error al procesar la orden');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obtener cantidad de un producto en el carrito
  const getProductQuantity = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  // Cargar carrito cuando el usuario cambie
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log('Usuario autenticado, cargando carrito del servidor...');
      loadCart();
    } else {
      console.log('Usuario no autenticado, cargando carrito local...');
      // Limpiar carrito del servidor y cargar carrito local
      setCart(null);
      loadLocalCart();
    }
  }, [isAuthenticated, user?.id, loadCart]);

  const value = {
    cart,
    cartItems,
    cartTotal,
    cartCount,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    isInCart,
    getProductQuantity,
    createOrderFromCart,
    setError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
