<template>
  <v-container fluid class="main-container">
    <div class="content-wrapper">
      <!-- Sección Principal -->
      <div class="main-section">
        <!-- Nueva Tarea -->
        <v-card class="task-card new-task-card" elevation="0">
          <v-card-text class="pa-6">
            <div class="section-header mb-4">
              <div class="d-flex align-center">
                <div class="icon-wrapper primary">
                  <v-icon color="white" size="20">mdi-plus</v-icon>
                </div>
                <div class="ml-3">
                  <h2 class="section-title">Nueva Tarea</h2>
                  <p class="section-subtitle">Agrega una nueva tarea a tu lista</p>
                </div>
              </div>
            </div>
            <NewTask />
          </v-card-text>
        </v-card>

        <!-- Lista de Tareas -->
        <v-card class="task-card mt-6" elevation="0">
          <v-card-text class="pa-6">
            <div class="section-header mb-4">
              <div class="d-flex align-center">
                <div class="icon-wrapper success">
                  <v-icon color="white" size="20">mdi-format-list-checks</v-icon>
                </div>
                <div class="ml-3">
                  <h2 class="section-title">Todas las Tareas</h2>
                  <p class="section-subtitle">Gestiona y organiza todas tus tareas</p>
                </div>
              </div>
            </div>
            
            <div v-if="loading" class="loading-container">
              <v-progress-circular
                :size="40"
                color="primary"
                indeterminate
              ></v-progress-circular>
              <p class="loading-text mt-3">Cargando tareas...</p>
            </div>
            <ShowTasks v-else @show-snackbar="showSnackbar" />
          </v-card-text>
        </v-card>

        <!-- Historial de Tareas -->
        <v-card class="task-card mt-6" elevation="0">
          <v-card-text class="pa-6">
            <div class="section-header mb-4">
              <div class="d-flex align-center">
                <div class="icon-wrapper secondary">
                  <v-icon color="white" size="20">mdi-history</v-icon>
                </div>
                <div class="ml-3">
                  <h2 class="section-title">Historial</h2>
                  <p class="section-subtitle">Tareas completadas y terminadas</p>
                </div>
              </div>
            </div>
            <TaskHistory @show-snackbar="showSnackbar" />
          </v-card-text>
        </v-card>
      </div>

      <!-- Sidebar -->
      <div class="sidebar-section">
        <!-- Filtros -->
        <v-card class="task-card filter-card" elevation="0">
          <v-card-text class="pa-6">
            <div class="section-header mb-4">
              <div class="d-flex align-center">
                <div class="icon-wrapper info">
                  <v-icon color="white" size="20">mdi-filter-variant</v-icon>
                </div>
                <div class="ml-3">
                  <h2 class="section-title">Filtrar</h2>
                  <p class="section-subtitle">Busca entre tus tareas</p>
                </div>
              </div>
            </div>
            <FilterTask />
          </v-card-text>
        </v-card>

        <!-- Estadísticas -->
        <v-card class="task-card stats-card mt-6" elevation="0">
          <v-card-text class="pa-6">
            <div class="section-header mb-4">
              <div class="d-flex align-center">
                <div class="icon-wrapper warning">
                  <v-icon color="white" size="20">mdi-chart-line</v-icon>
                </div>
                <div class="ml-3">
                  <h2 class="section-title">Estadísticas</h2>
                  <p class="section-subtitle">Resumen de tu productividad</p>
                </div>
              </div>
            </div>

            <!-- Grid compacto de estadísticas (2x2) -->
            <div class="stats-compact-grid">
              <div class="stat-compact-item">
                <div class="stat-compact-number primary--text">{{ getCurrentTasks }}</div>
                <div class="stat-compact-label">Pendientes</div>
              </div>
              
              <div class="stat-compact-item">
                <div class="stat-compact-number warning--text">{{ getMyDayTasks }}</div>
                <div class="stat-compact-label">Mi Día</div>
              </div>
              
              <div class="stat-compact-item">
                <div class="stat-compact-number orange--text">{{ getImportantTasks }}</div>
                <div class="stat-compact-label">Importantes</div>
              </div>
              
              <div class="stat-compact-item">
                <div class="stat-compact-number success--text">{{ getCompletedTasksCount }}</div>
                <div class="stat-compact-label">Completadas</div>
              </div>
            </div>

            <!-- Información adicional compacta -->
            <div class="stats-summary mt-3">
              <v-chip small color="info" text-color="white" class="mr-2">
                <v-icon left x-small>mdi-format-list-numbered</v-icon>
                Total: {{ getTotalTasks }}
              </v-chip>
              <v-chip small color="purple" text-color="white">
                <v-icon left x-small>mdi-tag-multiple</v-icon>
                {{ getCategoriesCount }} categorías
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- Mi Día -->
        <v-card class="task-card mt-6" elevation="0">
          <v-card-text class="pa-6">
            <div class="section-header mb-4">
              <div class="d-flex align-center">
                <div class="icon-wrapper primary">
                  <v-icon color="white" size="20">mdi-calendar-today</v-icon>
                </div>
                <div class="ml-3">
                  <h2 class="section-title">Mi Día</h2>
                  <p class="section-subtitle">Tareas programadas para hoy</p>
                </div>
              </div>
            </div>
            <MyDay @show-snackbar="showSnackbar" />
          </v-card-text>
        </v-card>

        <!-- Tareas Importantes -->
        <v-card class="task-card mt-6" elevation="0">
          <v-card-text class="pa-6">
            <div class="section-header mb-4">
              <div class="d-flex align-center">
                <div class="icon-wrapper warning">
                  <v-icon color="white" size="20">mdi-star</v-icon>
                </div>
                <div class="ml-3">
                  <h2 class="section-title">Importantes</h2>
                  <p class="section-subtitle">Tareas marcadas como importantes</p>
                </div>
              </div>
            </div>
            <ImportantTasks @show-snackbar="showSnackbar" />
          </v-card-text>
        </v-card>

        <!-- Tareas por Categoría -->
        <v-card class="task-card mt-6" elevation="0">
          <v-card-text class="pa-6">
            <div class="section-header mb-4">
              <div class="d-flex align-center">
                <div class="icon-wrapper info">
                  <v-icon color="white" size="20">mdi-tag-multiple</v-icon>
                </div>
                <div class="ml-3">
                  <h2 class="section-title">Por Categorías</h2>
                  <p class="section-subtitle">Tareas organizadas por categorías</p>
                </div>
              </div>
            </div>
            <TasksByCategory @show-snackbar="showSnackbar" />
          </v-card-text>
        </v-card>

        <!-- Grupos -->
        <v-card class="task-card mt-6" elevation="0">
          <v-card-text class="pa-6">
            <div class="section-header mb-4">
              <div class="d-flex align-center">
                <div class="icon-wrapper success">
                  <v-icon color="white" size="20">mdi-account-group</v-icon>
                </div>
                <div class="ml-3">
                  <h2 class="section-title">Grupos</h2>
                  <p class="section-subtitle">Gestión de equipos de trabajo</p>
                </div>
              </div>
            </div>
            <GroupManagement 
              @show-snackbar="showSnackbar" 
              @update-task="updateTaskFromGroup"
              @open-task-details="openTaskDetailsFromGroup"
            />
          </v-card-text>
        </v-card>
      </div>
    </div>
    <SnackbarTask :notify="notify" />
    
    <!-- Snackbar adicional para mensajes de detalles -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="4000"
      bottom
      right
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import NewTask from "./NewTask";
import ShowTasks from "./ShowTasks";
import FilterTask from "./FilterTask";
import SnackbarTask from "./SnackbarTask";
import TaskHistory from "./TaskHistory";
import MyDay from "./MyDay";
import ImportantTasks from "./ImportantTasks";
import TasksByCategory from "./TasksByCategory";
import GroupManagement from "./GroupManagement";

export default {
  name: "Tasks",
  components: { 
    ShowTasks, 
    NewTask, 
    FilterTask, 
    SnackbarTask, 
    TaskHistory, 
    MyDay, 
    ImportantTasks, 
    TasksByCategory,
    GroupManagement
  },
  data() {
    return {
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      }
    }
  },
  mounted() {
    this.getTasks();
  },
  computed: {
    ...mapState(["loading", "tasks", "notify", "tasksDeleted", "completedTasks"]),
    getCurrentTasks() {
      return this.tasks.length;
    },
    getCompletedTasksCount() {
      return this.completedTasks.length;
    },
    getMyDayTasks() {
      return this.tasks.filter(task => {
        const taskObj = this.getTaskObject(task);
        return taskObj.addToDay && !taskObj.completed;
      }).length;
    },
    getImportantTasks() {
      return this.tasks.filter(task => {
        const taskObj = this.getTaskObject(task);
        return taskObj.important && !taskObj.completed;
      }).length;
    },
    getCategoriesCount() {
      const categories = new Set();
      this.tasks.forEach(task => {
        const taskObj = this.getTaskObject(task);
        if (taskObj.category && !taskObj.completed) {
          categories.add(taskObj.category);
        }
      });
      return categories.size;
    },
    getTotalTasks() {
      return this.getCurrentTasks + this.getCompletedTasksCount;
    },
  },
  methods: {
    ...mapActions(["getTasks"]),
    ...mapMutations(["setNotify"]),
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
    showSnackbar(config) {
      this.snackbar = {
        show: true,
        message: config.message,
        color: config.color || 'success'
      };
    },
    
    // Métodos para manejar eventos del GroupManagement
    updateTaskFromGroup({ task }) {
      // Buscar la tarea en la lista principal y actualizarla
      const allTasks = this.$store.state.tasks;
      const taskIndex = allTasks.findIndex(t => {
        const tObj = this.getTaskObject(t);
        const searchObj = this.getTaskObject(task);
        return tObj.text === searchObj.text && tObj.createdAt === searchObj.createdAt;
      });
      
      if (taskIndex !== -1) {
        this.$store.commit('updateTask', { index: taskIndex, task });
      }
    },
    
    openTaskDetailsFromGroup({ task }) {
      // Encontrar el índice real de la tarea en la lista principal
      const allTasks = this.$store.state.tasks;
      const taskIndex = allTasks.findIndex(t => {
        const tObj = this.getTaskObject(t);
        const searchObj = this.getTaskObject(task);
        return tObj.text === searchObj.text && tObj.createdAt === searchObj.createdAt;
      });
      
      if (taskIndex !== -1) {
        // Abrir el diálogo de detalles de tarea
        // Necesitaremos emitir un evento o usar refs para abrir el modal
        this.$emit('open-task-details', { task, index: taskIndex });
      }
    }
  },
};
</script>

<style scoped>
.main-container {
  padding: 32px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
}

@media (max-width: 960px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.task-card {
  background: var(--v-cardBg-base);
  border-radius: 16px;
  border: 1px solid var(--v-border-base);
  transition: all 0.3s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.section-header {
  border-bottom: 1px solid var(--v-border-base);
  padding-bottom: 16px;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper.primary {
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-secondary-base));
}

.icon-wrapper.success {
  background: linear-gradient(135deg, var(--v-success-base), #66BB6A);
}

.icon-wrapper.info {
  background: linear-gradient(135deg, var(--v-info-base), #42A5F5);
}

.icon-wrapper.warning {
  background: linear-gradient(135deg, var(--v-warning-base), #FFB74D);
}

.icon-wrapper.secondary {
  background: linear-gradient(135deg, var(--v-secondary-base), #9575CD);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--v-textPrimary-base);
  margin: 0;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 14px;
  color: var(--v-textSecondary-base);
  margin: 4px 0 0 0;
  line-height: 1.3;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.loading-text {
  color: var(--v-textSecondary-base);
  font-size: 14px;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Estadísticas compactas */
.stats-compact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
}

.stat-compact-item {
  text-align: center;
  padding: 12px 8px;
  background: var(--v-hover-base);
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid var(--v-border-base);
}

.stat-compact-item:hover {
  background: var(--v-border-base);
  transform: translateY(-1px);
}

.stat-compact-number {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-compact-label {
  font-size: 11px;
  color: var(--v-textSecondary-base);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stats-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.stats-summary .v-chip {
  font-size: 10px !important;
  height: 24px !important;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: var(--v-hover-base);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid var(--v-border-base);
}

.stat-item:hover {
  background: var(--v-border-base);
  transform: translateY(-1px);
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--v-textSecondary-base);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Animaciones */
.task-card {
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

.new-task-card {
  animation-delay: 0.1s;
}

.filter-card {
  animation-delay: 0.2s;
}

.stats-card {
  animation-delay: 0.3s;
}
</style>
