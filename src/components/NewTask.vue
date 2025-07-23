<template>
  <div class="new-task-form">
    <v-text-field
      ref="taskInput"
      v-model="task"
      label="¿Qué necesitas hacer?"
      placeholder="Ej: Revisar emails, llamar al cliente..."
      outlined
      dense
      color="primary"
      class="task-input"
      @keyup.enter="addTask"
      hide-details="auto"
      :rules="showValidation ? [rules.required] : []"
    >
      <template v-slot:prepend-inner>
        <v-icon color="primary" size="20">mdi-pencil-outline</v-icon>
      </template>
    </v-text-field>
    
    <v-btn
      color="primary"
      large
      depressed
      class="add-btn mt-4"
      @click="addTask"
      :disabled="!task.trim()"
      block
    >
      <v-icon left size="20">mdi-plus</v-icon>
      Agregar Tarea
    </v-btn>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "NewTask",
  data() {
    return {
      task: "",
      showValidation: false,
      rules: {
        required: value => !!value?.trim() || 'La tarea no puede estar vacía'
      }
    };
  },
  methods: {
    ...mapMutations(["setTask"]),
    addTask() {
      // Mostrar validación si el campo está vacío
      if (!this.task.trim()) {
        this.showValidation = true;
        this.$nextTick(() => {
          this.$refs.taskInput.validate();
        });
        return;
      }

      // Si la tarea es válida, agregarla y resetear
      this.setTask(this.task.trim());
      this.task = "";
      this.showValidation = false;
      
      // Resetear validación del campo
      this.$nextTick(() => {
        if (this.$refs.taskInput) {
          this.$refs.taskInput.resetValidation();
        }
      });
    },
  },
  watch: {
    task(newValue) {
      // Si el usuario empieza a escribir, ocultar la validación
      if (newValue && newValue.length > 0) {
        this.showValidation = false;
        this.$nextTick(() => {
          if (this.$refs.taskInput) {
            this.$refs.taskInput.resetValidation();
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.new-task-form {
  width: 100%;
}

.task-input {
  font-size: 16px;
}

.task-input >>> .v-input__slot {
  border-radius: 12px !important;
  border-color: var(--v-border-base) !important;
}

.task-input >>> .v-input__slot:hover {
  border-color: var(--v-primary-base) !important;
}

.task-input >>> .v-text-field__slot input {
  font-size: 16px;
  color: var(--v-textPrimary-base);
}

.task-input >>> .v-text-field__slot input::placeholder {
  color: var(--v-textSecondary-base) !important;
}

.add-btn {
  border-radius: 12px !important;
  font-weight: 600;
  text-transform: none;
  font-size: 16px;
  height: 48px;
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-secondary-base)) !important;
  transition: all 0.3s ease;
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(var(--v-primary-base), 0.3) !important;
}

.add-btn:disabled {
  background: var(--v-hover-base) !important;
  color: var(--v-textSecondary-base) !important;
}

.add-btn >>> .v-btn__content {
  color: white;
}
</style>
