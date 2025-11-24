# 🏗️ Sistema de Análisis Geotécnico - HSGVA

## 📋 Descripción del Proyecto

Aplicación web profesional para la automatización del procesamiento, análisis y presentación de resultados de ensayos de laboratorio de suelos. Desarrollada con **Python Flask** (backend) y **HTML/CSS/JavaScript** (frontend), siguiendo una estética moderna y profesional inspirada en dashboards de Power BI.

### 🔧 Tecnologías Utilizadas

**Backend:**
- Python 3.x
- Flask (servidor web)
- Pandas (procesamiento de datos)
- OpenPyXL (lectura de Excel)
- NumPy (cálculos científicos)

**Frontend:**
- HTML5
- CSS3
- JavaScript (Vanilla)
- Chart.js (gráficos)
- Plotly.js (visualizaciones avanzadas)

## 🎯 Ensayos Incluidos

1. **💧 Contenido de Humedad** ✅ (Implementado)
2. **📊 Límites de Atterberg** (LL, LP, IP) - En desarrollo
3. **🔍 Clasificación de Suelos** (SUCS y AASHTO) - En desarrollo
4. **⚖️ Fases Gravimétricas y Volumétricas** - En desarrollo

## ✨ Características Principales

### Funcionalidades Implementadas:
- ✅ Dashboard interactivo con métricas y gráficos en tiempo real
- ✅ Módulo completo de Contenido de Humedad con:
  - Ingreso de datos de laboratorio
  - Cálculos automáticos validados
  - Visualización de resultados detallados
  - Historial de muestras
  - Exportación de datos a CSV
  - Validación de rangos y errores
- ✅ Interfaz responsive y profesional
- ✅ Navegación modular por ensayos
- ✅ Sistema de notificaciones y mensajes
- ✅ Fecha y hora en tiempo real

### Características de Diseño:
- 🎨 Paleta de colores verde profesional
- 📱 Diseño responsive (escritorio, tablet, móvil)
- 🎯 Tarjetas KPI con animaciones
- 📊 Múltiples tipos de gráficos (barras, líneas, gauge, treemap, pie)
- 🌊 Efectos visuales y transiciones suaves
- 📈 Visualización clara de datos y resultados

## 🚀 Instalación y Uso

### Requisitos Previos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Instalación

#### Opción 1: Inicio Automático (Windows) ⭐ RECOMENDADO

**PowerShell:**
```powershell
.\start.ps1
```

**CMD:**
```cmd
start.bat
```

Estos scripts automáticamente:
1. Verifican Python
2. Crean el entorno virtual
3. Instalan dependencias
4. Inician el servidor

#### Opción 2: Instalación Manual

1. **Crear entorno virtual:**
```bash
python -m venv venv
```

2. **Activar entorno virtual:**

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

3. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

4. **Iniciar aplicación:**
```bash
python app.py
```

5. **Abrir en navegador:**
```
http://localhost:5000
```

### Uso de la Aplicación

1. Ejecuta `start.bat` o `start.ps1` (Windows)
2. Abre tu navegador en `http://localhost:5000`
3. ¡Explora el dashboard y los módulos!
4. Presiona `Ctrl+C` en la terminal para detener el servidor

## 📁 Estructura del Proyecto

```
ProyectoHSGVA/
│
├── app.py                     # Aplicación Flask principal
├── requirements.txt           # Dependencias Python
├── start.bat                  # Script de inicio (Windows CMD)
├── start.ps1                  # Script de inicio (PowerShell)
│
├── index.html                 # Página principal
│
├── css/
│   ├── styles.css            # Estilos generales
│   └── modules.css           # Estilos de módulos
│
├── js/
│   ├── main.js               # Funcionalidad principal
│   ├── charts.js             # Gráficos del dashboard
│   └── modules/
│       ├── humedad.js        # Módulo de Humedad ✅
│       ├── atterberg.js      # Módulo de Atterberg
│       ├── clasificacion.js  # Módulo de Clasificación
│       ├── fases.js          # Módulo de Fases
│       └── informe.js        # Generador de informes
│
├── etl/                      # Módulos ETL de Python
│   ├── __init__.py
│   ├── hidrometria_etl.py    # ETL Hidrometría
│   ├── clasificacion_etl.py  # ETL Clasificación
│   ├── atterberg_etl.py      # ETL Atterberg
│   └── data_processor.py     # Procesador general
│
├── Data/                     # Datos de ensayos de laboratorio
│   ├── Limites de Atterberg.xlsx
│   ├── Clasificacion de Suelos #2.xlsx
│   └── Hidrometria #4.xlsx
│
└── README.md                 # Este archivo
```

## 🧪 Guía de Uso: Módulo de Contenido de Humedad

### Paso 1: Navegación
1. Abre la aplicación en tu navegador
2. En el menú lateral, haz clic en **"💧 Contenido de Humedad"**

### Paso 2: Ingreso de Datos

**Información General:**
- Nombre del Proyecto
- Número de Muestra
- Fecha del Ensayo
- Operador (opcional)

**Datos de Medición:**
- N° de Recipiente
- Peso del Recipiente (g)
- Peso Recipiente + Suelo Húmedo (g)
- Peso Recipiente + Suelo Seco (g)

### Paso 3: Cálculo
1. Completa todos los campos obligatorios (*)
2. Haz clic en **"Calcular"**
3. Los resultados se mostrarán automáticamente

### Paso 4: Múltiples Muestras
1. Para agregar otra muestra del mismo proyecto
2. Haz clic en **"Agregar Otra Muestra"**
3. Ingresa los nuevos datos
4. El sistema calculará el promedio automáticamente

### Paso 5: Exportar Datos
- Haz clic en **"Exportar"** para descargar los datos en formato CSV
- El archivo incluirá todas las muestras registradas

## 📊 Fórmulas Implementadas

### Contenido de Humedad (w%)

```
Ww = Peso Húmedo - Peso Seco           (Peso del agua)
Ws = Peso Seco - Peso Recipiente       (Peso del suelo seco)
w% = (Ww / Ws) × 100                   (Contenido de humedad)
```

### Clasificación por Humedad

- **Muy Seco:** w < 10%
- **Seco:** 10% ≤ w < 20%
- **Húmedo:** 20% ≤ w < 30%
- **Muy Húmedo:** w ≥ 30%

## 🛠️ Validaciones Implementadas

El sistema valida automáticamente:
- ✅ Campos obligatorios completos
- ✅ Valores numéricos válidos
- ✅ Peso húmedo > Peso del recipiente
- ✅ Peso seco > Peso del recipiente
- ✅ Peso húmedo > Peso seco
- ✅ Rangos lógicos de medición

## 🎨 Paleta de Colores

```css
Verde Principal: #4a7c59
Verde Oscuro:    #2d5016
Verde Claro:     #6ba083
Verde Acento:    #a8d5ba
Amarillo Dorado: #d4af37
```

## 📦 Tecnologías Utilizadas

**Backend:**
- **Python 3.x** - Lenguaje de programación
- **Flask** - Framework web ligero
- **Pandas** - Análisis y manipulación de datos
- **NumPy** - Cálculos científicos
- **OpenPyXL** - Lectura/escritura de archivos Excel

**Frontend:**
- **HTML5** - Estructura
- **CSS3** - Estilos y animaciones
- **JavaScript** (Vanilla) - Funcionalidad
- **Chart.js** - Gráficos de barras, líneas y pie
- **Plotly.js** - Gráficos avanzados (waterfall, gauge, treemap)
- **Font Awesome** - Iconos

**Integración:**
- **API REST** - Comunicación backend-frontend
- **JSON** - Formato de intercambio de datos

## 🔜 Próximos Desarrollos

### Módulos en Desarrollo:

1. **Límites de Atterberg:**
   - Límite Líquido (LL) con curva de fluidez
   - Límite Plástico (LP)
   - Índice de Plasticidad (IP)
   - Gráfico interactivo LL vs golpes

2. **Clasificación de Suelos:**
   - Sistema SUCS (Unified Soil Classification System)
   - Sistema AASHTO
   - Análisis granulométrico
   - Gráficos de distribución

3. **Fases del Suelo:**
   - Relaciones de fase
   - Diagrama de fases
   - Cálculo de propiedades volumétricas
   - Cálculo de propiedades gravimétricas

4. **Generador de Informes:**
   - Exportación a PDF
   - Plantillas personalizables
   - Inclusión de gráficos
   - Interpretación de resultados

## 👥 Equipo de Desarrollo

- Proyecto HSGVA
- Análisis de Suelos y Geotecnia

## 📄 Licencia

Este proyecto es de uso académico y profesional.

## 📞 Soporte

Para preguntas o soporte técnico, contacta al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última Actualización:** Noviembre 2025  
**Desarrollado con:** ❤️ y ☕