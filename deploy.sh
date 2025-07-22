# Salir si hay algún error
set -e

# 1. Ejecutar build del proyecto
echo "Ejecutando build de React..."
npm run build

# 2. Crear carpeta temporal local para solo el contenido de dist
echo "Preparando contenido para el despliegue..."
mkdir -p .deploy-temp
rm -rf .deploy-temp/*
cp -r dist/* .deploy-temp/

# 3. Enviar SOLO el contenido, no la carpeta 'dist'
echo "Enviando contenido del build al VPS..."
scp -r .deploy-temp/* smartpayvps@72.167.49.62:/tmp/react-temp

# 4. Ejecutar script remoto
echo "Ejecutando script de despliegue en VPS..."
ssh smartpayvps@72.167.49.62 'bash deploy-smartpay.sh'

# 5. Limpiar temporal local
rm -rf .deploy-temp

echo "✅ Despliegue completado."
