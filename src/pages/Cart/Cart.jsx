import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount, removeFromCart, clearCart, createOrderFromCart, loading, error } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [showMetodoPago, setShowMetodoPago] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState("beso");
  const [orderError, setOrderError] = useState("");
  
  const metodosPago = [
    { value: "beso", label: "💋 Beso", emoji: "💋" },
    { value: "baile", label: "💃 Baile", emoji: "💃" },
    { value: "foto", label: "📸 Foto", emoji: "📸" },
    { value: "abrazo", label: "🤗 Abrazo", emoji: "🤗" },
    { value: "sonrisa", label: "😊 Sonrisa", emoji: "😊" }
  ];

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setOrderError('Para confirmar tu compra necesitas iniciar sesión. Te redirigiremos al login...');
      setTimeout(() => {
        navigate('/login', { state: { from: { pathname: '/cart' } } });
      }, 3000);
      return;
    }
    
    setOrderError('');
    setShowMetodoPago(true);
  };

  const handleCheckout = async () => {
    try {
      setOrderError('');
      const result = await createOrderFromCart({ paymentMethod: metodoSeleccionado });
      
      // Mostrar mensaje de éxito y redirigir
      alert(`¡Compra confirmada! Tu orden ha sido procesada con ${metodoSeleccionado}. 💕`);
      navigate('/');
      
    } catch (err) {
      setOrderError(err.message || "Error al procesar la orden");
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      const itemId = item.id || item.productId;
      await removeFromCart(itemId);
    } catch (err) {
      console.error('Error removiendo item:', err);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
      try {
        await clearCart();
      } catch (err) {
        console.error('Error vaciando carrito:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 animate-pulse text-pink-500 mx-auto mb-4" />
          <p className="text-pink-600">Cargando tu carrito del amor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a comprar
          </button>
          
          <h1 className="text-3xl font-bold text-pink-800 flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3" />
            Tu Carrito del Amor
          </h1>
          
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-pink-500" />
            <span className="text-pink-600 font-semibold">{cartCount} productos</span>
          </div>
        </div>

        {/* Carrito vacío */}
        {(!cartItems || cartItems.length === 0) ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-pink-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-pink-700 mb-4">
              Tu carrito está vacío... ¡pero mi amor por ti está lleno! 💕
            </h2>
            <p className="text-pink-600 mb-8">
              Explora nuestros productos y encuentra el regalo perfecto para expresar tu amor.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3"
            >
              Explorar productos 🌹
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-pink-800">
                  Productos en tu carrito ({cartCount})
                </h2>
                {cartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-600 flex items-center text-sm"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Vaciar carrito
                  </button>
                )}
              </div>

              {cartItems.map((item, index) => (
                <div key={item.id || item.productId || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.product?.image || item.image || "/placeholder.svg"} 
                      alt={item.product?.name || item.title || "Producto"} 
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.product?.name || item.title || "Producto sin nombre"}
                      </h3>
                      <p className="text-pink-600 font-medium">
                        ${item.unitPrice || item.product?.price || 0}
                      </p>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="text-sm text-rose-700">
                        Pago: {item.paymentMethod || 'beso'} 💕
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-pink-700">
                        ${item.totalPrice || (item.quantity * (item.unitPrice || item.product?.price || 0))}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="mt-2 text-red-500 hover:text-red-600 text-sm flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen del carrito */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-pink-800 mb-6">
                  Resumen de tu compra
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío:</span>
                    <span className="font-semibold text-green-600">¡Gratis! 💕</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between text-lg font-bold text-pink-700">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Estado de autenticación */}
                {!isAuthenticated && (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">
                      <strong>💡 Tip:</strong> Inicia sesión para guardar tu carrito y proceder con la compra.
                    </p>
                  </div>
                )}

                {/* Mensajes de error */}
                {(error || orderError) && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">{error || orderError}</p>
                  </div>
                )}

                {/* Botón principal */}
                {!showMetodoPago ? (
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 text-lg"
                    disabled={loading}
                  >
                    {isAuthenticated ? 'Proceder al pago 💕' : 'Iniciar sesión para comprar 💕'}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-pink-800">
                      Elige tu método de pago 💕
                    </h3>
                    
                    <div className="space-y-2">
                      {metodosPago.map((metodo) => (
                        <label key={metodo.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="metodo-pago"
                            value={metodo.value}
                            checked={metodoSeleccionado === metodo.value}
                            onChange={(e) => setMetodoSeleccionado(e.target.value)}
                            className="w-4 h-4 text-pink-600"
                          />
                          <span className="text-lg">{metodo.emoji}</span>
                          <span className="text-gray-700">{metodo.label.replace(metodo.emoji + ' ', '')}</span>
                        </label>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        onClick={handleCheckout}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3"
                        disabled={loading}
                      >
                        {loading ? 'Procesando...' : `Confirmar compra con ${metodoSeleccionado} 💕`}
                      </Button>
                      
                      <Button
                        onClick={() => setShowMetodoPago(false)}
                        variant="outline"
                        className="w-full border-pink-300 text-pink-600 hover:bg-pink-50"
                      >
                        Volver
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
