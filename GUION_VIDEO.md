# 🎥 Guión para Video Explicativo (5 minutos)

## 📹 Estructura del Video

---

### **INTRO (0:00 - 0:30)**

**Visual:** Logo de HSGVA + Título del proyecto

**Narración:**
> "Bienvenidos. Hoy presentaremos el Sistema de Análisis Geotécnico HSGVA, una aplicación web diseñada para automatizar el procesamiento y análisis de ensayos de laboratorio de suelos."

**Elementos a Mostrar:**
- Logo del proyecto
- Título principal
- Nombres del equipo

---

### **SECCIÓN 1: Presentación de la Interfaz (0:30 - 1:30)**

**Visual:** Dashboard principal con navegación

**Narración:**
> "La aplicación cuenta con una interfaz moderna e intuitiva, inspirada en dashboards profesionales. En el panel lateral encontramos el menú de navegación con acceso a todos los módulos de ensayos."

**Demostración:**
1. **Recorrido visual del dashboard**
   - Mostrar KPIs principales
   - Resaltar métricas de proyectos activos
   - Mostrar ensayos realizados

2. **Gráficos interactivos**
   - Gráfico de cascada
   - Gráfico de barras de ensayos
   - Gráfico de líneas de tendencias
   - Medidor de eficiencia
   - TreeMap de distribución
   - Gráfico circular de estados

3. **Tabla de proyectos recientes**
   - Mostrar información organizada
   - Destacar funcionalidad de búsqueda

**Puntos Clave:**
- Diseño responsive
- Navegación intuitiva
- Visualización clara de datos
- Código de colores profesional

---

### **SECCIÓN 2: Módulo de Contenido de Humedad (1:30 - 3:30)**

**Visual:** Módulo completo en funcionamiento

**Narración:**
> "Vamos a demostrar el módulo de Contenido de Humedad, completamente funcional y validado según normas ASTM e INV."

#### **Paso 1: Ingreso de Datos (1:30 - 2:00)**

**Demostración:**
```
Proyecto: Edificio Central Plaza
Muestra: M-001
Fecha: 23/11/2025
Operador: Ing. García

Recipiente: R-15
Peso Recipiente: 25.50 g
Peso Húmedo: 185.30 g
Peso Seco: 165.80 g
```

**Narración:**
> "Ingresamos primero la información general del proyecto: nombre, número de muestra, fecha y operador responsable. Luego, los datos de medición obtenidos en laboratorio: número de recipiente y los tres pesajes requeridos."

#### **Paso 2: Cálculo y Resultados (2:00 - 2:45)**

**Demostración:**
1. Click en botón "Calcular"
2. Mostrar resultados instantáneos:
   - Contenido de Humedad: 13.92%
   - Peso del Agua: 19.50 g
   - Peso Suelo Seco: 140.30 g
   - Clasificación: Seco

**Narración:**
> "Al hacer clic en calcular, el sistema procesa los datos instantáneamente. Muestra el contenido de humedad calculado, el peso del agua, el peso del suelo seco, y clasifica automáticamente el suelo según su humedad."

#### **Paso 3: Cálculos Detallados (2:45 - 3:00)**

**Visual:** Sección de cálculos paso a paso

**Narración:**
> "La aplicación muestra los cálculos detallados paso a paso, facilitando la comprensión del proceso y permitiendo su verificación."

**Mostrar:**
```
1. Peso del Agua:
   Ww = 185.30 - 165.80 = 19.50 g

2. Peso del Suelo Seco:
   Ws = 165.80 - 25.50 = 140.30 g

3. Contenido de Humedad:
   w = (19.50 / 140.30) × 100 = 13.92%
```

#### **Paso 4: Múltiples Muestras (3:00 - 3:30)**

**Demostración:**
1. Agregar segunda muestra
2. Agregar tercera muestra
3. Mostrar tabla con historial
4. Resaltar cálculo de promedio automático

**Narración:**
> "Para proyectos con múltiples muestras, podemos agregar tantas como necesitemos. El sistema mantiene un historial organizado y calcula automáticamente el promedio de todas las mediciones."

---

### **SECCIÓN 3: Características Técnicas (3:30 - 4:15)**

**Visual:** Código y validaciones

**Narración:**
> "La aplicación incluye validaciones robustas que garantizan la calidad de los datos."

#### **Validaciones Implementadas:**

**Demostración de Errores:**
1. Intentar ingresar peso húmedo menor que recipiente
   - Mostrar mensaje: "El peso húmedo debe ser mayor que el recipiente"

2. Intentar ingresar peso seco mayor que húmedo
   - Mostrar mensaje: "El peso seco debe ser menor que el húmedo"

**Narración:**
> "El sistema valida que los pesos sean lógicamente correctos, previniendo errores de captura y asegurando resultados confiables."

#### **Funciones Adicionales:**

**Demostrar:**
1. **Exportar datos**
   - Click en botón Exportar
   - Mostrar archivo CSV generado
   - Abrir en Excel

2. **Limpiar formulario**
   - Click en botón Limpiar
   - Confirmar limpieza

**Narración:**
> "Podemos exportar todos los datos a formato CSV para análisis posteriores o integración con otras herramientas. También está la opción de limpiar el formulario para comenzar un nuevo proyecto."

---

### **SECCIÓN 4: Tecnologías y Metodología (4:15 - 4:45)**

**Visual:** Diagrama de arquitectura / código fuente

**Narración:**
> "La aplicación está desarrollada con tecnologías web estándar: HTML5 para la estructura, CSS3 para el diseño visual, y JavaScript puro para la funcionalidad."

**Mostrar brevemente:**
1. **Estructura modular**
   - Archivos organizados por función
   - Módulos independientes

2. **Librerías utilizadas:**
   - Chart.js para gráficos
   - Plotly.js para visualizaciones avanzadas
   - Font Awesome para iconografía

3. **Características:**
   - Sin dependencias de backend
   - Funciona 100% en el navegador
   - Responsive design
   - Código limpio y documentado

---

### **SECCIÓN 5: Módulos en Desarrollo (4:45 - 5:00)**

**Visual:** Pantallas de módulos futuros

**Narración:**
> "Actualmente estamos desarrollando los módulos restantes: Límites de Atterberg con curva de fluidez, Clasificación de Suelos según SUCS y AASHTO, Fases Gravimétricas y Volumétricas, y un generador de informes en PDF."

**Mostrar:**
- Wireframes o prototipos de próximos módulos
- Roadmap de desarrollo

---

### **CIERRE (5:00)**

**Visual:** Dashboard completo + Logo

**Narración:**
> "El Sistema de Análisis Geotécnico HSGVA representa una solución moderna, eficiente y profesional para el procesamiento de ensayos de laboratorio. Gracias por su atención."

**Elementos finales:**
- Logo HSGVA
- Contacto / Información del equipo
- Versión de la aplicación

---

## 🎬 Consejos para la Grabación

### Antes de Grabar:
- [ ] Preparar datos de ejemplo realistas
- [ ] Limpiar navegador (cerrar tabs innecesarios)
- [ ] Ajustar resolución de pantalla (1920x1080 recomendado)
- [ ] Probar el audio
- [ ] Preparar guión de narración

### Durante la Grabación:
- [ ] Hablar claro y pausado
- [ ] Hacer movimientos de mouse suaves
- [ ] Pausar entre secciones
- [ ] Resaltar elementos importantes
- [ ] Mantener ritmo constante

### Software Recomendado:
- **OBS Studio** (gratuito) - Grabación de pantalla
- **Audacity** (gratuito) - Edición de audio
- **DaVinci Resolve** (gratuito) - Edición de video

### Configuración de Grabación:
- Resolución: 1920x1080 (Full HD)
- FPS: 30 o 60
- Formato: MP4
- Codec: H.264
- Bitrate: 8-10 Mbps

---

## 📝 Checklist Pre-Grabación

### Preparación Técnica:
- [ ] Aplicación funcionando correctamente
- [ ] Datos de prueba preparados
- [ ] Navegador limpio (sin extensiones visibles)
- [ ] Zoom de navegador al 100%
- [ ] Modo de pantalla completa disponible

### Preparación Visual:
- [ ] Dashboard con datos interesantes
- [ ] Gráficos generados correctamente
- [ ] Colores renderizando bien
- [ ] Sin errores en consola

### Preparación de Contenido:
- [ ] Ejemplos de cálculo verificados
- [ ] Mensajes de validación probados
- [ ] Exportación funcionando
- [ ] Todas las funciones testeadas

---

## 🎯 Puntos Clave a Enfatizar

1. **Profesionalismo del diseño**
   - Interfaz moderna
   - Estética similar a Power BI
   - Código de colores institucional

2. **Funcionalidad completa**
   - Cálculos automáticos
   - Validaciones robustas
   - Resultados detallados

3. **Facilidad de uso**
   - Interfaz intuitiva
   - Instrucciones claras
   - Feedback inmediato

4. **Extensibilidad**
   - Diseño modular
   - Fácil de expandir
   - Código bien documentado

5. **Aplicabilidad**
   - Normas ASTM e INV
   - Casos de uso reales
   - Exportación de datos

---

## ⏱️ Distribución del Tiempo

| Sección | Tiempo | Contenido |
|---------|--------|-----------|
| Intro | 30s | Presentación |
| Dashboard | 1:00 | Interfaz y gráficos |
| Módulo Humedad | 2:00 | Demostración completa |
| Validaciones | 45s | Características técnicas |
| Tecnología | 30s | Stack tecnológico |
| Cierre | 15s | Conclusión |
| **TOTAL** | **5:00** | |

---

**¡Éxito con el video!** 🎬
