import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

// Simulador de API para desarrollo
// const API_BASE = 'http://localhost:3001/api'; // Cambiar por tu API real en producción

// Función para cargar usuarios del localStorage
function loadUsersFromStorage() {
  const storedUsers = localStorage.getItem('registeredUsers');
  const defaultUsers = [
    { id: 1, email: 'admin@taskflow.com', password: '123456', name: 'Administrador' },
    { id: 2, email: 'user@taskflow.com', password: '123456', name: 'Usuario Demo' }
  ];
  
  if (storedUsers) {
    const parsedUsers = JSON.parse(storedUsers);
    // Combinar usuarios por defecto con usuarios registrados, evitando duplicados
    const allUsers = [...defaultUsers];
    parsedUsers.forEach(user => {
      if (!allUsers.find(u => u.email === user.email)) {
        allUsers.push(user);
      }
    });
    return allUsers;
  }
  
  return defaultUsers;
}

// Función para guardar usuarios en localStorage
function saveUsersToStorage(users) {
  // Solo guardar usuarios que no sean los de demo
  const usersToSave = users.filter(user => 
    user.email !== 'admin@taskflow.com' && 
    user.email !== 'user@taskflow.com'
  );
  localStorage.setItem('registeredUsers', JSON.stringify(usersToSave));
}

// Cargar usuarios al inicializar
let mockUsers = loadUsersFromStorage();

export default new Vuex.Store({
  state: {
    // Estado de tareas por usuario
    tasks: [],
    completedTasks: [],
    filter: "",
    loading: false,
    notify: null,
    tasksDeleted: 0,
    darkMode: localStorage.getItem('darkMode') === 'true' || false,
    
    // Estado de grupos
    groups: [],
    
    // Estado de autenticación
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    authLoading: false,
    authError: null,
  },
  mutations: {
    // Mutaciones de tareas
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    setCompletedTasks(state, tasks) {
      state.completedTasks = tasks;
    },
    moveTaskToCompleted(state, taskIndex) {
      const task = state.tasks[taskIndex];
      if (task) {
        // Marcar como completada y agregar timestamp
        task.completed = true;
        task.completedAt = new Date().toISOString();
        state.completedTasks.push(task);
        state.tasks.splice(taskIndex, 1);
        state.notify = "complete";
        
        // Actualizar localStorage
        if (state.user) {
          localStorage.setItem(`tasks_${state.user.id}`, JSON.stringify(state.tasks));
          localStorage.setItem(`completedTasks_${state.user.id}`, JSON.stringify(state.completedTasks));
        }
      }
    },
    removeFromCompleted(state, taskIndex) {
      state.completedTasks.splice(taskIndex, 1);
      state.notify = "deleteCompleted";
      
      // Actualizar localStorage
      if (state.user) {
        localStorage.setItem(`completedTasks_${state.user.id}`, JSON.stringify(state.completedTasks));
      }
    },
    clearCompletedHistory(state) {
      state.completedTasks = [];
      state.notify = "clearHistory";
      
      // Actualizar localStorage
      if (state.user) {
        localStorage.setItem(`completedTasks_${state.user.id}`, JSON.stringify([]));
      }
    },
    setTask(state, task) {
      // Convertir string a objeto si es necesario
      const taskObject = typeof task === 'string' ? {
        text: task,
        completed: false,
        important: false,
        addToDay: false,
        dueDate: null,
        repeat: null,
        category: null,
        attachments: [],
        notes: '',
        reminder: null,
        createdAt: new Date().toISOString()
      } : task;
      
      state.tasks.push(taskObject);
      state.notify = "add";
      // Guardar tareas del usuario actual
      if (state.user) {
        const userTasks = JSON.parse(localStorage.getItem(`tasks_${state.user.id}`) || '[]');
        userTasks.push(taskObject);
        localStorage.setItem(`tasks_${state.user.id}`, JSON.stringify(userTasks));
      }
    },
    removeTask(state, index) {
      state.tasks.splice(index, 1);
      state.tasksDeleted++;
      state.notify = "delete";
      // Actualizar localStorage
      if (state.user) {
        localStorage.setItem(`tasks_${state.user.id}`, JSON.stringify(state.tasks));
        localStorage.setItem(`tasksDeleted_${state.user.id}`, state.tasksDeleted.toString());
      }
    },
    updateTask(state, { index, task }) {
      // Asegurar que la tarea sea un objeto
      const taskObject = typeof task === 'string' ? {
        text: task,
        completed: state.tasks[index]?.completed || false,
        important: state.tasks[index]?.important || false,
        addToDay: state.tasks[index]?.addToDay || false,
        dueDate: state.tasks[index]?.dueDate || null,
        repeat: state.tasks[index]?.repeat || null,
        category: state.tasks[index]?.category || null,
        attachments: state.tasks[index]?.attachments || [],
        notes: state.tasks[index]?.notes || '',
        reminder: state.tasks[index]?.reminder || null,
        createdAt: state.tasks[index]?.createdAt || new Date().toISOString()
      } : task;
      
      Vue.set(state.tasks, index, taskObject);
      state.notify = "update";
      // Actualizar localStorage
      if (state.user) {
        localStorage.setItem(`tasks_${state.user.id}`, JSON.stringify(state.tasks));
      }
    },
    setFilter(state, value) {
      state.filter = value;
    },
    setLoading(state, value) {
      state.loading = value;
    },
    setNotify(state, val) {
      state.notify = val;
    },
    setTasksDeleted(state, count) {
      state.tasksDeleted = count;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode.toString());
    },
    setDarkMode(state, value) {
      state.darkMode = value;
      localStorage.setItem('darkMode', value.toString());
    },
    
    // Mutaciones de autenticación
    setAuthLoading(state, loading) {
      state.authLoading = loading;
    },
    setAuthError(state, error) {
      state.authError = error;
    },
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
      
      // Cargar tareas del usuario cuando se autentica
      if (user) {
        const userTasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]');
        const userCompletedTasks = JSON.parse(localStorage.getItem(`completedTasks_${user.id}`) || '[]');
        const userGroups = JSON.parse(localStorage.getItem(`groups_${user.id}`) || '[]');
        const userTasksDeleted = parseInt(localStorage.getItem(`tasksDeleted_${user.id}`) || '0');
        state.tasks = userTasks;
        state.completedTasks = userCompletedTasks;
        state.groups = userGroups;
        state.tasksDeleted = userTasksDeleted;
      } else {
        // Limpiar tareas al cerrar sesión
        state.tasks = [];
        state.completedTasks = [];
        state.groups = [];
        state.tasksDeleted = 0;
      }
    },
    setToken(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    },
    updateUserName(state, newName) {
      if (state.user) {
        state.user.name = newName;
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.tasks = [];
      state.completedTasks = [];
      state.groups = [];
      state.tasksDeleted = 0;
      state.filter = "";
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
    
    // Mutaciones de grupos
    setGroups(state, groups) {
      state.groups = groups;
    },
    addGroup(state, group) {
      state.groups.push(group);
      // Actualizar localStorage
      if (state.user) {
        localStorage.setItem(`groups_${state.user.id}`, JSON.stringify(state.groups));
      }
    },
    updateGroup(state, updatedGroup) {
      const index = state.groups.findIndex(g => g.id === updatedGroup.id);
      if (index !== -1) {
        Vue.set(state.groups, index, updatedGroup);
        // Actualizar localStorage
        if (state.user) {
          localStorage.setItem(`groups_${state.user.id}`, JSON.stringify(state.groups));
        }
      }
    },
    removeGroup(state, groupId) {
      const index = state.groups.findIndex(g => g.id === groupId);
      if (index !== -1) {
        state.groups.splice(index, 1);
        // También remover la asignación de grupo de las tareas
        state.tasks.forEach(task => {
          if (task.groupId === groupId) {
            delete task.groupId;
            delete task.assignedTo;
          }
        });
        // Actualizar localStorage
        if (state.user) {
          localStorage.setItem(`groups_${state.user.id}`, JSON.stringify(state.groups));
          localStorage.setItem(`tasks_${state.user.id}`, JSON.stringify(state.tasks));
        }
      }
    },
  },
  actions: {
    // Acciones de tareas
    getTasks({ commit, state }) {
      commit("setLoading", true);
      
      // Simulación de carga de datos
      setTimeout(() => {
        if (state.user) {
          // Cargar tareas del usuario desde localStorage
          const userTasks = JSON.parse(localStorage.getItem(`tasks_${state.user.id}`) || '[]');
          commit("setTasks", userTasks);
        } else {
          // Si no hay usuario, no cargar tareas
          commit("setTasks", []);
        }
        commit("setLoading", false);
      }, 800);
    },
    
    // Acción para usuarios demo (solo para cuentas predefinidas)
    loadDemoTasks({ commit, state }) {
      if (state.user && state.user.email === 'admin@taskflow.com') {
        // Solo el admin tiene tareas demo
        const demoTasks = [
          "Revisar reportes del sistema",
          "Configurar nuevos usuarios",
          "Actualizar documentación"
        ];
        commit("setTasks", demoTasks);
        localStorage.setItem(`tasks_${state.user.id}`, JSON.stringify(demoTasks));
      } else if (state.user && state.user.email === 'user@taskflow.com') {
        // Usuario demo tiene tareas básicas
        const demoTasks = [
          "Completar perfil",
          "Explorar funcionalidades"
        ];
        commit("setTasks", demoTasks);
        localStorage.setItem(`tasks_${state.user.id}`, JSON.stringify(demoTasks));
      }
    },
    
    // Acciones de autenticación
    async login({ commit, dispatch }, { email, password }) {
      commit('setAuthLoading', true);
      commit('setAuthError', null);
      
      try {
        // Simulación de API - En producción, hacer llamada real
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Recargar usuarios del localStorage para asegurar datos actualizados
        mockUsers = loadUsersFromStorage();
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Credenciales incorrectas');
        }
        
        // Generar token simulado (en producción viene del servidor)
        const token = btoa(JSON.stringify({ 
          id: user.id, 
          email: user.email, 
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        }));
        
        commit('setToken', token);
        commit('setUser', { id: user.id, email: user.email, name: user.name });
        
        // Cargar tareas demo solo si es primera vez para cuentas predefinidas
        const hasExistingTasks = localStorage.getItem(`tasks_${user.id}`);
        if (!hasExistingTasks && (user.email === 'admin@taskflow.com' || user.email === 'user@taskflow.com')) {
          dispatch('loadDemoTasks');
        }
        
        commit('setAuthLoading', false);
        
        return { success: true };
      } catch (error) {
        commit('setAuthError', error.message);
        commit('setAuthLoading', false);
        throw error;
      }
    },
    
    async register({ commit }, { name, email, password }) {
      commit('setAuthLoading', true);
      commit('setAuthError', null);
      
      try {
        // Simulación de API - En producción, hacer llamada real
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Recargar usuarios del localStorage para verificación actualizada
        mockUsers = loadUsersFromStorage();
        
        // Verificar si el email ya existe
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
          throw new Error('El email ya está registrado');
        }
        
        // Crear nuevo usuario (en producción se envía al servidor)
        const newUser = {
          id: Date.now(), // ID único basado en timestamp
          email,
          password,
          name
        };
        
        // Agregar usuario al array y guardar en localStorage
        mockUsers.push(newUser);
        saveUsersToStorage(mockUsers);
        
        // Generar token
        const token = btoa(JSON.stringify({ 
          id: newUser.id, 
          email: newUser.email, 
          exp: Date.now() + (24 * 60 * 60 * 1000)
        }));
        
        commit('setToken', token);
        commit('setUser', { id: newUser.id, email: newUser.email, name: newUser.name });
        
        // Inicializar datos del nuevo usuario con arrays vacíos
        localStorage.setItem(`tasks_${newUser.id}`, JSON.stringify([]));
        localStorage.setItem(`completedTasks_${newUser.id}`, JSON.stringify([]));
        localStorage.setItem(`tasksDeleted_${newUser.id}`, '0');
        
        commit('setAuthLoading', false);
        
        return { success: true };
      } catch (error) {
        commit('setAuthError', error.message);
        commit('setAuthLoading', false);
        throw error;
      }
    },
    
    async loginWithOAuth({ commit }, { provider, id, email, name, avatar }) {
      commit('setAuthLoading', true);
      commit('setAuthError', null);
      
      try {
        // Simulación de procesamiento OAuth
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Recargar usuarios del localStorage
        mockUsers = loadUsersFromStorage();
        
        // Buscar usuario existente por email o por ID del proveedor
        let existingUser = mockUsers.find(u => 
          u.email === email || 
          (u.oauthProviders && u.oauthProviders[provider] === id)
        );
        
        if (!existingUser) {
          // Crear nuevo usuario desde OAuth
          existingUser = {
            id: Date.now(),
            email,
            name,
            avatar,
            oauthProviders: {
              [provider]: id
            },
            createdWithOAuth: true
          };
          
          mockUsers.push(existingUser);
          saveUsersToStorage(mockUsers);
          
          // Inicializar datos del nuevo usuario
          localStorage.setItem(`tasks_${existingUser.id}`, JSON.stringify([]));
          localStorage.setItem(`completedTasks_${existingUser.id}`, JSON.stringify([]));
          localStorage.setItem(`tasksDeleted_${existingUser.id}`, '0');
        } else {
          // Usuario existente - actualizar información OAuth
          if (!existingUser.oauthProviders) {
            existingUser.oauthProviders = {};
          }
          existingUser.oauthProviders[provider] = id;
          
          // Actualizar avatar y nombre si no los tiene
          if (avatar && !existingUser.avatar) {
            existingUser.avatar = avatar;
          }
          if (name && (!existingUser.name || existingUser.name.trim() === '')) {
            existingUser.name = name;
          }
          
          saveUsersToStorage(mockUsers);
        }
        
        // Generar token
        const token = btoa(JSON.stringify({ 
          id: existingUser.id, 
          email: existingUser.email, 
          exp: Date.now() + (24 * 60 * 60 * 1000)
        }));
        
        commit('setToken', token);
        commit('setUser', { 
          id: existingUser.id, 
          email: existingUser.email, 
          name: existingUser.name,
          avatar: existingUser.avatar,
          oauthProviders: existingUser.oauthProviders
        });
        
        commit('setAuthLoading', false);
        
        return { success: true };
      } catch (error) {
        commit('setAuthError', error.message || 'Error de autenticación OAuth');
        commit('setAuthLoading', false);
        throw error;
      }
    },
    
    async checkAuth({ commit, state }) {
      if (state.token) {
        try {
          // Verificar si el token es válido
          const decoded = JSON.parse(atob(state.token));
          if (decoded.exp > Date.now()) {
            commit('setUser', { 
              id: decoded.id, 
              email: decoded.email, 
              name: decoded.name || 'Usuario' 
            });
            axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          } else {
            commit('logout');
          }
        } catch (error) {
          commit('logout');
        }
      }
    },
    
    logout({ commit }) {
      commit('logout');
    }
  },
  getters: {
    getTasksFilter(state) {
      let reg = new RegExp(state.filter, "i");
      return state.tasks.filter((task) => {
        const taskText = typeof task === 'string' ? task : task.text;
        return reg.test(taskText);
      });
    },
    getCompletedTasks(state) {
      return state.completedTasks;
    },
    getCompletedTasksFilter(state) {
      let reg = new RegExp(state.filter, "i");
      return state.completedTasks.filter((task) => {
        const taskText = typeof task === 'string' ? task : task.text;
        return reg.test(taskText);
      });
    },
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    currentUser(state) {
      return state.user;
    },
    allRegisteredUsers() {
      return loadUsersFromStorage();
    }
  }
});
