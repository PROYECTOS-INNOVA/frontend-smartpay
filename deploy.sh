#!/bin/bash

# Salir si hay algún error
set -e

# 1. Ejecutar build del proyecto
echo "Ejecutando build de React..."
npm run build

# 2. Enviar la carpeta 'dist' por SCP al VPS
echo "Enviando carpeta 'dist' al VPS..."
scp -r dist smartpayvps@72.167.49.62:/tmp/react-temp

# 3. Ejecutar script remoto 'deploy-smartpay.sh'
echo "Ejecutando script de despliegue en VPS..."
ssh smartpayvps@72.167.49.62 'bash deploy-smartpay.sh'

echo "Despliegue completado."