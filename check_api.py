"""
Verificación rápida del endpoint
"""
import urllib.request
import json

try:
    print("🔍 Consultando http://localhost:5000/api/humedad/datos")
    
    with urllib.request.urlopen('http://localhost:5000/api/humedad/datos', timeout=5) as response:
        data = json.loads(response.read().decode())
        
        print("\n✅ Respuesta del servidor:")
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        if data.get('success') and data.get('data'):
            print(f"\n📊 Se obtuvieron {len(data['data'])} registros correctamente")
            print("\nLos datos ahora deberían mostrarse en el navegador cuando")
            print("presiones el botón 'Cargar desde Excel' en el módulo de Humedad.")
        else:
            print("\n⚠️ El servidor respondió pero no hay datos")
            
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\nAsegúrate de que el servidor Flask esté ejecutándose.")
