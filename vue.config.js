const path = require('path')

module.exports = {
  // Transpilación de dependencias necesarias
  transpileDependencies: [
    'vuetify'
  ],
  
  // Configuración para GitHub Pages y despliegue
  publicPath: process.env.NODE_ENV === 'production'
    ? '/VueJS-Gestor-Tareas/' // Ruta del repositorio GitHub
    : '/',
  
  // Configuración de salida para build
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true,
  
  // Configuración de index.html
  indexPath: 'index.html',
  
  // Configuración de Webpack
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          },
          vuetify: {
            test: /[\\/]node_modules[\\/]vuetify[\\/]/,
            name: 'vuetify',
            chunks: 'all',
            priority: 20
          }
        }
      },
      minimize: process.env.NODE_ENV === 'production'
    },
    // Resolver alias para importaciones limpias
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        }
      ]
    },
    // Configuración adicional para producción
    ...(process.env.NODE_ENV === 'production' && {
      performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
      }
    })
  },
  
  // Configuración del servidor de desarrollo
  devServer: {
    port: 8080,
    host: 'localhost',
    open: true,
    hot: true,
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: '/index.html' }
      ]
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  
  // Configuración para mejorar el rendimiento
  chainWebpack: config => {
    // Configuración para preload de recursos críticos
    config.plugin('preload').tap(options => {
      options[0] = {
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/]
      }
      return options
    })
    
    // Configuración para prefetch de recursos no críticos
    config.plugin('prefetch').tap(options => {
      options[0].fileBlacklist = options[0].fileBlacklist || []
      options[0].fileBlacklist.push(/\.map$/, /hot-update\.js$/)
      return options
    })
    
    // Optimización de imágenes
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'img/[name].[hash:8].[ext]'
      })
    
    // Configuración para HTML
    config.plugin('html').tap(args => {
      args[0].title = 'TaskFlow - Gestor de Tareas'
      args[0].meta = {
        viewport: 'width=device-width,initial-scale=1.0',
        description: 'TaskFlow - Aplicación para gestión de tareas'
      }
      return args
    })
  },
  
  // Configuración CSS
  css: {
    extract: process.env.NODE_ENV === 'production',
    sourceMap: process.env.NODE_ENV !== 'production',
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        additionalData: `@import "@/styles/variables.scss";` // Si tienes variables SCSS
      }
    }
  },
  
  // Configuración para PWA (opcional)
  pwa: {
    name: 'TaskFlow',
    themeColor: '#1976D2',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      background_color: '#1976D2'
    }
  },
  
  // Configuración para análisis de bundle (solo en desarrollo)
  ...(process.env.NODE_ENV === 'development' && {
    chainWebpack: config => {
      config
        .plugin('bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [{
          openAnalyzer: false,
          analyzerMode: 'static'
        }])
    }
  })
}
