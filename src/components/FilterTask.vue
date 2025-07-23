<template>
  <div class="filter-container">
    <v-text-field
      v-model="filter"
      label="Buscar tareas..."
      placeholder="Escribe para filtrar"
      outlined
      dense
      color="primary"
      class="filter-input"
      clearable
      hide-details
    >
      <template v-slot:prepend-inner>
        <v-icon color="primary" size="20">mdi-magnify</v-icon>
      </template>
    </v-text-field>
    
    <div v-if="filter" class="filter-info mt-3">
      <v-chip
        small
        color="primary"
        text-color="white"
        class="filter-chip"
      >
        <v-icon left small>mdi-filter</v-icon>
        Filtrando: "{{ filter }}"
      </v-chip>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "FilterTask",
  computed: {
    filter: {
      get() {
        return this.value;
      },
      set(val) {
        this.setFilter(val);
      },
    },
  },
  methods: {
    ...mapMutations(["setFilter"])
  },
};
</script>

<style scoped>
.filter-container {
  width: 100%;
}

.filter-input >>> .v-input__slot {
  border-radius: 12px !important;
  border-color: var(--v-border-base) !important;
}

.filter-input >>> .v-input__slot:hover {
  border-color: var(--v-primary-base) !important;
}

.filter-input >>> .v-text-field__slot input {
  font-size: 14px;
  color: var(--v-textPrimary-base);
}

.filter-input >>> .v-text-field__slot input::placeholder {
  color: var(--v-textSecondary-base) !important;
}

.filter-info {
  display: flex;
  align-items: center;
}

.filter-chip {
  border-radius: 8px !important;
  font-size: 12px;
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-secondary-base)) !important;
}
</style>
