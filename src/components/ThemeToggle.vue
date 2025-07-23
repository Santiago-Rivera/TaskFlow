<template>
  <div class="theme-settings">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          @click="toggleTheme"
          class="theme-toggle-btn"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon :color="iconColor" size="22" class="theme-icon">
            {{ darkMode ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}
          </v-icon>
        </v-btn>
      </template>
      <span>{{ darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro' }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ThemeToggle',
  computed: {
    ...mapState(['darkMode']),
    iconColor() {
      return this.darkMode ? '#FFB74D' : '#1565C0';
    }
  },
  methods: {
    ...mapMutations(['toggleDarkMode']),
    toggleTheme() {
      this.toggleDarkMode();
      this.$vuetify.theme.dark = this.darkMode;
      
      // Animación suave
      document.body.style.transition = 'background-color 0.3s ease';
    }
  }
};
</script>

<style scoped>
.theme-toggle-btn {
  transition: all 0.3s ease;
  border-radius: 50% !important;
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-icon {
  transition: all 0.5s ease;
}

.theme-toggle-btn:hover .theme-icon {
  transform: rotate(180deg);
}
</style>
