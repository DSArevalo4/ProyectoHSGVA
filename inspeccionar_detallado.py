"""
Script mejorado para inspeccionar el archivo de Hidrometría
"""

import pandas as pd
import os

filepath = r"C:\Users\SANTY\ProyectoHSGVA\Data\Hidrometria #4.xlsx"

print("=" * 60)
print("📊 INSPECCIÓN DETALLADA - HIDROMETRÍA")
print("=" * 60)
print()

try:
    # Leer sin encabezados primero
    df_raw = pd.read_excel(filepath, header=None)
    
    print(f"📄 Archivo: {os.path.basename(filepath)}")
    print(f"📏 Dimensiones: {df_raw.shape[0]} filas x {df_raw.shape[1]} columnas")
    print()
    
    print("👁️  Todas las filas (sin procesar):")
    print(df_raw.to_string())
    print()
    
    # Buscar fila de encabezados
    print("🔍 Buscando fila de encabezados...")
    for idx in range(min(10, len(df_raw))):
        row = df_raw.iloc[idx]
        non_null = row.dropna()
        if len(non_null) > 3:
            print(f"\nFila {idx} (posible encabezado):")
            print(non_null.to_dict())
    
    # Intentar leer con diferentes skiprows
    print("\n" + "=" * 60)
    print("Intentando leer con skiprows=1...")
    df1 = pd.read_excel(filepath, skiprows=1)
    print(f"Columnas: {list(df1.columns)}")
    print(f"\nPrimeras 3 filas:")
    print(df1.head(3))
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
