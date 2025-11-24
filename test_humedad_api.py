"""
Script para probar el endpoint de humedad
"""
import requests
import json

print("=" * 60)
print("🧪 PRUEBA DE API - CONTENIDO DE HUMEDAD")
print("=" * 60)
print()

try:
    # Probar endpoint de datos
    print("📥 Solicitando datos de humedad...")
    response = requests.get('http://localhost:5000/api/humedad/datos')
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ Respuesta exitosa!")
        print(f"Datos recibidos: {json.dumps(data, indent=2, ensure_ascii=False)}")
        
        if 'datos' in data:
            print(f"\n📊 Total de muestras: {len(data['datos'])}")
            for muestra in data['datos']:
                print(f"\n  🔬 {muestra['id']} - Recipiente: {muestra['recipiente']}")
                print(f"     • Peso húmedo: {muestra['peso_humedo']}g")
                print(f"     • Peso seco: {muestra['peso_seco']}g")
                print(f"     • Peso recipiente: {muestra['peso_recipiente']}g")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
