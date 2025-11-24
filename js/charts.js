// ========================================
// CHARTS.JS - Gráficos del Dashboard
// ========================================

let dashboardHumedadData = null;
let dashboardAtterbergData = null;
let dashboardClasificacionData = null;

document.addEventListener('DOMContentLoaded', function() {
    loadAllDashboardData();
});

// Cargar datos de todos los módulos
async function loadAllDashboardData() {
    try {
        // Cargar datos de humedad
        const humedadResponse = await fetch('/api/humedad/datos');
        const humedadResult = await humedadResponse.json();
        if (humedadResult.success) {
            dashboardHumedadData = humedadResult.data;
        }

        // Cargar datos de Atterberg
        const atterbergResponse = await fetch('/api/atterberg/datos');
        const atterbergResult = await atterbergResponse.json();
        if (atterbergResult.success) {
            dashboardAtterbergData = atterbergResult.data;
        }

        // Cargar datos de clasificación
        const clasificacionResponse = await fetch('/api/clasificacion/datos');
        const clasificacionResult = await clasificacionResponse.json();
        if (clasificacionResult.success) {
            dashboardClasificacionData = clasificacionResult.data;
        }

        // Inicializar gráficos
        initializeCharts();
    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        initializeCharts();
    }
}

function initializeCharts() {
    initHumedadEvolutionChart();
    initAtterbergChart();
    initClasificacionChart();
    initResumenGaugeChart();
    initComparativaChart();
    initDistribucionChart();
}

// ========================================
// 1. EVOLUCIÓN DE HUMEDAD vs TEMPERATURA
// ========================================

function initHumedadEvolutionChart() {
    const canvas = document.getElementById('waterfallChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let labels, humedadValues, temperaturaValues;
    
    if (dashboardHumedadData && dashboardHumedadData.length > 0) {
        labels = dashboardHumedadData.map(d => `${d.t_min} min`);
        humedadValues = dashboardHumedadData.map(d => d.humedad);
        temperaturaValues = dashboardHumedadData.map(d => d.temperatura);
    } else {
        labels = ['M1', 'M2', 'M3', 'M4', 'M5'];
        humedadValues = [15, 16, 14, 17, 15.5];
        temperaturaValues = [20, 21, 19, 22, 20.5];
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Contenido de Humedad (%)',
                    data: humedadValues,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y',
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Temperatura (°C)',
                    data: temperaturaValues,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: false,
                    yAxisID: 'y1',
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Evolución del Contenido de Humedad en el Tiempo',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Humedad (%)'
                    },
                    grid: {
                        color: '#e2e8f0'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Temperatura (°C)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// ========================================
// 2. LÍMITES DE ATTERBERG
// ========================================

function initAtterbergChart() {
    const canvas = document.getElementById('barChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ll, lp, ip;
    
    if (dashboardAtterbergData) {
        ll = dashboardAtterbergData.ll || 0;
        lp = dashboardAtterbergData.lp || 0;
        ip = dashboardAtterbergData.ip || 0;
    } else {
        ll = 50;
        lp = 30;
        ip = 20;
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Límite Líquido (LL)', 'Límite Plástico (LP)', 'Índice de Plasticidad (IP)'],
            datasets: [{
                label: 'Límites de Atterberg (%)',
                data: [ll, lp, ip],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(245, 87, 108, 0.8)',
                    'rgba(16, 185, 129, 0.8)'
                ],
                borderColor: [
                    '#667eea',
                    '#f5576c',
                    '#10b981'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Límites de Atterberg',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toFixed(2) + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Porcentaje (%)'
                    },
                    grid: {
                        color: '#e2e8f0'
                    }
                }
            }
        }
    });
}

// ========================================
// 3. CLASIFICACIÓN DE SUELOS
// ========================================

function initClasificacionChart() {
    const canvas = document.getElementById('lineChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let labels = [];
    let data = [];
    let colors = [];
    
    if (dashboardClasificacionData && dashboardClasificacionData.analisis_granulometrico) {
        const clasificaciones = {};
        dashboardClasificacionData.analisis_granulometrico.forEach(analisis => {
            if (analisis.clasificacion) {
                clasificaciones[analisis.clasificacion] = (clasificaciones[analisis.clasificacion] || 0) + 1;
            }
        });
        
        labels = Object.keys(clasificaciones);
        data = Object.values(clasificaciones);
        colors = [
            'rgba(102, 126, 234, 0.8)',
            'rgba(245, 87, 108, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)'
        ];
    } else {
        labels = ['A-1-a', 'A-1-b', 'A-2-4'];
        data = [2, 1, 1];
        colors = [
            'rgba(102, 126, 234, 0.8)',
            'rgba(245, 87, 108, 0.8)',
            'rgba(16, 185, 129, 0.8)'
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
                title: {
                    display: true,
                    text: 'Distribución de Clasificación AASHTO',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} muestra(s) (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ========================================
// 4. RESUMEN GAUGE (Plotly.js)
// ========================================

function initResumenGaugeChart() {
    const gaugeDiv = document.getElementById('gaugeChart');
    if (!gaugeDiv) return;

    let value = 0;
    let title = 'Humedad Promedio';
    
    if (dashboardHumedadData && dashboardHumedadData.length > 0) {
        const suma = dashboardHumedadData.reduce((acc, d) => acc + d.humedad, 0);
        value = suma / dashboardHumedadData.length;
    } else {
        value = 15.5;
    }

    const data = [{
        type: "indicator",
        mode: "gauge+number+delta",
        value: value,
        title: { 
            text: title + ' (%)',
            font: { size: 16, family: 'Segoe UI, sans-serif' }
        },
        delta: { 
            reference: 15, 
            increasing: { color: "#10b981" },
            decreasing: { color: "#ef4444" }
        },
        gauge: {
            axis: { 
                range: [0, 25],
                tickwidth: 1,
                tickcolor: "#1e293b"
            },
            bar: { color: "#3b82f6" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "#e2e8f0",
            steps: [
                { range: [0, 10], color: '#fee2e2' },
                { range: [10, 15], color: '#fef3c7' },
                { range: [15, 20], color: '#d1fae5' },
                { range: [20, 25], color: '#dbeafe' }
            ],
            threshold: {
                line: { color: "#ef4444", width: 4 },
                thickness: 0.75,
                value: 20
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

    Plotly.newPlot(gaugeDiv, data, layout, config);
}

// ========================================
// 5. COMPARATIVA DE MUESTRAS - TreeMap (Plotly.js)
// ========================================

function initComparativaChart() {
    const treeDiv = document.getElementById('treemapChart');
    if (!treeDiv) return;

    let labels, parents, values, colors;
    
    if (dashboardClasificacionData && dashboardClasificacionData.muestras) {
        const muestras = dashboardClasificacionData.muestras;
        labels = ['Total'];
        parents = [''];
        values = [muestras.reduce((sum, m) => sum + m.total_muestra, 0)];
        colors = ['#4a7c59'];
        
        muestras.forEach(m => {
            labels.push(`Muestra ${m.numero}`);
            parents.push('Total');
            values.push(m.total_muestra);
            colors.push(['#667eea', '#f5576c', '#10b981', '#f59e0b'][m.numero - 1] || '#64748b');
        });
    } else {
        labels = ['Total', 'M1', 'M2', 'M3', 'M4'];
        parents = ['', 'Total', 'Total', 'Total', 'Total'];
        values = [4500, 1200, 950, 1100, 1250];
        colors = ['#4a7c59', '#667eea', '#f5576c', '#10b981', '#f59e0b'];
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
        hovertemplate: '<b>%{label}</b><br>Peso: %{value}g<br>Porcentaje: %{percentParent}<extra></extra>'
    }];

    const layout = {
        title: {
            text: 'Distribución de Peso Total por Muestra',
            font: { size: 16, family: 'Segoe UI, sans-serif' }
        },
        paper_bgcolor: 'white',
        font: {
            family: 'Segoe UI, sans-serif',
            size: 13,
            color: '#1e293b'
        },
        margin: { t: 40, b: 10, l: 10, r: 10 }
    };

    const config = {
        responsive: true,
        displayModeBar: false
    };

    Plotly.newPlot(treeDiv, data, layout, config);
}

// ========================================
// 6. DISTRIBUCIÓN DE % PASA
// ========================================

function initDistribucionChart() {
    const canvas = document.getElementById('pieChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let labels, data, colors;
    
    if (dashboardClasificacionData && dashboardClasificacionData.analisis_granulometrico) {
        const tamiz10 = dashboardClasificacionData.analisis_granulometrico.filter(a => a.n_tamiz === 10);
        
        labels = tamiz10.map(a => `Muestra ${a.muestra}`);
        data = tamiz10.map(a => a.pct_pasa);
        colors = [
            'rgba(102, 126, 234, 0.8)',
            'rgba(245, 87, 108, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)'
        ];
    } else {
        labels = ['Muestra 1', 'Muestra 2', 'Muestra 3', 'Muestra 4'];
        data = [100, 18, 14, 24];
        colors = [
            'rgba(102, 126, 234, 0.8)',
            'rgba(245, 87, 108, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)'
        ];
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '% Que Pasa Tamiz #10',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.8', '1')),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Porcentaje que Pasa Tamiz #10 por Muestra',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toFixed(2) + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '% Que Pasa'
                    },
                    grid: {
                        color: '#e2e8f0'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Hacer las funciones disponibles globalmente
window.initializeCharts = initializeCharts;
