import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, ArrowRight, Send, Sparkles } from 'lucide-react';
import { useFirstVisit } from '../hooks/useFirstVisit';
import { useAuth } from '../context/AuthContext';
import { questionnaireAPI } from '../utils/api';
import axios from 'axios';

const questions = [
  {
    id: 1,
    question: "¿Me amas?",
    type: "yesno",
    key: "loves_me"
  },
  {
    id: 2,
    question: "¿Sabes que te amo muchísimo?",
    type: "yesno",
    key: "knows_i_love_her"
  },
  {
    id: 3,
    question: "¿Sabes que haría lo que sea por ti?",
    type: "yesno",
    key: "knows_i_would_do_anything"
  },
  {
    id: 4,
    question: "¿Crees que estoy loco?",
    type: "yesno",
    key: "thinks_im_crazy"
  },
  {
    id: 5,
    question: "¿Por qué crees que no me he rendido contigo todas las veces que te quisiste ir de mi lado?",
    type: "text",
    key: "why_never_gave_up",
    placeholder: "Escribe lo que desees... también puedes dejar en blanco"
  },
  {
    id: 6,
    question: "¿Aceptas seguir aguantando mis locuras para siempre? 🤪",
    type: "yesno",
    key: "accept_my_craziness"
  },
  {
    id: 7,
    question: "¿Me dejarías robarte un millón de sonrisas más? 😁",
    type: "yesno",
    key: "steal_million_smiles"
  },
  {
    id: 8,
    question: "¿Me dejarías seguir amándote cada día más?",
    type: "yesno",
    key: "love_you_more_each_day"
  },
  {
    id: 9,
    question: "¿Dejarías que siga siendo romántico contigo y nada más que contigo?",
    type: "yesno",
    key: "be_romantic_only_with_you"
  }
];

export default function Questionnaire() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener el usuario autenticado
  const { markQuestionnaireCompleted, questionnaireCount, hasCompletedQuestionnaire } = useFirstVisit();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleResponse = (value) => {
    setResponses(prev => ({
      ...prev,
      [questions[currentQuestion].key]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const userId = user ? user.id : null; // Obtener el ID del usuario si está autenticado
      
      console.log('📝 Enviando cuestionario:', { userId, responsesCount: Object.keys(responses).length });
      
      // Usar la nueva API que incluye userId
      const result = await questionnaireAPI.submit(responses, userId);
      
      console.log('✅ Cuestionario enviado exitosamente:', result);
      
      // Marcar cuestionario como completado ANTES de mostrar éxito
      // Esto incrementa el contador y sincroniza con BD
      const updatedCount = await markQuestionnaireCompleted();
      
      console.log('✅ Estado actualizado después de completar cuestionario, nuevo conteo:', updatedCount);
      
      setShowSuccess(true);
      
      // Redirigir inmediatamente con parámetro especial para bypassar verificación
      setTimeout(() => {
        console.log('🏠 Redirigiendo al homepage de la tienda después de completar cuestionario');
        console.log('📊 Estado final antes de redirección:', { 
          updatedCount,
          questionnaireCount, 
          hasCompletedQuestionnaire,
          userId: user?.id
        });
        
        // Usar parámetro especial para indicar que viene del cuestionario completado
        navigate('/?fromQuestionnaire=true', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Error al enviar cuestionario:', error);
      alert('Error al enviar el cuestionario. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const hasResponse = responses[currentQ.key] !== undefined && responses[currentQ.key] !== '';

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-6">💕</div>
          <h2 className="text-3xl font-bold text-pink-600 mb-4">
            ¡Gracias mi amor!
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Tus respuestas han sido enviadas con todo mi amor
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Serás redirigida al homepage en unos segundos...
          </p>
          <div className="animate-pulse">
            <Heart className="w-12 h-12 text-red-500 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Barra de progreso */}
        <div className="bg-gray-200 h-2">
          <div 
            className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
              <span className="text-lg font-semibold text-gray-600">
                Pregunta {currentQuestion + 1} de {questions.length}
              </span>
              <Sparkles className="w-6 h-6 text-rose-500 animate-pulse" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Respuestas */}
          <div className="mb-8">
            {currentQ.type === 'yesno' ? (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleResponse('Sí')}
                  className={`py-4 px-8 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    responses[currentQ.key] === 'Sí'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sí 💖
                </button>
                
                <button
                  onClick={() => handleResponse('No')}
                  className={`py-4 px-8 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    responses[currentQ.key] === 'No'
                      ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  No 💔
                </button>
              </div>
            ) : (
              <div>
                <textarea
                  value={responses[currentQ.key] || ''}
                  onChange={(e) => handleResponse(e.target.value)}
                  placeholder={currentQ.placeholder}
                  className="w-full p-4 border-2 border-pink-200 rounded-2xl focus:border-pink-500 focus:outline-none resize-none text-lg"
                  rows={6}
                />
              </div>
            )}
          </div>

          {/* Navegación */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400 transform hover:scale-105'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Anterior
            </button>

            <button
              onClick={handleNext}
              disabled={isSubmitting || (!hasResponse && currentQ.type === 'yesno')}
              className={`flex items-center gap-2 py-3 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                isSubmitting || (!hasResponse && currentQ.type === 'yesno')
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : currentQuestion === questions.length - 1
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : currentQuestion === questions.length - 1 ? (
                <>
                  Enviar
                  <Send className="w-5 h-5" />
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
