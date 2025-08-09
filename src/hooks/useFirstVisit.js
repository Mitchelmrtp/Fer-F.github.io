import { useState, useEffect } from 'react';
import { questionnaireAPI } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const useFirstVisit = () => {
  const { user, isAuthenticated } = useAuth(); // Obtener usuario del contexto
  const [isFirstVisit, setIsFirstVisit] = useState(null); // null = checking, true = first visit, false = returning user
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
  const [questionnaireCount, setQuestionnaireCount] = useState(0);

  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        // Verificar si ya visitó antes (localStorage)
        const hasVisited = localStorage.getItem('fer_has_visited');
        setIsFirstVisit(!hasVisited);
        
        // Si está autenticado, obtener el conteo real desde la base de datos
        if (isAuthenticated && user && user.id) {
          console.log('🔍 Obteniendo conteo de cuestionarios para usuario:', user.id);
          
          try {
            const response = await questionnaireAPI.getCount(user.id);
            if (response.success) {
              const count = response.data.questionnaireCount;
              setQuestionnaireCount(count);
              setHasCompletedQuestionnaire(count > 0);
              
              console.log('🔍 Conteo de cuestionarios obtenido desde BD:', count);
              
              // Sincronizar localStorage con la base de datos
              if (count > 0) {
                localStorage.setItem('fer_questionnaire_completed', 'true');
                localStorage.setItem('fer_questionnaire_count', count.toString());
              }
            }
          } catch (error) {
            console.error('Error obteniendo conteo de cuestionarios:', error);
            // Fallback a localStorage si falla la API
            const localCount = parseInt(localStorage.getItem('fer_questionnaire_count') || '0');
            setQuestionnaireCount(localCount);
            setHasCompletedQuestionnaire(localCount > 0);
          }
        } else {
          // Si no está autenticado, usar localStorage como fallback
          const questionnaireCompleted = localStorage.getItem('fer_questionnaire_completed');
          const count = parseInt(localStorage.getItem('fer_questionnaire_count') || '0');
          
          setHasCompletedQuestionnaire(!!questionnaireCompleted);
          setQuestionnaireCount(count);
          
          console.log('🔍 Usuario no autenticado, usando localStorage:', { count, completed: !!questionnaireCompleted });
        }
        
        console.log('🔍 Primera visita?', !hasVisited);
      } catch (error) {
        console.error('Error verificando primera visita:', error);
        setIsFirstVisit(false);
        setQuestionnaireCount(0);
        setHasCompletedQuestionnaire(false);
      }
    };

    checkFirstVisit();
  }, [isAuthenticated, user]); // Re-ejecutar cuando cambie el estado de autenticación

  const markAsVisited = () => {
    try {
      localStorage.setItem('fer_has_visited', 'true');
      setIsFirstVisit(false);
    } catch (error) {
      console.error('Error marcando como visitado:', error);
    }
  };

  const markQuestionnaireCompleted = async () => {
    try {
      // Si está autenticado, primero refrescar el conteo desde la base de datos
      if (isAuthenticated && user && user.id) {
        try {
          console.log('🔄 Refrescando conteo desde BD antes de marcar como completado...');
          const response = await questionnaireAPI.getCount(user.id);
          if (response.success) {
            const dbCount = response.data.questionnaireCount;
            
            // Actualizar estado local inmediatamente
            setQuestionnaireCount(dbCount);
            setHasCompletedQuestionnaire(dbCount > 0);
            
            // Actualizar localStorage
            localStorage.setItem('fer_questionnaire_completed', dbCount > 0 ? 'true' : 'false');
            localStorage.setItem('fer_questionnaire_count', dbCount.toString());
            localStorage.setItem('fer_has_visited', 'true');
            
            // Marcar como visitado
            setIsFirstVisit(false);
            
            console.log('✅ Estado actualizado con conteo de BD:', {
              dbCount,
              hasCompleted: dbCount > 0,
              isFirstVisit: false
            });
            
            // Retornar el conteo actualizado para que el componente lo use
            return dbCount;
          }
        } catch (error) {
          console.error('Error refrescando conteo desde BD:', error);
          // Continuar con la lógica de fallback
        }
      }
      
      // Fallback: usar conteo local si no hay usuario autenticado o falla la BD
      const newCount = questionnaireCount + 1;
      
      // Actualizar localStorage
      localStorage.setItem('fer_questionnaire_completed', 'true');
      localStorage.setItem('fer_questionnaire_count', newCount.toString());
      localStorage.setItem('fer_has_visited', 'true');
      
      // Actualizar estado local
      setHasCompletedQuestionnaire(true);
      setQuestionnaireCount(newCount);
      setIsFirstVisit(false);
      
      console.log('✅ Cuestionario completado (fallback). Total de veces:', newCount);
      return newCount;
    } catch (error) {
      console.error('Error marcando cuestionario completado:', error);
      return questionnaireCount;
    }
  };

  const resetFirstVisit = () => {
    try {
      localStorage.removeItem('fer_has_visited');
      localStorage.removeItem('fer_questionnaire_completed');
      localStorage.removeItem('fer_questionnaire_count');
      setIsFirstVisit(true);
      setHasCompletedQuestionnaire(false);
      setQuestionnaireCount(0);
    } catch (error) {
      console.error('Error reseteando primera visita:', error);
    }
  };

  return {
    isFirstVisit,
    hasCompletedQuestionnaire,
    questionnaireCount,
    markAsVisited,
    markQuestionnaireCompleted,
    resetFirstVisit
  };
};
