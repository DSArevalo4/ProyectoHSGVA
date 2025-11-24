// TOUR GUIADO CON DRIVER.JS - TOURS POR MÓDULO

const driver = window.driver.js.driver;

// Configuración común para todos los tours
const tourConfig = {
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    nextBtnText: 'Siguiente →',
    prevBtnText: '← Anterior',
    doneBtnText: '✓ Finalizar',
    progressText: '{{current}} de {{total}}',
};

// Tour para Dashboard
function getTourDashboard() {
    return {
        ...tourConfig,
        steps: [
            {
                element: '.page-title',
                popover: {
                    title: '� Dashboard',
                    description: 'Vista general del sistema con estadísticas de todos los ensayos geotécnicos realizados.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '.kpi-grid',
                popover: {
                    title: '📌 Tarjetas KPI',
                    description: 'Indicadores clave que muestran el total de muestras analizadas en cada tipo de ensayo. Cada tarjeta muestra estadísticas resumidas.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '#chartHumedad',
                popover: {
                    title: '💧 Gráfico de Humedad',
                    description: 'Gráfico de dispersión que muestra el contenido de humedad de todas las muestras analizadas. Es interactivo: puedes hacer zoom y descargar.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                element: '#chartAtterberg',
                popover: {
                    title: '� Carta de Plasticidad',
                    description: 'Carta de plasticidad de Casagrande que clasifica los suelos según sus límites de Atterberg.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                element: '#chartClasificacion',
                popover: {
                    title: '🏗️ Distribución por Clasificación',
                    description: 'Gráfico de barras que muestra la distribución de muestras según la clasificación AASHTO.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                popover: {
                    title: '✅ Dashboard Completado',
                    description: 'Usa el menú lateral para navegar a otros módulos y análisis específicos.',
                }
            }
        ]
    };
}

// Tour para Contenido de Humedad
function getTourHumedad() {
    return {
        ...tourConfig,
        steps: [
            {
                element: '.page-title',
                popover: {
                    title: '💧 Contenido de Humedad',
                    description: 'Módulo para analizar el contenido de humedad de las muestras de suelo.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '.stats-container',
                popover: {
                    title: '📊 Estadísticas',
                    description: 'Estadísticas generales: promedio, máximo, mínimo y desviación estándar del contenido de humedad.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '#humedadChart',
                popover: {
                    title: '📈 Gráfico de Dispersión',
                    description: 'Visualización de todas las muestras analizadas. Puedes hacer zoom, pan y exportar el gráfico.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                element: '.tabla-datos',
                popover: {
                    title: '📋 Tabla de Datos',
                    description: 'Tabla detallada con todos los valores de humedad, temperaturas y cálculos realizados.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                popover: {
                    title: '✅ Contenido de Humedad',
                    description: 'Este módulo te permite analizar y exportar los datos de humedad de tus muestras.',
                }
            }
        ]
    };
}

// Tour para Límites de Atterberg
function getTourAtterberg() {
    return {
        ...tourConfig,
        steps: [
            {
                element: '.page-title',
                popover: {
                    title: '📈 Límites de Atterberg',
                    description: 'Análisis de los límites líquido y plástico para clasificación de suelos finos.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '.stats-container',
                popover: {
                    title: '📊 Estadísticas',
                    description: 'Promedios de Límite Líquido (LL), Límite Plástico (LP) e Índice de Plasticidad (IP).',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '#atterbergChart',
                popover: {
                    title: '🎯 Carta de Plasticidad',
                    description: 'Carta de Casagrande que clasifica los suelos según LL e IP. Las líneas A y U dividen las zonas de clasificación.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                element: '.tabla-datos',
                popover: {
                    title: '📋 Tabla de Ensayos',
                    description: 'Detalle de cada ensayo con valores de LL, LP, IP y número de golpes.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                popover: {
                    title: '✅ Límites de Atterberg',
                    description: 'Usa este módulo para clasificar suelos cohesivos según su plasticidad.',
                }
            }
        ]
    };
}

// Tour para Clasificación de Suelos
function getTourClasificacion() {
    return {
        ...tourConfig,
        steps: [
            {
                element: '.page-title',
                popover: {
                    title: '🏗️ Clasificación de Suelos',
                    description: 'Sistema de clasificación AASHTO basado en análisis granulométrico.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '.stats-container',
                popover: {
                    title: '📊 Resumen',
                    description: 'Cantidad de muestras y distribución por tipo de suelo según AASHTO.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '#clasificacionChart',
                popover: {
                    title: '📊 Gráfico de Distribución',
                    description: 'Distribución de muestras por clasificación AASHTO (A-1 a A-7).',
                    side: "top",
                    align: 'start'
                }
            },
            {
                element: '.tabla-datos',
                popover: {
                    title: '� Tabla Detallada',
                    description: 'Clasificación AASHTO, porcentaje que pasa tamiz #200 y descripción de cada muestra.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                popover: {
                    title: '✅ Clasificación de Suelos',
                    description: 'Este módulo clasifica suelos según el sistema AASHTO usado en ingeniería de carreteras.',
                }
            }
        ]
    };
}

// Tour para Fases del Suelo
function getTourFases() {
    return {
        ...tourConfig,
        steps: [
            {
                element: '.page-title',
                popover: {
                    title: '⚖️ Fases del Suelo',
                    description: 'Análisis de las tres fases del suelo: sólidos, líquidos y gases.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '.fases-info',
                popover: {
                    title: '� Diagrama de Fases',
                    description: 'Representación visual de las relaciones volumétricas y gravimétricas del suelo.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '.calculos-container',
                popover: {
                    title: '� Cálculos',
                    description: 'Relaciones volumétricas: porosidad, relación de vacíos, grado de saturación, contenido de humedad, peso específico.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                popover: {
                    title: '✅ Fases del Suelo',
                    description: 'Comprende las propiedades físicas del suelo y sus relaciones fundamentales.',
                }
            }
        ]
    };
}

// Tour para Generador de Informes
function getTourInforme() {
    return {
        ...tourConfig,
        steps: [
            {
                element: '.page-title',
                popover: {
                    title: '📄 Generador de Informes',
                    description: 'Crea informes profesionales en PDF, Excel o Word con los ensayos seleccionados.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '.form-group',
                popover: {
                    title: '� Información del Proyecto',
                    description: 'Completa los datos del proyecto: título, cliente, nombre del proyecto y ubicación.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '.ensayo-checkbox',
                popover: {
                    title: '✅ Seleccionar Ensayos',
                    description: 'Marca los ensayos que deseas incluir en el informe. Puedes seleccionar uno o varios.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '#checkGraficos',
                popover: {
                    title: '📊 Incluir Gráficos',
                    description: 'Activa esta opción para incluir gráficos y tablas profesionales en el informe.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                element: '.formato-card',
                popover: {
                    title: '📁 Formato de Exportación',
                    description: 'Elige el formato del informe: PDF (profesional), Excel (editable con gráficos) o Word (texto).',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '#btnGenerarInforme',
                popover: {
                    title: '⬇️ Generar y Descargar',
                    description: 'Haz clic para generar el informe. Se descargará automáticamente con todos los ensayos seleccionados.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                popover: {
                    title: '✅ Generador de Informes',
                    description: 'Crea informes profesionales con tablas, gráficos y estadísticas en segundos.',
                }
            }
        ]
    };
}

// Función para obtener la página actual
function getPaginaActual() {
    const paginaActiva = document.querySelector('.page.active');
    if (!paginaActiva) return 'dashboard';
    
    const pageId = paginaActiva.id;
    return pageId.replace('-page', '');
}

// Función principal para iniciar el tour según la página actual
function iniciarTour() {
    const paginaActual = getPaginaActual();
    let tourSteps;
    
    switch(paginaActual) {
        case 'dashboard':
            tourSteps = getTourDashboard();
            break;
        case 'humedad':
            tourSteps = getTourHumedad();
            break;
        case 'atterberg':
            tourSteps = getTourAtterberg();
            break;
        case 'clasificacion':
            tourSteps = getTourClasificacion();
            break;
        case 'fases':
            tourSteps = getTourFases();
            break;
        case 'informe':
            tourSteps = getTourInforme();
            break;
        default:
            tourSteps = getTourDashboard();
    }
    
    const driverObj = driver(tourSteps);
    driverObj.drive();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const btnTour = document.getElementById('btnTourGuiado');
    if (btnTour) {
        btnTour.addEventListener('click', function() {
            iniciarTour();
        });
    }
});
