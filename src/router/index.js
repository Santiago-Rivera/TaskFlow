import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

// Importar componentes
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'  // Cambiar para mostrar login como página principal
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
];

const router = new VueRouter({
  mode: 'hash', // Cambiar a hash mode para GitHub Pages
  base: process.env.BASE_URL,
  routes
});

// Guardia de navegación
router.beforeEach(async (to, from, next) => {
  // Verificar autenticación si hay token
  if (store.state.token && !store.state.isAuthenticated) {
    await store.dispatch('checkAuth');
  }
  
  const isAuthenticated = store.getters.isAuthenticated;
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Ruta requiere autenticación
    if (!isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Ruta solo para invitados (login, register)
    if (isAuthenticated) {
      next('/dashboard');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
