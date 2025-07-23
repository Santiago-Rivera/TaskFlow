<template>
    <v-app :dark="darkMode">
        <v-app-bar app :color="appBarColor" flat elevation="0" class="border-bottom">
            <v-container class="py-0 px-0">
                <div class="d-flex align-center">
                    <div class="app-logo d-flex align-center">
                        <v-icon :color="logoColor" size="28" class="mr-3">mdi-check-circle</v-icon>
                        <h1 class="app-title">TaskFlow</h1>
                    </div>
                    <v-spacer></v-spacer>
                    
                    <!-- Info del usuario -->
                    <div class="user-info mr-4">
                        <v-chip
                            color="primary"
                            text-color="white"
                            small
                            class="user-chip"
                            @click="openUserSettings"
                            style="cursor: pointer;"
                        >
                            <v-icon left small>mdi-account-circle</v-icon>
                            {{ getUserName }}
                            <v-icon right small class="ml-1">mdi-cog</v-icon>
                        </v-chip>
                    </div>
                    
                    <!-- Toggle de tema -->
                    <ThemeToggle class="mr-2" />
                    
                    <!-- Botón de logout directo -->
                    <v-btn
                        icon
                        :color="iconColor"
                        @click="handleLogout"
                        title="Cerrar Sesión"
                    >
                        <v-icon>mdi-logout</v-icon>
                    </v-btn>
                </div>
            </v-container>
        </v-app-bar>
        
        <v-main :class="contentClass">
            <Tasks/>
        </v-main>
        
        <!-- Configuraciones de Usuario -->
        <UserSettings 
            v-model="userSettingsDialog" 
            @show-snackbar="showSnackbar"
        />
        
        <!-- Dialog de confirmación de logout -->
        <v-dialog v-model="logoutDialog" max-width="400" persistent>
            <v-card>
                <v-card-title class="headline">
                    <v-icon color="warning" class="mr-2">mdi-logout</v-icon>
                    Cerrar Sesión
                </v-card-title>
                <v-card-text>
                    ¿Estás seguro de que quieres cerrar sesión?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="logoutDialog = false">
                        Cancelar
                    </v-btn>
                    <v-btn color="error" text @click="confirmLogout">
                        Cerrar Sesión
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <!-- Snackbar para mensajes -->
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
    </v-app>
</template>

<script>
    import Tasks from "../components/Tasks";
    import ThemeToggle from "../components/ThemeToggle";
    import UserSettings from "../components/UserSettings";
    import { mapState, mapGetters, mapActions } from 'vuex';

    export default {
        name: 'DashboardView',
        components: { Tasks, ThemeToggle, UserSettings },
        data() {
            return {
                logoutDialog: false,
                userSettingsDialog: false,
                snackbar: {
                    show: false,
                    message: '',
                    color: 'success'
                }
            };
        },
        computed: {
            ...mapState(['darkMode']),
            ...mapGetters(['currentUser']),
            getUserName() {
                return this.currentUser && this.currentUser.name ? this.currentUser.name : 'Usuario';
            },
            appBarColor() {
                return this.darkMode ? 'surface' : 'white';
            },
            logoColor() {
                return this.darkMode ? '#64B5F6' : '#1565C0';
            },
            iconColor() {
                return this.darkMode ? 'white' : 'grey';
            },
            contentClass() {
                return this.darkMode ? 'app-content-dark' : 'app-content-light';
            }
        },
        methods: {
            ...mapActions(['logout']),
            handleLogout() {
                this.logoutDialog = true;
            },
            confirmLogout() {
                this.logout();
                this.logoutDialog = false;
                this.$router.push('/login');
            },
            openUserSettings() {
                this.userSettingsDialog = true;
            },
            showSnackbar(config) {
                this.snackbar = {
                    show: true,
                    message: config.message,
                    color: config.color || 'success'
                };
            }
        },
        mounted() {
            // Aplicar el tema guardado al iniciar
            this.$vuetify.theme.dark = this.darkMode;
        }
    }
</script>

<style scoped>
    .border-bottom {
        border-bottom: 1px solid var(--v-border-base) !important;
    }
    
    .app-title {
        font-size: 24px;
        font-weight: 600;
        margin: 0;
        letter-spacing: -0.5px;
        color: var(--v-textPrimary-base);
        transition: color 0.3s ease;
    }
    
    .app-content-light {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
        transition: background 0.3s ease;
    }
    
    .app-content-dark {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        min-height: 100vh;
        transition: background 0.3s ease;
    }
    
    .app-logo {
        transition: transform 0.3s ease;
    }
    
    .app-logo:hover {
        transform: scale(1.05);
    }
    
    .user-info {
        animation: fadeInRight 0.6s ease-out;
    }
    
    .user-chip {
        border-radius: 16px !important;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .user-chip:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .user-chip.v-chip--clickable:hover {
        opacity: 0.9;
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
</style>
