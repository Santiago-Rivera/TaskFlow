<template>
  <div class="important-tasks-container">
    <!-- Lista de tareas importantes (máximo 3 para igualar altura del filtro) -->
    <div v-if="importantTasks.length > 0">
      <v-list class="py-0">
        <div v-for="(task, index) in importantTasks.slice(0, 3)" :key="index">
          <v-list-item 
            class="task-item important-item"
            @click="openTaskDetails(task, getOriginalIndex(task))"
          >
            <v-list-item-avatar class="mr-3" size="24">
              <v-icon 
                :color="task.completed ? 'success' : 'orange'" 
                size="18"
              >
                {{ task.completed ? 'mdi-check-circle' : 'mdi-star' }}
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title 
                class="task-text"
                :class="{ 'completed-text': task.completed }"
              >
                {{ getTaskText(task) }}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                small
                color="success"
                @click.stop="markAsCompleted(getOriginalIndex(task))"
                title="Completar"
              >
                <v-icon small>mdi-check</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="index < Math.min(importantTasks.length, 3) - 1"></v-divider>
        </div>
      </v-list>

      <!-- Botón para ver más (solo si hay más de 3) -->
      <div v-if="importantTasks.length > 3" class="mt-3">
        <v-chip
          small
          color="orange"
          text-color="white"
          class="more-chip"
        >
          <v-icon left small>mdi-star</v-icon>
          {{ importantTasks.length - 3 }} más
        </v-chip>
      </div>
    </div>

    <!-- Estado vacío (misma altura que el input del filtro) -->
    <div v-else class="empty-state">
      <div class="empty-input">
        <v-icon color="grey lighten-1" size="20" class="mr-2">mdi-star-outline</v-icon>
        <span class="grey--text">No hay tareas importantes</span>
      </div>
    </div>

    <!-- Dialog de detalles de tarea -->
    <TaskDetails
      v-if="selectedTask"
      :show-dialog="showDetailsDialog"
      :task="selectedTask"
      :task-index="selectedTaskIndex"
      @update-task="updateTaskDetails"
      @delete-task="deleteTaskFromDetails"
      @close-dialog="closeDetailsDialog"
      @show-snackbar="$emit('show-snackbar', $event)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TaskDetails from './TaskDetails.vue'

export default {
  name: 'ImportantTasks',
  components: {
    TaskDetails
  },
  data() {
    return {
      showDetailsDialog: false,
      selectedTask: null,
      selectedTaskIndex: -1,
      categoryColors: {
        'trabajo': 'blue',
        'personal': 'green',
        'hogar': 'orange',
        'salud': 'red',
        'educacion': 'purple',
        'finanzas': 'teal',
        'compras': 'pink',
        'viajes': 'indigo'
      }
    }
  },
  computed: {
    ...mapState(['tasks']),
    importantTasks() {
      return this.tasks.filter(task => {
        const taskObj = this.getTaskObject(task)
        return taskObj.important && !taskObj.completed
      })
    }
  },
  methods: {
    getTaskObject(task) {
      if (typeof task === 'string') {
        return {
          text: task,
          completed: false,
          addToDay: false,
          important: false,
          dueDate: null,
          repeat: null,
          category: null,
          attachments: [],
          notes: '',
          reminder: null,
          createdAt: new Date().toISOString()
        }
      }
      return task
    },
    getTaskText(task) {
      return typeof task === 'string' ? task : task.text
    },
    getOriginalIndex(task) {
      return this.tasks.findIndex(t => {
        const taskObj = this.getTaskObject(t)
        const searchObj = this.getTaskObject(task)
        return taskObj.text === searchObj.text && 
               taskObj.createdAt === searchObj.createdAt
      })
    },
    getCategoryColor(category) {
      return this.categoryColors[category] || 'grey'
    },
    formatDueDate(dueDate) {
      if (!dueDate) return ''
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const due = new Date(dueDate)
      due.setHours(0, 0, 0, 0)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return `Vencida hace ${Math.abs(diffDays)} día(s)`
      if (diffDays === 0) return 'Vence hoy'
      if (diffDays === 1) return 'Vence mañana'
      if (diffDays <= 7) return `Vence en ${diffDays} días`
      
      return due.toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric' 
      })
    },
    getDueDateClass(dueDate) {
      if (!dueDate) return ''
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const due = new Date(dueDate)
      due.setHours(0, 0, 0, 0)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return 'overdue'
      if (diffDays === 0) return 'due-today'
      if (diffDays <= 3) return 'due-soon'
      return 'due-later'
    },
    openTaskDetails(task, originalIndex) {
      this.selectedTask = task
      this.selectedTaskIndex = originalIndex
      this.showDetailsDialog = true
    },
    closeDetailsDialog() {
      this.showDetailsDialog = false
      this.selectedTask = null
      this.selectedTaskIndex = -1
    },
    markAsCompleted(index) {
      this.$store.commit('moveTaskToCompleted', index)
      this.$emit('show-snackbar', {
        message: 'Tarea importante completada',
        color: 'success'
      })
    },
    removeImportant(index) {
      const task = this.getTaskObject(this.tasks[index])
      task.important = false
      this.$store.commit('updateTask', { index, task })
      this.$emit('show-snackbar', {
        message: 'Tarea ya no es importante',
        color: 'info'
      })
    },
    updateTaskDetails({ index, task }) {
      this.$store.commit('updateTask', { index, task })
    },
    deleteTaskFromDetails(index) {
      this.$store.commit('removeTask', index)
    }
  }
}
</script>

<style scoped>
.important-tasks-container {
  width: 100%;
}

.task-item {
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.important-item {
  border-left: 3px solid #ff9800;
}

.task-item:hover {
  background-color: #fff3e0;
}

.theme--dark .task-item:hover {
  background-color: #5d4037;
}

.task-text {
  font-size: 14px;
  color: var(--v-textPrimary-base);
  font-weight: 500;
}

.completed-text {
  text-decoration: line-through;
  opacity: 0.6;
}

.empty-state {
  display: flex;
  align-items: center;
}

.empty-input {
  display: flex;
  align-items: center;
  padding: 16px 12px;
  border: 1px solid var(--v-border-base);
  border-radius: 12px;
  background-color: transparent;
  width: 100%;
  font-size: 14px;
  color: var(--v-textSecondary-base);
}

.more-chip {
  border-radius: 8px !important;
  font-size: 12px;
  background: linear-gradient(135deg, #ff9800, #ff5722) !important;
}
</style>
