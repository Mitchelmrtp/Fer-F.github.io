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
    question: "¿Mitchel es bot?",
    type: "yesno",
    key: "mitchel_is_bot"
  },
  {
    id: 6,
    question: "¿Cuál es mi color favorito?",
    type: "text",
    key: "favorite_color",
    placeholder: "Escribe mi color favorito..."
  },
  {
    id: 7,
    question: "Antes de continuar...",
    type: "message",
    key: "before_continuing",
    message: "Holiii...! La verdad es que me lo pensé demasiado en hacer esto y me tardé más de lo que pensé. Sinceramente, los viernes se han vuelto muy raros y por eso quise terminar todo este día. Tal vez no te has percatado, pero cada viernes ha sido un suceso muy raro en estas 3 semanas aproximadamente, pero no quiero mencionarlos. No te voy a negar que me he sentido triste por muchas cosas y estuve a nada de cumplir el deseo de 'ya no me ames' o el de 'ya fue suficiente... ya todo terminó'. En lo más profundo de mi corazón sentía que me lo decías porque te habías sobrecargado de problemas y que por ese motivo tus decisiones. En cierta forma solo quería saber si estabas bien sin importar lo mucho que te extrañaba. Solo quería escuchar un ratito tu voz un ratito porque te extrañaba demasiado y a pesar de que me hablabas de una manera fría, te entendía pq estabas pasando por problemas. A pesar de que me dijera que todo había terminado y que ya era suficiente no te pude dejar ir. Tal vez sea un terco loco que, pero aquí estoy sin haberme rendido en ningún momento ni perdido las esperanzas de que vuelvas porque sabía que me extrañarías tanto como yo a ti. Te tenía presente en todo momento, intenté de todo para distraerme... intenté sobrecargar mi mente para no pensarte más, pero era imposible no extrañarte. Hasta cuando dormía, estabas en mis sueños. Por eso entendí que no había forma de olvidarte y si antes ya tenía en cuenta que te amaba, con todo esto me queda más que claro que no puedo imaginarme una vida sin ti. Sé que tenemos una diferencia enorme en cuanto a nuestra edad, pero quisiera romper esa barrera que nos detiene y esperarte todo lo necesario para poder estar contigo sin que nadie nos diga nada, sin que la sociedad no nos tache... Solo si me lo permites. Posiblemente más adelante tengas más problemas y quieras dejar todo y alejarte de todo el mundo, incluso de mi, pero quiero que tengas en cuenta que te amo y se me es muy difícil soltarte, te amo y solo imaginarme un futuro sin ti me pone triste. Si tan solo vieras las cosas que escribí y que no te puedo mostrar en mi tablet, entenderías que te amo y haría todo lo que sea por ti."
  },
  {
    id: 8,
    question: "¿Por qué crees que no me he rendido contigo todas las veces que te quisiste ir de mi lado?",
    type: "text",
    key: "why_never_gave_up",
    placeholder: "Escribe lo que desees... también puedes dejar en blanco"
  },
  {
    id: 9,
    question: "¿Aceptas seguir aguantando mis locuras para siempre? 🤪",
    type: "yesno",
    key: "accept_my_craziness"
  },
  {
    id: 10,
    question: "¿Me dejarías robarte un millón de sonrisas más con mis tonterías? 😁",
    type: "yesno",
    key: "steal_million_smiles"
  },
  {
    id: 11,
    question: "¿Me dejarías seguir amándote cada día más?",
    type: "yesno",
    key: "love_you_more_each_day"
  },
  {
    id: 12,
    question: "¿Dejarías que siga siendo romántico contigo y nada más que contigo?",
    type: "yesno",
    key: "be_romantic_only_with_you"
  },
  {
    id: 13,
    question: "💌 Y ahora lo más importante…",
    type: "special_final",
    key: "accept_relationship",
    isSpecial: true,
    finalMessage: "💌 Y ahora lo más importante…\nMi princesita hermosa… ✨\n\nHoy no solo quiero preguntarte algo, quiero abrirte mi corazón una vez más.\nQuiero pedirte, con todo mi amor, que vuelvas a ser oficialmente mi novia, mi enamorada, mi esposita, mi compañera de vida. 💖\n\nA pesar de lo que decidas, siempre estaré para ti y te amaré de una forma que ni las palabras pueden explicar.\nPara mí, ya lo eres todo: mi novia, mi enamorada, mi amor eterno, mi vida entera… y mi corazón siempre será solo tuyo. 💍❤️\n\nPrometo seguir robándote sonrisas, abrazándote fuerte cuando lo necesites, escucharte incluso en tus silencios, y amarte incluso en tus días más difíciles.\nPorque no existe un \"nosotros\" sin ti… y sin ti, yo no soy yo. ❤️"
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
  const [finalResponse, setFinalResponse] = useState(null);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Agregar estilos CSS para animaciones
  const styles = `
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.8s ease-out;
    }
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }
  `;

  // Inyectar estilos en el documento
  if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    if (!document.head.querySelector('style[data-questionnaire="true"]')) {
      styleSheet.setAttribute('data-questionnaire', 'true');
      document.head.appendChild(styleSheet);
    }
  }

  const handleResponse = (value) => {
    setResponses(prev => ({
      ...prev,
      [questions[currentQuestion].key]: value
    }));
  };

  const handleFinalResponse = (value) => {
    setResponses(prev => ({
      ...prev,
      [questions[currentQuestion].key]: value
    }));
    setFinalResponse(value);
    setShowFinalMessage(true);
    
    // Ya no enviamos automáticamente - el usuario debe hacer clic en "Finalizar"
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
  const hasResponse = currentQ.type === 'message' || currentQ.type === 'special_final' || responses[currentQ.key] !== undefined && responses[currentQ.key] !== '';
  const isRequired = currentQ.type === 'yesno'; // Solo las preguntas de sí/no son obligatorias

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
            {currentQ.type === 'message' ? (
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-2xl border-2 border-pink-200">
                <div className="text-center mb-4">
                  <Heart className="w-8 h-8 text-pink-500 mx-auto animate-pulse" />
                </div>
                <p className="text-gray-800 leading-relaxed text-justify whitespace-pre-line">
                  {currentQ.message}
                </p>
              </div>
            ) : currentQ.type === 'special_final' ? (
              showFinalMessage ? (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 p-8 rounded-3xl border-2 border-pink-300 shadow-2xl mb-6 animate-fade-in">
                    {finalResponse === 'Sí' ? (
                      <>
                        <div className="text-6xl mb-6 animate-bounce">💖</div>
                        <h3 className="text-2xl font-bold text-pink-600 mb-4">
                          ¡Sabía que dirías que sí, mi amor!
                        </h3>
                        <p className="text-lg text-gray-800 leading-relaxed">
                          Gracias por hacerme el más feliz del mundo 💍❤️
                        </p>
                        <div className="mt-6 flex justify-center space-x-4">
                          <span className="text-3xl animate-pulse">💕</span>
                          <span className="text-3xl animate-pulse delay-100">✨</span>
                          <span className="text-3xl animate-pulse delay-200">💖</span>
                          <span className="text-3xl animate-pulse delay-300">🌟</span>
                          <span className="text-3xl animate-pulse delay-400">💕</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-6xl mb-6">😢</div>
                        <h3 className="text-2xl font-bold text-gray-600 mb-4">
                          Aunque digas que no...
                        </h3>
                        <p className="text-lg text-gray-800 leading-relaxed">
                          Siempre te seguiré amando y esperando, mi princesa... 💔❤️
                        </p>
                        <div className="mt-6 flex justify-center space-x-4">
                          <span className="text-3xl animate-pulse">💔</span>
                          <span className="text-3xl animate-pulse delay-200">😔</span>
                          <span className="text-3xl animate-pulse delay-400">💙</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Botón Finalizar */}
                  <div className="text-center mt-8">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`flex items-center gap-3 mx-auto py-4 px-8 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                        isSubmitting
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : finalResponse === 'Sí'
                          ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white shadow-green-500/50'
                          : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white shadow-blue-500/50'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          Enviando respuestas...
                        </>
                      ) : (
                        <>
                          Finalizar
                          <Send className="w-6 h-6" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-8 rounded-3xl border-2 border-pink-300 shadow-xl mb-8">
                    <div className="text-center mb-6">
                      <div className="flex justify-center space-x-2 mb-4">
                        <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
                        <Sparkles className="w-8 h-8 text-rose-500 animate-pulse delay-100" />
                        <Heart className="w-8 h-8 text-red-500 animate-pulse delay-200" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xl text-gray-800 leading-relaxed whitespace-pre-line font-medium">
                        {currentQ.finalMessage}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 justify-center">
                    <button
                      onClick={() => handleFinalResponse('Sí')}
                      className="group relative overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 text-white font-bold py-6 px-12 rounded-full transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-pink-500/50 text-xl"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        Sí, acepto 💖
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    
                    <button
                      onClick={() => handleFinalResponse('No')}
                      className="group relative overflow-hidden bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-6 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl text-xl"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        No... 😢
                      </span>
                    </button>
                  </div>
                </div>
              )
            ) : currentQ.type === 'yesno' ? (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleResponse('Sí')}
                  className={`py-4 px-8 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    responses[currentQ.key] === 'Sí'
                      ? currentQ.isSpecial 
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xl ring-4 ring-pink-200'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {currentQ.isSpecial ? 'Sí 💖✨' : 'Sí 💖'}
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
                  rows={currentQ.key === 'why_never_gave_up' ? 6 : 3}
                />
              </div>
            )}
          </div>

          {/* Navegación */}
          {!(currentQ.type === 'special_final' && showFinalMessage) && (
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0 || currentQ.type === 'special_final'}
                className={`flex items-center gap-2 py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                  currentQuestion === 0 || currentQ.type === 'special_final'
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400 transform hover:scale-105'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Anterior
              </button>

              {currentQ.type !== 'special_final' && (
                <button
                  onClick={handleNext}
                  disabled={isSubmitting || (isRequired && !hasResponse)}
                  className={`flex items-center gap-2 py-3 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isSubmitting || (isRequired && !hasResponse)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : currentQuestion === questions.length - 1
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                      : currentQ.type === 'message'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
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
                  ) : currentQ.type === 'message' ? (
                    <>
                      Continuar
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
