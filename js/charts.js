// ========================================
// CHARTS.JS - Gráficos del Dashboard
// ========================================

let dashboardData = null;

document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
});

// Cargar datos reales desde el backend
async function loadDashboardData() {
    try {
        const response = await fetch('/api/humedad/datos');
        const result = await response.json();
        
        if (result.success && result.data) {
            dashboardData = result.data;
            initializeCharts();
        } else {
            console.warn('No se pudieron cargar los datos, usando datos de ejemplo');
            initializeCharts();
        }
    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        initializeCharts();
    }
}

function initializeCharts() {
    initWaterfallChart();
    initBarChart();
    initLineChart();
    initGaugeChart();
    initTreemapChart();
    initPieChart();
}

// ========================================
// GRÁFICO DE CASCADA (Plotly)
// ========================================

function initWaterfallChart() {
    let measure, x, y, title;
    
    // Si hay datos reales del Excel, mostrar variación de humedad
    if (dashboardData && dashboardData.length > 0) {
        // Tomar cada 3 muestras para simplificar el waterfall
        const indices = [0, 3, 6, 9, 12];
        const muestras = indices.map(i => dashboardData[i]).filter(d => d);
        
        // Calcular variaciones relativas
        const inicial = muestras[0].humedad;
        measure = ['absolute'];
        x = [`Inicial (${muestras[0].t_min}min)`];
        y = [inicial];
        
        for (let i = 1; i < muestras.length; i++) {
            const variacion = muestras[i].humedad - muestras[i-1].humedad;
            measure.push('relative');
            x.push(`${muestras[i].t_min}min`);
            y.push(variacion);
        }
        
        measure.push('total');
        x.push('Final');
        y.push(0);
        
        title = 'Variación de Humedad (%)';
    } else {
        measure = ['relative', 'relative', 'relative', 'relative', 'total'];
        x = ['Gasto A', 'Gasto B', 'Presupuesto', 'Gasto C', 'Total'];
        y = [400, -200, 300, -150, 0];
        title = '';
    }

    const data = [{
        type: 'waterfall',
        orientation: 'v',
        measure: measure,
        x: x,
        textposition: 'outside',
        y: y,
        connector: {
            line: {
                color: 'rgb(63, 63, 63)'
            }
        },
        decreasing: { marker: { color: '#ef4444' }},
        increasing: { marker: { color: '#4a7c59' }},
        totals: { marker: { color: '#6ba083' }}
    }];

    const layout = {
        title: {
            text: title,
            font: { family: 'Segoe UI, sans-serif' }
        },
        xaxis: {
            title: dashboardData ? 'Tiempo (min)' : 'Categorías',
            gridcolor: '#e2e8f0'
        },
        yaxis: {
            title: dashboardData ? 'Humedad (%)' : 'Monto (€)',
            gridcolor: '#e2e8f0'
        },
        paper_bgcolor: 'white',
        plot_bgcolor: 'white',
        font: {
            family: 'Segoe UI, sans-serif',
            color: '#1e293b'
        },
        margin: { t: 40, b: 60, l: 60, r: 20 }
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot('waterfallChart', data, layout, config);
}

// ========================================
// GRÁFICO DE BARRAS (Chart.js)
// ========================================

function initBarChart() {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;

    let labels, values, colors;
    
    // Si hay datos reales del Excel, usarlos
    if (dashboardData && dashboardData.length > 0) {
        // Tomar las primeras 5 muestras para el gráfico de barras
        const muestras = dashboardData.slice(0, 5);
        labels = muestras.map((d, i) => `Lectura ${i + 1}`);
        values = muestras.map(d => d.humedad);
        
        // Colores degradados
        colors = [
            'rgba(74, 124, 89, 0.9)',
            'rgba(107, 160, 131, 0.8)',
            'rgba(168, 213, 186, 0.7)',
            'rgba(107, 160, 131, 0.6)',
            'rgba(74, 124, 89, 0.5)'
        ];
    } else {
        // Datos de ejemplo
        labels = ['Humedad', 'Límites', 'Clasificación', 'Granulometría', 'Fases'];
        values = [15, 12, 10, 8, 7];
        colors = [
            'rgba(74, 124, 89, 0.8)',
            'rgba(107, 160, 131, 0.8)',
            'rgba(168, 213, 186, 0.8)',
            'rgba(74, 124, 89, 0.6)',
            'rgba(107, 160, 131, 0.6)'
        ];
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: dashboardData ? 'Humedad (%)' : 'Ensayos Realizados',
                data: values,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.', '1.')),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    borderColor: '#4a7c59',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return dashboardData ? `Humedad: ${context.parsed.y.toFixed(2)}%` : context.formattedValue;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#64748b',
                        callback: function(value) {
                            return dashboardData ? value.toFixed(1) + '%' : value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#64748b'
                    }
                }
            }
        }
    });
}

// ========================================
// GRÁFICO DE LÍNEAS (Chart.js)
// ========================================

function initLineChart() {
    const ctx = document.getElementById('lineChart');
    if (!ctx) return;

    let labels, humedadValues;
    
    // Si hay datos reales del Excel, usarlos
    if (dashboardData && dashboardData.length > 0) {
        labels = dashboardData.map(d => `${d.t_min} min`);
        humedadValues = dashboardData.map(d => d.humedad);
    } else {
        // Datos de ejemplo
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        humedadValues = [65, 70, 75, 72, 80, 85, 90, 88, 92, 95, 98, 100];
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Contenido de Humedad (%)',
                    data: humedadValues,
                    borderColor: '#4a7c59',
                    backgroundColor: 'rgba(74, 124, 89, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#4a7c59',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    borderColor: '#4a7c59',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#64748b'
                    }
                }
            }
        }
    });
}

// ========================================
// GRÁFICO GAUGE (Plotly)
// ========================================

function initGaugeChart() {
    let value, title, range, steps, threshold;
    
    // Si hay datos reales del Excel, calcular promedio de humedad
    if (dashboardData && dashboardData.length > 0) {
        const sumaHumedad = dashboardData.reduce((sum, d) => sum + d.humedad, 0);
        value = sumaHumedad / dashboardData.length;
        title = 'Humedad Promedio (%)';
        range = [0, 25];
        steps = [
            { range: [0, 12], color: '#fee2e2' },   // Muy seco
            { range: [12, 15], color: '#fef3c7' },  // Seco
            { range: [15, 18], color: '#d1fae5' },  // Normal
            { range: [18, 25], color: '#dbeafe' }   // Húmedo
        ];
        threshold = 20;
    } else {
        value = 87.5;
        title = 'Eficiencia (%)';
        range = [0, 100];
        steps = [
            { range: [0, 40], color: '#fee2e2' },
            { range: [40, 70], color: '#fef3c7' },
            { range: [70, 100], color: '#d1fae5' }
        ];
        threshold = 90;
    }

    const data = [{
        type: 'indicator',
        mode: 'gauge+number+delta',
        value: value,
        title: { 
            text: title,
            font: { size: 16, family: 'Segoe UI, sans-serif' }
        },
        delta: { 
            reference: dashboardData ? 15 : 80, 
            increasing: { color: '#4a7c59' },
            decreasing: { color: dashboardData ? '#ef4444' : '#94a3b8' }
        },
        gauge: {
            axis: { 
                range: [null, range[1]], 
                tickwidth: 1, 
                tickcolor: '#1e293b' 
            },
            bar: { color: '#4a7c59' },
            bgcolor: 'white',
            borderwidth: 2,
            bordercolor: '#e2e8f0',
            steps: steps,
            threshold: {
                line: { color: '#ef4444', width: 4 },
                thickness: 0.75,
                value: threshold
            }
        }
    }];

    const layout = {
        paper_bgcolor: 'white',
        font: { 
            color: '#1e293b',
            family: 'Segoe UI, sans-serif'
        },
        margin: { t: 40, b: 20, l: 20, r: 20 }
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot('gaugeChart', data, layout, config);
}

// ========================================
// TREEMAP (Plotly)
// ========================================

function initTreemapChart() {
    let labels, parents, values, colors;
    
    // Si hay datos reales del Excel, categorizar por rangos de humedad
    if (dashboardData && dashboardData.length > 0) {
        // Categorizar muestras por rangos de humedad
        const muySeco = dashboardData.filter(d => d.humedad < 14).length;
        const seco = dashboardData.filter(d => d.humedad >= 14 && d.humedad < 16).length;
        const normal = dashboardData.filter(d => d.humedad >= 16 && d.humedad < 18).length;
        const humedo = dashboardData.filter(d => d.humedad >= 18).length;
        
        const total = muySeco + seco + normal + humedo;
        
        labels = ['Total Muestras', 'Muy Seco (<14%)', 'Seco (14-16%)', 'Normal (16-18%)', 'Húmedo (≥18%)'];
        parents = ['', 'Total Muestras', 'Total Muestras', 'Total Muestras', 'Total Muestras'];
        values = [total, muySeco, seco, normal, humedo];
        colors = ['#4a7c59', '#fee2e2', '#fef3c7', '#d1fae5', '#dbeafe'];
    } else {
        labels = ['Total', 'Estrategia', 'Cáritas', 'Ripao', 'Sigma', 'Universidades'];
        parents = ['', 'Total', 'Total', 'Total', 'Total', 'Total'];
        values = [100, 35, 25, 20, 15, 5];
        colors = ['#4a7c59', '#6ba083', '#a8d5ba', '#d4af37', '#8b9556', '#556b2f'];
    }

    const data = [{
        type: 'treemap',
        labels: labels,
        parents: parents,
        values: values,
        textinfo: 'label+value+percent parent',
        marker: {
            colors: colors,
            line: { color: 'white', width: 2 }
        },
        hovertemplate: dashboardData 
            ? '<b>%{label}</b><br>Muestras: %{value}<br>Porcentaje: %{percentParent}<extra></extra>'
            : '<b>%{label}</b><br>Valor: %{value}<br>Porcentaje: %{percentParent}<extra></extra>'
    }];

    const layout = {
        paper_bgcolor: 'white',
        font: {
            family: 'Segoe UI, sans-serif',
            size: 13,
            color: dashboardData ? '#1e293b' : 'white'
        },
        margin: { t: 10, b: 10, l: 10, r: 10 }
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot('treemapChart', data, layout, config);
}

// ========================================
// GRÁFICO DE PIE (Chart.js)
// ========================================

function initPieChart() {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    let labels, data, colors;
    
    // Si hay datos reales del Excel, mostrar distribución por rangos
    if (dashboardData && dashboardData.length > 0) {
        const muySeco = dashboardData.filter(d => d.humedad < 14).length;
        const seco = dashboardData.filter(d => d.humedad >= 14 && d.humedad < 16).length;
        const normal = dashboardData.filter(d => d.humedad >= 16 && d.humedad < 18).length;
        const humedo = dashboardData.filter(d => d.humedad >= 18).length;
        
        labels = ['Muy Seco (<14%)', 'Seco (14-16%)', 'Normal (16-18%)', 'Húmedo (≥18%)'];
        data = [muySeco, seco, normal, humedo];
        colors = [
            'rgba(254, 226, 226, 0.8)',  // Muy seco - rojo claro
            'rgba(254, 243, 199, 0.8)',  // Seco - amarillo
            'rgba(209, 250, 229, 0.8)',  // Normal - verde claro
            'rgba(219, 234, 254, 0.8)'   // Húmedo - azul claro
        ];
    } else {
        labels = ['Completados', 'En Proceso', 'Pendientes'];
        data = [8, 3, 1];
        colors = [
            'rgba(74, 124, 89, 0.8)',
            'rgba(212, 175, 55, 0.8)',
            'rgba(148, 163, 184, 0.8)'
        ];
    }

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.8', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    borderColor: '#4a7c59',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return dashboardData 
                                ? `${label}: ${value} muestras (${percentage}%)`
                                : `${label}: ${value}`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Hacer las funciones disponibles globalmente
window.initializeCharts = initializeCharts;
