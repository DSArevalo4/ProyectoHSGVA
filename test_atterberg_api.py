"""
Script para probar el endpoint de Atterberg
"""

import requests
import json

def test_api():
    print("=" * 60)
    print("PRUEBA DE API - LÍMITES DE ATTERBERG")
    print("=" * 60)
    
    url = "http://localhost:5000/api/atterberg/datos"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if data.get('success'):
            print("\n✅ API funcionando correctamente")
            print(f"\nResumen:")
            print(f"  LL: {data['summary']['LL']}%")
            print(f"  LP: {data['summary']['LP']}%")
            print(f"  IP: {data['summary']['IP']}%")
            print(f"  Ensayos LL: {data['summary']['ensayos_ll']}")
            print(f"  Ensayos LP: {data['summary']['ensayos_lp']}")
            
            print("\n" + "=" * 60)
            print("DATOS COMPLETOS:")
            print("=" * 60)
            print(json.dumps(data, indent=2, ensure_ascii=False))
        else:
            print(f"\n❌ Error: {data.get('error')}")
    
    except Exception as e:
        print(f"\n❌ Error al conectar con la API: {e}")

if __name__ == "__main__":
    test_api()
