# Configuración OAuth - Guía de Configuración

## ⚠️ Estado Actual de Microsoft OAuth

**Microsoft OAuth está temporalmente deshabilitado**
 debido a incompatibilidades con la versión actual de @azure/msal-browser y Vue 2.

**Funcionalidades disponibles:**

- ✅ **Google OAuth**:
Completamente funcional
- ⚠️ **Microsoft OAuth**: Temporalmente deshabilitado (botón visible pero no funcional)

## ⚙️ Configuración de Proveedores OAuth

Para habilitar completamente la autenticación con Google y Microsoft/Outlook, necesitas configurar los siguientes proveedores:

### 🔵 Google OAuth

1. **Ir a Google Cloud Console**

   - Visita: <https://console.cloud.google.com/>
   - Crea un nuevo proyecto o selecciona uno existente

2. **Habilitar Google+ API**
   - Ve a "APIs & Services" > "Library"
   - Busca "Google+ API" y habilítala

3. **Crear credenciales OAuth**
   - Ve a "APIs & Services" > "Credentials"
   - Clic en "Create Credentials" > "OAuth client ID"
   - Tipo de aplicación: "Web application"
   - **Authorized JavaScript origins:**
     - `http://localhost:8080` (desarrollo)
     - `https://tu-dominio.github.io` (producción)
   - **Authorized redirect URIs:**
     - `http://localhost:8080` (desarrollo)
     - `https://tu-dominio.github.io` (producción)

4. **Actualizar configuración**
   - Copia el Client ID generado
   - Reemplaza en `src/plugins/oauth.js`:

   ```javascript
   clientId: 'TU-GOOGLE-CLIENT-ID.apps.googleusercontent.com'
   ```

### 🔴 Microsoft OAuth (Outlook)

1. **Ir a Azure Portal**
   - Visita: <https://portal.azure.com/>
   - Ve a "Azure Active Directory" > "App registrations"

2. **Registrar nueva aplicación**
   - Clic en "New registration"
   - Nombre: "TaskFlow App"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - **Redirect URI:**
     - Platform: Single-page application (SPA)
     - URL: `http://localhost:8080` (desarrollo)
     - Agrega también: `https://tu-dominio.github.io` (producción)

3. **Configurar permisos API**
   - Ve a "API permissions"
   - Agrega permisos:
     - Microsoft Graph > Delegated permissions
     - `User.Read`, `openid`, `profile`, `email`

4. **Actualizar configuración**
   - Copia el Application (client) ID
   - Reemplaza en `src/plugins/oauth.js`:

   ```javascript
   clientId: 'TU-MICROSOFT-CLIENT-ID'
   ```

## 🚀 Configuración para Desarrollo

Para desarrollo local, actualiza el archivo `src/plugins/oauth.js`:

```javascript
// Configuración de Google OAuth
const googleAuthConfig = {
  clientId: 'tu-google-client-id.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}

// Configuración de Microsoft OAuth
const msalConfig = {
  auth: {
    clientId: 'tu-microsoft-client-id',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: 'http://localhost:8080' // Para desarrollo
  }
}
```

## 🌐 Configuración para Producción

Para producción (GitHub Pages), actualiza las URLs:

```javascript
// Para GitHub Pages
redirectUri: 'https://tu-usuario.github.io/tu-repositorio'
```

Y asegúrate de agregar estas URLs en las configuraciones de Google Cloud Console y Azure Portal.

## ✅ Verificación

1. Los botones de OAuth aparecerán en las páginas de Login y Registro
2. Al hacer clic, se abrirá una ventana emergente de autenticación
3. Después de autenticarse, el usuario será redirigido al dashboard
4. Los datos del usuario se guardarán en localStorage

## 🔒 Seguridad

- Los Client IDs son públicos y es seguro incluirlos en el código frontend
- Los tokens de acceso se manejan automáticamente por las librerías OAuth
- La información del usuario se almacena localmente para esta demo

## 📝 Notas

- Esta implementación es para demostración y desarrollo
- En producción, considera usar un backend para manejar tokens y sesiones
- Los datos se almacenan en localStorage, no son persistentes entre dispositivos
