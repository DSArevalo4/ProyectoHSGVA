@echo off
echo ========================================
echo Sistema de Analisis Geotecnico - HSGVA
echo ========================================
echo.

REM Verificar si existe el entorno virtual
if not exist "venv" (
    echo Creando entorno virtual...
    python -m venv venv
    echo.
)

REM Activar entorno virtual
echo Activando entorno virtual...
call venv\Scripts\activate.bat
echo.

REM Instalar dependencias
echo Instalando dependencias...
pip install -r requirements.txt
echo.

REM Iniciar aplicacion
echo Iniciando servidor Flask...
echo.
python app.py

pause
