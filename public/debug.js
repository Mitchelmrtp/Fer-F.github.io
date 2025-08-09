// Script para debuggear el estado del cuestionario desde la consola del navegador

// Función para verificar el estado actual
window.debugQuestionnaireState = function() {
  const token = localStorage.getItem('fer_auth_token');
  const hasVisited = localStorage.getItem('fer_has_visited');
  const questionnaireCompleted = localStorage.getItem('fer_questionnaire_completed');
  const questionnaireCount = localStorage.getItem('fer_questionnaire_count');
  
  console.log('🔍 Estado actual del localStorage:', {
    token: token ? 'Presente' : 'No presente',
    hasVisited,
    questionnaireCompleted,
    questionnaireCount: parseInt(questionnaireCount || '0')
  });
  
  // Si hay token, hacer petición a la API
  if (token) {
    try {
      const user = JSON.parse(atob(token.split('.')[1]));
      console.log('👤 Usuario decodificado:', user);
      
      fetch(`http://localhost:3003/questionnaire/user/${user.id}/count`)
        .then(response => response.json())
        .then(data => {
          console.log('🔢 Conteo desde API:', data);
        })
        .catch(error => {
          console.error('❌ Error obteniendo conteo:', error);
        });
    } catch (error) {
      console.error('❌ Error decodificando token:', error);
    }
  }
};

// Función para limpiar el estado
window.resetQuestionnaireState = function() {
  localStorage.removeItem('fer_has_visited');
  localStorage.removeItem('fer_questionnaire_completed');
  localStorage.removeItem('fer_questionnaire_count');
  console.log('🧹 Estado del cuestionario limpiado');
  location.reload();
};

console.log('🔧 Funciones de debug disponibles:');
console.log('- debugQuestionnaireState(): Ver estado actual');
console.log('- resetQuestionnaireState(): Limpiar estado');
