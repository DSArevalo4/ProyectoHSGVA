// MÓDULO: FASES DEL SUELO

let fasesData = {
    volumetrica: {},
    gravimetrica: {}
};

function initFasesModule() {
    const page = document.getElementById('fases-page');
    page.innerHTML = `
        <div class="page-title">
            <h2><i class="fas fa-balance-scale"></i> Fases Gravimétricas y Volumétricas</h2>
        </div>

        <!-- Información del Módulo -->
        <div class="card" style="margin-bottom: 20px;">
            <div class="card-header">
                <h3>Sobre las Fases del Suelo</h3>
            </div>
            <div class="card-body">
                <p style="color: #64748b; line-height: 1.6;">
                    El suelo es un sistema trifásico compuesto por sólidos, agua y aire. 
                    Las relaciones de fases permiten cuantificar las proporciones volumétricas y 
                    gravimétricas de estos componentes.
                </p>
            </div>
        </div>

        <!-- Diagrama de Fases -->
        <div class="card" style="margin-bottom: 20px;">
            <div class="card-header">
                <h3>Diagrama de Fases</h3>
            </div>
            <div class="card-body">
                <div id="diagramaFases" style="display: flex; justify-content: center; padding: 20px;">
                    <svg width="400" height="500" viewBox="0 0 400 500">
                        <!-- Volumen -->
                        <g>
                            <text x="50" y="30" font-size="16" font-weight="bold" fill="#1e293b">VOLUMEN</text>
                            
                            <!-- Aire -->
                            <rect x="100" y="50" width="120" height="100" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
                            <text x="160" y="105" text-anchor="middle" font-size="14" font-weight="bold" fill="#0284c7">Va</text>
                            <text x="230" y="100" font-size="13" fill="#64748b">Aire</text>
                            
                            <!-- Agua -->
                            <rect x="100" y="150" width="120" height="100" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
                            <text x="160" y="205" text-anchor="middle" font-size="14" font-weight="bold" fill="#2563eb">Vw</text>
                            <text x="230" y="200" font-size="13" fill="#64748b">Agua</text>
                            
                            <!-- Sólidos -->
                            <rect x="100" y="250" width="120" height="150" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
                            <text x="160" y="330" text-anchor="middle" font-size="14" font-weight="bold" fill="#d97706">Vs</text>
                            <text x="230" y="325" font-size="13" fill="#64748b">Sólidos</text>
                            
                            <!-- Llaves para Vacíos y Total -->
                            <path d="M 225 50 L 240 50 L 240 250 L 225 250" stroke="#64748b" stroke-width="2" fill="none"/>
                            <text x="245" y="155" font-size="13" fill="#64748b">Vv (Vacíos)</text>
                            
                            <path d="M 225 50 L 255 50 L 255 400 L 225 400" stroke="#1e293b" stroke-width="2" fill="none"/>
                            <text x="260" y="230" font-size="14" font-weight="bold" fill="#1e293b">V (Total)</text>
                        </g>
                        
                        <!-- Peso -->
                        <g transform="translate(0, 0)">
                            <text x="330" y="30" font-size="16" font-weight="bold" fill="#1e293b">PESO</text>
                            
                            <!-- Aire (0) -->
                            <text x="330" y="105" text-anchor="middle" font-size="14" fill="#94a3b8">0</text>
                            
                            <!-- Agua -->
                            <text x="330" y="205" text-anchor="middle" font-size="14" font-weight="bold" fill="#2563eb">Ww</text>
                            
                            <!-- Sólidos -->
                            <text x="330" y="330" text-anchor="middle" font-size="14" font-weight="bold" fill="#d97706">Ws</text>
                            
                            <!-- Llave para Total -->
                            <path d="M 345 150 L 360 150 L 360 400 L 345 400" stroke="#1e293b" stroke-width="2" fill="none"/>
                            <text x="365" y="280" font-size="14" font-weight="bold" fill="#1e293b">W</text>
                        </g>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Formulario de Entrada -->
        <div class="card" style="margin-bottom: 20px;">
            <div class="card-header">
                <h3>Datos de Entrada</h3>
            </div>
            <div class="card-body">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div class="form-group">
                        <label for="volumenTotal">Volumen Total (V) - cm³</label>
                        <input type="number" id="volumenTotal" class="form-input" step="0.001" placeholder="Ej: 100">
                    </div>
                    <div class="form-group">
                        <label for="volumenSolidos">Volumen Sólidos (Vs) - cm³</label>
                        <input type="number" id="volumenSolidos" class="form-input" step="0.001" placeholder="Ej: 60">
                    </div>
                    <div class="form-group">
                        <label for="volumenAgua">Volumen Agua (Vw) - cm³</label>
                        <input type="number" id="volumenAgua" class="form-input" step="0.001" placeholder="Ej: 30">
                    </div>
                    <div class="form-group">
                        <label for="pesoSolidos">Peso Sólidos (Ws) - g</label>
                        <input type="number" id="pesoSolidos" class="form-input" step="0.001" placeholder="Ej: 150">
                    </div>
                    <div class="form-group">
                        <label for="pesoAgua">Peso Agua (Ww) - g</label>
                        <input type="number" id="pesoAgua" class="form-input" step="0.001" placeholder="Ej: 30">
                    </div>
                    <div class="form-group">
                        <label for="gravedadEspecifica">Gravedad Específica (Gs)</label>
                        <input type="number" id="gravedadEspecifica" class="form-input" step="0.001" value="2.65" placeholder="Ej: 2.65">
                    </div>
                </div>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="calcularFases()">
                        <i class="fas fa-calculator"></i> Calcular Fases
                    </button>
                    <button class="btn btn-secondary" onclick="limpiarFases()">
                        <i class="fas fa-eraser"></i> Limpiar
                    </button>
                </div>
            </div>
        </div>

        <!-- Resultados: Relaciones Volumétricas -->
        <div class="card" id="resultadosVolumetricasCard" style="display: none; margin-bottom: 20px;">
            <div class="card-header">
                <h3>Relaciones Volumétricas</h3>
            </div>
            <div class="card-body">
                <div id="resultadosVolumetricas" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;"></div>
            </div>
        </div>

        <!-- Resultados: Relaciones Gravimétricas -->
        <div class="card" id="resultadosGravimetricasCard" style="display: none; margin-bottom: 20px;">
            <div class="card-header">
                <h3>Relaciones Gravimétricas</h3>
            </div>
            <div class="card-body">
                <div id="resultadosGravimetricas" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;"></div>
            </div>
        </div>

        <!-- Resultados: Pesos Unitarios -->
        <div class="card" id="resultadosPesosCard" style="display: none;">
            <div class="card-header">
                <h3>Pesos Unitarios</h3>
            </div>
            <div class="card-body">
                <div id="resultadosPesos" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;"></div>
            </div>
        </div>
    `;
}

function calcularFases() {
    // Obtener valores de entrada
    const V = parseFloat(document.getElementById('volumenTotal').value) || 0;
    const Vs = parseFloat(document.getElementById('volumenSolidos').value) || 0;
    const Vw = parseFloat(document.getElementById('volumenAgua').value) || 0;
    const Ws = parseFloat(document.getElementById('pesoSolidos').value) || 0;
    const Ww = parseFloat(document.getElementById('pesoAgua').value) || 0;
    const Gs = parseFloat(document.getElementById('gravedadEspecifica').value) || 2.65;

    // Validar que haya datos
    if (V === 0 || Vs === 0) {
        alert('Por favor ingrese al menos el Volumen Total y el Volumen de Sólidos');
        return;
    }

    // Calcular valores derivados
    const Va = V - Vs - Vw;  // Volumen de aire
    const Vv = V - Vs;        // Volumen de vacíos
    const W = Ws + Ww;        // Peso total

    // RELACIONES VOLUMÉTRICAS
    const porosidad = (Vv / V) * 100;  // n (%)
    const relacionVacios = Vv / Vs;     // e
    const saturacion = Vv > 0 ? (Vw / Vv) * 100 : 0;  // S (%)
    const contenidoAire = Vv > 0 ? (Va / Vv) * 100 : 0;  // A (%)

    // RELACIONES GRAVIMÉTRICAS
    const contenidoHumedad = Ws > 0 ? (Ww / Ws) * 100 : 0;  // w (%)
    const gravedadEspecificaMuestra = V > 0 ? W / V : 0;  // γ

    // PESOS UNITARIOS (considerando densidad del agua = 1 g/cm³)
    const pesoUnitarioHumedo = V > 0 ? W / V : 0;  // γ (g/cm³)
    const pesoUnitarioSeco = V > 0 ? Ws / V : 0;   // γd (g/cm³)
    const pesoUnitarioSaturado = Vs > 0 ? (Ws + Vv) / V : 0;  // γsat (g/cm³)
    const pesoUnitarioSumergido = pesoUnitarioSaturado - 1;  // γ' (g/cm³)

    // Guardar resultados
    fasesData = {
        volumetrica: {
            V, Vs, Vw, Va, Vv,
            porosidad: porosidad.toFixed(2),
            relacionVacios: relacionVacios.toFixed(3),
            saturacion: saturacion.toFixed(2),
            contenidoAire: contenidoAire.toFixed(2)
        },
        gravimetrica: {
            W, Ws, Ww, Gs,
            contenidoHumedad: contenidoHumedad.toFixed(2),
            gravedadEspecifica: Gs.toFixed(3)
        },
        pesos: {
            pesoUnitarioHumedo: pesoUnitarioHumedo.toFixed(3),
            pesoUnitarioSeco: pesoUnitarioSeco.toFixed(3),
            pesoUnitarioSaturado: pesoUnitarioSaturado.toFixed(3),
            pesoUnitarioSumergido: pesoUnitarioSumergido.toFixed(3)
        }
    };

    // Mostrar resultados
    mostrarResultados();
}

function mostrarResultados() {
    // Mostrar relaciones volumétricas
    const volCard = document.getElementById('resultadosVolumetricasCard');
    const volDiv = document.getElementById('resultadosVolumetricas');
    volCard.style.display = 'block';

    volDiv.innerHTML = `
        <div class="resultado-item" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white;">
            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">Porosidad (n)</div>
            <div style="font-size: 24px; font-weight: bold;">${fasesData.volumetrica.porosidad}%</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">n = Vv / V</div>
        </div>
        <div class="resultado-item" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px; color: white;">
            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">Relación de Vacíos (e)</div>
            <div style="font-size: 24px; font-weight: bold;">${fasesData.volumetrica.relacionVacios}</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">e = Vv / Vs</div>
        </div>
        <div class="resultado-item" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 10px; color: white;">
            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">Saturación (S)</div>
            <div style="font-size: 24px; font-weight: bold;">${fasesData.volumetrica.saturacion}%</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">S = Vw / Vv</div>
        </div>
        <div class="resultado-item" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 10px; color: white;">
            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">Contenido de Aire (A)</div>
            <div style="font-size: 24px; font-weight: bold;">${fasesData.volumetrica.contenidoAire}%</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">A = Va / Vv</div>
        </div>
    `;

    // Mostrar relaciones gravimétricas
    const gravCard = document.getElementById('resultadosGravimetricasCard');
    const gravDiv = document.getElementById('resultadosGravimetricas');
    gravCard.style.display = 'block';

    gravDiv.innerHTML = `
        <div class="resultado-item" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 20px; border-radius: 10px; color: white;">
            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">Contenido de Humedad (w)</div>
            <div style="font-size: 24px; font-weight: bold;">${fasesData.gravimetrica.contenidoHumedad}%</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">w = Ww / Ws</div>
        </div>
        <div class="resultado-item" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); padding: 20px; border-radius: 10px; color: white;">
            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">Gravedad Específica (Gs)</div>
            <div style="font-size: 24px; font-weight: bold;">${fasesData.gravimetrica.gravedadEspecifica}</div>
            <div style="font-size: 11px; opacity: 0.8; margin-top: 5px;">Gs = ρs / ρw</div>
        </div>
    `;

    // Mostrar pesos unitarios
    const pesosCard = document.getElementById('resultadosPesosCard');
    const pesosDiv = document.getElementById('resultadosPesos');
    pesosCard.style.display = 'block';

    pesosDiv.innerHTML = `
        <div class="resultado-item" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 20px; border-radius: 10px; color: #1e293b;">
            <div style="font-size: 12px; margin-bottom: 5px; color: #64748b;">Peso Unitario Húmedo (γ)</div>
            <div style="font-size: 24px; font-weight: bold;">${fasesData.pesos.pesoUnitarioHumedo}</div>
            <div style="font-size: 11px; margin-top: 5px; color: #64748b;">g/cm³</div>
        </div>
        <div class="resultado-item" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 20px; border-radius: 10px; color: #1e293b;">
            <div style="font-size: 12px; margin-bottom: 5px; color: #64748b;">Peso Unitario Seco (γd)</div>
            <div style="font-size: 24px; font-weight: bold;">${fasesData.pesos.pesoUnitarioSeco}</div>
            <div style="font-size: 11px; margin-top: 5px; color: #64748b;">g/cm³</div>
        </div>
        <div class="resultado-item" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 20px; border-radius: 10px; color: #1e293b;">
            <div style="font-size: 12px; margin-bottom: 5px; color: #64748b;">Peso Unitario Saturado (γsat)</div>
            <div style="font-size: 24px; font-weight: bold;">${fasesData.pesos.pesoUnitarioSaturado}</div>
            <div style="font-size: 11px; margin-top: 5px; color: #64748b;">g/cm³</div>
        </div>
        <div class="resultado-item" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 20px; border-radius: 10px; color: #1e293b;">
            <div style="font-size: 12px; margin-bottom: 5px; color: #64748b;">Peso Unitario Sumergido (γ')</div>
            <div style="font-size: 24px; font-weight: bold;">${fasesData.pesos.pesoUnitarioSumergido}</div>
            <div style="font-size: 11px; margin-top: 5px; color: #64748b;">g/cm³</div>
        </div>
    `;
}

function limpiarFases() {
    document.getElementById('volumenTotal').value = '';
    document.getElementById('volumenSolidos').value = '';
    document.getElementById('volumenAgua').value = '';
    document.getElementById('pesoSolidos').value = '';
    document.getElementById('pesoAgua').value = '';
    document.getElementById('gravedadEspecifica').value = '2.65';

    document.getElementById('resultadosVolumetricasCard').style.display = 'none';
    document.getElementById('resultadosGravimetricasCard').style.display = 'none';
    document.getElementById('resultadosPesosCard').style.display = 'none';

    fasesData = {
        volumetrica: {},
        gravimetrica: {}
    };
}

window.initFasesModule = initFasesModule;
window.calcularFases = calcularFases;
window.limpiarFases = limpiarFases;
