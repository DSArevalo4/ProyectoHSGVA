"""
Script de prueba para verificar endpoints de módulos
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_endpoint(name, url):
    try:
        response = requests.get(url)
        print(f"\n{'='*60}")
        print(f"Testing: {name}")
        print(f"URL: {url}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data.get('success', False)}")
            if 'data' in data:
                if isinstance(data['data'], list):
                    print(f"Records: {len(data['data'])}")
                elif isinstance(data['data'], dict):
                    print(f"Keys: {list(data['data'].keys())}")
            print("✅ OK")
        else:
            print(f"❌ ERROR: {response.text}")
    except Exception as e:
        print(f"❌ EXCEPTION: {str(e)}")

if __name__ == "__main__":
    print("\n🧪 PROBANDO ENDPOINTS DE MÓDULOS")
    
    test_endpoint("Humedad - Datos", f"{BASE_URL}/api/humedad/datos")
    test_endpoint("Atterberg - Datos", f"{BASE_URL}/api/atterberg/datos")
    test_endpoint("Clasificación - Datos", f"{BASE_URL}/api/clasificacion/datos")
    
    print(f"\n{'='*60}")
    print("✅ Pruebas completadas")
    print(f"{'='*60}\n")
