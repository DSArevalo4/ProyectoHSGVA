// MÓDULO: CLASIFICACIÓN DE SUELOS

let clasificacionData = null;

function initClasificacionModule() {
    const page = document.getElementById('clasificacion-page');
    page.innerHTML = `
        <div class="page-title">
            <h2><i class="fas fa-layer-group"></i> Clasificación de Suelos</h2>
        </div>

        <!-- Botón para cargar datos -->
        <div class="card" style="margin-bottom: 20px;">
            <div class="card-header">
                <h3>Cargar Datos desde Excel</h3>
            </div>
            <div class="card-body">
                <button class="btn btn-primary" id="cargarClasificacionBtn" onclick="cargarDatosClasificacion()">
                    <i class="fas fa-file-excel"></i> Cargar Datos desde Excel
                </button>
            </div>
        </div>

        <!-- Selector de Muestras -->
        <div class="card" id="selectorCard" style="display: none; margin-bottom: 20px;">
            <div class="card-header">
                <h3>Seleccionar Muestra</h3>
            </div>
            <div class="card-body">
                <div id="selectorMuestras" style="display: flex; gap: 15px; flex-wrap: wrap;"></div>
            </div>
        </div>

        <!-- Información de la Muestra -->
        <div class="card" id="infoCard" style="display: none; margin-bottom: 20px;">
            <div class="card-header">
                <h3>Información de la Muestra</h3>
            </div>
            <div class="card-body">
                <div id="infoMuestra"></div>
            </div>
        </div>

        <!-- Análisis Granulométrico -->
        <div class="card" id="granulometriaCard" style="display: none; margin-bottom: 20px;">
            <div class="card-header">
                <h3>Análisis Granulométrico</h3>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="data-table" id="tablaGranulometria">
                        <thead>
                            <tr>
                                <th>N° Tamiz</th>
                                <th>Abertura (mm)</th>
                                <th>Peso Retenido (g)</th>
                                <th>% Retenido</th>
                                <th>% Pasa</th>
                            </tr>
                        </thead>
                        <tbody id="bodyGranulometria"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Gráfico de Curva Granulométrica -->
        <div class="card" id="graficoCard" style="display: none;">
            <div class="card-header">
                <h3>Curva Granulométrica</h3>
            </div>
            <div class="card-body">
                <div style="position: relative; height: 400px; width: 100%;">
                    <canvas id="graficoGranulometria"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos automáticamente
    cargarDatosClasificacion();
}

async function cargarDatosClasificacion() {
    try {
        const btn = document.getElementById('cargarClasificacionBtn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        }

        const response = await fetch('/api/clasificacion/datos');
        const result = await response.json();

        if (result.success && result.data) {
            clasificacionData = result.data;
            mostrarSelectorMuestras();
            if (btn) {
                btn.innerHTML = '<i class="fas fa-check"></i> Datos Cargados';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-sync-alt"></i> Recargar Datos';
                    btn.disabled = false;
                }, 2000);
            }
        } else {
            throw new Error('No se pudieron cargar los datos');
        }
    } catch (error) {
        console.error('Error cargando datos de clasificación:', error);
        const btn = document.getElementById('cargarClasificacionBtn');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-file-excel"></i> Cargar Datos desde Excel';
            btn.disabled = false;
        }
    }
}

function mostrarSelectorMuestras() {
    const selectorCard = document.getElementById('selectorCard');
    const selectorDiv = document.getElementById('selectorMuestras');

    selectorCard.style.display = 'block';

    let html = '';
    clasificacionData.muestras.forEach(muestra => {
        html += `
            <button class="btn btn-secondary" onclick="mostrarMuestra(${muestra.numero})" 
                    style="padding: 15px 30px; font-size: 16px;">
                <i class="fas fa-flask"></i> Muestra N° ${muestra.numero}
            </button>
        `;
    });

    selectorDiv.innerHTML = html;
}

function mostrarMuestra(numMuestra) {
    const muestra = clasificacionData.muestras.find(m => m.numero === numMuestra);
    const analisis = clasificacionData.analisis_granulometrico.filter(a => a.muestra === numMuestra);
    const clasificacion = analisis.find(a => a.clasificacion)?.clasificacion || 'N/A';

    // Mostrar información básica
    const infoCard = document.getElementById('infoCard');
    const infoDiv = document.getElementById('infoMuestra');
    infoCard.style.display = 'block';

    infoDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; text-align: center; color: white;">
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">Muestra N°</div>
                <div style="font-size: 32px; font-weight: bold;">${muestra.numero}</div>
            </div>
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; text-align: center; color: white;">
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">Clasificación AASHTO</div>
                <div style="font-size: 32px; font-weight: bold;">${clasificacion}</div>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; background: #f8fafc; padding: 20px; border-radius: 10px;">
            <div>
                <div style="color: #64748b; font-size: 13px; margin-bottom: 5px;">Platon</div>
                <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${muestra.platon} g</div>
            </div>
            <div>
                <div style="color: #64748b; font-size: 13px; margin-bottom: 5px;">Muestra</div>
                <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${muestra.muestra} g</div>
            </div>
            <div>
                <div style="color: #64748b; font-size: 13px; margin-bottom: 5px;">N° 10</div>
                <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${muestra.n10} g</div>
            </div>
            <div>
                <div style="color: #64748b; font-size: 13px; margin-bottom: 5px;">N° 40</div>
                <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${muestra.n40} g</div>
            </div>
            <div>
                <div style="color: #64748b; font-size: 13px; margin-bottom: 5px;">N° 200</div>
                <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${muestra.n200} g</div>
            </div>
            <div>
                <div style="color: #64748b; font-size: 13px; margin-bottom: 5px;">Total Muestra</div>
                <div style="font-size: 18px; font-weight: bold; color: #4a7c59;">${muestra.total_muestra} g</div>
            </div>
        </div>
    `;

    // Mostrar tabla de análisis granulométrico
    mostrarTablaGranulometria(analisis);

    // Mostrar gráfico
    mostrarGraficoGranulometria(analisis, numMuestra);
}

function mostrarTablaGranulometria(analisis) {
    const card = document.getElementById('granulometriaCard');
    const tbody = document.getElementById('bodyGranulometria');

    card.style.display = 'block';

    let html = '';
    analisis.forEach(dato => {
        html += `
            <tr>
                <td style="font-weight: bold;">N° ${dato.n_tamiz}</td>
                <td>${dato.abertura_mm.toFixed(3)}</td>
                <td>${dato.peso_retenido.toFixed(1)}</td>
                <td>${dato.pct_retenido.toFixed(2)}%</td>
                <td style="font-weight: bold; color: #4a7c59;">${dato.pct_pasa.toFixed(2)}%</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function mostrarGraficoGranulometria(analisis, numMuestra) {
    const card = document.getElementById('graficoCard');
    card.style.display = 'block';

    const ctx = document.getElementById('graficoGranulometria');
    
    if (!ctx) {
        console.error('Canvas no encontrado');
        return;
    }

    // Datos para el gráfico (% Pasa vs Abertura)
    const aberturas = analisis.map(a => a.abertura_mm);
    const porcentajes = analisis.map(a => a.pct_pasa);
    
    console.log('Datos del gráfico:', { aberturas, porcentajes });

    // Destruir gráfico anterior si existe
    if (window.graficoGranulometria && typeof window.graficoGranulometria.destroy === 'function') {
        window.graficoGranulometria.destroy();
    }

    // Esperar a que el canvas esté visible
    setTimeout(() => {
        window.graficoGranulometria = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: aberturas.map(a => a.toFixed(3) + ' mm'),
                datasets: [{
                    label: '% Pasa',
                    data: porcentajes,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
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
                        borderColor: '#667eea',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `% Pasa: ${context.parsed.y.toFixed(2)}%`;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: `Curva Granulométrica - Muestra N° ${numMuestra}`,
                        font: {
                            size: 16,
                            weight: 'bold'
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
                            color: '#e2e8f0',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#64748b',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Abertura del Tamiz (mm)'
                        },
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
    }, 100);
}

window.initClasificacionModule = initClasificacionModule;
window.cargarDatosClasificacion = cargarDatosClasificacion;
window.mostrarMuestra = mostrarMuestra;
