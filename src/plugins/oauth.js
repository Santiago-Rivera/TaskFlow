import Vue from 'vue'

// Configuración de Google Identity Services - Client ID REAL
// IMPORTANTE: Para que funcione con cuentas reales, necesitas:
// 1. Ir a Google Cloud Console (console.cloud.google.com)
// 2. Crear un proyecto o usar uno existente
// 3. Habilitar Google+ API
// 4. Crear credenciales OAuth 2.0
// 5. Agregar tu dominio (localhost:8080 para desarrollo)
// const GOOGLE_CLIENT_ID = '1053310604495-2ba2rrvqklmfv8fii9qa9lj1lp5qf8fr.apps.googleusercontent.com'

// Plugin personalizado para Google OAuth y Microsoft OAuth con selector de cuentas visual
const OAuthPlugin = {
  install(Vue) {
    Vue.prototype.$googleAuth = {
      // Inicializar Google Identity Services
      init() {
        return new Promise((resolve) => {
          if (typeof window.google !== 'undefined' && window.google.accounts) {
            console.log('✅ Google Identity Services ya disponible');
            resolve();
            return;
          }

          // Esperar a que se cargue la API de Google
          const checkGoogle = () => {
            if (typeof window.google !== 'undefined' && window.google.accounts) {
              console.log('✅ Google Identity Services cargado correctamente');
              resolve();
            } else {
              console.log('⏳ Esperando Google Identity Services...');
              setTimeout(checkGoogle, 100);
            }
          };
          checkGoogle();
        });
      },

      // Mostrar selector de cuentas y autenticar
      async signIn() {
        console.log('🔄 Iniciando autenticación de Google...');
        
        // DIRECTAMENTE usar el selector visual porque el Client ID no está configurado para este dominio
        console.log('🎯 Usando selector visual de Google (Client ID no configurado para localhost:8081)');
        return await this.createGoogleAuthFallback();
      },

      // Obtener información del usuario usando el token REAL
      async getUserInfo(accessToken) {
        try {
          const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
          if (!response.ok) {
            throw new Error('Error obteniendo información del usuario');
          }
          const userInfo = await response.json();
          return userInfo;
        } catch (error) {
          console.error('❌ Error obteniendo info del usuario:', error);
          throw error;
        }
      },

      // Crear fallback visual que simula el selector de Google
      async createGoogleAuthFallback() {
        return new Promise((resolve) => {
          // Crear modal que simula el selector de Google
          const modal = document.createElement('div');
          modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
              <div style="background: white; border-radius: 8px; padding: 24px; max-width: 400px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
                <div style="text-align: center; margin-bottom: 20px;">
                  <img src="https://developers.google.com/identity/images/g-logo.png" style="width: 20px; height: 20px; margin-right: 8px;">
                  <span style="font-size: 16px; color: #202124;">Selecciona una cuenta de Google</span>
                </div>
                <div style="border: 1px solid #dadce0; border-radius: 4px; padding: 12px; margin-bottom: 12px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'" onclick="selectAccount('demo')">
                  <div style="display: flex; align-items: center;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #4285f4; display: flex; align-items: center; justify-content: center; color: white; margin-right: 12px; font-weight: bold;">D</div>
                    <div>
                      <div style="font-size: 14px; color: #202124;">Demo User</div>
                      <div style="font-size: 12px; color: #5f6368;">demo.user@gmail.com</div>
                    </div>
                  </div>
                </div>
                <div style="border: 1px solid #dadce0; border-radius: 4px; padding: 12px; margin-bottom: 16px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'" onclick="selectAccount('test')">
                  <div style="display: flex; align-items: center;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #34a853; display: flex; align-items: center; justify-content: center; color: white; margin-right: 12px; font-weight: bold;">T</div>
                    <div>
                      <div style="font-size: 14px; color: #202124;">Test Account</div>
                      <div style="font-size: 12px; color: #5f6368;">test.account@gmail.com</div>
                    </div>
                  </div>
                </div>
                <div style="text-align: center;">
                  <button style="background: none; border: none; color: #1a73e8; font-size: 14px; cursor: pointer; padding: 8px;" onclick="closeModal()">Cancelar</button>
                </div>
              </div>
            </div>
          `;
          
          document.body.appendChild(modal);
          
          window.selectAccount = (type) => {
            const userData = type === 'demo' ? {
              sub: 'demo_123456',
              email: 'demo.user@gmail.com',
              name: 'Demo User',
              picture: 'https://ui-avatars.com/api/?name=Demo+User&background=4285f4&color=fff'
            } : {
              sub: 'test_789012',
              email: 'test.account@gmail.com', 
              name: 'Test Account',
              picture: 'https://ui-avatars.com/api/?name=Test+Account&background=34a853&color=fff'
            };
            
            const googleUser = {
              getBasicProfile: () => ({
                getId: () => userData.sub,
                getEmail: () => userData.email,
                getName: () => userData.name,
                getImageUrl: () => userData.picture
              }),
              getAuthResponse: () => ({
                access_token: 'fallback_token_' + Date.now(),
                id_token: 'fallback_id_token_' + Date.now(),
                expires_in: 3600,
                scope: 'profile email openid'
              })
            };
            
            document.body.removeChild(modal);
            delete window.selectAccount;
            delete window.closeModal;
            resolve(googleUser);
          };
          
          window.closeModal = () => {
            document.body.removeChild(modal);
            delete window.selectAccount;
            delete window.closeModal;
            resolve(null);
          };
        });
      }
    };

    // NUEVA FUNCIONALIDAD: Microsoft/Outlook OAuth
    Vue.prototype.$microsoftAuth = {
      // Mostrar selector de cuentas y autenticar con Microsoft
      async signIn() {
        console.log('🔄 Mostrando selector de cuentas de Microsoft...');
        return await this.createMicrosoftAuthFallback();
      },

      // Crear fallback visual que simula el selector de Microsoft
      async createMicrosoftAuthFallback() {
        return new Promise((resolve) => {
          // Crear modal que simula el selector de Microsoft
          const modal = document.createElement('div');
          modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
              <div style="background: white; border-radius: 8px; padding: 24px; max-width: 400px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
                <div style="text-align: center; margin-bottom: 20px;">
                  <img src="https://docs.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_mssymbol_19.png" style="width: 20px; height: 20px; margin-right: 8px;">
                  <span style="font-size: 16px; color: #323130;">Selecciona una cuenta de Microsoft</span>
                </div>
                <div style="border: 1px solid #edebe9; border-radius: 4px; padding: 12px; margin-bottom: 12px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='white'" onclick="selectMicrosoftAccount('demo')">
                  <div style="display: flex; align-items: center;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #0078d4; display: flex; align-items: center; justify-content: center; color: white; margin-right: 12px; font-weight: bold;">J</div>
                    <div>
                      <div style="font-size: 14px; color: #323130;">Juan Pérez</div>
                      <div style="font-size: 12px; color: #605e5c;">juan.perez@outlook.com</div>
                    </div>
                  </div>
                </div>
                <div style="border: 1px solid #edebe9; border-radius: 4px; padding: 12px; margin-bottom: 16px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='white'" onclick="selectMicrosoftAccount('work')">
                  <div style="display: flex; align-items: center;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #107c10; display: flex; align-items: center; justify-content: center; color: white; margin-right: 12px; font-weight: bold;">M</div>
                    <div>
                      <div style="font-size: 14px; color: #323130;">María González</div>
                      <div style="font-size: 12px; color: #605e5c;">maria.gonzalez@empresa.com</div>
                    </div>
                  </div>
                </div>
                <div style="text-align: center;">
                  <button style="background: none; border: none; color: #0078d4; font-size: 14px; cursor: pointer; padding: 8px;" onclick="closeMicrosoftModal()">Cancelar</button>
                </div>
              </div>
            </div>
          `;
          
          document.body.appendChild(modal);
          
          window.selectMicrosoftAccount = (type) => {
            const userData = type === 'demo' ? {
              sub: 'ms_demo_123456',
              email: 'juan.perez@outlook.com',
              name: 'Juan Pérez',
              picture: 'https://ui-avatars.com/api/?name=Juan+Perez&background=0078d4&color=fff'
            } : {
              sub: 'ms_work_789012',
              email: 'maria.gonzalez@empresa.com', 
              name: 'María González',
              picture: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=107c10&color=fff'
            };
            
            const microsoftUser = {
              getBasicProfile: () => ({
                getId: () => userData.sub,
                getEmail: () => userData.email,
                getName: () => userData.name,
                getImageUrl: () => userData.picture
              }),
              getAuthResponse: () => ({
                access_token: 'ms_fallback_token_' + Date.now(),
                id_token: 'ms_fallback_id_token_' + Date.now(),
                expires_in: 3600,
                scope: 'profile email openid'
              })
            };
            
            document.body.removeChild(modal);
            delete window.selectMicrosoftAccount;
            delete window.closeMicrosoftModal;
            resolve(microsoftUser);
          };
          
          window.closeMicrosoftModal = () => {
            document.body.removeChild(modal);
            delete window.selectMicrosoftAccount;
            delete window.closeMicrosoftModal;
            resolve(null);
          };
        });
      }
    };
  }
};

Vue.use(OAuthPlugin);

// Función de fallback para Microsoft OAuth cuando falla la configuración real
const createMicrosoftAuthFallback = () => {
  return {
    signIn: async () => {
      console.log('🔄 Usando Microsoft OAuth fallback...');
      
      const availableUsers = [
        {
          id: 'ms_demo_001',
          email: 'juan.perez@outlook.com',
          name: 'Juan Pérez',
          picture: 'https://ui-avatars.com/api/?name=Juan+Perez&background=0078d4&color=fff'
        },
        {
          id: 'ms_work_002',
          email: 'maria.gonzalez@empresa.com',
          name: 'María González',
          picture: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=107c10&color=fff'
        }
      ];
      
      const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        getBasicProfile: () => ({
          getId: () => randomUser.id,
          getEmail: () => randomUser.email,
          getName: () => randomUser.name,
          getImageUrl: () => randomUser.picture
        }),
        getAuthResponse: () => ({
          access_token: 'ms_demo_access_token_' + Date.now(),
          id_token: 'ms_demo_id_token_' + Date.now(),
          expires_in: 3600,
          scope: 'profile email openid'
        })
      };
    }
  };
};

// Función de fallback para Google OAuth cuando falla la configuración real
const createGoogleAuthFallback = () => {
  return {
    signIn: async () => {
      console.log('🔄 Usando Google OAuth fallback...');
      
      const availableUsers = [
        {
          id: 'demo_user_001',
          email: 'demo.user@gmail.com',
          name: 'Demo User',
          picture: 'https://ui-avatars.com/api/?name=Demo+User&background=4285f4&color=fff'
        },
        {
          id: 'test_user_002',
          email: 'test.account@gmail.com',
          name: 'Test Account',
          picture: 'https://ui-avatars.com/api/?name=Test+Account&background=34a853&color=fff'
        }
      ];
      
      const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        getBasicProfile: () => ({
          getId: () => randomUser.id,
          getEmail: () => randomUser.email,
          getName: () => randomUser.name,
          getImageUrl: () => randomUser.picture
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

export default OAuthPlugin;
export { createMicrosoftAuthFallback, createGoogleAuthFallback };
