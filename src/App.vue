<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
/* Estilos globales */
* {
    box-sizing: border-box;
}

html, body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
}

/* Transiciones suaves para el cambio de tema */
.v-application {
    transition: background-color 0.3s ease, color 0.3s ease;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: var(--v-surface-base);
}

::-webkit-scrollbar-thumb {
    background: var(--v-primary-base);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--v-primary-darken1);
}
</style>
