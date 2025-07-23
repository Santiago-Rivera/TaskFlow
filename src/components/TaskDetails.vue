<template>
  <v-dialog 
    v-model="dialog" 
    max-width="800" 
    persistent 
    scrollable
  >
    <v-card class="task-details-card">
      <!-- Header de la tarea -->
      <v-card-title class="task-header">
        <v-icon 
          :color="task.important ? 'red' : 'primary'" 
          class="mr-3" 
          size="28"
        >
          {{ task.important ? 'mdi-star' : 'mdi-clipboard-text' }}
        </v-icon>
        
        <div class="task-title-section flex-grow-1">
          <v-text-field
            v-if="editingTitle && !readOnly"
            v-model="editableTask.text"
            @blur="saveTitle"
            @keyup.enter="saveTitle"
            auto-focus
            dense
            hide-details
            class="task-title-input"
          ></v-text-field>
          <h2 
            v-else 
            class="task-title" 
            @click="!readOnly && (editingTitle = true)"
            :class="{ 'cursor-pointer': !readOnly }"
          >
            {{ editableTask.text }}
          </h2>
          
          <div class="task-meta">
            <v-chip
              v-if="editableTask.category"
              :color="getCategoryColor(editableTask.category)"
              small
              class="mr-2"
            >
              <v-icon left small>{{ getCategoryIcon(editableTask.category) }}</v-icon>
              {{ editableTask.category }}
            </v-chip>
            
            <v-chip
              v-if="editableTask.dueDate"
              :color="getDueDateColor()"
              small
              class="mr-2"
            >
              <v-icon left small>mdi-calendar</v-icon>
              {{ formatDate(editableTask.dueDate) }}
            </v-chip>
            
            <v-chip
              v-if="editableTask.important"
              color="red"
              small
              text-color="white"
            >
              <v-icon left small>mdi-star</v-icon>
              Importante
            </v-chip>
          </div>
        </div>
        
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Contenido del modal -->
      <v-card-text class="pa-0">
        <v-container class="py-4">
          <!-- Acciones rápidas -->
          <v-row class="mb-4">
            <v-col cols="12">
              <h3 class="section-title mb-3">
                <v-icon class="mr-2" color="primary">mdi-lightning-bolt</v-icon>
                Acciones Rápidas
              </h3>
              
              <div class="quick-actions">
                <v-btn
                  :color="editableTask.addToDay ? 'primary' : 'grey'"
                  :outlined="!editableTask.addToDay"
                  small
                  class="mr-2 mb-2"
                  @click="editableTask.addToDay = !editableTask.addToDay"
                >
                  <v-icon left small>mdi-calendar-today</v-icon>
                  {{ editableTask.addToDay ? 'En Mi Día' : 'Agregar a Mi Día' }}
                </v-btn>
                
                <v-btn
                  :color="editableTask.important ? 'red' : 'grey'"
                  :outlined="!editableTask.important"
                  small
                  class="mr-2 mb-2"
                  @click="editableTask.important = !editableTask.important"
                >
                  <v-icon left small>mdi-star</v-icon>
                  {{ editableTask.important ? 'Importante' : 'Marcar como Importante' }}
                </v-btn>
                
                <v-btn
                  color="orange"
                  outlined
                  small
                  class="mr-2 mb-2"
                  @click="showReminderDialog = true"
                >
                  <v-icon left small>mdi-bell</v-icon>
                  Recordatorio
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <!-- Fecha de vencimiento -->
          <v-row class="mb-4">
            <v-col cols="12" md="6">
              <h4 class="subsection-title mb-2">
                <v-icon class="mr-2" color="primary" small>mdi-calendar-clock</v-icon>
                Fecha de Vencimiento
              </h4>
              
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="editableTask.dueDate ? formatDate(editableTask.dueDate) : ''"
                    label="Seleccionar fecha"
                    prepend-icon="mdi-calendar"
                    readonly
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                    clearable
                    @click:clear="editableTask.dueDate = null"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="editableTask.dueDate"
                  @input="dateMenu = false"
                  :min="new Date().toISOString().substr(0, 10)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            
            <!-- Repetir tarea -->
            <v-col cols="12" md="6">
              <h4 class="subsection-title mb-2">
                <v-icon class="mr-2" color="primary" small>mdi-repeat</v-icon>
                Repetir
              </h4>
              
              <v-select
                v-model="editableTask.repeat"
                :items="repeatOptions"
                label="Frecuencia de repetición"
                prepend-icon="mdi-repeat"
                outlined
                dense
                clearable
              ></v-select>
            </v-col>
          </v-row>

          <!-- Categoría -->
          <v-row class="mb-4">
            <v-col cols="12" md="6">
              <h4 class="subsection-title mb-2">
                <v-icon class="mr-2" color="primary" small>mdi-tag</v-icon>
                Categoría
              </h4>
              
              <v-select
                v-model="editableTask.category"
                :items="categoryOptions"
                label="Seleccionar categoría"
                prepend-icon="mdi-tag"
                outlined
                dense
                clearable
              >
                <template v-slot:item="{ item }">
                  <v-icon :color="item.color" class="mr-2">{{ item.icon }}</v-icon>
                  {{ item.text }}
                </template>
                <template v-slot:selection="{ item }">
                  <v-icon :color="item.color" class="mr-2" small>{{ item.icon }}</v-icon>
                  {{ item.text }}
                </template>
              </v-select>
            </v-col>
          </v-row>

          <!-- Asignación de Grupo -->
          <v-row class="mb-4">
            <v-col cols="12" md="6">
              <h4 class="subsection-title mb-2">
                <v-icon class="mr-2" color="primary" small>mdi-account-group</v-icon>
                Grupo de Trabajo
              </h4>
              
              <v-select
                v-model="editableTask.assignedGroup"
                :items="groupOptions"
                item-text="name"
                item-value="id"
                label="Asignar a grupo"
                prepend-icon="mdi-account-group"
                outlined
                dense
                clearable
              >
                <template v-slot:item="{ item }">
                  <v-list-item-avatar size="30">
                    <v-avatar color="primary" size="30">
                      <span class="white--text text-caption">{{ item.name.substring(0, 2).toUpperCase() }}</span>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.members.length }} miembros</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:selection="{ item }">
                  <v-avatar color="primary" size="24" class="mr-2">
                    <span class="white--text text-caption">{{ item.name.substring(0, 2).toUpperCase() }}</span>
                  </v-avatar>
                  {{ item.name }}
                </template>
              </v-select>
            </v-col>
            
            <!-- Miembros asignados específicos -->
            <v-col cols="12" md="6" v-if="selectedGroupMembers.length > 0">
              <h4 class="subsection-title mb-2">
                <v-icon class="mr-2" color="primary" small>mdi-account-multiple</v-icon>
                Asignar Miembros
              </h4>
              
              <v-select
                v-model="editableTask.assignedMembers"
                :items="selectedGroupMembers"
                item-text="name"
                item-value="id"
                label="Seleccionar miembros específicos"
                prepend-icon="mdi-account-multiple"
                outlined
                dense
                multiple
                chips
                deletable-chips
              >
                <template v-slot:item="{ item }">
                  <v-list-item-avatar size="30">
                    <v-avatar color="secondary" size="30">
                      <span class="white--text text-caption">{{ item.name.substring(0, 2).toUpperCase() }}</span>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.role || 'Miembro' }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:selection="{ item }">
                  <v-chip small>
                    <v-avatar left>
                      <v-avatar color="secondary" size="20">
                        <span class="white--text text-caption">{{ item.name.substring(0, 1).toUpperCase() }}</span>
                      </v-avatar>
                    </v-avatar>
                    {{ item.name }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>
          </v-row>

          <!-- Archivos adjuntos -->
          <v-row class="mb-4">
            <v-col cols="12">
              <h4 class="subsection-title mb-2">
                <v-icon class="mr-2" color="primary" small>mdi-attachment</v-icon>
                Archivos Adjuntos
                <v-chip 
                  v-if="editableTask.attachments && editableTask.attachments.length > 0"
                  small 
                  color="primary" 
                  text-color="white" 
                  class="ml-2"
                >
                  {{ editableTask.attachments.length }}
                </v-chip>
              </h4>
              
              <v-file-input
                v-model="newFiles"
                label="Agregar archivos, fotos o videos"
                prepend-icon="mdi-paperclip"
                outlined
                dense
                multiple
                show-size
                accept="image/*,video/*,.pdf,.doc,.docx,.txt,.xlsx,.pptx"
                @change="addFiles"
              ></v-file-input>
              
              <!-- Visualizador de archivos mejorado -->
              <div v-if="editableTask.attachments && editableTask.attachments.length > 0" class="mt-4">
                <v-subheader class="pl-0 mb-2">
                  <v-icon small class="mr-2" color="grey">mdi-folder-open</v-icon>
                  Archivos adjuntados ({{ editableTask.attachments.length }})
                </v-subheader>
                
                <!-- Vista de cuadrícula para archivos -->
                <div class="file-grid">
                  <v-card
                    v-for="(file, index) in editableTask.attachments"
                    :key="index"
                    class="file-card"
                    elevation="2"
                    @click="openFilePreview(file, index)"
                  >
                    <!-- Vista previa del archivo -->
                    <div class="file-preview">
                      <!-- Vista previa para imágenes -->
                      <div 
                        v-if="isImage(file.type)" 
                        class="image-preview"
                        :style="{ backgroundImage: `url(${file.url})` }"
                      >
                        <div class="image-overlay">
                          <v-icon color="white" size="24">mdi-eye</v-icon>
                        </div>
                      </div>
                      
                      <!-- Vista previa para videos -->
                      <div 
                        v-else-if="isVideo(file.type)" 
                        class="video-preview"
                      >
                        <video :src="file.url" class="video-thumbnail" muted></video>
                        <div class="video-overlay">
                          <v-icon color="white" size="32">mdi-play-circle</v-icon>
                        </div>
                      </div>
                      
                      <!-- Icono para otros archivos -->
                      <div v-else class="file-icon-preview">
                        <v-icon 
                          :color="getFileColor(file.type)" 
                          size="48"
                        >
                          {{ getFileIcon(file.type) }}
                        </v-icon>
                      </div>
                    </div>
                    
                    <!-- Información del archivo -->
                    <v-card-text class="file-info pa-2">
                      <div class="file-name" :title="file.name">
                        {{ truncateFileName(file.name, 20) }}
                      </div>
                      <div class="file-details">
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                        <span class="file-type">{{ getFileTypeLabel(file.type) }}</span>
                      </div>
                      <div class="file-date">
                        {{ formatFileDate(file.uploadedAt) }}
                      </div>
                    </v-card-text>
                    
                    <!-- Acciones del archivo -->
                    <v-card-actions class="pa-1">
                      <v-btn
                        icon
                        small
                        color="primary"
                        @click.stop="downloadFile(file)"
                        title="Descargar"
                      >
                        <v-icon small>mdi-download</v-icon>
                      </v-btn>
                      
                      <v-btn
                        v-if="isImage(file.type) || isVideo(file.type)"
                        icon
                        small
                        color="info"
                        @click.stop="openFilePreview(file, index)"
                        title="Vista previa"
                      >
                        <v-icon small>mdi-eye</v-icon>
                      </v-btn>
                      
                      <v-spacer></v-spacer>
                      
                      <v-btn
                        icon
                        small
                        color="error"
                        @click.stop="removeFileWithConfirmation(index)"
                        title="Eliminar"
                      >
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </div>
                
                <!-- Información de almacenamiento -->
                <v-card class="mt-3" outlined>
                  <v-card-text class="pa-2">
                    <div class="d-flex align-center">
                      <v-icon small color="info" class="mr-2">mdi-information</v-icon>
                      <span class="text-caption">
                        Total: {{ getTotalFileSize() }} en {{ editableTask.attachments.length }} archivo{{ editableTask.attachments.length !== 1 ? 's' : '' }}
                      </span>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </v-col>
          </v-row>

          <!-- Dialog de vista previa de archivos -->
          <v-dialog v-model="filePreviewDialog" max-width="800px">
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="primary">{{ selectedFile && getFileIcon(selectedFile.type) }}</v-icon>
                {{ selectedFile && selectedFile.name }}
                <v-spacer></v-spacer>
                <v-btn icon @click="filePreviewDialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              
              <v-card-text class="pa-0" v-if="selectedFile">
                <!-- Vista previa de imagen -->
                <div v-if="isImage(selectedFile.type)" class="text-center">
                  <img 
                    :src="selectedFile.url" 
                    :alt="selectedFile.name"
                    style="max-width: 100%; max-height: 500px; object-fit: contain;"
                  />
                </div>
                
                <!-- Vista previa de video -->
                <div v-else-if="isVideo(selectedFile.type)" class="text-center">
                  <video 
                    :src="selectedFile.url"
                    controls
                    style="max-width: 100%; max-height: 500px;"
                  >
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </div>
                
                <!-- Vista previa de otros archivos -->
                <div v-else class="text-center pa-4">
                  <v-icon size="100" :color="getFileColor(selectedFile.type)">
                    {{ getFileIcon(selectedFile.type) }}
                  </v-icon>
                  <h3 class="mt-4">{{ selectedFile.name }}</h3>
                  <p class="text-subtitle-1">{{ getFileTypeLabel(selectedFile.type) }}</p>
                  <p class="text-caption">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
              </v-card-text>
              
              <v-card-actions>
                <v-btn
                  color="primary"
                  @click="downloadFile(selectedFile)"
                >
                  <v-icon left>mdi-download</v-icon>
                  Descargar
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="filePreviewDialog = false">
                  Cerrar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Dialog de confirmación para eliminar archivo -->
          <v-dialog v-model="deleteFileDialog" max-width="400px">
            <v-card>
              <v-card-title>
                <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
                Eliminar Archivo
              </v-card-title>
              <v-card-text>
                ¿Estás seguro de que quieres eliminar el archivo <strong>{{ fileToDelete && fileToDelete.name }}</strong>?
                <br><br>
                <small class="text--secondary">Esta acción no se puede deshacer.</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="deleteFileDialog = false">
                  Cancelar
                </v-btn>
                <v-btn color="error" @click="confirmDeleteFile">
                  <v-icon left small>mdi-delete</v-icon>
                  Eliminar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Notas -->
          <v-row>
            <v-col cols="12">
              <h4 class="subsection-title mb-2">
                <v-icon class="mr-2" color="primary" small>mdi-note-text</v-icon>
                Notas
              </h4>
              
              <v-textarea
                v-model="editableTask.notes"
                label="Agregar notas o detalles adicionales..."
                prepend-icon="mdi-note-text-outline"
                outlined
                rows="4"
                auto-grow
                counter
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Acciones del modal -->
      <v-card-actions class="px-6 py-4">
        <v-btn
          v-if="!readOnly"
          color="error"
          outlined
          @click="deleteTask"
        >
          <v-icon left>mdi-delete</v-icon>
          Eliminar
        </v-btn>
        
        <v-spacer></v-spacer>
        
        <v-btn
          text
          @click="closeDialog"
        >
          {{ readOnly ? 'Cerrar' : 'Cancelar' }}
        </v-btn>
        
        <v-btn
          v-if="!readOnly"
          color="primary"
          @click="saveTask"
          :loading="saving"
        >
          <v-icon left>mdi-content-save</v-icon>
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Dialog de recordatorio -->
    <v-dialog v-model="showReminderDialog" max-width="400">
      <v-card>
        <v-card-title>Configurar Recordatorio</v-card-title>
        <v-card-text>
          <v-select
            v-model="editableTask.reminder"
            :items="reminderOptions"
            label="Cuándo recordar"
            outlined
            dense
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showReminderDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="showReminderDialog = false">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
export default {
  name: 'TaskDetails',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
      required: true
    },
    taskIndex: {
      type: Number,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      editingTitle: false,
      saving: false,
      dateMenu: false,
      showReminderDialog: false,
      newFiles: [],
      editableTask: {},
      // Nuevas propiedades para el visualizador de archivos
      filePreviewDialog: false,
      selectedFile: null,
      selectedFileIndex: -1,
      deleteFileDialog: false,
      fileToDelete: null,
      fileToDeleteIndex: -1,
      categoryOptions: [
        { text: 'Trabajo', value: 'trabajo', color: 'blue', icon: 'mdi-briefcase' },
        { text: 'Personal', value: 'personal', color: 'green', icon: 'mdi-account' },
        { text: 'Hogar', value: 'hogar', color: 'orange', icon: 'mdi-home' },
        { text: 'Salud', value: 'salud', color: 'red', icon: 'mdi-heart' },
        { text: 'Educación', value: 'educacion', color: 'purple', icon: 'mdi-school' },
        { text: 'Finanzas', value: 'finanzas', color: 'teal', icon: 'mdi-currency-usd' },
        { text: 'Compras', value: 'compras', color: 'pink', icon: 'mdi-cart' },
        { text: 'Viajes', value: 'viajes', color: 'indigo', icon: 'mdi-airplane' }
      ],
      repeatOptions: [
        { text: 'No repetir', value: null },
        { text: 'Diariamente', value: 'daily' },
        { text: 'Semanalmente', value: 'weekly' },
        { text: 'Mensualmente', value: 'monthly' },
        { text: 'Anualmente', value: 'yearly' }
      ],
      reminderOptions: [
        { text: 'Sin recordatorio', value: null },
        { text: '15 minutos antes', value: '15min' },
        { text: '1 hora antes', value: '1hour' },
        { text: '1 día antes', value: '1day' },
        { text: 'En la fecha de vencimiento', value: 'due' }
      ]
    }
  },
  computed: {
    // Opciones de grupos disponibles
    groupOptions() {
      return this.$store.state.groups || []
    },
    
    // Miembros del grupo seleccionado
    selectedGroupMembers() {
      if (!this.editableTask.assignedGroup) {
        return []
      }
      
      const selectedGroup = this.groupOptions.find(group => group.id === this.editableTask.assignedGroup)
      return selectedGroup ? selectedGroup.members : []
    }
  },
  watch: {
    showDialog(newVal) {
      this.dialog = newVal
      if (newVal) {
        this.loadTask()
      }
    },
    dialog(newVal) {
      if (!newVal) {
        this.$emit('close-dialog')
      }
    },
    // Watcher para limpiar miembros asignados cuando se cambie el grupo
    'editableTask.assignedGroup'(newGroupId) {
      if (!newGroupId) {
        this.editableTask.assignedMembers = []
      } else {
        // Si se cambia a un nuevo grupo, limpiar miembros asignados previamente
        this.editableTask.assignedMembers = []
      }
    }
  },
  methods: {
    loadTask() {
      // Crear una copia profunda de la tarea para editar
      this.editableTask = {
        text: this.task.text || this.task,
        completed: this.task.completed || false,
        addToDay: this.task.addToDay || false,
        important: this.task.important || false,
        dueDate: this.task.dueDate || null,
        repeat: this.task.repeat || null,
        category: this.task.category || null,
        attachments: this.task.attachments ? [...this.task.attachments] : [],
        notes: this.task.notes || '',
        reminder: this.task.reminder || null,
        assignedGroup: this.task.assignedGroup || null,
        assignedMembers: this.task.assignedMembers ? [...this.task.assignedMembers] : [],
        createdAt: this.task.createdAt || new Date().toISOString()
      }
    },
    saveTitle() {
      this.editingTitle = false
      if (!this.editableTask.text.trim()) {
        this.editableTask.text = this.task.text || this.task
      }
    },
    addFiles() {
      if (this.newFiles && this.newFiles.length > 0) {
        this.newFiles.forEach(file => {
          const fileInfo = {
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString()
          }
          this.editableTask.attachments.push(fileInfo)
        })
        this.newFiles = []
      }
    },
    removeFile(index) {
      // Liberar URL del objeto si existe
      if (this.editableTask.attachments[index].url) {
        URL.revokeObjectURL(this.editableTask.attachments[index].url)
      }
      this.editableTask.attachments.splice(index, 1)
    },
    getFileIcon(type) {
      if (type.startsWith('image/')) return 'mdi-image'
      if (type.startsWith('video/')) return 'mdi-video'
      if (type.includes('pdf')) return 'mdi-file-pdf-box'
      if (type.includes('word')) return 'mdi-file-word'
      if (type.includes('text')) return 'mdi-file-document'
      return 'mdi-file'
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    getCategoryColor(category) {
      const cat = this.categoryOptions.find(c => c.value === category)
      return cat ? cat.color : 'grey'
    },
    getCategoryIcon(category) {
      const cat = this.categoryOptions.find(c => c.value === category)
      return cat ? cat.icon : 'mdi-tag'
    },
    formatDate(date) {
      if (!date) return ''
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
      }
      return new Date(date).toLocaleDateString('es-ES', options)
    },
    getDueDateColor() {
      if (!this.editableTask.dueDate) return 'grey'
      const today = new Date()
      const dueDate = new Date(this.editableTask.dueDate)
      const diffTime = dueDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return 'red' // Vencida
      if (diffDays === 0) return 'orange' // Hoy
      if (diffDays <= 3) return 'yellow' // Próxima
      return 'green' // Futura
    },
    async saveTask() {
      this.saving = true
      
      try {
        // Simular guardado
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Emitir evento para actualizar la tarea en el componente padre
        this.$emit('update-task', {
          index: this.taskIndex,
          task: { ...this.editableTask }
        })
        
        this.$emit('show-snackbar', {
          message: 'Tarea actualizada exitosamente',
          color: 'success'
        })
        
        this.closeDialog()
      } catch (error) {
        this.$emit('show-snackbar', {
          message: 'Error al guardar la tarea',
          color: 'error'
        })
      } finally {
        this.saving = false
      }
    },
    deleteTask() {
      if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        this.$emit('delete-task', this.taskIndex)
        this.closeDialog()
      }
    },
    closeDialog() {
      this.editingTitle = false
      this.dialog = false
      // Limpiar URLs de archivos
      this.editableTask.attachments?.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url)
        }
      })
    },
    // Nuevas funciones para el visualizador de archivos
    isImage(type) {
      return type && type.startsWith('image/')
    },
    isVideo(type) {
      return type && type.startsWith('video/')
    },
    getFileColor(type) {
      if (this.isImage(type)) return 'green'
      if (this.isVideo(type)) return 'red'
      if (type && type.includes('pdf')) return 'red'
      if (type && type.includes('word')) return 'blue'
      if (type && type.includes('excel')) return 'green'
      if (type && type.includes('powerpoint')) return 'orange'
      if (type && type.includes('text')) return 'grey'
      return 'blue'
    },
    getFileTypeLabel(type) {
      if (this.isImage(type)) return 'Imagen'
      if (this.isVideo(type)) return 'Video'
      if (type && type.includes('pdf')) return 'PDF'
      if (type && type.includes('word')) return 'Word'
      if (type && type.includes('excel')) return 'Excel'
      if (type && type.includes('powerpoint')) return 'PowerPoint'
      if (type && type.includes('text')) return 'Texto'
      return 'Archivo'
    },
    truncateFileName(name, maxLength) {
      if (name.length <= maxLength) return name
      const extension = name.split('.').pop()
      const nameWithoutExt = name.substring(0, name.lastIndexOf('.'))
      const truncated = nameWithoutExt.substring(0, maxLength - extension.length - 4)
      return `${truncated}...${extension}`
    },
    formatFileDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getTotalFileSize() {
      if (!this.editableTask.attachments) return '0 KB'
      const totalBytes = this.editableTask.attachments.reduce((total, file) => total + file.size, 0)
      return this.formatFileSize(totalBytes)
    },
    openFilePreview(file, index) {
      this.selectedFile = file
      this.selectedFileIndex = index
      this.filePreviewDialog = true
    },
    downloadFile(file) {
      if (file.url) {
        const link = document.createElement('a')
        link.href = file.url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },
    removeFileWithConfirmation(index) {
      this.fileToDelete = this.editableTask.attachments[index]
      this.fileToDeleteIndex = index
      this.deleteFileDialog = true
    },
    confirmDeleteFile() {
      if (this.fileToDeleteIndex >= 0) {
        this.removeFile(this.fileToDeleteIndex)
        this.deleteFileDialog = false
        this.fileToDelete = null
        this.fileToDeleteIndex = -1
      }
    },
    
    // Métodos relacionados con grupos
    getAssignedGroupInfo() {
      if (!this.editableTask.assignedGroup) return null
      
      const group = this.groupOptions.find(g => g.id === this.editableTask.assignedGroup)
      return group || null
    },
    
    getAssignedMembersInfo() {
      if (!this.editableTask.assignedMembers || this.editableTask.assignedMembers.length === 0) {
        return []
      }
      
      const groupInfo = this.getAssignedGroupInfo()
      if (!groupInfo) return []
      
      return this.editableTask.assignedMembers.map(memberId => {
        return groupInfo.members.find(member => member.id === memberId)
      }).filter(member => member) // Filtrar miembros no encontrados
    },
    
    getGroupDisplayText() {
      const groupInfo = this.getAssignedGroupInfo()
      if (!groupInfo) return ''
      
      const membersInfo = this.getAssignedMembersInfo()
      
      if (membersInfo.length === 0) {
        return `${groupInfo.name} (Todo el grupo)`
      } else if (membersInfo.length === 1) {
        return `${groupInfo.name} - ${membersInfo[0].name}`
      } else {
        return `${groupInfo.name} - ${membersInfo.length} miembros`
      }
    }
  }
}
</script>

<style scoped>
.task-details-card {
  border-radius: 16px;
  overflow: hidden;
}

.task-header {
  background: linear-gradient(135deg, var(--v-primary-base) 0%, var(--v-primary-darken1) 100%);
  color: white;
  padding: 20px 24px;
}

.task-title {
  margin: 0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.task-title:hover {
  opacity: 0.8;
}

.task-title-input >>> .v-input__slot {
  background: rgba(255,255,255,0.1) !important;
}

.task-title-input >>> input {
  color: white !important;
  font-size: 1.5rem !important;
  font-weight: 500 !important;
}

.task-meta {
  margin-top: 8px;
}

.section-title {
  color: var(--v-primary-base);
  font-weight: 500;
  display: flex;
  align-items: center;
}

.subsection-title {
  color: var(--v-text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Dark mode adjustments */
.theme--dark .task-header {
  background: linear-gradient(135deg, var(--v-primary-base) 0%, var(--v-primary-darken2) 100%);
}

.theme--dark .task-details-card {
  background-color: var(--v-surface-base);
}

/* File chips styling */
.v-chip {
  max-width: 300px;
}

.v-chip >>> .v-chip__content {
  overflow: hidden;
  text-overflow: ellipsis;
}

.cursor-pointer {
  cursor: pointer;
}

/* Visualizador de archivos */
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.file-card {
  border-radius: 12px !important;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.file-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.file-preview {
  position: relative;
  height: 120px;
  background: var(--v-grey-lighten4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.file-card:hover .image-overlay {
  opacity: 1;
}

.video-preview {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.7);
  border-radius: 50%;
  padding: 8px;
}

.file-icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.file-info {
  min-height: 80px;
}

.file-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--v-textPrimary-base);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.file-size {
  font-size: 0.75rem;
  color: var(--v-textSecondary-base);
  background: var(--v-grey-lighten3);
  padding: 2px 6px;
  border-radius: 4px;
}

.file-type {
  font-size: 0.75rem;
  color: var(--v-primary-base);
  font-weight: 500;
}

.file-date {
  font-size: 0.7rem;
  color: var(--v-textSecondary-base);
}

/* Dark theme support */
.theme--dark .file-preview {
  background: var(--v-grey-darken3);
}

.theme--dark .file-size {
  background: var(--v-grey-darken2);
  color: var(--v-grey-lighten2);
}
</style>
