// Base URL para el backend
export const BASE_URL = 'http://localhost:3003';

// Función helper para hacer requests con manejo de errores
const makeRequest = async (url, options = {}) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// API functions para autenticación
export const authAPI = {
  login: (credentials) => makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData) => makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  verifyToken: (token) => makeRequest('/auth/verify', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  }),
};

// API functions para carrito
export const cartAPI = {
  getCart: (userId) => makeRequest(`/cart/${userId}`),
  
  addToCart: (cartData) => makeRequest('/cart/add', {
    method: 'POST',
    body: JSON.stringify(cartData),
  }),
  
  updateCartItem: (cartItemId, quantity) => makeRequest(`/cart/item/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),
  
  removeFromCart: (cartItemId) => makeRequest(`/cart/item/${cartItemId}`, {
    method: 'DELETE',
  }),
  
  clearCart: (userId) => makeRequest(`/cart/clear/${userId}`, {
    method: 'DELETE',
  }),
};

// API functions para órdenes
export const orderAPI = {
  checkout: (orderData) => makeRequest('/order/checkout', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  getOrders: (userId) => makeRequest(`/orders/${userId}`),
  
  getOrderById: (orderId) => makeRequest(`/order/${orderId}`),
};

// API functions para productos
export const productAPI = {
  getProducts: () => makeRequest('/products'),
  
  getProductById: (productId) => makeRequest(`/product/${productId}`),
  
  searchProducts: (query) => makeRequest(`/products/search?q=${encodeURIComponent(query)}`),
  
  getProductsByCategory: (category) => makeRequest(`/products/category/${category}`),
};

// API functions para usuarios
export const userAPI = {
  getProfile: (userId) => makeRequest(`/user/${userId}`),
  
  getProfileByEmail: (email) => makeRequest(`/user/email/${email}`),
  
  createUser: (userData) => makeRequest('/user', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  updateProfile: (userId, userData) => makeRequest(`/user/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

// API functions para cuestionarios
export const questionnaireAPI = {
  // Enviar cuestionario
  submit: (responses, userId = null) => makeRequest('/questionnaire/submit', {
    method: 'POST',
    body: JSON.stringify({ responses, userId }),
  }),
  
  // Obtener conteo de cuestionarios de un usuario
  getCount: (userId) => makeRequest(`/questionnaire/user/${userId}/count`),
  
  // Obtener todos los cuestionarios de un usuario
  getUserQuestionnaires: (userId) => makeRequest(`/questionnaire/user/${userId}`),
};

export default {
  authAPI,
  cartAPI,
  orderAPI,
  productAPI,
  userAPI,
  questionnaireAPI,
};
