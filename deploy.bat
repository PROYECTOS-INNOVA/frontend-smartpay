@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo ===============================
echo Ejecutando npm run build...
echo ===============================
call npm run build

IF NOT EXIST dist (
    echo [ERROR] No se encontró la carpeta 'dist'. El build falló.
    exit /b 1
)

echo ===============================
echo Subiendo carpeta 'dist' al VPS...
echo ===============================
scp -r dist smartpayvps@72.167.49.62:/tmp/react-temp

if errorlevel 1 (
    echo [ERROR] Fallo al transferir la carpeta 'dist' al VPS.
    exit /b 1
)

echo ===============================
echo Ejecutando script remoto 'deploy-smartpay.sh'...
echo ===============================
ssh smartpayvps@72.167.49.62 "bash deploy-smartpay.sh"

if errorlevel 1 (
    echo [ERROR] Fallo al ejecutar el script remoto.
    exit /b 1
)

echo ===============================
echo Despliegue completo.
echo ===============================
pause
