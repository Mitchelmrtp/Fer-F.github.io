import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useFirstVisit } from './hooks/useFirstVisit';
import Header from './components/layout/Header';
import LoginForm from './components/auth/LoginForm';
import RegistroForm from './components/auth/RegistroForm';
import AutoRegister from './components/auth/AutoRegister';
import RestablecerContraseña from './components/auth/RestablecerContraseña';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import DashboardPage from './pages/DashboardPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import QuestionnaireWelcome from './pages/QuestionnaireWelcome';
import Questionnaire from './pages/Questionnaire';

import './App.css';

const FlowHandler = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { isFirstVisit, hasCompletedQuestionnaire, questionnaireCount, markAsVisited } = useFirstVisit();
  const location = useLocation();
  const prevStateRef = useRef();
  
  // Verificar si viene del cuestionario completado
  const searchParams = new URLSearchParams(location.search);
  const fromQuestionnaire = searchParams.get('fromQuestionnaire') === 'true';
  
  // Debug del estado del FlowHandler (solo cuando hay cambios significativos)
  useEffect(() => {
    const currentState = {
      isAuthenticated,
      loading,
      isFirstVisit,
      hasCompletedQuestionnaire,
      questionnaireCount,
      location: location.pathname
    };
    
    // Solo logear si hay cambios en autenticación o cuestionario
    if (
      prevStateRef.current?.isAuthenticated !== isAuthenticated ||
      prevStateRef.current?.hasCompletedQuestionnaire !== hasCompletedQuestionnaire ||
      prevStateRef.current?.questionnaireCount !== questionnaireCount ||
      prevStateRef.current?.loading !== loading
    ) {
      console.log('🔍 FlowHandler - Estado actual:', currentState);
    }
    
    prevStateRef.current = currentState;
  }, [isAuthenticated, loading, isFirstVisit, hasCompletedQuestionnaire, questionnaireCount, location.pathname]);  // No interferir con rutas específicas
  if (location.pathname.includes('/questionnaire') || 
      location.pathname.includes('/login') || 
      location.pathname.includes('/registro') ||
      location.pathname.includes('/dashboard')) {
    console.log('📍 En ruta específica, no interferir');
    return children;
  }
  
  // Si está cargando, mostrar loading
  if (loading || isFirstVisit === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  // FLUJO PRINCIPAL: Solo en la ruta raíz "/"
  if (location.pathname === '/') {
    console.log('🚦 FlowHandler evaluando ruta "/" con estado:', {
      isAuthenticated,
      questionnaireCount,
      hasCompletedQuestionnaire,
      isFirstVisit,
      loading,
      fromQuestionnaire,
      timestamp: new Date().toISOString()
    });
    
    // CASO ESPECIAL: Si viene del cuestionario completado, ir directo a la tienda
    if (fromQuestionnaire && isAuthenticated) {
      console.log('🎯 Viene del cuestionario completado → Acceso directo a la tienda');
      if (isFirstVisit) markAsVisited();
      // Limpiar el parámetro de la URL
      window.history.replaceState({}, '', '/');
      return children;
    }
    
    // 1. No autenticado → Mostrar AutoRegister
    if (!isAuthenticated) {
      console.log('📍 No autenticado → AutoRegister');
      return <AutoRegister />;
    }
    
    // 2. Autenticado + NUNCA ha completado el cuestionario → Ir al cuestionario OBLIGATORIO
    if (isAuthenticated && questionnaireCount === 0) {
      console.log('📍 Autenticado + NUNCA hizo cuestionario → Cuestionario OBLIGATORIO');
      return <Navigate to="/questionnaire-welcome" replace />;
    }
    
    // 3. Autenticado + YA hizo el cuestionario al menos una vez → Acceso a la tienda
    if (isAuthenticated && questionnaireCount > 0) {
      console.log('📍 Autenticado + ya hizo cuestionario → Acceso a la tienda romántica');
      console.log('📊 Detalles:', { questionnaireCount, hasCompletedQuestionnaire, isFirstVisit });
      if (isFirstVisit) markAsVisited(); // Marcar como visitado si es necesario
      return children;
    }
    
    // 4. Estado de espera/carga
    console.log('⏳ Estado de espera - mostrando loading...');
    console.log('📊 Estado actual completo:', {
      isAuthenticated,
      questionnaireCount,
      hasCompletedQuestionnaire,
      isFirstVisit,
      loading
    });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sincronizando...</p>
        </div>
      </div>
    );
  }
  
  console.log('📍 Mostrando contenido normal');
  return children;
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

// Componente AppContent que contiene la estructura principal
const AppContent = ({ musicPlaying, toggleMusic, audioRef }) => {
  return (
    <div className="min-h-screen flex flex-col bg-custom-bg">
      <FlowHandler>
        <Header onToggleMusic={toggleMusic} musicPlaying={musicPlaying} />
        <audio 
          ref={audioRef} 
          preload="auto" 
          playsInline
          crossOrigin="anonymous"
          style={{ display: 'none' }}
        >
          <source src="/Promesa.mp3" type="audio/mpeg" />
          Tu navegador no soporta el elemento audio.
        </audio>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Ruta del carrito - PROTEGIDA */}
            <Route 
              path="/cart" 
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              } 
            />
            
            {/* Rutas del cuestionario */}
            <Route path="/questionnaire-welcome" element={<QuestionnaireWelcome />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            
            {/* Rutas públicas (redirigen al dashboard si ya está logueado) */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              } 
            />
            <Route 
              path="/registro" 
              element={
                <PublicRoute>
                  <RegistroForm />
                </PublicRoute>
              } 
            />
            <Route 
              path="/restablecer" 
              element={
                <PublicRoute>
                  <RestablecerContraseña />
                </PublicRoute>
              } 
            />
            
            {/* Rutas protegidas del dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/order-details/:orderId" 
              element={
                <PrivateRoute>
                  <OrderDetailsPage />
                </PrivateRoute>
              } 
            />
                
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </FlowHandler>
    </div>
  );
};

function App() {
  const [musicPlaying, setMusicPlaying] = useState(false); // Cambiar a false por defecto
  const [musicInitialized, setMusicInitialized] = useState(false);
  const audioRef = useRef(null);

  // Inicializar el audio
  useEffect(() => {
    if (audioRef.current && !musicInitialized) {
      console.log('🎵 Inicializando sistema de audio...');
      
      audioRef.current.src = '/Promesa.mp3';
      audioRef.current.loop = true;
      audioRef.current.volume = 0.15; // Volumen un poco más alto
      audioRef.current.preload = 'auto';
      
      // Eventos de audio para debugging
      audioRef.current.addEventListener('loadstart', () => console.log('🎵 Cargando audio...'));
      audioRef.current.addEventListener('canplay', () => console.log('🎵 Audio listo para reproducir'));
      audioRef.current.addEventListener('error', (e) => console.error('❌ Error de audio:', e));
      audioRef.current.addEventListener('ended', () => console.log('🎵 Audio terminado'));
      
      setMusicInitialized(true);
      
      // Intentar autoplay después de un pequeño delay
      setTimeout(async () => {
        await tryAutoplay();
      }, 1000);
    }
  }, [musicInitialized]);

  const tryAutoplay = async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
      setMusicPlaying(true);
      console.log('🎵 Música iniciada automáticamente');
    } catch (error) {
      console.log('🔇 Autoplay bloqueado. Esperando interacción del usuario.');
      setMusicPlaying(false);
      
      // Función para iniciar música en la primera interacción
      const startMusicOnInteraction = async (event) => {
        console.log('👆 Interacción detectada:', event.type);
        try {
          if (audioRef.current && !musicPlaying) {
            await audioRef.current.play();
            setMusicPlaying(true);
            console.log('🎵 Música iniciada después de interacción del usuario');
            
            // Remover todos los listeners
            removeInteractionListeners();
          }
        } catch (err) {
          // Silenciar este error ya que es normal
          console.log('🔇 Audio aún no disponible, esperando...');
        }
      };
      
      const removeInteractionListeners = () => {
        document.removeEventListener('click', startMusicOnInteraction);
        document.removeEventListener('touchstart', startMusicOnInteraction);
        document.removeEventListener('keydown', startMusicOnInteraction);
      };
      
      // Agregar listeners más específicos (sin scroll para evitar spam)
      document.addEventListener('click', startMusicOnInteraction, { once: true });
      document.addEventListener('touchstart', startMusicOnInteraction, { once: true });
      document.addEventListener('keydown', startMusicOnInteraction, { once: true });
    }
  };

  // Función para alternar música
  const toggleMusic = async () => {
    if (!audioRef.current) {
      console.log('❌ Referencia de audio no disponible');
      return;
    }
    
    console.log('🎛️ Toggle música. Estado actual:', musicPlaying);
    
    try {
      if (musicPlaying) {
        audioRef.current.pause();
        setMusicPlaying(false);
        console.log('⏸️ Música pausada');
      } else {
        await audioRef.current.play();
        setMusicPlaying(true);
        console.log('▶️ Música reanudada');
      }
    } catch (error) {
      console.error('❌ Error al alternar música:', error);
      setMusicPlaying(false);
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent 
            musicPlaying={musicPlaying} 
            toggleMusic={toggleMusic} 
            audioRef={audioRef} 
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;