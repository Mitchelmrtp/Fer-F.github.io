import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Mail, Lock, Phone, CreditCard, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegistroForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    contraseña: '',
    confirmarContraseña: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }
    
    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es requerido';
    }
    
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'El email no es válido';
    }
    
    if (!formData.contraseña) {
      nuevosErrores.contraseña = 'La contraseña es requerida';
    } else if (formData.contraseña.length < 6) {
      nuevosErrores.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.confirmarContraseña) {
      nuevosErrores.confirmarContraseña = 'Confirma tu contraseña';
    } else if (formData.contraseña !== formData.confirmarContraseña) {
      nuevosErrores.confirmarContraseña = 'Las contraseñas no coinciden';
    }
    
    if (formData.dni && !/^\d{8}$/.test(formData.dni)) {
      nuevosErrores.dni = 'El DNI debe tener 8 dígitos';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    
    setLoading(true);
    setErrores({});
    setMensaje('');
    
    try {
      const userData = {
        name: formData.nombre,
        lastName: formData.apellido,
        email: formData.email,
        password: formData.contraseña,
        documentNumber: formData.dni,
        phone: formData.telefono,
        type: 'cliente'
      };
      
      const result = await register(userData);
      
      if (result.success) {
        setMensaje('¡Registro exitoso! Redirigiendo...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        if (result.error.includes('email')) {
          setErrores({ email: 'Este email ya está registrado' });
        } else if (result.error.includes('documento')) {
          setErrores({ dni: 'Este DNI ya está registrado' });
        } else {
          setErrores({ general: result.error || 'Error al registrar usuario' });
        }
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setErrores({ general: error.message || 'Error al registrar usuario' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Heart className="h-16 w-16 text-pink-500 animate-pulse" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Únete a nuestra familia
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Crea tu cuenta y disfruta de nuestros productos únicos
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 border border-pink-100">
          <form className="space-y-6" onSubmit={handleRegister}>
            {mensaje && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      ¡Éxito!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      {mensaje}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errores.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error al registrarse
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {errores.general}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400 transition-colors ${
                      errores.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Tu nombre"
                  />
                </div>
                {errores.nombre && <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>}
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400 transition-colors ${
                      errores.apellido ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Tu apellido"
                  />
                </div>
                {errores.apellido && <p className="mt-1 text-sm text-red-600">{errores.apellido}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400 transition-colors ${
                      errores.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="tu-email@ejemplo.com"
                  />
                </div>
                {errores.email && <p className="mt-1 text-sm text-red-600">{errores.email}</p>}
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400 transition-colors"
                    placeholder="999 999 999"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                DNI
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  disabled={loading}
                  maxLength="8"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400 transition-colors ${
                    errores.dni ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="12345678"
                />
              </div>
              {errores.dni && <p className="mt-1 text-sm text-red-600">{errores.dni}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="contraseña"
                    name="contraseña"
                    value={formData.contraseña}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400 transition-colors ${
                      errores.contraseña ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errores.contraseña && <p className="mt-1 text-sm text-red-600">{errores.contraseña}</p>}
              </div>

              <div>
                <label htmlFor="confirmarContraseña" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmarContraseña"
                    name="confirmarContraseña"
                    value={formData.confirmarContraseña}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400 transition-colors ${
                      errores.confirmarContraseña ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Repite tu contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errores.confirmarContraseña && <p className="mt-1 text-sm text-red-600">{errores.confirmarContraseña}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </div>
                ) : (
                  'Crear cuenta'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-pink-600 hover:text-pink-500 transition-colors"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroForm;

