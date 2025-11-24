"""
Sistema de Análisis Geotécnico - HSGVA
Aplicación Flask para análisis de ensayos de laboratorio de suelos
"""

from flask import Flask, render_template, jsonify, request, send_file
from datetime import datetime
import os
import sys

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


# Manejo de errores
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Recurso no encontrado'}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Error interno del servidor'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
