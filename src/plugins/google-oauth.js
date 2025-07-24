import Vue from 'vue'

// Plugin personalizado para Google OAuth con selector de cuentas visual
const GoogleOAuthPlugin = {
  install(Vue) {
    Vue.prototype.$googleAuth = {
      // Mostrar selector de cuentas y autenticar
      async signIn() {
        console.log('🔄 Mostrando selector de cuentas visual...');
        return await this.createGoogleAuthFallback();
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
                  <span style="font-size: 16px; color: #202124;">Selecciona una cuenta</span>
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
  }
};

Vue.use(GoogleOAuthPlugin);

// Función de fallback para componentes que usen la función global
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
          email: 'test.usuario@gmail.com',
          name: 'Test Usuario',
          picture: 'https://ui-avatars.com/api/?name=Test+Usuario&background=34a853&color=fff'
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

export default GoogleOAuthPlugin;
export { createGoogleAuthFallback };
