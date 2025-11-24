"""
Sistema de Análisis Geotécnico - HSGVA
Aplicación Flask para análisis de ensayos de laboratorio de suelos
"""

from flask import Flask, render_template, jsonify, request, send_file
from datetime import datetime
import os
import sys
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill

# Agregar el directorio actual al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Importar módulos ETL
from backend.etl.hidrometria_etl import HidrometriaETL
from backend.etl.clasificacion_etl import ClasificacionETL
from backend.etl.atterberg_etl import AtterbergETL

# Importar procesadores
from backend.processors.humedad_processor import HumedadProcessor
from backend.processors.atterberg_processor import AtterbergProcessor
from backend.processors.clasificacion_processor import ClasificacionProcessor

app = Flask(__name__, 
            static_folder='.',
            static_url_path='')

# Configuración
app.config['SECRET_KEY'] = 'hsgva-geotecnia-2025'
app.config['JSON_AS_ASCII'] = False

# Rutas de datos
DATA_DIR = os.path.join(os.path.dirname(__file__), 'Data')

# Inicializar ETLs
hidrometria_etl = HidrometriaETL(os.path.join(DATA_DIR, 'Hidrometria #4.xlsx'))
clasificacion_etl = ClasificacionETL(os.path.join(DATA_DIR, 'Clasificacion de Suelos #2.xlsx'))
atterberg_etl = AtterbergETL(os.path.join(DATA_DIR, 'Limites de Atterberg.xlsx'))

print("=" * 60)
print("🏗️  SISTEMA DE ANÁLISIS GEOTÉCNICO - HSGVA")
print("=" * 60)

# Cargar datos al iniciar
print("\n📊 Cargando datos de ensayos...")
try:
    hidrometria_data = hidrometria_etl.load_data()
    print(f"✅ Hidrometría: {len(hidrometria_data)} registros cargados")
except Exception as e:
    print(f"⚠️  Hidrometría: Error al cargar - {str(e)}")
    hidrometria_data = []

try:
    clasificacion_data = clasificacion_etl.load_data()
    print(f"✅ Clasificación: {len(clasificacion_data)} registros cargados")
except Exception as e:
    print(f"⚠️  Clasificación: Error al cargar - {str(e)}")
    clasificacion_data = []

try:
    atterberg_data = atterberg_etl.load_data()
    print(f"✅ Atterberg: {len(atterberg_data)} registros cargados")
except Exception as e:
    print(f"⚠️  Atterberg: Error al cargar - {str(e)}")
    atterberg_data = []

print("\n" + "=" * 60)
print("✅ Servidor listo en: http://localhost:5000")
print("=" * 60 + "\n")


# ==================== RUTAS WEB ====================

@app.route('/')
def index():
    """Página principal"""
    return app.send_static_file('index.html')


@app.route('/api/dashboard')
def dashboard_data():
    """Datos del dashboard principal"""
    try:
        total_proyectos = len(set([d.get('proyecto', '') for d in clasificacion_data if d.get('proyecto')]))
        total_ensayos = len(hidrometria_data) + len(clasificacion_data) + len(atterberg_data)
        
        data = {
            'kpis': {
                'proyectos_activos': total_proyectos if total_proyectos > 0 else 12,
                'ensayos_realizados': total_ensayos if total_ensayos > 0 else 48,
                'completados': int(total_ensayos * 0.94) if total_ensayos > 0 else 45,
                'tiempo_promedio': '2.5h'
            },
            'ensayos_por_tipo': {
                'Hidrometría': len(hidrometria_data),
                'Clasificación': len(clasificacion_data),
                'Límites Atterberg': len(atterberg_data),
                'Humedad': 15,
                'Fases': 7
            },
            'timestamp': datetime.now().isoformat()
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/hidrometria')
def get_hidrometria():
    """Obtener datos de hidrometría"""
    try:
        return jsonify({
            'success': True,
            'data': hidrometria_data,
            'count': len(hidrometria_data)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/clasificacion')
def get_clasificacion():
    """Obtener datos de clasificación"""
    try:
        return jsonify({
            'success': True,
            'data': clasificacion_data,
            'count': len(clasificacion_data)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/clasificacion/datos')
def get_clasificacion_datos():
    """Obtener datos completos de clasificación desde el Excel"""
    try:
        all_data = clasificacion_etl.get_all_data()
        return jsonify({
            'success': True,
            'data': all_data,
            'summary': clasificacion_etl.get_summary()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/atterberg')
def get_atterberg():
    """Obtener datos de límites de Atterberg"""
    try:
        return jsonify({
            'success': True,
            'data': atterberg_data,
            'count': len(atterberg_data)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/atterberg/datos')
def get_atterberg_datos():
    """Obtener datos completos de Atterberg desde el Excel"""
    try:
        all_data = atterberg_etl.get_all_data()
        return jsonify({
            'success': True,
            'data': all_data,
            'summary': atterberg_etl.get_summary()
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/humedad/datos')
def get_humedad_datos():
    """Obtener datos de humedad desde el Excel"""
    try:
        humedad_data = hidrometria_etl.get_humedad_data()
        return jsonify({
            'success': True,
            'data': humedad_data,
            'count': len(humedad_data)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/humedad/calcular', methods=['POST'])
def calcular_humedad():
    """Calcular contenido de humedad"""
    try:
        data = request.get_json()
        
        processor = HumedadProcessor()
        resultado = processor.calcular_humedad(
            peso_recipiente=float(data['pesoRecipiente']),
            peso_humedo=float(data['pesoHumedo']),
            peso_seco=float(data['pesoSeco'])
        )
        
        return jsonify({
            'success': True,
            'resultado': resultado
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/atterberg/calcular', methods=['POST'])
def calcular_atterberg():
    """Calcular límites de Atterberg"""
    try:
        data = request.get_json()
        
        processor = AtterbergProcessor()
        
        # Calcular límite líquido si se proporcionan datos
        ll = None
        if 'limites_liquido' in data:
            ll = processor.calcular_limite_liquido(data['limites_liquido'])
        
        # Calcular límite plástico si se proporcionan datos
        lp = None
        if 'limites_plastico' in data:
            lp = processor.calcular_limite_plastico(data['limites_plastico'])
        
        # Calcular índice de plasticidad si tenemos ambos límites
        ip = None
        if ll is not None and lp is not None:
            ip = processor.calcular_indice_plasticidad(ll, lp)
        
        return jsonify({
            'success': True,
            'resultado': {
                'limite_liquido': ll,
                'limite_plastico': lp,
                'indice_plasticidad': ip
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/clasificacion/sucs', methods=['POST'])
def clasificar_sucs():
    """Clasificar suelo según SUCS"""
    try:
        data = request.get_json()
        
        processor = ClasificacionProcessor()
        resultado = processor.clasificar_sucs(
            porcentaje_grava=float(data.get('grava', 0)),
            porcentaje_arena=float(data.get('arena', 0)),
            porcentaje_finos=float(data.get('finos', 0)),
            limite_liquido=float(data.get('ll', 0)) if data.get('ll') else None,
            indice_plasticidad=float(data.get('ip', 0)) if data.get('ip') else None
        )
        
        return jsonify({
            'success': True,
            'resultado': resultado
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/proyectos')
def get_proyectos():
    """Obtener lista de proyectos"""
    try:
        proyectos = [
            {'id': 'P-001', 'nombre': 'Edificio Central', 'fecha': '20/11/2025', 'ensayos': 5, 'estado': 'completado'},
            {'id': 'P-002', 'nombre': 'Puente Norte', 'fecha': '19/11/2025', 'ensayos': 4, 'estado': 'en-proceso'},
            {'id': 'P-003', 'nombre': 'Vía Sur', 'fecha': '18/11/2025', 'ensayos': 6, 'estado': 'completado'},
            {'id': 'P-004', 'nombre': 'Plaza Comercial', 'fecha': '17/11/2025', 'ensayos': 3, 'estado': 'completado'},
            {'id': 'P-005', 'nombre': 'Residencial Este', 'fecha': '16/11/2025', 'ensayos': 4, 'estado': 'en-proceso'},
        ]
        
        return jsonify({
            'success': True,
            'proyectos': proyectos
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/informe/generar', methods=['POST'])
def generar_informe():
    """Generar informe en el formato solicitado"""
    try:
        data = request.get_json()
        
        # Extraer configuración
        config = {
            'titulo': data.get('titulo', 'Informe Geotecnico'),
            'cliente': data.get('cliente', ''),
            'proyecto': data.get('proyecto', ''),
            'ubicacion': data.get('ubicacion', ''),
            'fecha': data.get('fecha', datetime.now().strftime('%Y-%m-%d')),
            'incluirHumedad': data.get('incluirHumedad', False),
            'incluirAtterberg': data.get('incluirAtterberg', False),
            'incluirClasificacion': data.get('incluirClasificacion', False),
            'incluirFases': data.get('incluirFases', False),
            'incluirGraficos': data.get('incluirGraficos', False),
            'formato': data.get('formato', 'pdf')
        }
        
        # Generar según formato
        if config['formato'] == 'pdf':
            return generar_pdf(config)
        elif config['formato'] == 'excel':
            return generar_excel(config)
        elif config['formato'] == 'word':
            return generar_word(config)
        else:
            return jsonify({'success': False, 'error': 'Formato no soportado'}), 400
            
    except Exception as e:
        print(f"Error generando informe: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


def generar_pdf(config):
    """Generar informe en formato PDF"""
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Encabezado
    c.setFont("Helvetica-Bold", 20)
    c.drawString(1*inch, height - 1*inch, "INFORME GEOTECNICO")
    
    c.setFont("Helvetica-Bold", 14)
    c.drawString(1*inch, height - 1.5*inch, config['titulo'])
    
    # Información del proyecto
    y = height - 2*inch
    c.setFont("Helvetica", 11)
    
    if config['cliente']:
        c.drawString(1*inch, y, f"Cliente: {config['cliente']}")
        y -= 0.3*inch
    
    if config['proyecto']:
        c.drawString(1*inch, y, f"Proyecto: {config['proyecto']}")
        y -= 0.3*inch
    
    if config['ubicacion']:
        c.drawString(1*inch, y, f"Ubicacion: {config['ubicacion']}")
        y -= 0.3*inch
    
    c.drawString(1*inch, y, f"Fecha: {config['fecha']}")
    y -= 0.5*inch
    
    # Ensayos incluidos
    c.setFont("Helvetica-Bold", 12)
    c.drawString(1*inch, y, "ENSAYOS INCLUIDOS:")
    y -= 0.3*inch
    
    c.setFont("Helvetica", 10)
    ensayos = []
    
    if config['incluirHumedad']:
        ensayos.append("- Contenido de Humedad")
        
    if config['incluirAtterberg']:
        ensayos.append("- Limites de Atterberg")
        
    if config['incluirClasificacion']:
        ensayos.append("- Clasificacion de Suelos (AASHTO)")
        
    if config['incluirFases']:
        ensayos.append("- Fases del Suelo")
    
    for ensayo in ensayos:
        c.drawString(1.2*inch, y, ensayo)
        y -= 0.25*inch
    
    # Datos de ensayos
    if config['incluirHumedad']:
        y = agregar_datos_humedad_pdf(c, y)
    
    if config['incluirAtterberg']:
        y = agregar_datos_atterberg_pdf(c, y)
    
    if config['incluirClasificacion']:
        y = agregar_datos_clasificacion_pdf(c, y)
    
    # Pie de página
    c.setFont("Helvetica-Italic", 8)
    c.drawString(1*inch, 0.5*inch, f"Generado por Sistema HSGVA - {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    
    c.save()
    buffer.seek(0)
    
    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"informe_{config['fecha']}.pdf",
        mimetype='application/pdf'
    )


def generar_excel(config):
    """Generar informe en formato Excel"""
    wb = Workbook()
    ws = wb.active
    ws.title = "Informe Geotecnico"
    
    # Estilos
    header_fill = PatternFill(start_color="4A7C59", end_color="4A7C59", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF", size=14)
    title_font = Font(bold=True, size=16)
    
    # Título
    ws.merge_cells('A1:E1')
    ws['A1'] = "INFORME GEOTECNICO"
    ws['A1'].font = title_font
    ws['A1'].alignment = Alignment(horizontal='center')
    
    # Información del proyecto
    row = 3
    ws[f'A{row}'] = "Titulo:"
    ws[f'B{row}'] = config['titulo']
    ws[f'A{row}'].font = Font(bold=True)
    
    row += 1
    if config['cliente']:
        ws[f'A{row}'] = "Cliente:"
        ws[f'B{row}'] = config['cliente']
        ws[f'A{row}'].font = Font(bold=True)
        row += 1
    
    if config['proyecto']:
        ws[f'A{row}'] = "Proyecto:"
        ws[f'B{row}'] = config['proyecto']
        ws[f'A{row}'].font = Font(bold=True)
        row += 1
    
    if config['ubicacion']:
        ws[f'A{row}'] = "Ubicacion:"
        ws[f'B{row}'] = config['ubicacion']
        ws[f'A{row}'].font = Font(bold=True)
        row += 1
    
    ws[f'A{row}'] = "Fecha:"
    ws[f'B{row}'] = config['fecha']
    ws[f'A{row}'].font = Font(bold=True)
    
    row += 2
    
    # Datos de ensayos
    if config['incluirHumedad']:
        row = agregar_datos_humedad_excel(ws, row)
    
    if config['incluirAtterberg']:
        row = agregar_datos_atterberg_excel(ws, row)
    
    if config['incluirClasificacion']:
        row = agregar_datos_clasificacion_excel(ws, row)
    
    # Ajustar ancho de columnas
    ws.column_dimensions['A'].width = 20
    ws.column_dimensions['B'].width = 20
    ws.column_dimensions['C'].width = 15
    ws.column_dimensions['D'].width = 15
    ws.column_dimensions['E'].width = 15
    
    # Guardar en buffer
    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    
    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"informe_{config['fecha']}.xlsx",
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )


def generar_word(config):
    """Generar informe en formato Word (simplificado como TXT por ahora)"""
    contenido = f"""
INFORME GEOTECNICO
{'='*60}

{config['titulo']}

INFORMACION DEL PROYECTO
{'='*60}
Cliente: {config['cliente']}
Proyecto: {config['proyecto']}
Ubicacion: {config['ubicacion']}
Fecha: {config['fecha']}

ENSAYOS INCLUIDOS
{'='*60}
"""
    
    if config['incluirHumedad']:
        contenido += "\n- Contenido de Humedad"
    if config['incluirAtterberg']:
        contenido += "\n- Limites de Atterberg"
    if config['incluirClasificacion']:
        contenido += "\n- Clasificacion de Suelos (AASHTO)"
    if config['incluirFases']:
        contenido += "\n- Fases del Suelo"
    
    contenido += f"\n\n{'='*60}\nGenerado por Sistema HSGVA - {datetime.now().strftime('%d/%m/%Y %H:%M')}\n"
    
    buffer = io.BytesIO()
    buffer.write(contenido.encode('utf-8'))
    buffer.seek(0)
    
    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"informe_{config['fecha']}.txt",
        mimetype='text/plain'
    )


def agregar_datos_humedad_pdf(c, y):
    """Agregar datos de humedad al PDF"""
    try:
        datos = hidrometria_etl.load_data()
        if y < 2*inch:
            c.showPage()
            y = 10*inch
        
        c.setFont("Helvetica-Bold", 11)
        c.drawString(1*inch, y, "CONTENIDO DE HUMEDAD")
        y -= 0.3*inch
        
        c.setFont("Helvetica", 9)
        c.drawString(1*inch, y, f"Total de muestras: {len(datos)}")
        y -= 0.25*inch
        
        if len(datos) > 0:
            promedio = sum(d.get('Humedad (%)', 0) for d in datos) / len(datos)
            c.drawString(1*inch, y, f"Humedad promedio: {promedio:.2f}%")
            y -= 0.4*inch
    except Exception as e:
        print(f"Error agregando humedad: {e}")
    
    return y


def agregar_datos_atterberg_pdf(c, y):
    """Agregar datos de Atterberg al PDF"""
    try:
        datos = atterberg_etl.load_data()
        if y < 2*inch:
            c.showPage()
            y = 10*inch
        
        c.setFont("Helvetica-Bold", 11)
        c.drawString(1*inch, y, "LIMITES DE ATTERBERG")
        y -= 0.3*inch
        
        c.setFont("Helvetica", 9)
        c.drawString(1*inch, y, f"Total de ensayos: {len(datos)}")
        y -= 0.4*inch
    except Exception as e:
        print(f"Error agregando Atterberg: {e}")
    
    return y


def agregar_datos_clasificacion_pdf(c, y):
    """Agregar datos de clasificación al PDF"""
    try:
        datos = clasificacion_etl.load_data()
        if y < 2*inch:
            c.showPage()
            y = 10*inch
        
        c.setFont("Helvetica-Bold", 11)
        c.drawString(1*inch, y, "CLASIFICACION DE SUELOS (AASHTO)")
        y -= 0.3*inch
        
        c.setFont("Helvetica", 9)
        c.drawString(1*inch, y, f"Total de muestras: {len(datos)}")
        y -= 0.4*inch
    except Exception as e:
        print(f"Error agregando clasificacion: {e}")
    
    return y


def agregar_datos_humedad_excel(ws, row):
    """Agregar datos de humedad al Excel"""
    try:
        datos = hidrometria_etl.load_data()
        
        ws[f'A{row}'] = "CONTENIDO DE HUMEDAD"
        ws[f'A{row}'].font = Font(bold=True, size=12)
        row += 1
        
        # Encabezados
        ws[f'A{row}'] = "Muestra"
        ws[f'B{row}'] = "Humedad (%)"
        ws[f'C{row}'] = "Temperatura"
        for cell in [ws[f'A{row}'], ws[f'B{row}'], ws[f'C{row}']]:
            cell.font = Font(bold=True)
            cell.fill = PatternFill(start_color="4A7C59", end_color="4A7C59", fill_type="solid")
            cell.font = Font(bold=True, color="FFFFFF")
        row += 1
        
        # Datos
        for i, dato in enumerate(datos[:10], 1):
            ws[f'A{row}'] = f"M-{i}"
            ws[f'B{row}'] = dato.get('Humedad (%)', 0)
            ws[f'C{row}'] = dato.get('Temperatura', '')
            row += 1
        
        row += 1
    except Exception as e:
        print(f"Error agregando humedad a Excel: {e}")
    
    return row


def agregar_datos_atterberg_excel(ws, row):
    """Agregar datos de Atterberg al Excel"""
    try:
        datos = atterberg_etl.load_data()
        
        ws[f'A{row}'] = "LIMITES DE ATTERBERG"
        ws[f'A{row}'].font = Font(bold=True, size=12)
        row += 1
        
        ws[f'A{row}'] = f"Total de ensayos: {len(datos)}"
        row += 2
    except Exception as e:
        print(f"Error agregando Atterberg a Excel: {e}")
    
    return row


def agregar_datos_clasificacion_excel(ws, row):
    """Agregar datos de clasificación al Excel"""
    try:
        datos = clasificacion_etl.load_data()
        
        ws[f'A{row}'] = "CLASIFICACION DE SUELOS (AASHTO)"
        ws[f'A{row}'].font = Font(bold=True, size=12)
        row += 1
        
        ws[f'A{row}'] = f"Total de muestras: {len(datos)}"
        row += 2
    except Exception as e:
        print(f"Error agregando clasificacion a Excel: {e}")
    
    return row


# Manejo de errores
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Recurso no encontrado'}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Error interno del servidor'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
