<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card class="settings-card">
      <v-card-title class="settings-header">
        <v-icon color="primary" class="mr-3" size="28">mdi-cog</v-icon>
        <span class="headline">Configuraciones de Usuario</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-6">
        <v-container>
          <!-- Información Personal -->
          <v-row>
            <v-col cols="12">
              <h3 class="section-title mb-4">
                <v-icon class="mr-2" color="primary">mdi-account</v-icon>
                Información Personal
              </h3>
              
              <v-text-field
                v-model="userSettings.name"
                label="Nombre"
                prepend-icon="mdi-account-circle"
                :rules="nameRules"
                outlined
                dense
                class="mb-2"
              ></v-text-field>
              
              <v-text-field
                v-model="userSettings.email"
                label="Email"
                prepend-icon="mdi-email"
                :rules="emailRules"
                outlined
                dense
                disabled
                hint="El email no se puede modificar"
                persistent-hint
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <!-- Preferencias de Aplicación -->
          <v-row>
            <v-col cols="12">
              <h3 class="section-title mb-4">
                <v-icon class="mr-2" color="primary">mdi-palette</v-icon>
                Preferencias de Aplicación
              </h3>
              
              <v-row>
                <v-col cols="12" md="6">
                  <v-switch
                    v-model="userSettings.darkMode"
                    label="Modo Oscuro"
                    prepend-icon="mdi-brightness-4"
                    color="primary"
                    @change="updateTheme"
                  ></v-switch>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-switch
                    v-model="userSettings.notifications"
                    label="Notificaciones"
                    prepend-icon="mdi-bell"
                    color="primary"
                  ></v-switch>
                </v-col>
              </v-row>

              <v-select
                v-model="userSettings.tasksPerPage"
                :items="tasksPerPageOptions"
                label="Tareas por página"
                prepend-icon="mdi-view-list"
                outlined
                dense
              ></v-select>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <!-- Estadísticas del Usuario -->
          <v-row>
            <v-col cols="12">
              <h3 class="section-title mb-4">
                <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
                Estadísticas
              </h3>
              
              <v-row>
                <v-col cols="6" md="3">
                  <v-card class="stats-card text-center pa-3" outlined>
                    <v-icon color="success" size="24" class="mb-2">mdi-check-circle</v-icon>
                    <div class="stats-number">{{ userStats.completedTasks }}</div>
                    <div class="stats-label">Completadas</div>
                  </v-card>
                </v-col>
                
                <v-col cols="6" md="3">
                  <v-card class="stats-card text-center pa-3" outlined>
                    <v-icon color="warning" size="24" class="mb-2">mdi-clock</v-icon>
                    <div class="stats-number">{{ userStats.pendingTasks }}</div>
                    <div class="stats-label">Pendientes</div>
                  </v-card>
                </v-col>
                
                <v-col cols="6" md="3">
                  <v-card class="stats-card text-center pa-3" outlined>
                    <v-icon color="error" size="24" class="mb-2">mdi-delete</v-icon>
                    <div class="stats-number">{{ userStats.deletedTasks }}</div>
                    <div class="stats-label">Eliminadas</div>
                  </v-card>
                </v-col>
                
                <v-col cols="6" md="3">
                  <v-card class="stats-card text-center pa-3" outlined>
                    <v-icon color="info" size="24" class="mb-2">mdi-format-list-checks</v-icon>
                    <div class="stats-number">{{ userStats.totalTasks }}</div>
                    <div class="stats-label">Total</div>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <!-- Cambio de Contraseña -->
          <v-row>
            <v-col cols="12">
              <h3 class="section-title mb-4">
                <v-icon class="mr-2" color="primary">mdi-lock</v-icon>
                Seguridad
              </h3>
              
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <v-icon class="mr-2">mdi-key-change</v-icon>
                    Cambiar Contraseña
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-text-field
                      v-model="passwordData.current"
                      label="Contraseña Actual"
                      type="password"
                      prepend-icon="mdi-lock"
                      outlined
                      dense
                      class="mb-2"
                    ></v-text-field>
                    
                    <v-text-field
                      v-model="passwordData.new"
                      label="Nueva Contraseña"
                      type="password"
                      prepend-icon="mdi-lock-plus"
                      outlined
                      dense
                      class="mb-2"
                    ></v-text-field>
                    
                    <v-text-field
                      v-model="passwordData.confirm"
                      label="Confirmar Nueva Contraseña"
                      type="password"
                      prepend-icon="mdi-lock-check"
                      outlined
                      dense
                      class="mb-3"
                    ></v-text-field>
                    
                    <v-btn
                      color="primary"
                      @click="changePassword"
                      :disabled="!isPasswordValid"
                      small
                    >
                      <v-icon left small>mdi-content-save</v-icon>
                      Cambiar Contraseña
                    </v-btn>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="px-6 py-4">
        <v-btn
          color="error"
          outlined
          @click="confirmDeleteAccount"
        >
          <v-icon left>mdi-account-remove</v-icon>
          Eliminar Cuenta
        </v-btn>
        
        <v-spacer></v-spacer>
        
        <v-btn
          text
          @click="closeDialog"
        >
          Cancelar
        </v-btn>
        
        <v-btn
          color="primary"
          @click="saveSettings"
          :loading="saving"
        >
          <v-icon left>mdi-content-save</v-icon>
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Dialog de confirmación para eliminar cuenta -->
    <v-dialog v-model="deleteAccountDialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="headline error--text">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Eliminar Cuenta
        </v-card-title>
        <v-card-text>
          <p>¿Estás seguro de que quieres eliminar tu cuenta?</p>
          <p class="font-weight-bold error--text">Esta acción no se puede deshacer y perderás todas tus tareas.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteAccountDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteAccount">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'UserSettings',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      saving: false,
      deleteAccountDialog: false,
      userSettings: {
        name: '',
        email: '',
        darkMode: false,
        notifications: true,
        tasksPerPage: 10
      },
      passwordData: {
        current: '',
        new: '',
        confirm: ''
      },
      nameRules: [
        v => !!v || 'El nombre es requerido',
        v => v.length >= 2 || 'El nombre debe tener al menos 2 caracteres'
      ],
      emailRules: [
        v => !!v || 'El email es requerido',
        v => /.+@.+\..+/.test(v) || 'El email debe ser válido'
      ],
      tasksPerPageOptions: [
        { text: '5 tareas', value: 5 },
        { text: '10 tareas', value: 10 },
        { text: '20 tareas', value: 20 },
        { text: '50 tareas', value: 50 }
      ]
    }
  },
  computed: {
    ...mapState(['user', 'tasks', 'tasksDeleted']),
    ...mapGetters(['darkMode']),
    userStats() {
      const completedTasks = this.tasks.filter(task => task.completed).length
      const pendingTasks = this.tasks.filter(task => !task.completed).length
      const totalTasks = this.tasks.length
      
      return {
        completedTasks,
        pendingTasks,
        deletedTasks: this.tasksDeleted,
        totalTasks
      }
    },
    isPasswordValid() {
      return this.passwordData.current && 
             this.passwordData.new && 
             this.passwordData.confirm &&
             this.passwordData.new === this.passwordData.confirm &&
             this.passwordData.new.length >= 6
    }
  },
  watch: {
    value(newVal) {
      this.dialog = newVal
      if (newVal) {
        this.loadUserSettings()
      }
    },
    dialog(newVal) {
      if (!newVal) {
        this.$emit('input', false)
      }
    }
  },
  methods: {
    loadUserSettings() {
      if (this.user) {
        this.userSettings = {
          name: this.user.name || '',
          email: this.user.email || '',
          darkMode: this.darkMode,
          notifications: JSON.parse(localStorage.getItem('notifications') || 'true'),
          tasksPerPage: parseInt(localStorage.getItem('tasksPerPage') || '10')
        }
      }
    },
    updateTheme() {
      this.$store.commit('toggleDarkMode')
    },
    async saveSettings() {
      this.saving = true
      
      try {
        // Simular guardado de configuraciones
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Guardar preferencias en localStorage
        localStorage.setItem('notifications', JSON.stringify(this.userSettings.notifications))
        localStorage.setItem('tasksPerPage', this.userSettings.tasksPerPage.toString())
        
        // Actualizar nombre del usuario en el store
        if (this.userSettings.name !== this.user.name) {
          this.$store.commit('updateUserName', this.userSettings.name)
        }
        
        this.$emit('show-snackbar', {
          message: 'Configuraciones guardadas exitosamente',
          color: 'success'
        })
        
        this.closeDialog()
      } catch (error) {
        this.$emit('show-snackbar', {
          message: 'Error al guardar las configuraciones',
          color: 'error'
        })
      } finally {
        this.saving = false
      }
    },
    async changePassword() {
      if (!this.isPasswordValid) return
      
      try {
        // Simular cambio de contraseña
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.$emit('show-snackbar', {
          message: 'Contraseña cambiada exitosamente',
          color: 'success'
        })
        
        // Limpiar campos
        this.passwordData = {
          current: '',
          new: '',
          confirm: ''
        }
      } catch (error) {
        this.$emit('show-snackbar', {
          message: 'Error al cambiar la contraseña',
          color: 'error'
        })
      }
    },
    confirmDeleteAccount() {
      this.deleteAccountDialog = true
    },
    async deleteAccount() {
      try {
        // Eliminar datos del usuario
        localStorage.removeItem(`tasks_${this.user.id}`)
        localStorage.removeItem(`tasksDeleted_${this.user.id}`)
        
        this.$emit('show-snackbar', {
          message: 'Cuenta eliminada exitosamente',
          color: 'success'
        })
        
        // Cerrar dialogs y hacer logout
        this.deleteAccountDialog = false
        this.closeDialog()
        
        setTimeout(() => {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }, 1500)
      } catch (error) {
        this.$emit('show-snackbar', {
          message: 'Error al eliminar la cuenta',
          color: 'error'
        })
      }
    },
    closeDialog() {
      this.dialog = false
      this.passwordData = {
        current: '',
        new: '',
        confirm: ''
      }
    }
  }
}
</script>

<style scoped>
.settings-card {
  border-radius: 12px;
  overflow: hidden;
}

.settings-header {
  background: linear-gradient(135deg, var(--v-primary-base) 0%, var(--v-primary-darken1) 100%);
  color: white;
  padding: 20px 24px;
}

.section-title {
  color: var(--v-primary-base);
  font-weight: 500;
  display: flex;
  align-items: center;
}

.stats-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 8px;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.stats-number {
  font-size: 24px;
  font-weight: bold;
  color: var(--v-primary-base);
}

.stats-label {
  font-size: 12px;
  color: var(--v-text-secondary);
  font-weight: 500;
}

.v-expansion-panel-header {
  color: var(--v-text-primary);
}

.v-expansion-panel-content >>> .v-expansion-panel-content__wrap {
  padding: 16px;
}

/* Dark mode adjustments */
.theme--dark .stats-card {
  background-color: rgba(255,255,255,0.05);
}

.theme--dark .stats-card:hover {
  box-shadow: 0 4px 12px rgba(255,255,255,0.1);
}

.theme--dark .settings-header {
  background: linear-gradient(135deg, var(--v-primary-base) 0%, var(--v-primary-darken2) 100%);
}
</style>
