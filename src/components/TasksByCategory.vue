<template>
  <div class="categories-container">
    <!-- Lista de categorías (máximo 2 para igualar altura del filtro) -->
    <div v-if="Object.keys(tasksByCategory).length > 0">
      <!-- Mostrar máximo 2 categorías -->
      <div v-for="(tasks, category, index) in limitedTasksByCategory" :key="category" class="category-section">
        <div class="category-item">
          <!-- Header de categoría compacto -->
          <div class="d-flex align-center mb-2">
            <div class="category-icon-small" :class="getCategoryColor(category)">
              <v-icon size="14" color="white">{{ getCategoryIcon(category) }}</v-icon>
            </div>
            <span class="category-name-small ml-2">{{ getCategoryName(category) }}</span>
            <span class="category-count-small ml-1">({{ tasks.length }})</span>
          </div>

          <!-- Lista de tareas de la categoría (máximo 2) -->
          <v-list class="py-0" dense>
            <div v-for="(task, taskIndex) in tasks.slice(0, 2)" :key="`${category}-${taskIndex}`">
              <v-list-item 
                class="task-item-small"
                @click="openTaskDetails(task, getOriginalIndex(task))"
              >
                <v-list-item-avatar class="mr-2" size="20">
                  <v-icon 
                    :color="task.completed ? 'success' : 'grey'" 
                    size="14"
                  >
                    {{ task.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                  </v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title 
                    class="task-text-small"
                    :class="{ 'completed-text': task.completed }"
                  >
                    {{ getTaskText(task).length > 20 ? getTaskText(task).substring(0, 20) + '...' : getTaskText(task) }}
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    icon
                    x-small
                    color="success"
                    @click.stop="markAsCompleted(getOriginalIndex(task))"
                    title="Completar"
                  >
                    <v-icon x-small>mdi-check</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </div>
          </v-list>
        </div>
        
        <v-divider v-if="index < Math.min(Object.keys(tasksByCategory).length, 2) - 1" class="my-2"></v-divider>
      </div>

      <!-- Botón para ver más categorías -->
      <div v-if="Object.keys(tasksByCategory).length > 2" class="mt-3">
        <v-chip
          small
          color="purple"
          text-color="white"
          class="more-chip"
        >
          <v-icon left small>mdi-tag</v-icon>
          +{{ Object.keys(tasksByCategory).length - 2 }} categorías más
        </v-chip>
      </div>
    </div>

    <!-- Estado vacío (misma altura que el input del filtro) -->
    <div v-else class="empty-state">
      <div class="empty-input">
        <v-icon color="grey lighten-1" size="20" class="mr-2">mdi-tag-outline</v-icon>
        <span class="grey--text">No hay categorías</span>
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
  name: 'TasksByCategory',
  components: {
    TaskDetails
  },
  data() {
    return {
      showDetailsDialog: false,
      selectedTask: null,
      selectedTaskIndex: -1,
      selectedFilter: null,
      categoryOptions: [
        { text: 'Trabajo', value: 'trabajo', color: 'blue', icon: 'mdi-briefcase' },
        { text: 'Personal', value: 'personal', color: 'green', icon: 'mdi-account' },
        { text: 'Hogar', value: 'hogar', color: 'orange', icon: 'mdi-home' },
        { text: 'Salud', value: 'salud', color: 'red', icon: 'mdi-heart' },
        { text: 'Educación', value: 'educacion', color: 'purple', icon: 'mdi-school' },
        { text: 'Finanzas', value: 'finanzas', color: 'teal', icon: 'mdi-currency-usd' },
        { text: 'Compras', value: 'compras', color: 'pink', icon: 'mdi-cart' },
        { text: 'Viajes', value: 'viajes', color: 'indigo', icon: 'mdi-airplane' }
      ]
    }
  },
  computed: {
    ...mapState(['tasks']),
    tasksByCategory() {
      const grouped = {}
      this.tasks.forEach(task => {
        const taskObj = this.getTaskObject(task)
        if (taskObj.category && !taskObj.completed) {
          if (!grouped[taskObj.category]) {
            grouped[taskObj.category] = []
          }
          grouped[taskObj.category].push(taskObj)
        }
      })
      return grouped
    },
    uncategorizedTasks() {
      return this.tasks.filter(task => {
        const taskObj = this.getTaskObject(task)
        return !taskObj.category && !taskObj.completed
      }).map(task => this.getTaskObject(task))
    },
    filteredTasksByCategory() {
      if (this.selectedFilter) {
        return this.tasksByCategory[this.selectedFilter] ? 
          { [this.selectedFilter]: this.tasksByCategory[this.selectedFilter] } : {}
      }
      return this.tasksByCategory
    },
    availableCategories() {
      return this.categoryOptions.filter(cat => 
        Object.keys(this.tasksByCategory).includes(cat.value)
      )
    },
    limitedTasksByCategory() {
      const categories = Object.keys(this.tasksByCategory).slice(0, 2)
      const limited = {}
      categories.forEach(category => {
        limited[category] = this.tasksByCategory[category]
      })
      return limited
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
      const categoryData = this.categoryOptions.find(cat => cat.value === category)
      return categoryData ? categoryData.color : 'grey'
    },
    getCategoryIcon(category) {
      const categoryData = this.categoryOptions.find(cat => cat.value === category)
      return categoryData ? categoryData.icon : 'mdi-tag'
    },
    getCategoryName(category) {
      const categoryData = this.categoryOptions.find(cat => cat.value === category)
      return categoryData ? categoryData.text : category
    },
    hasMetaInfo(task) {
      return task.addToDay || task.dueDate || task.attachments?.length > 0 || 
             task.notes || task.reminder
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
        message: 'Tarea completada',
        color: 'success'
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
.categories-container {
  width: 100%;
}

.category-section {
  margin-bottom: 8px;
}

.category-item {
  cursor: pointer;
}

.category-icon-small {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-icon-small.blue { background: #2196f3; }
.category-icon-small.green { background: #4caf50; }
.category-icon-small.orange { background: #ff9800; }
.category-icon-small.red { background: #f44336; }
.category-icon-small.purple { background: #9c27b0; }
.category-icon-small.teal { background: #009688; }
.category-icon-small.pink { background: #e91e63; }
.category-icon-small.indigo { background: #3f51b5; }
.category-icon-small.grey { background: #757575; }

.category-name-small {
  font-size: 13px;
  font-weight: 600;
  color: var(--v-textPrimary-base);
}

.category-count-small {
  font-size: 11px;
  color: var(--v-textSecondary-base);
}

.task-item-small {
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
  min-height: 32px !important;
  padding: 4px 8px;
}

.task-item-small:hover {
  background-color: var(--v-grey-lighten4);
}

.theme--dark .task-item-small:hover {
  background-color: var(--v-grey-darken3);
}

.task-text-small {
  font-size: 12px;
  color: var(--v-textPrimary-base);
  line-height: 1.2;
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
  background: linear-gradient(135deg, #9c27b0, #673ab7) !important;
}
</style>
