"""
Prueba del endpoint de humedad con el servidor en ejecución
"""
import requests
import json
import time

print("=" * 60)
print("🌐 PRUEBA DE ENDPOINT - /api/humedad/datos")
print("=" * 60)
print()

# Esperar un poco para asegurar que el servidor esté listo
print("⏳ Esperando que el servidor esté listo...")
time.sleep(2)

try:
    url = 'http://localhost:5000/api/humedad/datos'
    print(f"📡 Consultando: {url}")
    
    response = requests.get(url, timeout=5)
    
    print(f"Status Code: {response.status_code}")
    print()
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Respuesta exitosa!")
        print()
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        if 'data' in data and len(data['data']) > 0:
            print()
            print("=" * 60)
            print(f"📊 Total de registros: {data['count']}")
            print("=" * 60)
            
            for i, registro in enumerate(data['data'], 1):
                print(f"\n🔬 Muestra {i}:")
                print(f"   Proyecto: {registro.get('proyecto', 'N/A')}")
                print(f"   Muestra: {registro.get('muestra', 'N/A')}")
                print(f"   Recipiente: {registro.get('numero_recipiente', 'N/A')}")
                print(f"   Peso húmedo: {registro.get('peso_humedo', 0)}g")
                print(f"   Peso seco: {registro.get('peso_seco', 0)}g")
                print(f"   Peso recipiente: {registro.get('peso_recipiente', 0)}g")
                print(f"   Humedad: {registro.get('humedad', 0)}%")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        
except requests.exceptions.ConnectionError:
    print("❌ No se puede conectar al servidor.")
    print("   Asegúrate de que Flask esté ejecutándose en http://localhost:5000")
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
