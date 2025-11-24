# 🚀 Guía Rápida de Inicio

## ¿Qué es este proyecto?

Sistema web para automatizar ensayos de laboratorio de suelos con:
- ✅ Dashboard profesional con gráficos interactivos
- ✅ Módulo de Contenido de Humedad completamente funcional
- ✅ Validación automática de datos
- ✅ Exportación de resultados
- ✅ Interfaz moderna estilo Power BI

---

## ⚡ Inicio Rápido (3 pasos)

### 1️⃣ Abrir la Aplicación

**Windows:**
```
Doble clic en: index.html
```

**Mac/Linux:**
```bash
open index.html
```

### 2️⃣ Explorar el Dashboard

- Observa las métricas principales (KPIs)
- Navega por los gráficos interactivos
- Revisa la tabla de proyectos

### 3️⃣ Usar el Módulo de Humedad

1. **Click en:** 💧 Contenido de Humedad (menú lateral)
2. **Completa los datos:**
   - Proyecto: "Mi Proyecto de Prueba"
   - Muestra: "M-001"
   - Fecha: (ya viene por defecto)
   - N° Recipiente: "R-1"
   - Peso Recipiente: 25.50
   - Peso Húmedo: 185.30
   - Peso Seco: 165.80
3. **Click en:** Calcular
4. **¡Listo!** Verás los resultados instantáneos

---

## 📖 Navegación Básica

### Menú Lateral

| Opción | Función |
|--------|---------|
| 🏠 Dashboard | Vista general del sistema |
| 💧 Contenido de Humedad | Cálculo de humedad del suelo ✅ |
| 📊 Límites de Atterberg | Próximamente |
| 🔍 Clasificación | Próximamente |
| ⚖️ Fases del Suelo | Próximamente |
| 📄 Generar Informe | Próximamente |

---

## 🧮 Ejemplo Práctico

### Caso: Ensayo de Humedad

**Datos medidos en laboratorio:**
- Recipiente R-15: 25.50 g
- Rec. + Suelo Húmedo: 185.30 g
- Rec. + Suelo Seco: 165.80 g

**Resultado automático:**
- Humedad: **13.92%**
- Clasificación: **Seco**
- Peso agua: 19.50 g
- Peso suelo seco: 140.30 g

---

## ❓ Preguntas Frecuentes

**¿Necesito internet?**
Sí, solo para cargar las librerías de gráficos (Chart.js, Plotly). El resto funciona localmente.

**¿Dónde se guardan los datos?**
Actualmente se mantienen en memoria. Al cerrar el navegador se pierden. Puedes exportar a CSV antes de cerrar.

**¿Funciona en móvil?**
Sí, el diseño es completamente responsive.

**¿Puedo modificar el código?**
Sí, el código está completamente documentado y es de uso libre para el proyecto.

---

## 📊 Características del Dashboard

### KPIs Disponibles
1. **Proyectos Activos:** 12 proyectos
2. **Ensayos Realizados:** 48 ensayos
3. **Completados:** 45 (93.75%)
4. **Tiempo Promedio:** 2.5 horas

### Gráficos Interactivos
- Cascada de presupuestos
- Barras de ensayos por tipo
- Líneas de tendencias mensuales
- Medidor de eficiencia
- TreeMap de distribución
- Circular de estados de proyectos

---

## 🎯 Próximos Pasos

1. **Explorar** todos los gráficos del dashboard
2. **Practicar** con el módulo de humedad
3. **Experimentar** con diferentes valores
4. **Exportar** tus primeros resultados
5. **Revisar** la documentación técnica en `GUIA_TECNICA.md`

---

## 📞 ¿Necesitas Ayuda?

**Documentación Completa:**
- `README.md` - Guía principal
- `GUIA_TECNICA.md` - Detalles técnicos
- `GUION_VIDEO.md` - Para crear el video
- `CHECKLIST.md` - Estado del proyecto

**Archivos Importantes:**
- `index.html` - Página principal
- `css/styles.css` - Estilos
- `js/main.js` - Funcionalidad

---

## ✨ Tips Rápidos

💡 **Tip 1:** Puedes agregar múltiples muestras y el sistema calcula el promedio automáticamente

💡 **Tip 2:** Todos los cálculos se muestran paso a paso para que puedas verificarlos

💡 **Tip 3:** La aplicación valida que los datos sean lógicos antes de calcular

💡 **Tip 4:** Exporta tus datos a CSV para abrirlos en Excel

💡 **Tip 5:** El formulario se puede limpiar con el botón "Limpiar"

---

## 🎨 Personalización

**Cambiar colores:**
Edita `css/styles.css` → Variables CSS (`:root`)

**Agregar módulos:**
Sigue la estructura en `js/modules/humedad.js`

**Modificar dashboard:**
Edita `js/charts.js` para los gráficos

---

**¡Listo para comenzar! 🚀**

Abre `index.html` y explora tu nuevo sistema de análisis geotécnico.
