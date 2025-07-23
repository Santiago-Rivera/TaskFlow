<template>
  <v-app :dark="darkMode">
    <div class="auth-container">
      <div class="auth-background"></div>
      
      <v-container fluid class="auth-content">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <v-card class="auth-card" elevation="12">
              <v-card-text class="pa-8">
                <!-- Logo y título -->
                <div class="text-center mb-6">
                  <div class="logo-container">
                    <v-icon :color="logoColor" size="48" class="mb-4">mdi-check-circle</v-icon>
                    <h1 class="auth-title">TaskFlow</h1>
                    <p class="auth-subtitle">Crea tu cuenta nueva</p>
                  </div>
                </div>

                <!-- Formulario de registro -->
                <v-form ref="form" v-model="valid" @submit.prevent="handleRegister">
                  <v-text-field
                    v-model="name"
                    label="Nombre completo"
                    outlined
                    color="primary"
                    class="auth-input"
                    :rules="nameRules"
                    prepend-inner-icon="mdi-account-outline"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="email"
                    label="Correo electrónico"
                    type="email"
                    outlined
                    color="primary"
                    class="auth-input"
                    :rules="emailRules"
                    prepend-inner-icon="mdi-email-outline"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    label="Contraseña"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    color="primary"
                    class="auth-input"
                    :rules="passwordRules"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirmar contraseña"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    outlined
                    color="primary"
                    class="auth-input"
                    :rules="confirmPasswordRules"
                    prepend-inner-icon="mdi-lock-check-outline"
                    :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showConfirmPassword = !showConfirmPassword"
                    required
                  ></v-text-field>

                  <!-- Términos y condiciones -->
                  <v-checkbox
                    v-model="acceptTerms"
                    color="primary"
                    class="mt-2 mb-4"
                    :rules="[v => !!v || 'Debes aceptar los términos y condiciones']"
                  >
                    <template v-slot:label>
                      <span class="terms-text">
                        Acepto los 
                        <a href="#" class="auth-link" @click.prevent="">términos y condiciones</a>
                      </span>
                    </template>
                  </v-checkbox>

                  <!-- Error message -->
                  <v-alert
                    v-if="authError"
                    type="error"
                    outlined
                    dense
                    class="mb-4"
                  >
                    {{ authError }}
                  </v-alert>

                  <!-- Botón de registro -->
                  <v-btn
                    type="submit"
                    :loading="authLoading"
                    :disabled="!valid"
                    color="primary"
                    large
                    block
                    depressed
                    class="auth-btn mb-4"
                  >
                    <v-icon left>mdi-account-plus</v-icon>
                    Crear Cuenta
                  </v-btn>

                  <!-- Link a login -->
                  <div class="text-center">
                    <p class="mb-0">
                      ¿Ya tienes cuenta? 
                      <router-link :to="{ name: 'Login' }" class="auth-link">
                        Inicia sesión aquí
                      </router-link>
                    </p>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Toggle de tema -->
      <div class="theme-toggle-wrapper">
        <ThemeToggle />
      </div>
    </div>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ThemeToggle from '../components/ThemeToggle.vue';

export default {
  name: 'RegisterView',
  components: {
    ThemeToggle
  },
  data() {
    return {
      valid: false,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      acceptTerms: false,
      nameRules: [
        v => !!v || 'El nombre es requerido',
        v => v.length >= 2 || 'El nombre debe tener al menos 2 caracteres',
      ],
      emailRules: [
        v => !!v || 'El correo es requerido',
        v => /.+@.+\..+/.test(v) || 'El correo debe ser válido',
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida',
        v => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
      ],
      confirmPasswordRules: [
        v => !!v || 'Confirma tu contraseña',
        v => v === this.password || 'Las contraseñas no coinciden',
      ],
    };
  },
  computed: {
    ...mapState(['authLoading', 'authError', 'darkMode']),
    logoColor() {
      return this.darkMode ? '#64B5F6' : '#1565C0';
    }
  },
  methods: {
    ...mapActions(['register']),
    async handleRegister() {
      if (this.$refs.form.validate()) {
        try {
          await this.register({
            name: this.name,
            email: this.email,
            password: this.password
          });
          this.$router.push('/dashboard');
        } catch (error) {
          // Error ya manejado en el store
        }
      }
    }
  },
  mounted() {
    // Aplicar tema
    this.$vuetify.theme.dark = this.darkMode;
  }
};
</script>

<style scoped>
.auth-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  z-index: 0;
}

.theme.v-application.theme--dark .auth-background {
  background: linear-gradient(135deg, #2c1810 0%, #1e3c72 100%);
}

.auth-content {
  position: relative;
  z-index: 1;
}

.auth-card {
  border-radius: 16px !important;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.theme.v-application.theme--dark .auth-card {
  background: rgba(45, 45, 45, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  animation: fadeInDown 0.8s ease-out;
}

.auth-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--v-primary-base);
  margin: 0;
  letter-spacing: -1px;
}

.auth-subtitle {
  font-size: 16px;
  color: var(--v-textSecondary-base);
  margin: 8px 0 0 0;
}

.auth-input {
  margin-bottom: 8px;
}

.auth-input >>> .v-input__slot {
  border-radius: 12px !important;
}

.auth-btn {
  border-radius: 12px !important;
  font-weight: 600;
  text-transform: none;
  font-size: 16px;
  height: 48px;
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-secondary-base)) !important;
}

.auth-link {
  color: var(--v-primary-base);
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}

.terms-text {
  font-size: 14px;
  color: var(--v-textSecondary-base);
}

.theme-toggle-wrapper {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10;
}

/* Animaciones */
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

.auth-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
