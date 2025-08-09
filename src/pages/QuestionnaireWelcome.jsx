import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';

export default function QuestionnaireWelcome() {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  const handleContinue = () => {
    navigate('/questionnaire');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-4 left-4">
            <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
          </div>
          <div className="absolute top-8 right-8">
            <Sparkles className="w-6 h-6 text-rose-500 animate-pulse" />
          </div>
          <div className="absolute bottom-8 left-8">
            <Sparkles className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div className="absolute bottom-4 right-4">
            <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
          </div>
        </div>

        <div className="relative z-10 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">💕</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
              Bienvenida mi Princesa
            </h1>
          </div>

          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p className="text-xl">
              <span className="font-semibold">Diga su nombre...</span>
            </p>
            
            <p className="text-2xl font-bold text-pink-600 animate-pulse">
              ¡Ah! Te la creíste 😄
            </p>
            
            <p className="text-xl">
              Sé muy bien que eres mi <span className="font-bold text-rose-600">Fer</span>, 
              mi <span className="font-bold text-red-600">amor</span>, 
              mi <span className="font-bold text-pink-600">vida</span>...
            </p>

            <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-2xl border-2 border-pink-200 mt-8">
              <p className="text-lg font-medium text-gray-800">
                Para proceder, quisiera que completes una serie de cuestionarios
              </p>
            </div>

            <div className="mt-8">
              <p className="text-xl font-semibold text-gray-800 mb-6">
                ¿Quieres continuar?
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleContinue}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                >
                  Sí, continuar 💖
                </button>
                
                <button
                  onClick={handleBack}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                >
                  No, volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
