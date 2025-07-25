# 🎯 TaskFlow - Gestor de Tareas Avanzado

![TaskFlow](https://img.shields.io/badge/TaskFlow-1.0.0-blue.svg)
![Vue.js](https://img.shields.io/badge/Vue.js-2.6.11-green.svg)
![Vuetify](https://img.shields.io/badge/Vuetify-2.6.10-purple.svg)

_Gestor de tareas profesional desarrollado en VueJS con autenticación OAuth, diseño moderno y alto rendimiento._

## 🚀 Despliegue Rápido

### Script de Despliegue Automático (Windows)

```cmd
build-deploy.bat
```

### Comandos Manuales

```bash
# Instalar dependencias
npm install

# Build para producción
npm run build:prod

# Previsualizar localmente
npm run build:preview

# Desplegar en GitHub Pages
npm run deploy
```

## 🌐 Configuración de Despliegue

### ⚙️ vue.config.js - Configuración Completa

La configuración está optimizada para:

- ✅ **GitHub Pages**: Rutas automáticas `/VueJS-Gestor-Tareas/`
- ✅ **Optimización de Bundle**: Code splitting inteligente
- ✅ **Cache Strategy**: Hash de archivos para cache eficiente
- ✅ **SEO Ready**: Meta tags y título configurables
- ✅ **Performance**: Preload/prefetch automático

### 📁 Estructura de Rutas para Despliegue

- **Página Principal**: `/login` - Pantalla de autenticación (como en la imagen)
- **Dashboard**: `/dashboard` - Panel principal (requiere auth)
- **Registro**: `/register` - Creación de cuentas

### 🔧 Variables de Entorno

**Desarrollo (`.env`)**:

```env
VUE_APP_NAME=TaskFlow
VUE_APP_BASE_URL=/
VUE_APP_DEV_MODE=true
```

**Producción (`.env.production`)**:

```env
VUE_APP_NAME=TaskFlow
VUE_APP_BASE_URL=/VueJS-Gestor-Tareas/
VUE_APP_DEV_MODE=false
```

## ✨ Características Principales

### 🔐 Sistema de Autenticación

- **Login y Registro**:

Sistema completo de autenticación con JWT

- **Usuarios Persistentes**: Los usuarios registrados se guardan en localStorage
- **Cuentas Demo**: Incluye cuentas de demostración con tareas pre-cargadas
- **Protección de Rutas**: Navegación protegida que requiere autenticación

### 📋 Gestión de Tareas

- **CRUD Completo**: Agregar, ver, editar y eliminar tareas
- **Filtrado Inteligente**: Buscar tareas por texto
- **Validación Mejorada**: Campos con validación en tiempo real
- **Persistencia por Usuario**: Cada usuario tiene sus propias tareas aisladas

### 🎨 Interfaz y Experiencia

- **Diseño Profesional**: Interfaz moderna y minimalista
- **Modo Oscuro/Claro**: Toggle entre temas con persistencia
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Animaciones Suaves**: Transiciones y efectos visuales

### ⚙️ Configuraciones de Usuario

- **Perfil Personalizable**: Editar información personal
- **Preferencias**: Configurar tema, notificaciones y tareas por página
- **Estadísticas**: Visualizar métricas de tareas completadas/eliminadas
- **Seguridad**: Cambio de contraseña y eliminación de cuenta

### 📊 Métricas y Estadísticas

- **Historial Completo**: Visualizar todas las tareas del usuario
- **Contadores**: Tareas completadas, pendientes y eliminadas
- **Persistencia**: Estadísticas guardadas por usuario

## 🛠️ Stack Tecnológico

_Esta aplicación está desarrollada con:_

- **VueJS 2.6.11** - Framework principal

- **Vuex 3.3.0** - Gestión de estado

- **Vuetify 2.6.10** - Framework de UI Material Design

- **Vue Router 3.0.0** - Enrutamiento SPA

- **Axios** - Cliente HTTP

- **JWT Decode** - Manejo de tokens JWT

- **LocalStorage** - Persistencia de datos

## 🚀 Setup e Instalación

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Instalación

1. **Instalar dependencias:**

npm install

1. **Correr el proyecto en desarrollo:**

bash
npm run serve

1. **Abrir en el navegador:**

<http://localhost:8080>

### Scripts Disponibles

```bash
# Desarrollo
npm run serve

# Compilar para producción
npm run build

# Linter
npm run lint
```

## 🔧 Configuración

### Variables de Entorno

La aplicación utiliza `NODE_OPTIONS=--openssl-legacy-provider` para compatibilidad con Node.js v17+.

### Cuentas Demo

El sistema incluye dos cuentas de demostración:

- **Admin**: `admin@taskflow.com` / `123456`
- **Usuario**: `user@taskflow.com` / `123456`

## 📱 Funcionalidades Implementadas

### Autenticación

- [x] Sistema de login/registro
- [x] Validación de formularios
- [x] Tokens JWT simulados
- [x] Persistencia de sesión
- [x] Logout con confirmación

### Gestión de Tareas

- [x] Crear tareas con validación
- [x] Editar tareas inline
- [x] Eliminar con confirmación
- [x] Marcar como completadas
- [x] Filtrado en tiempo real
- [x] Aislamiento por usuario

### Interfaz de Usuario

- [x] Diseño responsive
- [x] Modo oscuro/claro
- [x] Animaciones y transiciones
- [x] Notificaciones (snackbars)
- [x] Iconografía Material Design

### Configuraciones

- [x] Panel de configuraciones de usuario
- [x] Edición de perfil
- [x] Estadísticas personales
- [x] Cambio de contraseña
- [x] Eliminación de cuenta

## 🗂️ Estructura del Proyecto

src/
├── components/
│   ├── FilterTask.vue      # Filtrado de tareas
│   ├── NewTask.vue         # Formulario nueva tarea
│   ├── ShowTasks.vue       # Lista de tareas
│   ├── SnackbarTask.vue    # Notificaciones
│   ├── Tasks.vue           # Componente principal tareas
│   ├── ThemeToggle.vue     # Toggle tema oscuro/claro
│   └── UserSettings.vue    # Panel configuraciones usuario
├── views/
│   ├── Dashboard.vue       # Panel principal
│   ├── Login.vue          # Pantalla de login
│   └── Register.vue       # Pantalla de registro
├── router/
│   └── index.js           # Configuración de rutas
├── store/
│   └── index.js           # Estado global (Vuex)
├── plugins/
│   └── vuetify.js         # Configuración Vuetify
└── assets/
    └── image.png          # Recursos estáticos

## 💾 Gestión de Datos

### LocalStorage

La aplicación utiliza localStorage para:

- Tokens de autenticación
- Usuarios registrados
- Tareas por usuario
- Preferencias de tema
- Estadísticas personales

### Aislamiento de Usuarios

- Cada usuario tiene su propio espacio de datos
- Claves de localStorage con formato: `tasks_${userId}`, `tasksDeleted_${userId}`
- Prevención de cross-contamination entre usuarios

## 🔮 Futuras Mejoras

- [ ] API backend real
- [ ] Base de datos persistente
- [ ] Notificaciones push
- [ ] Colaboración entre usuarios
- [ ] Exportar/importar tareas
- [ ] Categorías y etiquetas
- [ ] Fechas de vencimiento
- [ ] Prioridades de tareas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Equipo de Vue.js por el excelente framework
- Vuetify por los componentes Material Design
- Comunidad open source por la inspiración

---

**¿Encontraste un bug o tienes una sugerencia? ¡Abre un issue!** �
