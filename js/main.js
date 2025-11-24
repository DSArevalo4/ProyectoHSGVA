// ========================================
// MAIN.JS - Funcionalidad Principal
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeDateTime();
    initializeNavigation();
    populateProjectsTable();
    
    // Inicializar gráficos del dashboard ya que es la página activa por defecto
    if (typeof initializeCharts === 'function') {
        // Pequeño delay para asegurar que el DOM esté completamente listo
        setTimeout(initializeCharts, 100);
    }
});

// ========================================
// SIDEBAR
// ========================================

function initializeSidebar() {
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
}

// ========================================
// FECHA Y HORA
// ========================================

function initializeDateTime() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function updateDateTime() {
    const now = new Date();
    
    // Fecha
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        dateElement.textContent = now.toLocaleDateString('es-ES', options);
    }
    
    // Hora
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        timeElement.textContent = now.toLocaleTimeString('es-ES', options);
    }
}

// ========================================
// NAVEGACIÓN
// ========================================

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover clase active de todos los items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Agregar clase active al item clickeado
            this.classList.add('active');
            
            // Obtener página a mostrar
            const pageName = this.getAttribute('data-page');
            
            // Ocultar todas las páginas
            pages.forEach(page => page.classList.remove('active'));
            
            // Mostrar página seleccionada
            const targetPage = document.getElementById(`${pageName}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
                
                // Cargar contenido dinámico según la página
                loadPageContent(pageName);
            }
        });
    });
}

function loadPageContent(pageName) {
    switch(pageName) {
        case 'dashboard':
            // Inicializar gráficos del dashboard
            if (typeof initializeCharts === 'function') {
                initializeCharts();
            }
            break;
        case 'humedad':
            loadHumedadPage();
            break;
        case 'atterberg':
            loadAtterbergPage();
            break;
        case 'clasificacion':
            loadClasificacionPage();
            break;
        case 'fases':
            loadFasesPage();
            break;
        case 'informe':
            loadInformePage();
            break;
    }
}

// ========================================
// TABLA DE PROYECTOS
// ========================================

function populateProjectsTable() {
    const tbody = document.getElementById('projectsTableBody');
    
    if (!tbody) return;
    
    const ensayos = [
        { id: 'E-001', tipo: 'Contenido de Humedad', fecha: '23/11/2025', muestras: 13, estado: 'completado' },
        { id: 'E-002', tipo: 'Límites de Atterberg', fecha: '23/11/2025', muestras: 6, estado: 'completado' },
        { id: 'E-003', tipo: 'Clasificación AASHTO', fecha: '23/11/2025', muestras: 4, estado: 'completado' },
        { id: 'E-004', tipo: 'Fases del Suelo', fecha: '24/11/2025', muestras: 1, estado: 'en-proceso' }
    ];
    
    tbody.innerHTML = '';
    
    ensayos.forEach(ensayo => {
        const row = document.createElement('tr');
        
        const estadoClass = ensayo.estado;
        const estadoText = ensayo.estado.charAt(0).toUpperCase() + ensayo.estado.slice(1).replace('-', ' ');
        
        row.innerHTML = `
            <td><strong>${ensayo.id}</strong></td>
            <td>${ensayo.tipo}</td>
            <td>${ensayo.fecha}</td>
            <td><strong>${ensayo.muestras}</strong></td>
            <td><span class="status-badge ${estadoClass}">${estadoText}</span></td>
            <td>
                <button class="btn-action" title="Ver detalles"><i class="fas fa-eye"></i></button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// ========================================
// FUNCIONES DE CARGA DE PÁGINAS
// ========================================

function loadHumedadPage() {
    const page = document.getElementById('humedad-page');
    if (page && page.innerHTML.trim() === '') {
        if (typeof initHumedadModule === 'function') {
            initHumedadModule();
        }
    }
}

function loadAtterbergPage() {
    const page = document.getElementById('atterberg-page');
    if (page && page.innerHTML.trim() === '') {
        if (typeof initAtterbergModule === 'function') {
            initAtterbergModule();
        }
    }
}

function loadClasificacionPage() {
    const page = document.getElementById('clasificacion-page');
    if (page && page.innerHTML.trim() === '') {
        if (typeof initClasificacionModule === 'function') {
            initClasificacionModule();
        }
    }
}

function loadFasesPage() {
    const page = document.getElementById('fases-page');
    if (page && page.innerHTML.trim() === '') {
        if (typeof initFasesModule === 'function') {
            initFasesModule();
        }
    }
}

function loadInformePage() {
    const page = document.getElementById('informe-page');
    if (page && page.innerHTML.trim() === '') {
        if (typeof initInformeModule === 'function') {
            initInformeModule();
        }
    }
}

// ========================================
// UTILIDADES
// ========================================

function formatNumber(num, decimals = 2) {
    return Number(num).toFixed(decimals);
}

function showNotification(message, type = 'info') {
    // Implementar sistema de notificaciones
    console.log(`[${type.toUpperCase()}] ${message}`);
}

function validateNumber(value, min = null, max = null) {
    const num = parseFloat(value);
    
    if (isNaN(num)) {
        return { valid: false, message: 'Debe ser un número válido' };
    }
    
    if (min !== null && num < min) {
        return { valid: false, message: `El valor debe ser mayor o igual a ${min}` };
    }
    
    if (max !== null && num > max) {
        return { valid: false, message: `El valor debe ser menor o igual a ${max}` };
    }
    
    return { valid: true, value: num };
}

// Exportar funciones globales
window.formatNumber = formatNumber;
window.showNotification = showNotification;
window.validateNumber = validateNumber;
