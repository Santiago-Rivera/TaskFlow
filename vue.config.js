const path = require('path')

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  
  // Configuración para GitHub Pages
  publicPath: process.env.NODE_ENV === 'production'
    ? '/VueJS-Gestor-Tareas/' // Ruta relativa para GitHub Pages
    : '/',
  
  // Configuración adicional para el build
  outputDir: 'dist',
  assetsDir: 'static',
  
  // Optimización para evitar problemas de rutas y rendimiento
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    // Resolver alias para importaciones más limpias
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      fallback: {
        "crypto": false,
        "stream": false,
        "assert": false,
        "http": false,
        "https": false,
        "os": false,
        "url": false
      }
    },
    // Configuración para módulos externos
    externals: {
      // Tratar MSAL como externo si hay problemas
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        }
      ]
    }
  },
  
  // Configuración para el servidor de desarrollo
  devServer: {
    port: 8080,
    open: true,
    historyApiFallback: true, // Para SPA routing
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  
  // Configuración para mejorar el rendimiento
  chainWebpack: config => {
    // Preload para recursos críticos
    config.plugin('preload').tap(options => {
      options[0] = {
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [/\.map$/, /hot-update\.js$/]
      }
      return options
    })
    
    // Prefetch para recursos no críticos
    config.plugin('prefetch').tap(options => {
      options[0].fileBlacklist = options[0].fileBlacklist || []
      options[0].fileBlacklist.push(/\.map$/, /hot-update\.js$/)
      return options
    })
  },
  
  // Configuración CSS
  css: {
    extract: process.env.NODE_ENV === 'production',
    sourceMap: process.env.NODE_ENV !== 'production'
  }
}
