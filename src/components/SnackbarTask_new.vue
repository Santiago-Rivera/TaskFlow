<template>
    <v-snackbar 
        v-model="snack" 
        :color="type" 
        :timeout="3000"
        top
        right
        shaped
        class="custom-snackbar"
        @input="setNotify(null)"
    >
        <div class="d-flex align-center">
            <v-icon color="white" class="mr-3" size="20">{{ icon }}</v-icon>
            <span class="snack-message">{{ message }}</span>
        </div>
        
        <template v-slot:action="{ attrs }">
            <v-btn
                text
                color="white"
                small
                v-bind="attrs"
                @click="snack = false"
            >
                <v-icon small>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import { mapMutations } from 'vuex';

let types = ['delete', 'update', 'add'];

export default {
    name: "SnackbarTask",
    props: {
        notify: { type: String, validator: value => types.includes(value) }
    },
    data() {
        return {
            snack: false
        };
    },
    watch: {
        notify(val) {
            if (val) {
                this.snack = true;
            }
        }
    },
    methods: {
        ...mapMutations(['setNotify'])
    },
    computed: {
        type() {
            switch (this.notify) {
                case 'delete':
                    return 'error';
                case 'update':
                    return 'info';
                case 'add':
                    return 'success';
                default:
                    return 'primary';
            }
        },
        icon() {
            switch (this.notify) {
                case 'delete':
                    return 'mdi-delete-circle';
                case 'update':
                    return 'mdi-pencil-circle';
                case 'add':
                    return 'mdi-check-circle';
                default:
                    return 'mdi-information';
            }
        },
        message() {
            switch (this.notify) {
                case 'delete':
                    return 'Tarea eliminada correctamente';
                case 'update':
                    return 'Tarea actualizada exitosamente';
                case 'add':
                    return 'Nueva tarea agregada';
                default:
                    return '';
            }
        }
    }
};
</script>

<style scoped>
.custom-snackbar {
    border-radius: 12px !important;
}

.custom-snackbar >>> .v-snack__wrapper {
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid var(--v-border-base);
}

.snack-message {
    font-weight: 500;
    font-size: 14px;
    color: white;
}
</style>
