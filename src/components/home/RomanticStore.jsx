
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { useFirstVisit } from "../../hooks/useFirstVisit"
import { Heart, MessageCircle, RotateCcw } from "lucide-react"
import Banner from "../layout/Banner"
import ProductGrid from "../RomanticStore/ProductGrid"
import ProductDetailModal from "../RomanticStore/ProductDetailModal"
import CartModal from "../RomanticStore/CartModal"
import LoveLetterSection from "../RomanticStore/LoveLetterSection"
import FloatingHearts from "../RomanticStore/FloatingHearts"
import { productAPI } from "../../utils/api"

export default function RomanticStore() {
  const navigate = useNavigate()
  const { resetFirstVisit } = useFirstVisit()
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const [hearts, setHearts] = useState([])
  const { cart, cartCount, cartItems, addToCart } = useCart()

  useEffect(() => {
    console.log('Iniciando carga de productos...');
    productAPI.getProducts()
      .then(response => {
        console.log('Respuesta de API:', response);
        if (response.success) {
          console.log('Productos recibidos:', response.data);
          setProducts(response.data.products || response.data);
        } else {
          console.error('Error en respuesta:', response);
          setProducts([]);
        }
      })
      .catch(error => {
        console.error('Error al cargar productos:', error);
        setProducts([]);
      });
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: window.innerHeight,
      }
      setHearts((prev) => [...prev, newHeart])
      setTimeout(() => {
        setHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id))
      }, 3000)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // CartContext handles addToCart and cart state

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 relative overflow-hidden">
      <FloatingHearts hearts={hearts} />
      <Banner />
      <main className="container mx-auto px-4 py-8">
        <ProductGrid
          products={products}
          onProductClick={setSelectedProduct}
          onAddToCart={addToCart}
        />
      </main>
      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
      <CartModal
        cart={cartItems}
        open={showCart}
        onClose={() => setShowCart(false)}
      />
      <LoveLetterSection />
      
      {/* Botón flotante para el cuestionario */}
      <button
        onClick={() => {
          console.log('🎯 Botón del cuestionario clickeado');
          navigate('/questionnaire-welcome');
        }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-50 group animate-bounce"
        title="Cuestionario Especial"
        style={{ zIndex: 9999 }}
      >
        <div className="flex items-center justify-center">
          <MessageCircle className="w-6 h-6" />
          <Heart className="w-4 h-4 absolute -top-1 -right-1 text-red-300 animate-pulse" />
        </div>
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          💕
        </span>
      </button>

      {/* Botón de reset para desarrollo (solo en desarrollo) */}
      <button
        onClick={() => {
          console.log('🔄 Reseteando estado de primera visita...');
          resetFirstVisit();
          window.location.reload();
        }}
        className="fixed bottom-6 left-6 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-xl transition-all duration-300 z-50 group"
        title="Reset Flujo - Simular Primera Visita"
      >
        <RotateCcw className="w-5 h-5" />
        <span className="absolute bottom-full left-0 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          🔄
        </span>
      </button>

      {/* Texto flotante adicional para debugging */}
      <div className="fixed bottom-20 right-6 bg-pink-100 text-pink-800 px-3 py-1 rounded-lg text-sm shadow-lg z-40 animate-pulse">
      </div>
    </div>
  )
}

