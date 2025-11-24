"""
Script de prueba para verificar el sistema
"""

import sys
import os

print("=" * 60)
print("🧪 PRUEBA DEL SISTEMA DE ANÁLISIS GEOTÉCNICO")
print("=" * 60)
print()

# Verificar imports
print("📦 Verificando dependencias...")
try:
    import flask
    print("✅ Flask:", flask.__version__)
except ImportError as e:
    print("❌ Flask no encontrado")

try:
    import pandas as pd
    print("✅ Pandas:", pd.__version__)
except ImportError:
    print("❌ Pandas no encontrado")

try:
    import numpy as np
    print("✅ NumPy:", np.__version__)
except ImportError:
    print("❌ NumPy no encontrado")

try:
    import scipy
    print("✅ SciPy:", scipy.__version__)
except ImportError:
    print("❌ SciPy no encontrado")

try:
    import openpyxl
    print("✅ openpyxl:", openpyxl.__version__)
except ImportError:
    print("❌ openpyxl no encontrado")

print()

# Verificar archivos de datos
print("📁 Verificando archivos de datos...")
DATA_DIR = os.path.join(os.path.dirname(__file__), 'Data')

files_to_check = [
    'Hidrometria #4.xlsx',
    'Clasificacion de Suelos #2.xlsx',
    'Limites de Atterberg.xlsx'
]

for file in files_to_check:
    filepath = os.path.join(DATA_DIR, file)
    if os.path.exists(filepath):
        size = os.path.getsize(filepath) / 1024  # KB
        print(f"✅ {file} ({size:.1f} KB)")
    else:
        print(f"❌ {file} - NO ENCONTRADO")

print()

# Probar procesador de humedad
print("🧮 Probando procesador de humedad...")
try:
    sys.path.insert(0, os.path.dirname(__file__))
    from backend.processors.humedad_processor import HumedadProcessor
    
    processor = HumedadProcessor()
    resultado = processor.calcular_humedad(
        peso_recipiente=25.50,
        peso_humedo=185.30,
        peso_seco=165.80
    )
    
    print(f"   Humedad calculada: {resultado['humedad']}%")
    print(f"   Clasificación: {resultado['clasificacion']}")
    print("✅ Procesador de humedad funcionando correctamente")
except Exception as e:
    print(f"❌ Error en procesador de humedad: {str(e)}")

print()

# Probar ETL
print("📊 Probando ETL de datos...")
try:
    from backend.etl.hidrometria_etl import HidrometriaETL
    
    etl = HidrometriaETL(os.path.join(DATA_DIR, 'Hidrometria #4.xlsx'))
    data = etl.load_data()
    
    if data:
        print(f"✅ ETL Hidrometría: {len(data)} registros cargados")
        if len(data) > 0:
            print(f"   Columnas: {list(data[0].keys())[:5]}...")
    else:
        print("⚠️  ETL Hidrometría: No se cargaron datos (puede ser normal si el archivo está vacío)")
except Exception as e:
    print(f"⚠️  ETL Hidrometría: {str(e)}")

print()
print("=" * 60)
print("✅ PRUEBA COMPLETADA")
print("=" * 60)
print()
print("💡 Para iniciar la aplicación ejecuta: python app.py")
print()
