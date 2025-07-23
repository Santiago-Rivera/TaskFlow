import Vue from 'vue'
import VueGoogleOAuth2 from 'vue-google-oauth2'

// Configuración de Google OAuth
const googleAuthConfig = {
  clientId: 'tu-google-client-id.apps.googleusercontent.com', // Necesitas configurar esto
  scope: 'profile email',
  prompt: 'select_account'
}

Vue.use(VueGoogleOAuth2, googleAuthConfig)

// Configuración de Microsoft OAuth (simulada para compatibilidad)
const createMockMSAL = () => {
  return {
    loginPopup: async () => {
      throw new Error('Microsoft OAuth no está disponible en esta versión. Por favor, configura las credenciales en OAUTH_CONFIG.md');
    }
  };
};

const mockLoginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email']
};

// Función para inicializar MSAL (simulada)
const initializeMSAL = async () => {
  console.warn('Microsoft OAuth está deshabilitado temporalmente. Ver OAUTH_CONFIG.md para configuración.');
  return {
    msalInstance: createMockMSAL(),
    loginRequest: mockLoginRequest
  };
};

export { initializeMSAL }
