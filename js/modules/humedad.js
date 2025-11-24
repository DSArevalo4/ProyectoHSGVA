// ========================================
// MÓDULO: CONTENIDO DE HUMEDAD
// ========================================

function initHumedadModule() {
    const page = document.getElementById('humedad-page');
    
    page.innerHTML = `
        <div class="page-title">
            <h2><i class="fas fa-tint"></i> Contenido de Humedad</h2>
            <div class="page-actions">
                <button class="btn-primary" onclick="cargarDatosExcel()">
                    <i class="fas fa-file-excel"></i> Cargar Datos desde Excel
                </button>
                <button class="btn-secondary" onclick="exportHumedadData()">
                    <i class="fas fa-file-pdf"></i> Exportar PDF
                </button>
            </div>
        </div>

        <div class="module-container">
            <!-- Datos del Ensayo -->
            <div class="chart-card" id="datosExcelCard" style="display: none;">
                <div class="chart-header">
                    <h3><i class="fas fa-database"></i> Datos del Ensayo de Hidrometría</h3>
                    <span class="badge" id="contadorDatosExcel">0 registros</span>
                </div>
                <div class="chart-body" style="padding-top: 0;">
                    <div id="datosExcelTable"></div>
                    <!-- Parámetros discretos al final -->
                    <div id="parametrosCompactos" style="display: none; margin-top: 20px; padding: 10px 15px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid var(--primary-green); border-radius: 6px; font-size: 0.95rem; line-height: 1.5;">
                        <strong style="color: #2d5016; margin-right: 12px;">📐 Parámetros del Ensayo:</strong>
                        <span style="margin: 0 10px; color: #495057;">Ws = <strong style="color: #2d5016;" id="wsValue">-</strong> g</span>
                        <span style="margin: 0 10px; color: #495057;">Gs = <strong style="color: #2d5016;" id="gsValue">-</strong></span>
                        <span style="margin: 0 10px; color: #495057;">Cm = <strong style="color: #2d5016;" id="cmValue">-</strong></span>
                        <span style="margin: 0 10px; color: #495057;">CC = <strong style="color: #2d5016;" id="ccValue">-</strong></span>
                        <span style="margin: 0 10px; color: #495057;">Alfa = <strong style="color: #2d5016;" id="alfaValue">-</strong></span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Cargar datos automáticamente
    cargarDatosExcel();
}

// Array para almacenar muestras
let humedadSamples = [];

function exportHumedadData() {
    if (humedadSamples.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    // Crear CSV
    let csv = 'N° Recipiente,Peso Recipiente (g),Peso Húmedo (g),Peso Seco (g),Humedad (%)\n';
    humedadSamples.forEach(sample => {
        csv += `${sample.recipienteNum},${sample.pesoRecipiente},${sample.pesoHumedo},${sample.pesoSeco},${sample.humedad.toFixed(2)}\n`;
    });

    // Descargar
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Contenido_Humedad_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ========================================
// CARGAR DATOS DESDE EXCEL
// ========================================

async function cargarDatosExcel() {
    console.log('🔄 Iniciando carga de datos desde Excel...');
    
    try {
        console.log('📡 Haciendo petición a /api/humedad/datos');
        const response = await fetch('/api/humedad/datos');
        
        console.log('📥 Respuesta recibida, status:', response.status);
        const result = await response.json();
        
        console.log('📊 Datos parseados:', result);
        
        if (result.success && result.data.length > 0) {
            console.log(`✅ ${result.data.length} registros encontrados`);
            
            // Limpiar array antes de cargar para evitar duplicados
            humedadSamples = [];
            
            mostrarDatosExcel(result.data);
            
            // Cargar datos en el array
            result.data.forEach(dato => {
                humedadSamples.push({
                    recipienteNum: dato.numero_recipiente || 'N/A',
                    pesoRecipiente: dato.peso_recipiente,
                    pesoHumedo: dato.peso_humedo,
                    pesoSeco: dato.peso_seco,
                    humedad: dato.humedad
                });
            });
            
            console.log('✅ Datos cargados correctamente');
            
            // Mostrar notificación
            showNotification(`✅ ${result.data.length} registros cargados desde Excel`, 'success');
            showNotification(`✅ ${result.data.length} registros cargados desde Excel`, 'success');
        } else {
            console.warn('⚠️ No se encontraron datos de humedad en el Excel');
            showNotification('⚠️ No se encontraron datos en el Excel', 'warning');
        }
    } catch (error) {
        console.error('❌ Error al cargar datos del Excel:', error);
        showNotification('⚠️ Error al cargar datos del Excel', 'error');
    }
}

function mostrarDatosExcel(datos) {
    console.log('📊 mostrarDatosExcel llamada con:', datos);
    
    const card = document.getElementById('datosExcelCard');
    const contador = document.getElementById('contadorDatosExcel');
    const tableContainer = document.getElementById('datosExcelTable');
    const parametrosCompactos = document.getElementById('parametrosCompactos');
    
    console.log('🔍 Elementos encontrados:', {
        card: !!card,
        contador: !!contador,
        tableContainer: !!tableContainer,
        parametrosCompactos: !!parametrosCompactos
    });
    
    if (!datos || datos.length === 0) {
        console.warn('⚠️ No hay datos para mostrar');
        if (card) card.style.display = 'none';
        if (parametrosCompactos) parametrosCompactos.style.display = 'none';
        return;
    }
    
    // Mostrar parámetros del ensayo de forma discreta
    if (parametrosCompactos) {
        parametrosCompactos.style.display = 'block';
        document.getElementById('wsValue').textContent = '362.56';
        document.getElementById('gsValue').textContent = '2.72';
        document.getElementById('cmValue').textContent = '1';
        document.getElementById('ccValue').textContent = '3';
        document.getElementById('alfaValue').textContent = '0.99';
    }
    
    // Mostrar card de datos
    console.log('✅ Mostrando card con', datos.length, 'registros');
    card.style.display = 'block';
    contador.textContent = `${datos.length} registros`;
    
    // Crear tabla con todos los datos
    let html = `
        <div style="overflow-x: auto; max-height: none;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Muestra</th>
                        <th>N° Recipiente</th>
                        <th>Peso Recipiente (g)</th>
                        <th>Peso Húmedo (g)</th>
                        <th>Peso Seco (g)</th>
                        <th>Humedad (%)</th>
                        <th>Fecha</th>
                        <th>t (min)</th>
                        <th>T (°C)</th>
                        <th>% Más fino</th>
                        <th>D (mm)</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    datos.forEach(dato => {
        html += `
            <tr>
                <td>${dato.muestra || 'N/A'}</td>
                <td>${dato.numero_recipiente || 'N/A'}</td>
                <td>${dato.peso_recipiente.toFixed(2)}</td>
                <td>${dato.peso_humedo.toFixed(2)}</td>
                <td>${dato.peso_seco.toFixed(2)}</td>
                <td><strong>${dato.humedad.toFixed(2)}%</strong></td>
                <td>${dato.fecha ? dato.fecha.split(' ')[0] : 'N/A'}</td>
                <td>${dato.t_min || 'N/A'}</td>
                <td>${dato.temperatura || 'N/A'}</td>
                <td>${dato.pct_mas_fino ? dato.pct_mas_fino.toFixed(2) : 'N/A'}</td>
                <td>${dato.d_mm ? dato.d_mm.toFixed(4) : 'N/A'}</td>
            </tr>
        `;
    });
    
    // Agregar fila de promedio
    const avgHumedad = datos.reduce((sum, d) => sum + d.humedad, 0) / datos.length;
    html += `
                <tr class="average-row" style="background: #f0f9ff; font-weight: bold;">
                    <td colspan="5"><strong>PROMEDIO</strong></td>
                    <td><strong>${avgHumedad.toFixed(2)}%</strong></td>
                    <td colspan="5"></td>
                </tr>
    `;
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    tableContainer.innerHTML = html;
    console.log('✅ Tabla creada e insertada en el DOM');
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4a7c59' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar estilos de animación
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        .badge {
            background: #4a7c59;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
}

// Hacer funciones disponibles globalmente
window.initHumedadModule = initHumedadModule;
window.exportHumedadData = exportHumedadData;
window.cargarDatosExcel = cargarDatosExcel;
window.showNotification = showNotification;
window.cargarDatosExcel = cargarDatosExcel;
