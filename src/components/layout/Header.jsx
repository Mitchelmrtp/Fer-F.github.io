import { Heart, ShoppingCart, Music, MicOffIcon as MusicOff, User, LogOut, Settings } from "lucide-react"
import { Button } from "../common/Button"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useState, useRef, useEffect } from "react"

// Puedes crear un Badge simple aquí si no existe
function Badge({ children, className }) {
  return <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${className || ''}`}>{children}</span>
}

export default function Header({ onToggleMusic, musicPlaying }) {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Heart className="h-8 w-8 text-white animate-pulse" />
          <h1 className="text-2xl font-bold">Tienda del Amor 💕</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleMusic} 
            className={`text-white hover:bg-white/20 relative ${musicPlaying ? 'bg-white/10' : ''}`}
            title={musicPlaying ? 'Silenciar música' : 'Activar música'}
          >
            {musicPlaying ? (
              <>
                <MusicOff className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </>
            ) : (
              <Music className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/cart')}
            className="text-white hover:bg-white/20 relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-pink-800">{cartCount}</Badge>
            )}
          </Button>
          
          {/* Menú de usuario */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 rounded-full px-3 py-2 transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user.nombre}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setShowUserMenu(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-white hover:bg-white/20"
            >
              <User className="h-4 w-4 mr-1" />
              Iniciar Sesión
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
