#!/usr/bin/env sh

# Script para desplegar en GitHub Pages

# Parar si hay errores
set -e

# Compilar el proyecto
echo "🔨 Compilando proyecto..."
npm run build

# Navegar al directorio de distribución
cd dist

# Agregar archivo .nojekyll para evitar problemas con GitHub Pages
echo "📄 Creando archivo .nojekyll..."
echo > .nojekyll

# Inicializar repositorio git en dist
echo "📦 Inicializando git en directorio dist..."
git init
git add -A
git commit -m "Deploy to GitHub Pages"

# Forzar push a la rama gh-pages
echo "🚀 Desplegando a GitHub Pages..."
git push -f git@github.com:TU_USUARIO/VueJS-Gestor-Tareas.git master:gh-pages

cd -

echo "✅ ¡Despliegue completado!"
echo "🌐 Tu aplicación estará disponible en: https://TU_USUARIO.github.io/VueJS-Gestor-Tareas/"
