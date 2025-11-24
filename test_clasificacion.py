"""
Script para probar el ETL de Clasificación de Suelos
"""

from backend.etl.clasificacion_etl import ClasificacionETL
import json

def test_clasificacion():
    print("=" * 80)
    print("PRUEBA DE ETL - CLASIFICACIÓN DE SUELOS")
    print("=" * 80)
    
    # Inicializar ETL
    filepath = "Data/Clasificacion de Suelos #2.xlsx"
    etl = ClasificacionETL(filepath)
    
    # Cargar datos
    print("\n1. Cargando datos...")
    data = etl.load_data()
    
    if not data:
        print("❌ No se pudieron cargar los datos")
        return
    
    print("✅ Datos cargados exitosamente")
    
    # Mostrar muestras básicas
    print("\n" + "=" * 80)
    print("MUESTRAS BÁSICAS")
    print("=" * 80)
    muestras = etl.get_muestras()
    for muestra in muestras:
        print(f"\nMuestra N° {muestra['numero']}")
        print(f"  Platon: {muestra['platon']} g")
        print(f"  Muestra: {muestra['muestra']} g")
        print(f"  N° 10: {muestra['n10']} g")
        print(f"  N° 40: {muestra['n40']} g")
        print(f"  N° 200: {muestra['n200']} g")
        print(f"  Fondo: {muestra['fondo']} g")
        print(f"  Total Muestra: {muestra['total_muestra']} g")
    
    # Mostrar análisis granulométrico
    print("\n" + "=" * 80)
    print("ANÁLISIS GRANULOMÉTRICO")
    print("=" * 80)
    analisis = etl.get_analisis_granulometrico()
    
    muestra_actual = None
    for dato in analisis:
        if dato['muestra'] != muestra_actual:
            muestra_actual = dato['muestra']
            print(f"\n{'='*70}")
            print(f"Muestra N° {dato['muestra']}")
            if dato['clasificacion']:
                print(f"Clasificación: {dato['clasificacion']}")
            print(f"{'='*70}")
            print(f"{'Tamiz':<10} {'Abertura (mm)':<15} {'Peso Ret (g)':<15} {'% Retenido':<15} {'% Pasa':<15}")
            print("-" * 70)
        
        print(f"{str(dato['n_tamiz']):<10} {dato['abertura_mm']:<15.3f} {dato['peso_retenido']:<15.1f} {dato['pct_retenido']:<15.2f} {dato['pct_pasa']:<15.2f}")
    
    # Mostrar resumen
    print("\n" + "=" * 80)
    print("RESUMEN")
    print("=" * 80)
    summary = etl.get_summary()
    print(f"Total de muestras: {summary['total_muestras']}")
    print(f"Total de análisis: {summary['total_analisis']}")
    print(f"Números de muestras: {summary['muestras']}")
    
    # Mostrar datos completos de Muestra 1
    print("\n" + "=" * 80)
    print("DATOS COMPLETOS MUESTRA N° 1 (JSON)")
    print("=" * 80)
    muestra1 = etl.get_muestra_by_number(1)
    print(json.dumps(muestra1, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    test_clasificacion()
