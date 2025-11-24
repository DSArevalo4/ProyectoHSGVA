// MÓDULO: GENERADOR DE INFORMES
function initInformeModule() {
    const page = document.getElementById('informe-page');
    page.innerHTML = `
        <div class="page-title">
            <h2><i class="fas fa-file-pdf"></i> Generador de Informes</h2>
        </div>
        <div class="info-message">
            <i class="fas fa-info-circle"></i>
            <p>Módulo en desarrollo. Aquí se generarán informes consolidados en PDF.</p>
        </div>
    `;
}
window.initInformeModule = initInformeModule;
