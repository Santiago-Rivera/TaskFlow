<template>
  <v-app :dark="darkMode">
    <div class="loading-container">
      <div class="loading-content">
        <div class="logo-container mb-6">
          <v-icon :color="logoColor" size="64" class="mb-4 pulse">mdi-check-circle</v-icon>
          <h1 class="loading-title">TaskFlow</h1>
        </div>
        
        <v-progress-circular
          :size="50"
          :width="4"
          color="primary"
          indeterminate
          class="mb-4"
        ></v-progress-circular>
        
        <p class="loading-text">Verificando autenticación...</p>
      </div>
    </div>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'LoadingScreen',
  computed: {
    ...mapState(['darkMode']),
    logoColor() {
      return this.darkMode ? '#64B5F6' : '#1565C0';
    }
  },
  mounted() {
    this.$vuetify.theme.dark = this.darkMode;
  }
};
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.theme.v-application.theme--dark .loading-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.loading-content {
  text-align: center;
  padding: 2rem;
}

.loading-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: -1px;
}

.loading-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin: 0;
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.logo-container {
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
