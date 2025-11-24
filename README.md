
# 🏗️ Sistema de Análisis Geotécnico - HSGVA Lab

## 📋 Descripción

Sistema web profesional para el procesamiento, análisis y generación de informes de ensayos de laboratorio de suelos. Incluye análisis de contenido de humedad, límites de Atterberg, clasificación de suelos (AASHTO) y fases del suelo.

### ✨ Características Principales

- 📊 **Dashboard interactivo** con estadísticas en tiempo real
- 💧 **Contenido de Humedad** - Análisis completo con gráficos
- � **Límites de Atterberg** - LL, LP, IP y Carta de Plasticidad
- 🏗️ **Clasificación de Suelos** - Sistema AASHTO
- ⚖️ **Fases del Suelo** - Relaciones volumétricas y gravimétricas
- 📄 **Generador de Informes** - Exporta a PDF, Excel y Word con gráficos
- 🎯 **Tour Guiado** - Ayuda contextual en cada módulo

---

## 🚀 Inicio Rápido

### Requisitos

- **Python 3.8 o superior** instalado en tu computadora
- Navegador web moderno (Chrome, Firefox, Edge)

### Instalación (Paso a Paso)

#### ⭐ **Opción 1: Inicio Automático (RECOMENDADO)**

1. **Extrae el archivo ZIP** en una carpeta de tu preferencia

2. **Abre la carpeta** del proyecto

3. **Ejecuta el script de inicio:**

   **En Windows con PowerShell:**
   - Haz clic derecho en `start.ps1`
   - Selecciona "Ejecutar con PowerShell"
   - O abre PowerShell en la carpeta y ejecuta:
     ```powershell
     .\start.ps1
     ```

   **En Windows con CMD:**
   - Doble clic en `start.bat`
   - O abre CMD en la carpeta y ejecuta:
     ```cmd
     start.bat
     ```

4. **¡Listo!** El navegador se abrirá automáticamente en `http://localhost:5000`

> El script automáticamente:
> - ✅ Verifica que Python esté instalado
> - ✅ Crea el entorno virtual
> - ✅ Instala todas las dependencias necesarias
> - ✅ Inicia el servidor
> - ✅ Abre el navegador

---

#### 📝 **Opción 2: Instalación Manual**

Si prefieres hacerlo paso a paso:

**1. Abre una terminal en la carpeta del proyecto**

**2. Crea el entorno virtual:**
```bash
python -m venv venv
```

**3. Activa el entorno virtual:**

- **Windows (PowerShell):**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```

- **Windows (CMD):**
  ```cmd
  venv\Scripts\activate.bat
  ```

- **Linux/Mac:**
  ```bash
  source venv/bin/activate
  ```

**4. Instala las dependencias:**
```bash
pip install -r requirements.txt
```

**5. Inicia el servidor:**
```bash
python app.py
```

**6. Abre tu navegador en:**
```
http://localhost:5000
```

**7. Para detener el servidor:**
- Presiona `Ctrl + C` en la terminal

---

## 📚 Guía de Uso

### 🎯 Tour Guiado

Al abrir la aplicación, haz clic en el botón **❓** en la esquina superior derecha para ver el tour guiado de cada módulo.

### 📊 Módulos Disponibles

#### 1. **Dashboard**
- Vista general de todos los ensayos
- Estadísticas resumidas
- Gráficos interactivos

#### 2. **Contenido de Humedad**
- Visualización de datos de hidrometría
- Gráficos de dispersión
- Tabla detallada con todos los parámetros

#### 3. **Límites de Atterberg**
- Límite Líquido (LL)
- Límite Plástico (LP)
- Índice de Plasticidad (IP)
- Carta de Plasticidad de Casagrande

#### 4. **Clasificación de Suelos**
- Sistema AASHTO
- Distribución granulométrica
- Gráficos de clasificación

#### 5. **Fases del Suelo**
- Diagrama de fases
- Relaciones volumétricas
- Cálculos automáticos

#### 6. **Generador de Informes**
- Selecciona ensayos a incluir
- Elige formato: PDF, Excel o Word
- Incluye gráficos y tablas automáticamente
- Descarga con un clic

---

## 📁 Estructura del Proyecto

```
ProyectoHSGVA/
│
├── 📄 app.py                  # Servidor Flask
├── 📄 index.html              # Interfaz principal
├── 📋 requirements.txt        # Dependencias Python
├── 🚀 start.bat              # Inicio automático (CMD)
├── 🚀 start.ps1              # Inicio automático (PowerShell)
│
├── 📁 css/                    # Estilos
│   ├── styles.css
│   └── modules.css
│
├── 📁 js/                     # JavaScript
│   ├── main.js               # Funcionalidad principal
│   ├── charts.js             # Gráficos
│   ├── tour.js               # Tour guiado
│   └── modules/              # Módulos por ensayo
│
├── 📁 etl/                    # Procesamiento de datos
│   ├── hidrometria_etl.py
│   ├── atterberg_etl.py
│   └── clasificacion_etl.py
│
└── 📁 Data/                   # Datos de ensayos
    ├── Hidrometria #4.xlsx
    ├── Limites de Atterberg.xlsx
    └── Clasificacion de Suelos #2.xlsx
```

---

## 🔧 Tecnologías

**Backend:**
- Python 3.x
- Flask 3.0.0
- Pandas 2.1.4
- NumPy 1.26.2
- ReportLab 4.0.7 (PDF)
- Matplotlib 3.10.7 (Gráficos)
- OpenPyXL 3.1.2 (Excel)

**Frontend:**
- HTML5, CSS3, JavaScript
- Chart.js (Gráficos)
- Plotly.js (Visualizaciones)
- Driver.js (Tour guiado)
- Font Awesome (Iconos)

---

## 🎨 Características de Diseño

- ✨ Interfaz moderna y profesional
- 🎨 Paleta de colores verde geotécnico
- 📱 Diseño responsive (se adapta a móvil, tablet y PC)
- 🌊 Animaciones suaves
- 📊 Gráficos interactivos
- 🎯 Tour guiado contextual

---

## ❓ Solución de Problemas

### **El servidor no inicia**
- Verifica que Python esté instalado: `python --version`
- Asegúrate de estar en la carpeta correcta del proyecto
- Intenta con la instalación manual

### **Error al instalar dependencias**
- Actualiza pip: `python -m pip install --upgrade pip`
- Verifica tu conexión a internet
- Ejecuta: `pip install -r requirements.txt` nuevamente

### **El navegador no se abre automáticamente**
- Abre manualmente: `http://localhost:5000`
- Verifica que el puerto 5000 no esté en uso

### **Errores de permisos en PowerShell**
- Ejecuta PowerShell como Administrador
- O usa `start.bat` en su lugar

---

## � Datos de Ejemplo

El proyecto incluye datos de ejemplo en la carpeta `Data/`:
- Ensayos de hidrometría
- Límites de Atterberg
- Clasificación de suelos AASHTO

Estos datos se cargan automáticamente al iniciar la aplicación.

---

## 📄 Generación de Informes

### Pasos para generar un informe:

1. Ve al módulo **"Generador de Informes"**
2. Completa la información del proyecto (título, cliente, ubicación)
3. Selecciona los ensayos a incluir (checkbox)
4. Marca "Incluir Gráficos" si deseas gráficos en el informe
5. Elige el formato: **PDF**, **Excel** o **Word**
6. Haz clic en **"Generar Informe"**
7. El archivo se descargará automáticamente

**Formatos disponibles:**
- **PDF** - Informe profesional con tablas y gráficos
- **Excel** - Datos editables con gráficos embebidos
- **Word** - Documento de texto con datos

---

## � Actualizar Datos

Para cargar tus propios datos de ensayos:

1. Coloca los archivos Excel en la carpeta `Data/`
2. Asegúrate de que el formato sea compatible
3. Reinicia el servidor (Ctrl+C y ejecuta `start.bat` nuevamente)

---

## 💡 Consejos

- 🎯 Usa el **Tour Guiado** (botón ❓) para familiarizarte con cada módulo
- 📊 Los gráficos son interactivos: haz zoom, pan y descarga imágenes
- 📄 Genera informes con gráficos para presentaciones profesionales
- 💾 Los datos se procesan en tiempo real, no se necesita guardar

---

## � Versión

**Versión:** 2.0.0  
**Fecha:** Noviembre 2025  

---

## 🎓 Uso Académico

Este sistema está diseñado para uso académico y profesional en el campo de la ingeniería geotécnica y mecánica de suelos.

---

**¿Necesitas ayuda?** Usa el botón ❓ en la aplicación para ver el tour guiado de cada módulo.