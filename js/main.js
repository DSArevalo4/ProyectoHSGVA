// ========================================
// MAIN.JS - Funcionalidad Principal
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeDateTime();
    initializeNavigation();
    populateProjectsTable();
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
            // El dashboard ya está cargado
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
    
    const proyectos = [
        { id: 'P-001', nombre: 'Edificio Central', fecha: '20/11/2025', ensayos: 5, estado: 'completado' },
        { id: 'P-002', nombre: 'Puente Norte', fecha: '19/11/2025', ensayos: 4, estado: 'en-proceso' },
        { id: 'P-003', nombre: 'Vía Sur', fecha: '18/11/2025', ensayos: 6, estado: 'completado' },
        { id: 'P-004', nombre: 'Plaza Comercial', fecha: '17/11/2025', ensayos: 3, estado: 'completado' },
        { id: 'P-005', nombre: 'Residencial Este', fecha: '16/11/2025', ensayos: 4, estado: 'en-proceso' },
        { id: 'P-006', nombre: 'Torre Empresarial', fecha: '15/11/2025', ensayos: 7, estado: 'completado' },
        { id: 'P-007', nombre: 'Centro Comercial', fecha: '14/11/2025', ensayos: 5, estado: 'pendiente' }
    ];
    
    tbody.innerHTML = '';
    
    proyectos.forEach(proyecto => {
        const row = document.createElement('tr');
        
        const estadoClass = proyecto.estado;
        const estadoText = proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1).replace('-', ' ');
        
        row.innerHTML = `
            <td><strong>${proyecto.id}</strong></td>
            <td>${proyecto.nombre}</td>
            <td>${proyecto.fecha}</td>
            <td><strong>${proyecto.ensayos}</strong></td>
            <td><span class="status-badge ${estadoClass}">${estadoText}</span></td>
            <td>
                <button class="btn-action" title="Ver detalles"><i class="fas fa-eye"></i></button>
                <button class="btn-action" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn-action" title="Eliminar"><i class="fas fa-trash"></i></button>
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
