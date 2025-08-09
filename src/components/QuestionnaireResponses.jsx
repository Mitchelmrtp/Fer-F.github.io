import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCurrentToken } from '../utils/auth';
import { Heart, Calendar, MapPin, Trash2, Eye, RefreshCw } from 'lucide-react';
import axios from 'axios';

// Mapeo de keys a preguntas en español
const questionLabels = {
  loves_me: "¿Me amas?",
  knows_i_love_her: "¿Sabes que te amo muchísimo?",
  knows_i_would_do_anything: "¿Sabes que haría lo que sea por ti?",
  thinks_im_crazy: "¿Crees que estoy loco?",
  why_never_gave_up: "¿Por qué crees que no me he rendido contigo todas las veces que te quisiste ir de mi lado?",
  accept_my_craziness: "¿Aceptas seguir aguantando mis locuras para siempre? 🤪",
  steal_million_smiles: "¿Me dejarías robarte un millón de sonrisas más? 😁",
  favorite_memory: "¿Cuál es tu recuerdo favorito conmigo?",
  what_makes_me_special: "¿Qué es lo que más te gusta de mí? (Puedes ser honesta, no me voy a enojar... creo 😅)"
};

export default function QuestionnaireResponses() {
  const { user } = useAuth();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [noToken, setNoToken] = useState(false);

  // Función para obtener la pregunta en español
  const getQuestionLabel = (key) => {
    return questionLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  useEffect(() => {
    console.log('🔍 QuestionnaireResponses - Estado del usuario:', user);
    console.log('🔍 QuestionnaireResponses - Es admin?:', user?.tipo === 'admin');
    
    if (user?.tipo === 'admin') {
      fetchQuestionnaires();
    }
  }, [user]);

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true);
      setNoToken(false);
      
      // Debug: Ver qué hay en localStorage y usuario
      console.log('🔍 Debug información:');
      console.log('Usuario desde contexto:', user);
      console.log('ID del usuario:', user?.id);
      console.log('Tipo de usuario:', user?.tipo);
      
      if (!user || !user.id) {
        console.error('No hay información de usuario disponible');
        setNoToken(true);
        setLoading(false);
        return;
      }
      
      if (user.tipo !== 'admin') {
        console.error('Usuario no es admin');
        setLoading(false);
        return;
      }
      
      console.log('Haciendo petición con userId:', user.id);
      
      const response = await axios.get(`http://localhost:3003/questionnaire/admin/all?userId=${user.id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setQuestionnaires(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener cuestionarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestionnaire = async (id) => {
    try {
      setDeleting(id);
      
      if (!user || !user.id) {
        console.error('No hay información de usuario disponible');
        alert('Error: Usuario no autenticado');
        return;
      }
      
      if (user.tipo !== 'admin') {
        console.error('Usuario no es admin');
        alert('Error: Permisos insuficientes');
        return;
      }
      
      const response = await axios.delete(`http://localhost:3003/questionnaire/admin/${id}?userId=${user.id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setQuestionnaires(prev => prev.filter(q => q.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar cuestionario:', error);
      alert('Error al eliminar el cuestionario');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openModal = (questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuestionnaire(null);
  };

  // Validación de usuario autenticado
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Debes iniciar sesión para acceder a esta sección.</p>
      </div>
    );
  }

  if (user?.tipo !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Acceso denegado. Solo administradores pueden ver esta sección.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando respuestas...</p>
      </div>
    );
  }

  if (noToken) {
    return (
      <div className="text-center py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-yellow-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Información de usuario no disponible</h3>
          <p className="text-yellow-700 mb-4">No se pudo obtener la información del usuario autenticado. Por favor, intenta cerrar sesión e iniciar sesión nuevamente.</p>
          <button
            onClick={fetchQuestionnaires}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-800">Respuestas del Cuestionario</h2>
        </div>
        <button
          onClick={fetchQuestionnaires}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Lista de cuestionarios */}
      {questionnaires.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No hay respuestas de cuestionarios aún</p>
          <p className="text-gray-500">Las respuestas aparecerán aquí cuando alguien complete el cuestionario</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {questionnaires.map((questionnaire) => (
            <div
              key={questionnaire.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {formatDate(questionnaire.completedAt)}
                    </span>
                  </div>
                  
                  {questionnaire.ipAddress && (
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        IP: {questionnaire.ipAddress}
                      </span>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Vista previa de respuestas:</strong>
                    </p>
                    <div className="text-sm text-gray-600">
                      {Object.entries(questionnaire.responses).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="truncate">
                          <span className="font-medium">{getQuestionLabel(key)}:</span> {value || 'Sin respuesta'}
                        </div>
                      ))}
                      {Object.keys(questionnaire.responses).length > 2 && (
                        <div className="text-gray-500 italic">
                          +{Object.keys(questionnaire.responses).length - 2} respuestas más...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openModal(questionnaire)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </button>
                  
                  <button
                    onClick={() => deleteQuestionnaire(questionnaire.id)}
                    disabled={deleting === questionnaire.id}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                  >
                    {deleting === questionnaire.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {deleting === questionnaire.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para ver respuestas completas */}
      {showModal && selectedQuestionnaire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Respuestas Completas</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  <p><strong>Fecha:</strong> {formatDate(selectedQuestionnaire.completedAt)}</p>
                  {selectedQuestionnaire.ipAddress && (
                    <p><strong>IP:</strong> {selectedQuestionnaire.ipAddress}</p>
                  )}
                </div>
                
                {Object.entries(selectedQuestionnaire.responses).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-200 pb-3">
                    <p className="font-medium text-gray-800 mb-1">
                      {getQuestionLabel(key)}:
                    </p>
                    <p className="text-gray-700">
                      {value || <span className="text-gray-400 italic">Sin respuesta</span>}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
