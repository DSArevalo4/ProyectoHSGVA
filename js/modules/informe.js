// MODULO: GENERADOR DE INFORMES

let informeConfig = {
    incluirHumedad: false,
    incluirAtterberg: false,
    incluirClasificacion: false,
    incluirFases: false,
    incluirGraficos: true,
    formato: 'pdf',
    titulo: '',
    cliente: '',
    proyecto: '',
    ubicacion: '',
    fecha: new Date().toISOString().split('T')[0]
};

function generarValoresPredeterminados() {
    const fechaActual = new Date();
    const mes = fechaActual.toLocaleDateString('es-ES', { month: 'long' });
    const anio = fechaActual.getFullYear();
    
    return {
        titulo: 'Informe Geotecnico - ' + mes.charAt(0).toUpperCase() + mes.slice(1) + ' ' + anio,
        cliente: 'Cliente',
        proyecto: 'Proyecto',
        ubicacion: 'Ubicacion del Proyecto',
        fecha: fechaActual.toISOString().split('T')[0]
    };
}

function initInformeModule() {
    console.log('Inicializando modulo de informes...');
    
    if (!informeConfig.titulo) {
        const defaults = generarValoresPredeterminados();
        informeConfig.titulo = defaults.titulo;
        informeConfig.cliente = defaults.cliente;
        informeConfig.proyecto = defaults.proyecto;
        informeConfig.ubicacion = defaults.ubicacion;
        informeConfig.fecha = defaults.fecha;
    }

    const page = document.getElementById('informe-page');
    if (!page) {
        console.error('No se encontro el elemento informe-page');
        return;
    }

    console.log('Generando HTML del modulo...');
    
    page.innerHTML = '<div class="page-title"><h2><i class="fas fa-file-alt"></i> Generador de Informes</h2></div>' +
        '<div class="card" style="margin-bottom: 20px;"><div class="card-header"><h3><i class="fas fa-info-circle"></i> Informacion del Proyecto</h3></div><div class="card-body">' +
        '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">' +
        '<div class="form-group"><label for="tituloInforme">Titulo del Informe</label><input type="text" id="tituloInforme" class="form-input" value="' + informeConfig.titulo + '"></div>' +
        '<div class="form-group"><label for="clienteInforme">Cliente</label><input type="text" id="clienteInforme" class="form-input" value="' + informeConfig.cliente + '"></div>' +
        '<div class="form-group"><label for="proyectoInforme">Nombre del Proyecto</label><input type="text" id="proyectoInforme" class="form-input" value="' + informeConfig.proyecto + '"></div>' +
        '<div class="form-group"><label for="ubicacionInforme">Ubicacion</label><input type="text" id="ubicacionInforme" class="form-input" value="' + informeConfig.ubicacion + '"></div>' +
        '<div class="form-group"><label for="fechaInforme">Fecha del Informe</label><input type="date" id="fechaInforme" class="form-input" value="' + informeConfig.fecha + '"></div></div></div></div>' +
        '<div class="card" style="margin-bottom: 20px;"><div class="card-header"><h3><i class="fas fa-check-square"></i> Seleccionar Ensayos a Incluir</h3></div><div class="card-body">' +
        '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">' +
        '<div class="ensayo-checkbox"><label class="checkbox-container"><input type="checkbox" id="checkHumedad"><span class="checkmark"></span><div class="checkbox-content"><i class="fas fa-tint" style="color: #3b82f6; font-size: 24px;"></i><div><strong>Contenido de Humedad</strong></div></div></label></div>' +
        '<div class="ensayo-checkbox"><label class="checkbox-container"><input type="checkbox" id="checkAtterberg"><span class="checkmark"></span><div class="checkbox-content"><i class="fas fa-chart-line" style="color: #667eea; font-size: 24px;"></i><div><strong>Limites de Atterberg</strong></div></div></label></div>' +
        '<div class="ensayo-checkbox"><label class="checkbox-container"><input type="checkbox" id="checkClasificacion"><span class="checkmark"></span><div class="checkbox-content"><i class="fas fa-layer-group" style="color: #10b981; font-size: 24px;"></i><div><strong>Clasificacion de Suelos</strong></div></div></label></div>' +
        '<div class="ensayo-checkbox"><label class="checkbox-container"><input type="checkbox" id="checkFases"><span class="checkmark"></span><div class="checkbox-content"><i class="fas fa-cube" style="color: #f59e0b; font-size: 24px;"></i><div><strong>Fases del Suelo</strong></div></div></label></div></div>' +
        '<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;"><label class="checkbox-container"><input type="checkbox" id="checkGraficos" checked><span class="checkmark"></span><div class="checkbox-content"><i class="fas fa-chart-bar" style="color: #8b5cf6; font-size: 20px;"></i><div><strong>Incluir Graficos</strong></div></div></label></div></div></div>' +
        '<div class="card" style="margin-bottom: 20px;"><div class="card-header"><h3><i class="fas fa-file-export"></i> Formato de Exportacion</h3></div><div class="card-body"><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">' +
        '<label class="formato-card selected"><input type="radio" name="formato" value="pdf" checked><div class="formato-icon" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);"><i class="fas fa-file-pdf"></i></div><div class="formato-info"><strong>PDF</strong></div></label>' +
        '<label class="formato-card"><input type="radio" name="formato" value="excel"><div class="formato-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"><i class="fas fa-file-excel"></i></div><div class="formato-info"><strong>Excel</strong></div></label>' +
        '<label class="formato-card"><input type="radio" name="formato" value="word"><div class="formato-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);"><i class="fas fa-file-word"></i></div><div class="formato-info"><strong>Word</strong></div></label></div></div></div>' +
        '<div class="card"><div class="card-header"><h3><i class="fas fa-eye"></i> Vista Previa</h3></div><div class="card-body"><div id="vistaPrevia" style="background: #f8fafc; padding: 20px; border-radius: 8px; min-height: 100px;"></div>' +
        '<div style="margin-top: 20px; display: flex; gap: 15px; justify-content: flex-end;"><button class="btn-secondary" id="btnLimpiar"><i class="fas fa-undo"></i> Limpiar</button><button class="btn-primary" id="btnGenerarInforme"><i class="fas fa-download"></i> Generar Informe</button></div></div></div>';

    initInformeEventListeners();
    actualizarVistaPrevia();
    console.log('Modulo de informes cargado');
}

function initInformeEventListeners() {
    console.log('Agregando event listeners...');
    
    ['checkHumedad', 'checkAtterberg', 'checkClasificacion', 'checkFases', 'checkGraficos'].forEach(function(id) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                actualizarConfigInforme();
                actualizarVistaPrevia();
            });
        }
    });

    ['tituloInforme', 'clienteInforme', 'proyectoInforme', 'ubicacionInforme', 'fechaInforme'].forEach(function(id) {
        const input = document.getElementById(id);
        if (input) input.addEventListener('input', actualizarConfigInforme);
    });

    document.querySelectorAll('input[name="formato"]').forEach(function(radio) {
        radio.addEventListener('change', function(e) {
            informeConfig.formato = e.target.value;
            document.querySelectorAll('.formato-card').forEach(function(card) {
                card.classList.remove('selected');
            });
            e.target.closest('.formato-card').classList.add('selected');
        });
    });
    
    // Event listener para botón de generar
    var btnGenerar = document.getElementById('btnGenerarInforme');
    if (btnGenerar) {
        btnGenerar.addEventListener('click', generarInforme);
        console.log('Event listener agregado al boton Generar');
    } else {
        console.error('No se encontro el boton btnGenerarInforme');
    }
    
    // Event listener para botón de limpiar
    var btnLimpiar = document.getElementById('btnLimpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarFormularioInforme);
        console.log('Event listener agregado al boton Limpiar');
    }
}

function actualizarConfigInforme() {
    var ch = document.getElementById('checkHumedad');
    var ca = document.getElementById('checkAtterberg');
    var cc = document.getElementById('checkClasificacion');
    var cf = document.getElementById('checkFases');
    var cg = document.getElementById('checkGraficos');
    var ti = document.getElementById('tituloInforme');
    var ci = document.getElementById('clienteInforme');
    var pi = document.getElementById('proyectoInforme');
    var ui = document.getElementById('ubicacionInforme');
    var fi = document.getElementById('fechaInforme');
    
    informeConfig.incluirHumedad = ch ? ch.checked : false;
    informeConfig.incluirAtterberg = ca ? ca.checked : false;
    informeConfig.incluirClasificacion = cc ? cc.checked : false;
    informeConfig.incluirFases = cf ? cf.checked : false;
    informeConfig.incluirGraficos = cg ? cg.checked : false;
    informeConfig.titulo = ti ? ti.value : '';
    informeConfig.cliente = ci ? ci.value : '';
    informeConfig.proyecto = pi ? pi.value : '';
    informeConfig.ubicacion = ui ? ui.value : '';
    informeConfig.fecha = fi ? fi.value : '';
}

function actualizarVistaPrevia() {
    var vp = document.getElementById('vistaPrevia');
    if (!vp) return;

    var ensayos = [];
    if (informeConfig.incluirHumedad) ensayos.push('Contenido de Humedad');
    if (informeConfig.incluirAtterberg) ensayos.push('Limites de Atterberg');
    if (informeConfig.incluirClasificacion) ensayos.push('Clasificacion de Suelos');
    if (informeConfig.incluirFases) ensayos.push('Fases del Suelo');

    if (ensayos.length === 0) {
        vp.innerHTML = '<p style="color: #64748b; text-align: center;">Selecciona ensayos a incluir</p>';
        return;
    }

    var html = '<div><strong>Titulo:</strong> ' + informeConfig.titulo + '</div>';
    html += '<div><strong>Ensayos:</strong> ' + ensayos.join(', ') + '</div>';
    html += '<div><strong>Formato:</strong> ' + informeConfig.formato.toUpperCase() + '</div>';
    vp.innerHTML = html;
}

function limpiarFormularioInforme() {
    var d = generarValoresPredeterminados();
    informeConfig = {
        incluirHumedad: false,
        incluirAtterberg: false,
        incluirClasificacion: false,
        incluirFases: false,
        incluirGraficos: true,
        formato: 'pdf',
        titulo: d.titulo,
        cliente: d.cliente,
        proyecto: d.proyecto,
        ubicacion: d.ubicacion,
        fecha: d.fecha
    };
    initInformeModule();
}

function generarInforme() {
    console.log('=== GENERAR INFORME INICIADO ===');
    actualizarConfigInforme();
    
    console.log('Configuracion actualizada:', informeConfig);
    
    if (!informeConfig.incluirHumedad && !informeConfig.incluirAtterberg && !informeConfig.incluirClasificacion && !informeConfig.incluirFases) {
        console.warn('No hay ensayos seleccionados');
        alert('Selecciona al menos un ensayo');
        return;
    }
    if (!informeConfig.titulo.trim()) {
        console.warn('No hay titulo');
        alert('Ingresa un titulo');
        return;
    }
    
    var btn = document.getElementById('btnGenerarInforme');
    if (!btn) {
        console.error('No se encontro el boton btnGenerarInforme');
        return;
    }
    
    console.log('Boton encontrado, iniciando generacion...');
    
    var originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    
    console.log('Enviando peticion a /api/informe/generar');
    console.log('Datos a enviar:', informeConfig);
    
    // Hacer petición al backend
    fetch('/api/informe/generar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(informeConfig)
    })
    .then(function(response) {
        console.log('Respuesta recibida:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error('Error al generar informe: ' + response.status);
        }
        return response.blob();
    })
    .then(function(blob) {
        console.log('Blob recibido, tamano:', blob.size, 'bytes');
        
        // Crear URL temporal y descargar
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        
        var extension = informeConfig.formato === 'pdf' ? 'pdf' : 
                       informeConfig.formato === 'excel' ? 'xlsx' : 'txt';
        a.download = 'informe_' + informeConfig.fecha + '.' + extension;
        
        console.log('Descargando archivo:', a.download);
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('Descarga completada');
        
        btn.innerHTML = '<i class="fas fa-check"></i> Descargado!';
        setTimeout(function() {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
    })
    .catch(function(error) {
        console.error('Error completo:', error);
        alert('Error al generar el informe: ' + error.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}

window.initInformeModule = initInformeModule;
