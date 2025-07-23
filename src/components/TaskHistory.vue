<template>
  <div>
    <!-- Header del historial -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h3 class="text-h6 font-weight-medium">
          <v-icon class="mr-2" color="success">mdi-history</v-icon>
          Historial de Tareas
        </h3>
        <p class="text-caption text--secondary mt-1">
          {{ completedTasks.length }} {{ completedTasks.length === 1 ? 'tarea completada' : 'tareas completadas' }}
        </p>
      </div>
      <v-btn
        v-if="completedTasks.length > 0"
        color="error"
        text
        small
        @click="showClearDialog = true"
      >
        <v-icon small class="mr-1">mdi-delete-sweep</v-icon>
        Limpiar Todo
      </v-btn>
    </div>

    <!-- Lista de tareas completadas -->
    <div v-if="completedTasks.length === 0" class="empty-state">
      <div class="text-center pa-8">
        <v-icon size="80" color="grey lighten-2">mdi-check-circle-outline</v-icon>
        <h4 class="text-h6 grey--text mt-4 mb-2">No hay tareas completadas</h4>
        <p class="text-body-2 grey--text">Las tareas que completes aparecerán aquí</p>
      </div>
    </div>

    <v-card
      v-else
      class="task-history-card"
      elevation="0"
      outlined
    >
      <v-list class="py-0">
        <div v-for="(task, index) in completedTasks" :key="index">
          <v-list-item class="completed-task-item">
            <!-- Indicador de completado -->
            <v-list-item-avatar class="mr-3">
              <v-icon color="success" size="20">mdi-check-circle</v-icon>
            </v-list-item-avatar>

            <!-- Contenido de la tarea -->
            <v-list-item-content>
              <v-list-item-title class="completed-task-text">
                {{ getTaskText(task) }}
              </v-list-item-title>
              <v-list-item-subtitle class="d-flex align-center mt-1">
                <v-icon small class="mr-1" color="grey">mdi-clock-outline</v-icon>
                Completada {{ formatCompletedDate(task.completedAt) }}
                
                <!-- Mostrar categoría si existe -->
                <v-chip
                  v-if="task.category"
                  x-small
                  class="ml-2"
                  color="primary"
                  text-color="white"
                >
                  {{ task.category }}
                </v-chip>

                <!-- Mostrar si era importante -->
                <v-icon
                  v-if="task.important"
                  small
                  class="ml-2"
                  color="orange"
                >
                  mdi-star
                </v-icon>
              </v-list-item-subtitle>
            </v-list-item-content>

            <!-- Acciones -->
            <v-list-item-action>
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon small>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="showTaskDetails(task)">
                    <v-list-item-icon>
                      <v-icon small>mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Ver detalles</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="confirmDelete(index)">
                    <v-list-item-icon>
                      <v-icon small color="error">mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Eliminar del historial</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
          
          <v-divider v-if="index < completedTasks.length - 1" :key="`divider-${index}`"></v-divider>
        </div>
      </v-list>
    </v-card>

    <!-- Dialog de confirmación para eliminar una tarea -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon color="error" class="mr-2">mdi-delete</v-icon>
          Eliminar del historial
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar esta tarea del historial? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteFromHistory">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmación para limpiar todo el historial -->
    <v-dialog v-model="showClearDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon color="error" class="mr-2">mdi-delete-sweep</v-icon>
          Limpiar historial completo
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar todas las tareas del historial? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showClearDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="clearAllHistory">Limpiar Todo</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de detalles de tarea -->
    <TaskDetails
      v-if="selectedTask"
      :show-dialog="showDetailsDialog"
      :task="selectedTask"
      :task-index="-1"
      :read-only="true"
      @close-dialog="closeDetailsDialog"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TaskDetails from './TaskDetails.vue'

export default {
  name: 'TaskHistory',
  components: {
    TaskDetails
  },
  data() {
    return {
      showDeleteDialog: false,
      showClearDialog: false,
      showDetailsDialog: false,
      taskToDelete: null,
      selectedTask: null
    }
  },
  computed: {
    ...mapGetters(['getCompletedTasks']),
    completedTasks() {
      return this.getCompletedTasks
    }
  },
  methods: {
    getTaskText(task) {
      return typeof task === 'string' ? task : task.text
    },
    formatCompletedDate(dateString) {
      if (!dateString) return 'Fecha desconocida'
      
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
      const diffMinutes = Math.floor(diffTime / (1000 * 60))

      if (diffMinutes < 1) {
        return 'hace un momento'
      } else if (diffMinutes < 60) {
        return `hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`
      } else if (diffHours < 24) {
        return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
      } else if (diffDays === 1) {
        return 'ayer'
      } else if (diffDays < 7) {
        return `hace ${diffDays} días`
      } else {
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    },
    confirmDelete(index) {
      this.taskToDelete = index
      this.showDeleteDialog = true
    },
    deleteFromHistory() {
      if (this.taskToDelete !== null) {
        this.$store.commit('removeFromCompleted', this.taskToDelete)
        this.$emit('show-snackbar', {
          message: 'Tarea eliminada del historial',
          color: 'info'
        })
      }
      this.showDeleteDialog = false
      this.taskToDelete = null
    },
    clearAllHistory() {
      this.$store.commit('clearCompletedHistory')
      this.$emit('show-snackbar', {
        message: 'Historial limpiado completamente',
        color: 'info'
      })
      this.showClearDialog = false
    },
    showTaskDetails(task) {
      this.selectedTask = task
      this.showDetailsDialog = true
    },
    closeDetailsDialog() {
      this.showDetailsDialog = false
      this.selectedTask = null
    }
  }
}
</script>

<style scoped>
.task-history-card {
  border-radius: 12px !important;
  background: var(--v-surface-base);
}

.completed-task-item {
  padding: 16px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.completed-task-item:hover {
  background-color: var(--v-grey-lighten5);
}

.theme--dark .completed-task-item:hover {
  background-color: var(--v-grey-darken3);
}

.completed-task-text {
  text-decoration: line-through;
  opacity: 0.7;
  font-size: 0.95rem;
}

.empty-state {
  border: 2px dashed var(--v-grey-lighten3);
  border-radius: 12px;
  background: var(--v-grey-lighten5);
}

.theme--dark .empty-state {
  border-color: var(--v-grey-darken2);
  background: var(--v-grey-darken4);
}

.v-list-item__subtitle {
  line-height: 1.4 !important;
}
</style>
