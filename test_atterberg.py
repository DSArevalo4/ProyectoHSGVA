"""
Script para probar el ETL de Atterberg
"""

from backend.etl.atterberg_etl import AtterbergETL
import json

def test_atterberg():
    print("=" * 60)
    print("PRUEBA DE ETL - LÍMITES DE ATTERBERG")
    print("=" * 60)
    
    # Inicializar ETL
    filepath = "Data/Limites de Atterberg.xlsx"
    etl = AtterbergETL(filepath)
    
    # Cargar datos
    print("\n1. Cargando datos...")
    data = etl.load_data()
    
    if not data:
        print("❌ No se pudieron cargar los datos")
        return
    
    print("✅ Datos cargados exitosamente")
    
    # Mostrar Límite Líquido
    print("\n" + "=" * 60)
    print("LÍMITE LÍQUIDO")
    print("=" * 60)
    ll_data = etl.get_limite_liquido_data()
    for ensayo in ll_data:
        print(f"\nEnsayo {ensayo['ensayo']}: {ensayo['caso']}")
        print(f"  N° Golpes: {ensayo['n_golpes']}")
        print(f"  Recipiente: {ensayo['recipiente']} g")
        print(f"  Recipiente + Suelo H: {ensayo['recipiente_suelo_h']} g")
        print(f"  Recipiente + Suelo s: {ensayo['recipiente_suelo_s']} g")
        print(f"  Ww: {ensayo['ww']} g")
        print(f"  Ws: {ensayo['ws']} g")
        print(f"  W%: {ensayo['w_percent']}%")
    
    # Mostrar Límite Plástico
    print("\n" + "=" * 60)
    print("LÍMITE PLÁSTICO")
    print("=" * 60)
    lp_data = etl.get_limite_plastico_data()
    for ensayo in lp_data:
        print(f"\nEnsayo {ensayo['ensayo']}")
        print(f"  Recipiente: {ensayo['recipiente']} g")
        print(f"  Recipiente + Suelo H: {ensayo['recipiente_suelo_h']} g")
        print(f"  Recipiente + Suelo s: {ensayo['recipiente_suelo_s']} g")
        print(f"  Ww: {ensayo['ww']} g")
        print(f"  Ws: {ensayo['ws']} g")
        print(f"  W%: {ensayo['w_percent']}%")
    
    # Mostrar resumen
    print("\n" + "=" * 60)
    print("RESUMEN")
    print("=" * 60)
    summary = etl.get_summary()
    print(f"LL (Límite Líquido): {summary['LL']}%")
    print(f"LP (Límite Plástico): {summary['LP']}%")
    print(f"IP (Índice de Plasticidad): {summary['IP']}%")
    print(f"Ensayos LL: {summary['ensayos_ll']}")
    print(f"Ensayos LP: {summary['ensayos_lp']}")
    
    # Mostrar todos los datos en JSON
    print("\n" + "=" * 60)
    print("DATOS COMPLETOS (JSON)")
    print("=" * 60)
    all_data = etl.get_all_data()
    print(json.dumps(all_data, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    test_atterberg()
