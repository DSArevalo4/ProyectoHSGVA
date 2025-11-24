"""
Script para inspeccionar la estructura del archivo de Hidrometría
"""

import pandas as pd
import os

filepath = r"C:\Users\SANTY\ProyectoHSGVA\Data\Hidrometria #4.xlsx"

print("=" * 60)
print("📊 INSPECCIÓN DEL ARCHIVO DE HIDROMETRÍA")
print("=" * 60)
print()

try:
    # Leer el archivo Excel
    excel_file = pd.ExcelFile(filepath)
    
    print(f"📄 Archivo: {os.path.basename(filepath)}")
    print(f"📑 Hojas disponibles: {excel_file.sheet_names}")
    print()
    
    # Leer cada hoja
    for sheet_name in excel_file.sheet_names:
        print(f"\n{'=' * 60}")
        print(f"📋 HOJA: {sheet_name}")
        print('=' * 60)
        
        df = pd.read_excel(filepath, sheet_name=sheet_name)
        
        print(f"\n📏 Dimensiones: {df.shape[0]} filas x {df.shape[1]} columnas")
        print(f"\n📝 Columnas:")
        for i, col in enumerate(df.columns, 1):
            print(f"   {i}. {col}")
        
        print(f"\n👁️  Primeras 5 filas:")
        print(df.head().to_string())
        
        print(f"\n📊 Información de tipos de datos:")
        print(df.dtypes)
        
        print(f"\n🔢 Estadísticas básicas (columnas numéricas):")
        print(df.describe())
        
except Exception as e:
    print(f"❌ Error al leer el archivo: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
