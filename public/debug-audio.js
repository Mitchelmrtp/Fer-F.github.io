// Debug script para probar la música en la consola del navegador

// Función para testear el audio directamente
window.debugAudio = function() {
  console.log('🔧 Iniciando debug de audio...');
  
  // Crear elemento de audio temporal
  const testAudio = new Audio('/Promesa.mp3');
  testAudio.volume = 0.1;
  testAudio.loop = true;
  
  testAudio.addEventListener('loadstart', () => console.log('🎵 [TEST] Cargando...'));
  testAudio.addEventListener('canplay', () => console.log('🎵 [TEST] Listo para reproducir'));
  testAudio.addEventListener('play', () => console.log('🎵 [TEST] Reproduciendo'));
  testAudio.addEventListener('pause', () => console.log('🎵 [TEST] Pausado'));
  testAudio.addEventListener('error', (e) => console.error('❌ [TEST] Error:', e));
  
  // Intentar reproducir
  testAudio.play()
    .then(() => {
      console.log('✅ [TEST] Audio funcionando correctamente');
      window.testAudio = testAudio; // Guardar referencia para control manual
    })
    .catch(error => {
      console.error('❌ [TEST] Error al reproducir:', error);
    });
};

// Función para parar el audio de prueba
window.stopDebugAudio = function() {
  if (window.testAudio) {
    window.testAudio.pause();
    window.testAudio = null;
    console.log('🛑 [TEST] Audio de prueba detenido');
  }
};

// Función para verificar el estado del audio principal
window.checkMainAudio = function() {
  // Buscar el elemento de audio en la página
  const audioElement = document.querySelector('audio');
  if (audioElement) {
    console.log('🎵 [MAIN] Audio element encontrado:', {
      src: audioElement.src,
      volume: audioElement.volume,
      paused: audioElement.paused,
      ended: audioElement.ended,
      readyState: audioElement.readyState,
      networkState: audioElement.networkState
    });
  } else {
    console.log('❌ [MAIN] No se encontró elemento de audio');
  }
};

console.log('🔧 Funciones de debug de audio disponibles:');
console.log('- debugAudio(): Probar audio directamente');
console.log('- stopDebugAudio(): Detener audio de prueba');
console.log('- checkMainAudio(): Verificar estado del audio principal');
