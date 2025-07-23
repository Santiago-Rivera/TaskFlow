# 🔐 Configuración Google OAuth - Cuentas Reales

## 📋 **Pasos para Conectar Cuentas Reales de Gmail**

### 1. **Crear Proyecto en Google Cloud Console**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombra tu proyecto: "TaskFlow Gestor Tareas"

### 2. **Habilitar Google+ API**

1. En el menú lateral, ve a **"APIs y servicios"** → **"Biblioteca"**
2. Busca **"Google+ API"** y **"Google Identity"**
3. Haz clic en **"Habilitar"** para ambas APIs

### 3. **Configurar Pantalla de Consentimiento OAuth**

1. Ve a **"APIs y servicios"** → **"Pantalla de consentimiento OAuth"**
2. Selecciona **"Externo"** como tipo de usuario
3. Completa la información requerida:
   - **Nombre de la aplicación**: TaskFlow - Gestor de Tareas
   - **Correo de soporte**: <tu-email@gmail.com>
   - **Logo** (opcional): Puedes subir un logo
   - **Dominios autorizados**: localhost (para desarrollo)

### 4. **Crear Credenciales OAuth 2.0**

1. Ve a **"APIs y servicios"** → **"Credenciales"**
2. Haz clic en **"+ CREAR CREDENCIALES"** → **"ID de cliente de OAuth 2.0"**
3. Selecciona **"Aplicación web"** como tipo
4. Configura:
   - **Nombre**: TaskFlow Web Client
   - **Orígenes de JavaScript autorizados**:
     - `http://localhost:8080`
     - `http://localhost:3000`
     - `http://127.0.0.1:8080`
   - **URI de redirección autorizados**:
     - `http://localhost:8080`
     - `http://localhost:3000`

### 5. **Obtener Client ID**

1. Después de crear las credenciales, copia el **Client ID**
2. Se verá algo así: `1067893001308-xxxxxxxxxx.apps.googleusercontent.com`

### 6. **Actualizar la Configuración**

1. Abre el archivo: `src/plugins/oauth.js`
2. Reemplaza la línea del clientId:

```javascript
// Cambiar esto:
clientId: '1067893001308-your-real-client-id-here.apps.googleusercontent.com',

// Por tu Client ID real:
clientId: 'TU_CLIENT_ID_REAL_AQUÍ.apps.googleusercontent.com',
```

## 🚀 **Cómo Funciona con Cuentas Reales**

### ✅ **Comportamiento Esperado:**

1. **Click en "Continuar con Google"**
2. **Popup de Google** aparece mostrando:
   - Todas las cuentas de Gmail configuradas en el dispositivo
   - Opción "Usar otra cuenta" para añadir nuevas
3. **Selección de cuenta** por parte del usuario
4. **Autorización de permisos** (nombre, email, foto)
5. **Login/Registro automático** en la aplicación
6. **Redirección al dashboard** con datos reales del usuario

### 📱 **Soporte Multi-Dispositivo:**

- **🖥️ Laptop/PC**: Detecta cuentas de Chrome/Edge
- **📱 Móvil**: Integración con app de Gmail instalada
- **📊 Tablet**: Mismo comportamiento que móvil

### 🔐 **Datos Obtenidos:**

- **Email real** del usuario de Gmail
- **Nombre completo** de la cuenta de Google
- **Foto de perfil** (avatar) de Google
- **ID único** de Google para identificación

## ⚡ **Testing Rápido**

### 1. **Modo Desarrollo:**

```bash
npm run serve
```

### 2. **Probar OAuth:**

1. Abre `http://localhost:8080`
2. Ve a Login o Register
3. Haz clic en "Continuar con Google"
4. Verifica que aparece el popup real de Google

### 3. **Verificar Funcionamiento:**

- ✅ Popup se abre correctamente
- ✅ Muestra cuentas del dispositivo
- ✅ Permite seleccionar cuenta
- ✅ Redirige al dashboard con datos reales

## 🛠️ **Solución de Problemas**

### **Error: "redirect_uri_mismatch"**

- Verifica que las URLs en Google Console coincidan exactamente
- Asegúrate de incluir `http://localhost:8080`

### **Error: "popup_closed_by_user"**

- Normal si el usuario cierra el popup
- La aplicación maneja este error automáticamente

### **Error: "access_denied"**

- Usuario negó permisos
- Mensaje de error personalizado se muestra

### **No aparece popup:**

- Verifica que el Client ID sea correcto
- Revisa la consola del navegador para errores
- Asegúrate de que las APIs estén habilitadas

## 🎯 **Estado Actual vs. Configurado**

### ❌ **Antes (Demo):**

- Client ID de demostración
- Datos ficticios generados
- No conexión real a Google

### ✅ **Después (Real):**

- Client ID real de tu proyecto
- Cuentas reales de Gmail del dispositivo
- Autenticación completa con Google OAuth 2.0
- Datos reales del usuario autenticado

## 📞 **Soporte**

Si encuentras problemas:

1. Verifica que el Client ID esté correctamente configurado
2. Revisa que las URLs estén en la lista de orígenes autorizados
3. Asegúrate de que las APIs estén habilitadas en Google Cloud Console

**¡Una vez configurado, los usuarios podrán conectar sus cuentas reales de Gmail con un solo clic!** 🎉
