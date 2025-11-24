// MÓDULO: LÍMITES DE ATTERBERG

let atterbergData = null;

function initAtterbergModule() {
    const page = document.getElementById('atterberg-page');
    page.innerHTML = `
        <div class="page-title">
            <h2><i class="fas fa-chart-line"></i> Límites de Atterberg</h2>
        </div>

        <!-- Botón para cargar datos -->
        <div class="card" style="margin-bottom: 20px;">
            <div class="card-header">
                <h3>Cargar Datos desde Excel</h3>
            </div>
            <div class="card-body">
                <button class="btn btn-primary" id="cargarAtterbergBtn" onclick="cargarDatosAtterberg()">
                    <i class="fas fa-file-excel"></i> Cargar Datos desde Excel
                </button>
            </div>
        </div>

        <!-- Resumen de Límites -->
        <div class="card" id="resumenCard" style="display: none; margin-bottom: 20px;">
            <div class="card-header">
                <h3>Resultados de Límites de Atterberg</h3>
            </div>
            <div class="card-body">
                <div id="resumenLimites" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;"></div>
            </div>
        </div>

        <!-- Tabla de Límite Líquido -->
        <div class="card" id="limiteLiquidoCard" style="display: none; margin-bottom: 20px;">
            <div class="card-header">
                <h3>Límite Líquido (LL)</h3>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="data-table" id="tablaLimiteLiquido">
                        <thead>
                            <tr>
                                <th>Ensayo</th>
                                <th>Caso</th>
                                <th>N° Golpes</th>
                                <th>Recipiente (g)</th>
                                <th>Rec + Suelo H (g)</th>
                                <th>Rec + Suelo s (g)</th>
                                <th>Ww (g)</th>
                                <th>Ws (g)</th>
                                <th>W (%)</th>
                            </tr>
                        </thead>
                        <tbody id="bodyLimiteLiquido"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Tabla de Límite Plástico -->
        <div class="card" id="limitePlasticoCard" style="display: none; margin-bottom: 20px;">
            <div class="card-header">
                <h3>Límite Plástico (LP)</h3>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="data-table" id="tablaLimitePlastico">
                        <thead>
                            <tr>
                                <th>Ensayo</th>
                                <th>Recipiente (g)</th>
                                <th>Rec + Suelo H (g)</th>
                                <th>Rec + Suelo s (g)</th>
                                <th>Ww (g)</th>
                                <th>Ws (g)</th>
                                <th>W (%)</th>
                            </tr>
                        </thead>
                        <tbody id="bodyLimitePlastico"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Gráfico de Límite Líquido -->
        <div class="card" id="graficoLLCard" style="display: none;">
            <div class="card-header">
                <h3>Relación N° Golpes vs Contenido de Humedad</h3>
            </div>
            <div class="card-body">
                <canvas id="graficoLimiteLiquido" height="300"></canvas>
            </div>
        </div>
    `;
    
    // Cargar datos automáticamente
    cargarDatosAtterberg();
}

async function cargarDatosAtterberg() {
    try {
        const btn = document.getElementById('cargarAtterbergBtn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        }

        const response = await fetch('/api/atterberg/datos');
        const result = await response.json();

        if (result.success && result.data) {
            atterbergData = result.data;
            mostrarDatosAtterberg();
            
            if (btn) {
                btn.innerHTML = '<i class="fas fa-check"></i> Datos Cargados';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-file-excel"></i> Recargar Datos';
                    btn.disabled = false;
                }, 2000);
            }
        } else {
            throw new Error('No se pudieron cargar los datos');
        }
    } catch (error) {
        console.error('Error cargando datos de Atterberg:', error);
        const btn = document.getElementById('cargarAtterbergBtn');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-file-excel"></i> Cargar Datos desde Excel';
            btn.disabled = false;
        }
    }
}

function mostrarDatosAtterberg() {
    if (!atterbergData) return;

    // Mostrar resumen
    mostrarResumen();

    // Mostrar tabla de Límite Líquido
    mostrarTablaLimiteLiquido();

    // Mostrar tabla de Límite Plástico
    mostrarTablaLimitePlastico();

    // Mostrar gráfico
    mostrarGraficoLimiteLiquido();
}

function mostrarResumen() {
    const resumenCard = document.getElementById('resumenCard');
    const resumenDiv = document.getElementById('resumenLimites');

    resumenCard.style.display = 'block';

    resumenDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; text-align: center; color: white;">
            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">Límite Líquido</div>
            <div style="font-size: 32px; font-weight: bold;">${atterbergData.ll}%</div>
        </div>
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; text-align: center; color: white;">
            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">Límite Plástico</div>
            <div style="font-size: 32px; font-weight: bold;">${atterbergData.lp}%</div>
        </div>
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; text-align: center; color: white;">
            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">Índice de Plasticidad</div>
            <div style="font-size: 32px; font-weight: bold;">${atterbergData.ip}%</div>
        </div>
    `;
}

function mostrarTablaLimiteLiquido() {
    const card = document.getElementById('limiteLiquidoCard');
    const tbody = document.getElementById('bodyLimiteLiquido');

    card.style.display = 'block';

    let html = '';
    atterbergData.limite_liquido.forEach(ensayo => {
        html += `
            <tr>
                <td>${ensayo.ensayo}</td>
                <td>${ensayo.caso}</td>
                <td>${ensayo.n_golpes}</td>
                <td>${ensayo.recipiente}</td>
                <td>${ensayo.recipiente_suelo_h}</td>
                <td>${ensayo.recipiente_suelo_s}</td>
                <td>${ensayo.ww}</td>
                <td>${ensayo.ws}</td>
                <td style="font-weight: bold; color: #4a7c59;">${ensayo.w_percent}%</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function mostrarTablaLimitePlastico() {
    const card = document.getElementById('limitePlasticoCard');
    const tbody = document.getElementById('bodyLimitePlastico');

    card.style.display = 'block';

    let html = '';
    atterbergData.limite_plastico.forEach(ensayo => {
        html += `
            <tr>
                <td>${ensayo.ensayo}</td>
                <td>${ensayo.recipiente}</td>
                <td>${ensayo.recipiente_suelo_h}</td>
                <td>${ensayo.recipiente_suelo_s}</td>
                <td>${ensayo.ww}</td>
                <td>${ensayo.ws}</td>
                <td style="font-weight: bold; color: #4a7c59;">${ensayo.w_percent}%</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function mostrarGraficoLimiteLiquido() {
    const card = document.getElementById('graficoLLCard');
    card.style.display = 'block';

    const ctx = document.getElementById('graficoLimiteLiquido');

    // Extraer datos para el gráfico
    const golpes = atterbergData.limite_liquido.map(e => e.n_golpes);
    const humedades = atterbergData.limite_liquido.map(e => e.w_percent);

    // Destruir gráfico anterior si existe
    if (window.graficoLL) {
        window.graficoLL.destroy();
    }

    window.graficoLL = new Chart(ctx, {
        type: 'line',
        data: {
            labels: golpes,
            datasets: [{
                label: 'Contenido de Humedad (%)',
                data: humedades,
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
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Contenido de Humedad (%)'
                    },
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
                    title: {
                        display: true,
                        text: 'Número de Golpes (N)'
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
}

window.initAtterbergModule = initAtterbergModule;
window.cargarDatosAtterberg = cargarDatosAtterberg;
