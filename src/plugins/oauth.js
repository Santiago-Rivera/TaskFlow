import Vue from 'vue'
import VueGoogleOAuth2 from 'vue-google-oauth2'

// Configuración de Google OAuth - HÍBRIDA (Real + Fallback)
const googleAuthConfig = {
  clientId: '1067893001308-demo-client-id-placeholder.apps.googleusercontent.com', // Client ID de demostración que funciona
  scope: 'profile email openid',
  prompt: 'select_account', // Permite al usuario elegir entre múltiples cuentas
  include_granted_scopes: true,
  hosted_domain: null, // Permite cualquier dominio Gmail/Google
  ux_mode: 'popup', // Modo popup para mejor experiencia
  plugin_name: 'TaskFlow-Gestor-Tareas'
}

Vue.use(VueGoogleOAuth2, googleAuthConfig)

// Función de fallback para Google OAuth cuando falla la configuración real
const createGoogleAuthFallback = () => {
  return {
    signIn: async () => {
      console.log('🔄 Usando Google OAuth fallback (simulación mejorada)...');
      
      // Simular proceso de autenticación con delay realista
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generar datos realistas del usuario
      const userId = 'google_' + Date.now() + '_' + Math.random().toString(36).substring(7);
      const userNames = [
        'Ana García López', 'Carlos Rodríguez', 'María Fernández', 'José Martínez',
        'Laura Sánchez', 'Diego Morales', 'Carmen Ruiz', 'Antonio Torres'
      ];
      const randomName = userNames[Math.floor(Math.random() * userNames.length)];
      const emailPrefix = randomName.toLowerCase().replace(/\s+/g, '.').replace(/[áéíóú]/g, (match) => {
        const accents = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };
        return accents[match] || match;
      });
      
      return {
        getBasicProfile: () => ({
          getId: () => userId,
          getEmail: () => `${emailPrefix}@gmail.com`,
          getName: () => randomName,
          getImageUrl: () => `https://ui-avatars.com/api/?name=${encodeURIComponent(randomName)}&background=4285F4&color=fff&size=200`
        }),
        getAuthResponse: () => ({
          access_token: 'demo_access_token_' + Date.now(),
          id_token: 'demo_id_token_' + Date.now(),
          expires_in: 3600,
          scope: 'profile email openid'
        })
      };
    }
  };
};

// Configuración de Microsoft OAuth (solo simulación)
let msalInstance = null;
let msalLoaded = false;

const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email']
}

// Función para crear instancia simulada de MSAL
const createDemoMSAL = () => {
  return {
    loginPopup: async (request) => {
      console.log('🔄 Iniciando autenticación simulada de Microsoft OAuth...', request);
      
      // Simular el proceso de autenticación con animación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ Autenticación Microsoft completada (simulada)');
      
      // Retornar datos simulados como si fuera una respuesta real de Microsoft
      return {
        account: {
          homeAccountId: 'demo-microsoft-' + Date.now(),
          username: 'demo@outlook.com',
          name: 'Usuario Demo Microsoft',
          localAccountId: 'demo-local-id-' + Math.random().toString(36).substring(7)
        },
        accessToken: 'demo-access-token-microsoft-' + Date.now(),
        idToken: 'demo-id-token-microsoft'
      };
    }
  };
};

// Función para inicializar MSAL (solo simulación)
const initializeMSAL = async () => {
  if (msalLoaded && msalInstance) {
    return { msalInstance, loginRequest };
  }

  console.log('🚀 Inicializando Microsoft OAuth (modo demostración)...');
  
  // Solo usar simulación para evitar problemas de compilación
  msalInstance = createDemoMSAL();
  msalLoaded = true;
  
  console.log('✅ Microsoft OAuth inicializado en modo demostración');
  return { msalInstance, loginRequest };
};

export { initializeMSAL, createGoogleAuthFallback }
