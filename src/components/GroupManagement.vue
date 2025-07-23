<template>
  <div class="group-management-container">
    <!-- Lista de grupos existentes -->
    <div v-if="groups.length > 0">
      <v-list class="py-0">
        <div v-for="(group, index) in displayedGroups" :key="index">
          <v-list-item 
            class="group-item"
            @click="openGroupDetails(group)"
          >
            <v-list-item-avatar class="mr-3" size="24">
              <div class="group-avatar" :style="{ backgroundColor: group.color }">
                <v-icon color="white" size="14">{{ group.icon }}</v-icon>
              </div>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="group-name">
                {{ group.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="group-info">
                {{ group.members.length }} miembro{{ group.members.length !== 1 ? 's' : '' }} • 
                {{ getGroupTasksCount(group.id) }} tarea{{ getGroupTasksCount(group.id) !== 1 ? 's' : '' }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <div class="d-flex">
                <v-btn
                  icon
                  small
                  color="success"
                  @click.stop="showGroupTasks(group)"
                  title="Ver tareas"
                  class="mr-1"
                >
                  <v-icon small>mdi-format-list-bulleted</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="primary"
                  @click.stop="openGroupDetails(group)"
                  title="Ver detalles"
                >
                  <v-icon small>mdi-eye</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="index < displayedGroups.length - 1"></v-divider>
        </div>
      </v-list>

      <!-- Botón para ver más grupos -->
      <div v-if="groups.length > maxDisplay" class="mt-3">
        <v-chip
          small
          color="primary"
          text-color="white"
          class="more-chip"
        >
          <v-icon left small>mdi-account-group</v-icon>
          +{{ groups.length - maxDisplay }} grupos más
        </v-chip>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <div class="empty-input">
        <v-icon color="grey lighten-1" size="20" class="mr-2">mdi-account-group-outline</v-icon>
        <span class="grey--text">No hay grupos creados</span>
      </div>
    </div>

    <!-- Botón flotante para crear grupo -->
    <v-btn
      fab
      small
      color="primary"
      class="create-group-btn"
      @click="showCreateGroupDialog = true"
      title="Crear nuevo grupo"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Dialog para crear/editar grupo -->
    <v-dialog v-model="showCreateGroupDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
          {{ editingGroup ? 'Editar Grupo' : 'Crear Nuevo Grupo' }}
        </v-card-title>

        <v-card-text>
          <v-form ref="groupForm" v-model="groupFormValid">
            <!-- Información básica del grupo -->
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="groupForm.name"
                  label="Nombre del grupo"
                  :rules="[rules.required]"
                  outlined
                  dense
                  prepend-inner-icon="mdi-account-group"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="groupForm.color"
                  :items="groupColors"
                  label="Color"
                  outlined
                  dense
                  prepend-inner-icon="mdi-palette"
                >
                  <template v-slot:item="{ item }">
                    <div class="d-flex align-center">
                      <div 
                        class="color-circle mr-2" 
                        :style="{ backgroundColor: item.value }"
                      ></div>
                      {{ item.text }}
                    </div>
                  </template>
                  <template v-slot:selection="{ item }">
                    <div class="d-flex align-center">
                      <div 
                        class="color-circle mr-2" 
                        :style="{ backgroundColor: item.value }"
                      ></div>
                      {{ item.text }}
                    </div>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="groupForm.icon"
                  :items="groupIcons"
                  label="Icono"
                  outlined
                  dense
                  prepend-inner-icon="mdi-shape"
                >
                  <template v-slot:item="{ item }">
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">{{ item.value }}</v-icon>
                      {{ item.text }}
                    </div>
                  </template>
                  <template v-slot:selection="{ item }">
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">{{ item.value }}</v-icon>
                      {{ item.text }}
                    </div>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="groupForm.category"
                  :items="groupCategories"
                  label="Categoría"
                  outlined
                  dense
                  prepend-inner-icon="mdi-tag"
                ></v-select>
              </v-col>
            </v-row>

            <v-textarea
              v-model="groupForm.description"
              label="Descripción del grupo"
              outlined
              dense
              rows="3"
              prepend-inner-icon="mdi-text"
            ></v-textarea>

            <!-- Gestión de miembros -->
            <h4 class="mb-3">
              <v-icon class="mr-2" color="primary">mdi-account-multiple</v-icon>
              Miembros del Grupo
            </h4>

            <!-- Agregar nuevo miembro -->
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newMember.name"
                  label="Nombre del miembro"
                  outlined
                  dense
                  prepend-inner-icon="mdi-account"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="newMember.email"
                  label="Email"
                  type="email"
                  outlined
                  dense
                  prepend-inner-icon="mdi-email"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="primary"
                  @click="addMember"
                  :disabled="!newMember.name || !newMember.email"
                  block
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <!-- Lista de miembros -->
            <div v-if="groupForm.members.length > 0" class="mt-3">
              <v-list dense>
                <v-list-item
                  v-for="(member, index) in groupForm.members"
                  :key="index"
                  class="member-item"
                >
                  <v-list-item-avatar size="32">
                    <v-avatar :color="getAvatarColor(member.name)" size="32">
                      <span class="white--text text-caption">
                        {{ getInitials(member.name) }}
                      </span>
                    </v-avatar>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ member.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ member.email }}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-select
                      v-model="member.role"
                      :items="memberRoles"
                      dense
                      class="role-select"
                    ></v-select>
                  </v-list-item-action>

                  <v-list-item-action>
                    <v-btn
                      icon
                      small
                      color="error"
                      @click="removeMember(index)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeGroupDialog">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="saveGroup"
            :disabled="!groupFormValid"
          >
            {{ editingGroup ? 'Actualizar' : 'Crear' }} Grupo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de detalles del grupo -->
    <v-dialog v-model="showGroupDetailsDialog" max-width="700px">
      <v-card v-if="selectedGroup">
        <v-card-title class="group-header" :style="{ backgroundColor: selectedGroup.color }">
          <v-icon color="white" class="mr-2">{{ selectedGroup.icon }}</v-icon>
          <span class="white--text">{{ selectedGroup.name }}</span>
          <v-spacer></v-spacer>
          <v-btn icon color="white" @click="editGroup(selectedGroup)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="white" @click="showGroupDetailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <!-- Información del grupo -->
          <div class="mb-4">
            <h4 class="mb-2">Descripción</h4>
            <p class="text-body-2">{{ selectedGroup.description || 'Sin descripción' }}</p>
          </div>

          <!-- Miembros del grupo -->
          <div class="mb-4">
            <h4 class="mb-2">
              Miembros ({{ selectedGroup.members.length }})
            </h4>
            <v-list dense>
              <v-list-item
                v-for="member in selectedGroup.members"
                :key="member.email"
              >
                <v-list-item-avatar size="36">
                  <v-avatar :color="getAvatarColor(member.name)" size="36">
                    <span class="white--text">{{ getInitials(member.name) }}</span>
                  </v-avatar>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ member.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ member.email }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-chip small :color="getRoleColor(member.role)">
                    {{ member.role }}
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </div>

          <!-- Tareas del grupo -->
          <div>
            <h4 class="mb-2">
              Tareas asignadas ({{ getGroupTasks(selectedGroup.id).length }})
            </h4>
            <div v-if="getGroupTasks(selectedGroup.id).length === 0" class="text-center py-4">
              <v-icon size="48" color="grey lighten-2">mdi-clipboard-text-outline</v-icon>
              <p class="grey--text mt-2">No hay tareas asignadas a este grupo</p>
            </div>
            <v-list v-else dense>
              <v-list-item
                v-for="task in getGroupTasks(selectedGroup.id)"
                :key="task.id"
              >
                <v-list-item-icon>
                  <v-icon :color="task.completed ? 'success' : 'grey'">
                    {{ task.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title :class="{ 'text-decoration-line-through': task.completed }">
                    {{ getTaskText(task) }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="task.assignedTo">
                    Asignada a: {{ task.assignedTo }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-chip
                    x-small
                    :color="task.completed ? 'success' : 'warning'"
                  >
                    {{ task.completed ? 'Completada' : 'Pendiente' }}
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" @click="deleteGroup(selectedGroup.id)">
            <v-icon left>mdi-delete</v-icon>
            Eliminar Grupo
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="showGroupDetailsDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para mostrar tareas del grupo -->
    <v-dialog v-model="showGroupTasksDialog" max-width="800px">
      <v-card class="group-tasks-card">
        <v-card-title class="group-tasks-header" :style="{ backgroundColor: selectedTaskGroup && selectedTaskGroup.color }">
          <div class="d-flex align-center">
            <v-icon color="white" class="mr-3">{{ selectedTaskGroup && selectedTaskGroup.icon }}</v-icon>
            <div>
              <h3 class="white--text mb-0">{{ selectedTaskGroup && selectedTaskGroup.name }}</h3>
              <p class="white--text mb-0 opacity-90">
                {{ getGroupTasks(selectedTaskGroup && selectedTaskGroup.id).length }} 
                tarea{{ getGroupTasks(selectedTaskGroup && selectedTaskGroup.id).length !== 1 ? 's' : '' }} asignada{{ getGroupTasks(selectedTaskGroup && selectedTaskGroup.id).length !== 1 ? 's' : '' }}
              </p>
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="showGroupTasksDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-0" style="max-height: 500px; overflow-y: auto;">
          <!-- Estado vacío -->
          <div v-if="getGroupTasks(selectedTaskGroup && selectedTaskGroup.id).length === 0" class="text-center py-8">
            <v-icon size="80" color="grey lighten-2">mdi-clipboard-text-outline</v-icon>
            <h3 class="mt-4 grey--text">No hay tareas asignadas</h3>
            <p class="grey--text">Este grupo aún no tiene tareas asignadas</p>
          </div>

          <!-- Lista de tareas -->
          <v-list v-else two-line>
            <div v-for="(task, index) in getGroupTasks(selectedTaskGroup && selectedTaskGroup.id)" :key="task.id || index">
              <v-list-item 
                class="task-item-group"
                @click="openTaskDetails(task, index)"
              >
                <v-list-item-action>
                  <v-checkbox
                    :input-value="task.completed"
                    @change="toggleTaskComplete(task, index)"
                    @click.stop
                    color="success"
                  ></v-checkbox>
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title 
                    :class="{ 'text-decoration-line-through grey--text': task.completed }"
                  >
                    {{ getTaskText(task) }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle class="d-flex align-center mt-1">
                    <!-- Indicadores de la tarea -->
                    <div class="task-indicators-group">
                      <v-icon 
                        v-if="task.important" 
                        color="red" 
                        small 
                        class="mr-1"
                      >
                        mdi-star
                      </v-icon>
                      
                      <v-icon 
                        v-if="task.dueDate" 
                        :color="getDueDateColor(task.dueDate)"
                        small 
                        class="mr-1"
                      >
                        mdi-calendar-clock
                      </v-icon>
                      
                      <v-icon 
                        v-if="task.attachments && task.attachments.length > 0" 
                        color="blue" 
                        small 
                        class="mr-1"
                      >
                        mdi-attachment
                      </v-icon>
                      
                      <v-icon 
                        v-if="task.notes" 
                        color="orange" 
                        small 
                        class="mr-1"
                      >
                        mdi-note-text
                      </v-icon>
                    </div>

                    <!-- Miembros asignados específicos -->
                    <div v-if="task.assignedMembers && task.assignedMembers.length > 0" class="ml-auto">
                      <v-chip
                        v-for="memberId in task.assignedMembers.slice(0, 3)"
                        :key="memberId"
                        x-small
                        class="mr-1"
                        :color="getAssignedMemberInfo(memberId, selectedTaskGroup).color"
                      >
                        {{ getAssignedMemberInfo(memberId, selectedTaskGroup).name }}
                      </v-chip>
                      <v-chip
                        v-if="task.assignedMembers.length > 3"
                        x-small
                        color="grey"
                      >
                        +{{ task.assignedMembers.length - 3 }}
                      </v-chip>
                    </div>
                    <div v-else class="ml-auto">
                      <v-chip x-small color="primary">
                        Todo el grupo
                      </v-chip>
                    </div>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon small @click.stop="openTaskDetails(task, index)">
                    <v-icon small>mdi-open-in-new</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              
              <v-divider v-if="index < getGroupTasks(selectedTaskGroup && selectedTaskGroup.id).length - 1"></v-divider>
            </div>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="showGroupTasksDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'GroupManagement',
  data() {
    return {
      maxDisplay: 3,
      showCreateGroupDialog: false,
      showGroupDetailsDialog: false,
      showGroupTasksDialog: false,
      selectedGroup: null,
      selectedTaskGroup: null,
      editingGroup: false,
      groupFormValid: false,
      groupForm: {
        name: '',
        description: '',
        color: '#2196f3',
        icon: 'mdi-account-group',
        category: 'trabajo',
        members: []
      },
      newMember: {
        name: '',
        email: '',
        role: 'miembro'
      },
      rules: {
        required: value => !!value || 'Este campo es obligatorio'
      },
      groupColors: [
        { text: 'Azul', value: '#2196f3' },
        { text: 'Verde', value: '#4caf50' },
        { text: 'Rojo', value: '#f44336' },
        { text: 'Púrpura', value: '#9c27b0' },
        { text: 'Naranja', value: '#ff9800' },
        { text: 'Teal', value: '#009688' },
        { text: 'Indigo', value: '#3f51b5' },
        { text: 'Rosa', value: '#e91e63' }
      ],
      groupIcons: [
        { text: 'Grupo', value: 'mdi-account-group' },
        { text: 'Equipo', value: 'mdi-account-multiple' },
        { text: 'Trabajo', value: 'mdi-briefcase' },
        { text: 'Proyecto', value: 'mdi-folder-multiple' },
        { text: 'Familia', value: 'mdi-home-group' },
        { text: 'Estudio', value: 'mdi-school' },
        { text: 'Deporte', value: 'mdi-run' },
        { text: 'Creatividad', value: 'mdi-lightbulb-group' }
      ],
      groupCategories: [
        { text: 'Trabajo', value: 'trabajo' },
        { text: 'Personal', value: 'personal' },
        { text: 'Familia', value: 'familia' },
        { text: 'Educación', value: 'educacion' },
        { text: 'Deporte', value: 'deporte' },
        { text: 'Hogar', value: 'hogar' }
      ],
      memberRoles: [
        { text: 'Administrador', value: 'admin' },
        { text: 'Coordinador', value: 'coordinador' },
        { text: 'Miembro', value: 'miembro' }
      ]
    }
  },
  computed: {
    ...mapState(['tasks']),
    groups() {
      return this.$store.state.groups || []
    },
    displayedGroups() {
      return this.groups.slice(0, this.maxDisplay)
    }
  },
  methods: {
    openGroupDetails(group) {
      this.selectedGroup = group
      this.showGroupDetailsDialog = true
    },
    addMember() {
      if (this.newMember.name && this.newMember.email) {
        this.groupForm.members.push({
          ...this.newMember,
          id: Date.now(),
          joinedAt: new Date().toISOString()
        })
        this.newMember = { name: '', email: '', role: 'miembro' }
      }
    },
    removeMember(index) {
      this.groupForm.members.splice(index, 1)
    },
    saveGroup() {
      if (this.groupFormValid) {
        const groupData = {
          ...this.groupForm,
          id: this.editingGroup ? this.selectedGroup.id : Date.now(),
          createdAt: this.editingGroup ? this.selectedGroup.createdAt : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        if (this.editingGroup) {
          this.$store.commit('updateGroup', groupData)
        } else {
          this.$store.commit('addGroup', groupData)
        }

        this.$emit('show-snackbar', {
          message: `Grupo ${this.editingGroup ? 'actualizado' : 'creado'} exitosamente`,
          color: 'success'
        })

        this.closeGroupDialog()
      }
    },
    editGroup(group) {
      this.editingGroup = true
      this.selectedGroup = group
      this.groupForm = { ...group, members: [...group.members] }
      this.showGroupDetailsDialog = false
      this.showCreateGroupDialog = true
    },
    deleteGroup(groupId) {
      if (confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
        this.$store.commit('removeGroup', groupId)
        this.showGroupDetailsDialog = false
        this.$emit('show-snackbar', {
          message: 'Grupo eliminado exitosamente',
          color: 'success'
        })
      }
    },
    closeGroupDialog() {
      this.showCreateGroupDialog = false
      this.editingGroup = false
      this.selectedGroup = null
      this.groupForm = {
        name: '',
        description: '',
        color: '#2196f3',
        icon: 'mdi-account-group',
        category: 'trabajo',
        members: []
      }
      this.newMember = { name: '', email: '', role: 'miembro' }
    },
    getGroupTasksCount(groupId) {
      return this.getGroupTasks(groupId).length
    },
    getGroupTasks(groupId) {
      if (!groupId) return []
      return this.tasks.filter(task => {
        const taskObj = this.getTaskObject(task)
        return taskObj.assignedGroup === groupId
      })
    },
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
          assignedGroup: null,
          assignedMembers: [],
          createdAt: new Date().toISOString()
        }
      }
      return task
    },
    getTaskText(task) {
      return this.getTaskObject(task).text
    },
    getInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    },
    getAvatarColor(name) {
      const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722']
      const index = name.length % colors.length
      return colors[index]
    },
    getRoleColor(role) {
      const colors = {
        admin: 'red',
        coordinador: 'orange',
        miembro: 'blue'
      }
      return colors[role] || 'grey'
    },
    
    // Nuevos métodos para el diálogo de tareas
    showGroupTasks(group) {
      this.selectedTaskGroup = group
      this.showGroupTasksDialog = true
    },
    
    toggleTaskComplete(task, index) {
      task.completed = !task.completed
      this.$emit('update-task', { index, task })
    },
    
    openTaskDetails(task, index) {
      this.$emit('open-task-details', { task, index })
    },
    
    getDueDateColor(dueDate) {
      if (!dueDate) return 'grey'
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return 'red' // Vencida
      if (diffDays === 0) return 'orange' // Hoy
      if (diffDays <= 3) return 'yellow' // Próxima
      return 'green' // Futura
    },
    
    getAssignedMemberInfo(memberId, group) {
      if (!group || !group.members) {
        return { name: 'Desconocido', color: 'grey' }
      }
      
      const member = group.members.find(m => m.id === memberId)
      if (!member) {
        return { name: 'Desconocido', color: 'grey' }
      }
      
      return {
        name: member.name.split(' ')[0], // Solo el primer nombre
        color: this.getRoleColor(member.role)
      }
    }
  }
}
</script>

<style scoped>
.group-management-container {
  width: 100%;
  position: relative;
}

.group-item {
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.group-item:hover {
  background-color: var(--v-grey-lighten4);
}

.theme--dark .group-item:hover {
  background-color: var(--v-grey-darken3);
}

.group-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.group-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--v-textPrimary-base);
}

.group-info {
  font-size: 12px;
  color: var(--v-textSecondary-base);
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
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-secondary-base)) !important;
}

.create-group-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 2;
}

.color-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(0,0,0,0.1);
}

.member-item {
  border: 1px solid var(--v-border-base);
  border-radius: 8px;
  margin-bottom: 8px;
}

.role-select {
  width: 120px;
}

.group-header {
  color: white;
}

.group-tasks-card {
  border-radius: 16px;
  overflow: hidden;
}

.group-tasks-header {
  padding: 20px 24px;
}

.task-item-group {
  cursor: pointer;
  transition: background-color 0.2s;
}

.task-item-group:hover {
  background-color: var(--v-grey-lighten4);
}

.theme--dark .task-item-group:hover {
  background-color: var(--v-grey-darken3);
}

.task-indicators-group {
  display: flex;
  align-items: center;
}

.opacity-90 {
  opacity: 0.9;
}
</style>
