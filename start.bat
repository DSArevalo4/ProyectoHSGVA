@echo off
REM Script para iniciar la aplicación en Windows
REM Ejecutar este archivo para iniciar el servidor

echo ========================================
echo Sistema de Analisis Geotecnico - HSGVA
echo ========================================
echo.

REM Verificar si Python está instalado
echo Verificando instalacion de Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Python no esta instalado o no esta en el PATH
    echo Por favor instala Python desde https://www.python.org/
    pause
    exit /b
)
echo + Python encontrado
echo.

REM Verificar si existe el entorno virtual
if exist "venv\" (
    echo + Entorno virtual encontrado
) else (
    echo Creando entorno virtual...
    python -m venv venv
    echo + Entorno virtual creado
)
echo.

REM Activar entorno virtual
echo Activando entorno virtual...
call venv\Scripts\activate.bat
echo.

REM Instalar dependencias
echo Instalando dependencias...
pip install -r requirements.txt --quiet --disable-pip-version-check
echo.

echo ========================================
echo Iniciando servidor...
echo ========================================
echo.
echo La aplicacion estara disponible en:
echo   http://localhost:5000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

REM Iniciar aplicación
python app.py
