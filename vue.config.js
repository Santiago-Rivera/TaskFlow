const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  // Configuración para GitHub Pages
  publicPath: process.env.NODE_ENV === 'production'
    ? 'https://Santiago-Rivera.github.io/VueJS-Gestor-Tareas/' // Reemplaza con el nombre de tu repositorio
    : '/',
  
  // Configuración adicional para el build
  outputDir: 'dist',
  assetsDir: 'static',
  
  // Configuración para evitar problemas de rutas en GitHub Pages
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }
})
