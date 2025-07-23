<template>
  <div class="tasks-container">
    <div v-if="getTasksFilter.length === 0" class="empty-state">
      <v-icon size="48" color="grey lighten-1" class="mb-4">mdi-clipboard-text-outline</v-icon>
      <h3 class="empty-title">No hay tareas</h3>
      <p class="empty-subtitle">¡Agrega tu primera tarea para comenzar!</p>
    </div>
    
    <transition-group name="task-list" tag="div" class="tasks-list" v-else>
      <div
        v-for="(task, index) in getTasksFilter"
        :key="`task-${index}`"
        class="task-item"
      >
        <!-- Modo Edición -->
        <div v-if="editing === index" class="edit-mode">
          <v-text-field
            v-model="text"
            outlined
            dense
            color="primary"
            hide-details
            class="edit-input"
            @keyup.enter="emitUpdateTask"
            @keyup.esc="cancelEdit"
            autofocus
          >
            <template v-slot:prepend-inner>
              <v-icon color="primary" size="18">mdi-pencil</v-icon>
            </template>
          </v-text-field>
          
          <div class="edit-actions mt-3">
            <v-btn
              small
              color="success"
              depressed
              class="action-btn"
              @click="emitUpdateTask"
            >
              <v-icon left small>mdi-check</v-icon>
              Guardar
            </v-btn>
            <v-btn
              small
              color="grey"
              text
              class="action-btn ml-2"
              @click="cancelEdit"
            >
              <v-icon left small>mdi-close</v-icon>
              Cancelar
            </v-btn>
          </div>
        </div>

        <!-- Modo Vista -->
        <div v-else class="view-mode">
          <div class="task-content" @click="openTaskDetails(index)">
            <div class="task-main">
              <!-- Checkbox para completar -->
              <v-checkbox
                :value="getTaskObject(task).completed"
                @change="toggleComplete(index)"
                @click.stop
                color="success"
                class="task-checkbox"
                hide-details
              ></v-checkbox>
              
              <!-- Contenido de la tarea -->
              <div class="task-info">
                <div 
                  class="task-text" 
                  :class="{ 'completed': getTaskObject(task).completed }"
                >
                  {{ getTaskText(task) }}
                  
                  <!-- Indicadores -->
                  <div class="task-indicators">
                    <v-icon 
                      v-if="getTaskObject(task).important" 
                      color="red" 
                      small 
                      class="ml-2"
                    >
                      mdi-star
                    </v-icon>
                    
                    <v-icon 
                      v-if="getTaskObject(task).dueDate" 
                      :color="getDueDateColor(getTaskObject(task).dueDate)"
                      small 
                      class="ml-1"
                    >
                      mdi-calendar-clock
                    </v-icon>
                    
                    <v-icon 
                      v-if="getTaskObject(task).attachments && getTaskObject(task).attachments.length > 0" 
                      color="blue" 
                      small 
                      class="ml-1"
                    >
                      mdi-attachment
                    </v-icon>
                    
                    <v-icon 
                      v-if="getTaskObject(task).notes" 
                      color="orange" 
                      small 
                      class="ml-1"
                    >
                      mdi-note-text
                    </v-icon>
                    
                    <v-icon 
                      v-if="getTaskObject(task).assignedGroup" 
                      color="purple" 
                      small 
                      class="ml-1"
                      :title="getGroupDisplayText(task)"
                    >
                      mdi-account-group
                    </v-icon>
                  </div>
                </div>
                
                <!-- Meta información -->
                <div class="task-meta" v-if="hasMetaInfo(task)">
                  <v-chip
                    v-if="getTaskObject(task).category"
                    :color="getCategoryColor(getTaskObject(task).category)"
                    x-small
                    class="mr-1"
                  >
                    {{ getTaskObject(task).category }}
                  </v-chip>
                  
                  <span 
                    v-if="getTaskObject(task).dueDate"
                    class="due-date"
                    :class="getDueDateClass(getTaskObject(task).dueDate)"
                  >
                    {{ formatDueDate(getTaskObject(task).dueDate) }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Acciones de la tarea -->
            <div class="task-actions" @click.stop>
              <v-btn
                icon
                small
                color="success"
                class="action-icon"
                @click="markAsCompleted(index)"
                title="Marcar como completada"
              >
                <v-icon size="18">mdi-check</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                color="primary"
                class="action-icon"
                @click="taskUpdate(index, task)"
                title="Editar texto"
              >
                <v-icon size="18">mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                color="error"
                class="action-icon"
                @click="removeTask(index)"
                title="Eliminar tarea"
              >
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
    
    <!-- Modal de detalles de tarea -->
    <TaskDetails
      :show-dialog="showTaskDetails"
      :task="selectedTask"
      :task-index="selectedTaskIndex"
      @update-task="updateTaskDetails"
      @delete-task="deleteTaskFromDetails"
      @show-snackbar="$emit('show-snackbar', $event)"
      @close-dialog="showTaskDetails = false"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import TaskDetails from "./TaskDetails.vue";

export default {
  name: "ShowTasks",
  components: {
    TaskDetails
  },
  data() {
    return {
      editing: null,
      text: "",
      showTaskDetails: false,
      selectedTask: {},
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
    };
  },
  computed: {
    ...mapGetters(["getTasksFilter"]),
  },
  methods: {
    ...mapMutations(["removeTask", "updateTask"]),
    taskUpdate(index, task) {
      this.editing = index;
      this.text = task;
    },
    emitUpdateTask() {
      if (this.text.trim()) {
        this.updateTask({ index: this.editing, task: this.text.trim() });
        this.editing = null;
        this.text = "";
      }
    },
    cancelEdit() {
      this.editing = null;
      this.text = "";
    },
    openTaskDetails(index) {
      this.selectedTaskIndex = index;
      this.selectedTask = this.getTaskObject(this.getTasksFilter[index]);
      this.showTaskDetails = true;
    },
    getTaskObject(task) {
      // Si la tarea es un string, convertirla a objeto
      if (typeof task === 'string') {
        return {
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
        };
      }
      return task;
    },
    getTaskText(task) {
      return typeof task === 'string' ? task : task.text;
    },
    hasMetaInfo(task) {
      const taskObj = this.getTaskObject(task);
      return taskObj.category || taskObj.dueDate;
    },
    getCategoryColor(category) {
      return this.categoryColors[category] || 'grey';
    },
    getDueDateColor(dueDate) {
      if (!dueDate) return 'grey';
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'red'; // Vencida
      if (diffDays === 0) return 'orange'; // Hoy
      if (diffDays <= 3) return 'yellow'; // Próxima
      return 'green'; // Futura
    },
    getDueDateClass(dueDate) {
      if (!dueDate) return '';
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'overdue';
      if (diffDays === 0) return 'due-today';
      if (diffDays <= 3) return 'due-soon';
      return 'due-later';
    },
    formatDueDate(dueDate) {
      if (!dueDate) return '';
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return `Vencida hace ${Math.abs(diffDays)} día(s)`;
      if (diffDays === 0) return 'Vence hoy';
      if (diffDays === 1) return 'Vence mañana';
      if (diffDays <= 7) return `Vence en ${diffDays} días`;
      
      return due.toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric' 
      });
    },
    toggleComplete(index) {
      const task = this.getTaskObject(this.getTasksFilter[index]);
      task.completed = !task.completed;
      this.updateTask({ index, task });
    },
    markAsCompleted(index) {
      this.$store.commit('moveTaskToCompleted', index);
      this.$emit('show-snackbar', {
        message: 'Tarea marcada como completada',
        color: 'success'
      });
    },
    updateTaskDetails({ index, task }) {
      this.updateTask({ index, task });
    },
    deleteTaskFromDetails(index) {
      this.removeTask(index);
    },
    
    // Métodos relacionados con grupos
    getGroupDisplayText(task) {
      const taskObj = this.getTaskObject(task);
      if (!taskObj.assignedGroup) return '';
      
      const group = this.$store.state.groups?.find(g => g.id === taskObj.assignedGroup);
      if (!group) return '';
      
      if (!taskObj.assignedMembers || taskObj.assignedMembers.length === 0) {
        return `${group.name} (Todo el grupo)`;
      }
      
      const assignedMembers = taskObj.assignedMembers.map(memberId => {
        return group.members.find(member => member.id === memberId);
      }).filter(member => member);
      
      if (assignedMembers.length === 1) {
        return `${group.name} - ${assignedMembers[0].name}`;
      } else if (assignedMembers.length > 1) {
        return `${group.name} - ${assignedMembers.length} miembros`;
      }
      
      return group.name;
    }
  },
};
</script>

<style scoped>
.tasks-container {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--v-textSecondary-base);
  margin: 0 0 8px 0;
}

.empty-subtitle {
  font-size: 14px;
  color: var(--v-textSecondary-base);
  margin: 0;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  background: var(--v-hover-base);
  border: 1px solid var(--v-border-base);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.task-item:hover {
  background: var(--v-surface-base);
  border-color: var(--v-primary-base);
  transform: translateX(4px);
}

.view-mode .task-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.task-text {
  font-size: 16px;
  color: var(--v-textPrimary-base);
  line-height: 1.4;
  flex: 1;
  margin-right: 16px;
  word-break: break-word;
}

.task-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-icon {
  transition: all 0.3s ease;
}

.action-icon:hover {
  transform: scale(1.1);
}

.edit-mode {
  width: 100%;
}

.edit-input >>> .v-input__slot {
  border-radius: 8px !important;
}

.edit-actions {
  display: flex;
  align-items: center;
}

.action-btn {
  border-radius: 8px !important;
  font-weight: 500;
  text-transform: none;
}

/* Animaciones para la lista */
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.4s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.task-list-move {
  transition: transform 0.4s ease;
}

/* Nuevos estilos para tareas mejoradas */
.view-mode .task-content {
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

.task-main {
  display: flex;
  align-items: flex-start;
  flex: 1;
  gap: 12px;
}

.task-checkbox {
  margin-top: 0;
  padding-top: 0;
}

.task-checkbox >>> .v-input__slot {
  margin-bottom: 0;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-text {
  font-size: 16px;
  color: var(--v-textPrimary-base);
  line-height: 1.4;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.task-text.completed {
  text-decoration: line-through;
  color: var(--v-textSecondary-base);
  opacity: 0.7;
}

.task-indicators {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.due-date {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
}

.due-date.overdue {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.due-date.due-today {
  background-color: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.due-date.due-soon {
  background-color: rgba(255, 235, 59, 0.1);
  color: #fbc02d;
}

.due-date.due-later {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.task-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  margin-left: 12px;
}

/* Hover effects */
.task-item:hover .task-actions {
  opacity: 1;
}

.task-actions {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

/* Dark mode adjustments */
.theme--dark .due-date.overdue {
  background-color: rgba(244, 67, 54, 0.2);
}

.theme--dark .due-date.due-today {
  background-color: rgba(255, 152, 0, 0.2);
}

.theme--dark .due-date.due-soon {
  background-color: rgba(255, 235, 59, 0.2);
}

.theme--dark .due-date.due-later {
  background-color: rgba(76, 175, 80, 0.2);
}
</style>
