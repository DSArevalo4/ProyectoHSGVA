"""
Script para depurar el endpoint de humedad
"""
import sys
sys.path.append(r'C:\Users\SANTY\ProyectoHSGVA')

from backend.etl.hidrometria_etl import HidrometriaETL

print("=" * 60)
print("🔍 DEPURACIÓN - GET_HUMEDAD_DATA")
print("=" * 60)
print()

try:
    # Inicializar ETL
    etl = HidrometriaETL(r"C:\Users\SANTY\ProyectoHSGVA\Data\Hidrometria #4.xlsx")
    
    print("📊 Cargando datos...")
    etl.load_data()
    
    print("\n📥 Llamando get_humedad_data()...")
    humedad_data = etl.get_humedad_data()
    
    print(f"\n✅ Datos retornados: {len(humedad_data)} registros")
    
    if humedad_data:
        print("\n📋 Estructura de datos:")
        for i, dato in enumerate(humedad_data, 1):
            print(f"\n  Registro {i}:")
            for key, value in dato.items():
                print(f"    {key}: {value}")
    else:
        print("\n⚠️ No se retornaron datos")
        
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
