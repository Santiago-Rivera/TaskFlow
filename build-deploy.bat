@echo off
echo ========================================
echo    TASKFLOW - BUILD PARA DESPLIEGUE
echo ========================================
echo.

echo 1. Instalando dependencias...
call npm install

echo.
echo 2. Limpiando build anterior...
if exist dist rmdir /s /q dist

echo.
echo 3. Construyendo para produccion...
call npm run build:prod

echo.
echo 4. Verificando archivos generados...
if exist dist\index.html (
    echo ✅ Build completado exitosamente
    echo.
    echo Archivos generados en la carpeta 'dist':
    dir dist /b
    echo.
    echo ========================================
    echo   TASKFLOW LISTO PARA DESPLIEGUE
    echo ========================================
    echo.
    echo Para previsualizar localmente:
    echo   npm run build:preview
    echo.
    echo Para desplegar en GitHub Pages:
    echo   npm run deploy
    echo.
) else (
    echo ❌ Error en el build
    echo Revisa los mensajes de error arriba
)

pause
