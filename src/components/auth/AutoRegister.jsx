import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function AutoRegister() {
  const [stage, setStage] = useState('welcome'); // welcome, registering, success, error
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, login } = useAuth();

  // Datos predefinidos para el registro automático
  const userData = {
    name: 'Fer',
    lastName: 'Mi Princesa',
    email: 'fer.mi.amor@love.com',
    password: 'teamo123',
    phone: '999999999',
    document: '12345678'
  };

  const handleAutoRegister = async () => {
    setLoading(true);
    setStage('registering');

    try {
      // Intentar login primero (por si ya está registrado)
      console.log('🔐 Verificando usuario existente...');
      try {
        const loginResult = await login({
          email: userData.email,
          password: userData.password
        });
        
        if (loginResult.success) {
          console.log('✅ Usuario existente - Login exitoso');
          setStage('success');
          setTimeout(() => {
            navigate('/');
          }, 1500);
          return;
        }
      } catch (loginError) {
        // Es normal que falle si el usuario no existe
      }

      // Si el login falla, intentar registro
      console.log('📝 Creando nuevo usuario...');
      const registerResult = await register(userData);
      
      if (registerResult.success) {
        console.log('✅ Registro exitoso, iniciando login...');
        
        // Login automático después del registro
        const loginResult = await login({
          email: userData.email,
          password: userData.password
        });
        
        if (loginResult.success) {
          console.log('✅ Login automático exitoso después de registro');
          setStage('success');
          
          setTimeout(() => {
            console.log('� Registro+Login exitoso, dejando que FlowHandler maneje la navegación');
            // Para un registro nuevo, siempre irá al cuestionario (questionnaireCount = 0)
            navigate('/');
          }, 1500);
        } else {
          throw new Error('Error en login automático después de registro');
        }
      } else {
        throw new Error(registerResult.error || 'Error en registro');
      }
    } catch (error) {
      console.error('❌ Error en auto-registro:', error);
      
      // Mostrar error y redirigir al login manual
      setStage('error');
      setTimeout(() => {
        console.log('🔄 Redirigiendo al login manual por error');
        navigate('/login');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (stage === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Bienvenida mi amor! 💕
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Antes de comenzar esta experiencia especial, necesitamos preparar todo para ti...
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-pink-50 rounded-lg p-4">
              <Sparkles className="w-6 h-6 text-pink-500 mx-auto mb-2" />
              <p className="text-sm text-pink-700">
                Vamos a crear tu perfil automáticamente y luego te llevaré a un cuestionario muy especial
              </p>
            </div>
            
            <button
              onClick={handleAutoRegister}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Comenzar la aventura</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'registering') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Preparando todo para ti...
            </h2>
            <p className="text-gray-600">
              Creando tu perfil y configurando la experiencia perfecta
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-500">
            <p>✨ Creando tu cuenta especial</p>
            <p>🔐 Configurando acceso automático</p>
            <p>💕 Preparando sorpresas</p>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Todo listo, mi amor! 🎉
            </h2>
            <p className="text-gray-600">
              Te estoy llevando al cuestionario especial que preparé para ti...
            </p>
          </div>
          
          <div className="animate-pulse text-pink-500 font-medium">
            Redirigiendo al cuestionario...
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Oops, algo salió mal 😅
            </h2>
            <p className="text-gray-600 mb-4">
              No te preocupes mi amor, te llevaré al login manual para que puedas ingresar.
            </p>
          </div>
          
          <div className="animate-pulse text-red-500 font-medium">
            Redirigiendo al login...
          </div>
        </div>
      </div>
    );
  }

  return null;
}
