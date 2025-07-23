// Simulador de Google OAuth para demostración
let googleAuthLoaded = false;
let demoMode = true; // Cambiar a false cuando tengas credenciales reales

const createDemoGoogleAuth = () => {
  return {
    signIn: async () => {
      console.log('Simulando login de Google OAuth...');
      
      // Simular el proceso de autenticación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Retornar datos simulados como si fuera una respuesta real de Google
      return {
        getBasicProfile: () => ({
          getId: () => 'demo-google-' + Date.now(),
          getEmail: () => 'demo@gmail.com',
          getName: () => 'Usuario Demo Google',
          getImageUrl: () => 'https://via.placeholder.com/150/4285F4/FFFFFF?text=G'
        }),
        getAuthResponse: () => ({
          access_token: 'demo-google-access-token',
          id_token: 'demo-google-id-token'
        })
      };
    }
  };
};

const initializeGoogleAuth = () => {
  if (googleAuthLoaded) {
    return;
  }

  // Si estamos en modo demo o si hay error con la librería real
  if (demoMode) {
    console.log('Inicializando Google OAuth en modo demostración');
    window.demoGoogleAuth = createDemoGoogleAuth();
    googleAuthLoaded = true;
    return;
  }

  googleAuthLoaded = true;
};

export { initializeGoogleAuth, demoMode }
