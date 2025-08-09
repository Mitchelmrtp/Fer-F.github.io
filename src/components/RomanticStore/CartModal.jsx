import { Dialog } from "../../components/common/Dialog"
import { DialogContent } from "../../components/common/DialogContent"
import { DialogHeader } from "../../components/common/DialogHeader"
import { DialogTitle } from "../../components/common/DialogTitle"
import { Button } from "../../components/common/Button"
import { Heart } from "lucide-react"

import { useState } from "react"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function CartModal({ cart, open, onClose }) {
  const [showMetodoPago, setShowMetodoPago] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState("besos");
  const metodosPago = ["besos", "baile", "foto"];

  const { createOrderFromCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [orderError, setOrderError] = useState("");

  const handleCheckout = async () => {
    try {
      // Verificar si el usuario está autenticado antes de procesar la orden
      if (!isAuthenticated) {
        console.log('Usuario no autenticado, redirigiendo al login...');
        setOrderError('Debes iniciar sesión para confirmar tu compra');
        // Cerrar modales y redirigir al login después de un breve delay
        setTimeout(() => {
          setShowMetodoPago(false);
          onClose();
          navigate('/login'); // Redirigir a la página de login
        }, 2000);
        return;
      }

      await createOrderFromCart({ paymentMethod: metodoSeleccionado })
      setShowMetodoPago(false)
      onClose()
    } catch (err) {
      setOrderError(err.message || "Error al procesar la orden")
    }
  }

  const handleProceedToCheckout = () => {
    // Verificar autenticación al hacer clic en "Reclamar todo mi amor"
    if (!isAuthenticated) {
      console.log('Usuario no autenticado, mostrando mensaje...');
      setOrderError('Debes iniciar sesión para proceder con la compra');
      setTimeout(() => {
        onClose();
        navigate('/login');
      }, 2000);
      return;
    }
    
    // Si está autenticado, mostrar el modal de método de pago
    setOrderError(''); // Limpiar errores previos
    setShowMetodoPago(true);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-md bg-gradient-to-br from-pink-50 to-rose-50">
          <DialogHeader>
            <DialogTitle className="text-2xl text-pink-800 flex items-center">
              <Heart className="h-6 w-6 mr-2" />
              Tu Carrito del Amor
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {(!cart || cart.length === 0) ? (
              <p className="text-center text-gray-600 py-8">
                Tu carrito está vacío... ¡pero mi amor por ti está lleno! 💕
              </p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/50 p-3 rounded-lg">
                    <img src={item.image || "/placeholder.svg"} alt={item.title} className="h-12 w-12 rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-pink-600">{item.price}</p>
                      <p className="text-xs text-rose-700">Pago: {item.pago || 'besos'}</p>
                    </div>
                  </div>
                ))}
                <div className="bg-pink-100 p-4 rounded-lg text-center">
                  <p className="text-pink-800 font-semibold mb-2">¡Resumen de tu compra!</p>
                  <p className="text-pink-600 text-sm">
                    {cart.length > 0
                      ? cart.map(item => `${item.title}: ${item.pago || 'besos'}`).join(', ')
                      : 'Agrega productos para ver el resumen.'}
                  </p>
                </div>
                
                {/* Mostrar mensaje de error si existe */}
                {orderError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="text-sm">{orderError}</p>
                  </div>
                )}
                
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                  onClick={() => {
                    onClose();
                    navigate('/cart');
                  }}
                >
                  Ver carrito completo 💕
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para elegir método de pago */}
      <Dialog open={showMetodoPago} onOpenChange={setShowMetodoPago}>
        <DialogContent className="max-w-sm bg-gradient-to-br from-pink-50 to-rose-50">
          <DialogHeader>
            <DialogTitle className="text-xl text-pink-800">Elige tu método de pago</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <select
              value={metodoSeleccionado}
              onChange={e => setMetodoSeleccionado(e.target.value)}
              className="w-full p-2 rounded border border-pink-300"
            >
              {metodosPago.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          {orderError && <p className="text-red-600 text-sm mb-2">{orderError}</p>}
          <Button
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            onClick={handleCheckout}
          >
            Confirmar compra
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
