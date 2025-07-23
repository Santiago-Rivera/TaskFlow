# Funcionamiento de OAuth - Demostración

## 🎯 Funcionalidad Implementada

### ✅ Botón de Google (Gmail)

**Al hacer clic:**

1. **Modo Demostración** (actual):
   - Simula el proceso de autenticación de Google
   - Crea un usuario demo con datos ficticios
   - Muestra notificación de éxito
   - Redirige al dashboard

2. **Modo Producción** (con credenciales reales):
   - Abre ventana popup de Google OAuth
   - Usuario se autentica con su cuenta real de Gmail
   - Obtiene datos reales del perfil
   - Guarda la sesión y redirige

### ✅ Botón de Microsoft (Outlook)

**Al hacer clic:**

1. **Modo Demostración** (actual):
   - Simula el proceso de autenticación de Microsoft
   - Crea un usuario demo con datos de Outlook ficticios
   - Muestra notificación de éxito
   - Redirige al dashboard

2. **Modo Producción** (con credenciales reales):
   - Abre ventana popup de Microsoft OAuth
   - Usuario se autentica con su cuenta de Outlook/Microsoft
   - Obtiene datos reales del perfil
   - Guarda la sesión y redirige

## 🔄 Flujo de Autenticación

### Login y Registro

1. **Usuario hace clic en botón OAuth**
2. **Se muestra estado de carga** (spinner en el botón)
3. **Proceso de autenticación**:
   - Google: Datos del perfil de Gmail
   - Microsoft: Datos del perfil de Outlook
4. **Creación/Login automático**:
   - Si es usuario nuevo: se registra automáticamente
   - Si existe: inicia sesión
5. **Notificación de éxito**
6. **Redirección al dashboard**

## 📱 Datos Que Se Obtienen

### Google OAuth

- **ID único**: Identificador de Google
- **Email**: Dirección de Gmail
- **Nombre**: Nombre completo del perfil
- **Avatar**: Foto de perfil de Google

### Microsoft OAuth

- **ID único**: Identificador de Microsoft
- **Email**: Dirección de Outlook/Hotmail
- **Nombre**: Nombre completo del perfil
- **Avatar**: Por defecto null (Microsoft no siempre proporciona foto)

## 🎮 Cómo Probar

### En Modo Demostración (Actual)

1. Abrir la aplicación
2. Ir a Login o Registro
3. Hacer clic en "Continuar con Google" o "Continuar con Outlook"
4. Ver el proceso simulado (2 segundos de carga)
5. Observar la notificación de éxito
6. Verificar la redirección al dashboard

### Para Habilitar Modo Real

1. Configurar credenciales en Google Cloud Console
2. Configurar credenciales en Azure Portal
3. Actualizar los Client IDs en `src/plugins/oauth.js`
4. Cambiar `demoMode = false` en `google-auth-demo.js`

## 🔧 Estados de Carga

- **Google Loading**: Spinner azul en botón de Google
- **Microsoft Loading**: Spinner azul en botón de Microsoft
- **Estados independientes**: Cada botón maneja su propio estado
- **Botones deshabilitados**: Durante el proceso de carga

## ✨ Características Especiales

1. **Fallback Robusto**: Si las librerías reales fallan, usa demostración
2. **Mensajes de Éxito**: Notificaciones personalizadas por proveedor
3. **Manejo de Errores**: Mensajes claros si algo falla
4. **Compatibilidad**: Funciona tanto en Login como en Registro
5. **Persistencia**: Los datos se guardan en localStorage
6. **Experiencia Unificada**: Misma UX que el login tradicional

## 🎯 Resultado Final

Después de la autenticación OAuth exitosa:

- Usuario autenticado en la aplicación
- Datos del perfil guardados
- Sesión activa
- Acceso completo a todas las funcionalidades de TaskFlow
- Avatar y nombre mostrados en la interfaz
