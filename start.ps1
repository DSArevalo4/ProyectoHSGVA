# Script para iniciar la aplicación en Windows
# Ejecutar este archivo para iniciar el servidor

Write-Host "========================================" -ForegroundColor Green
Write-Host "Sistema de Análisis Geotécnico - HSGVA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Verificar si Python está instalado
Write-Host "Verificando instalación de Python..." -ForegroundColor Yellow

try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor instala Python desde https://www.python.org/" -ForegroundColor Red
    pause
    exit
}

Write-Host ""

# Verificar si existe el entorno virtual
if (Test-Path "venv") {
    Write-Host "✓ Entorno virtual encontrado" -ForegroundColor Green
} else {
    Write-Host "Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✓ Entorno virtual creado" -ForegroundColor Green
}

Write-Host ""

# Activar entorno virtual
Write-Host "Activando entorno virtual..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

Write-Host ""

# Instalar dependencias
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet --disable-pip-version-check

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Iniciando servidor..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "La aplicación estará disponible en:" -ForegroundColor Cyan
Write-Host "  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Iniciar aplicación
python app.py
