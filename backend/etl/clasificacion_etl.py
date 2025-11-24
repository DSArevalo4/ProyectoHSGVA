"""
ETL para procesar datos de Clasificación de Suelos
"""

import pandas as pd
import os
from datetime import datetime


class ClasificacionETL:
    def __init__(self, filepath):
        self.filepath = filepath
        self.data = None
        
    def load_data(self):
        """Cargar datos desde Excel con estructura específica"""
        try:
            if not os.path.exists(self.filepath):
                print(f"⚠️  Archivo no encontrado: {self.filepath}")
                return []
            
            # Leer archivo sin encabezados
            df = pd.read_excel(self.filepath, header=None)
            
            muestras = []
            
            # Muestra 1 (filas 1-8)
            muestra1 = self._extraer_muestra_basica(df, 1, 2, 1)
            if muestra1:
                muestras.append(muestra1)
            
            # Muestra 2 (filas 10-17)
            muestra2 = self._extraer_muestra_basica(df, 2, 11, 1)
            if muestra2:
                muestras.append(muestra2)
            
            # Muestra 3 (filas 1-8, columnas E-F)
            muestra3 = self._extraer_muestra_basica(df, 3, 2, 4)
            if muestra3:
                muestras.append(muestra3)
            
            # Muestra 4 (filas 10-17, columnas E-F)
            muestra4 = self._extraer_muestra_basica(df, 4, 11, 4)
            if muestra4:
                muestras.append(muestra4)
            
            # Extraer datos de análisis granulométrico (filas 20-31)
            analisis = []
            muestra_actual = None
            
            for i in range(20, 32):
                # Verificar si hay nombre de muestra (nueva muestra)
                if pd.notna(df.iloc[i, 1]) and 'Muestra' in str(df.iloc[i, 1]):
                    muestra_nombre = str(df.iloc[i, 1])
                    
                    # Determinar número de muestra
                    if 'N° 2' in muestra_nombre or 'Muestra N° 2' in muestra_nombre:
                        muestra_actual = 2
                    elif 'N° 3' in muestra_nombre or 'Muestra N° 3' in muestra_nombre:
                        muestra_actual = 3
                    elif 'N° 4' in muestra_nombre or 'Muestra N° 4' in muestra_nombre:
                        muestra_actual = 4
                    else:
                        muestra_actual = 1
                    
                    # Primera línea de datos de esta muestra
                    n_tamiz = df.iloc[i, 2] if pd.notna(df.iloc[i, 2]) else 0
                    abertura = df.iloc[i, 3] if pd.notna(df.iloc[i, 3]) else 0
                    peso_retenido = df.iloc[i, 4] if pd.notna(df.iloc[i, 4]) else 0
                    pct_retenido = df.iloc[i, 5] if pd.notna(df.iloc[i, 5]) else 0
                    pct_pasa = df.iloc[i, 6] if pd.notna(df.iloc[i, 6]) else 0
                    clasificacion = df.iloc[i, 7] if pd.notna(df.iloc[i, 7]) else ''
                    
                    analisis.append({
                        'muestra': muestra_actual,
                        'n_tamiz': int(n_tamiz) if isinstance(n_tamiz, (int, float)) else n_tamiz,
                        'abertura_mm': float(abertura) if isinstance(abertura, (int, float)) else 0,
                        'peso_retenido': float(peso_retenido) if isinstance(peso_retenido, (int, float)) else 0,
                        'pct_retenido': round(float(pct_retenido), 2) if isinstance(pct_retenido, (int, float)) else 0,
                        'pct_pasa': round(float(pct_pasa), 2) if isinstance(pct_pasa, (int, float)) else 0,
                        'clasificacion': str(clasificacion).strip() if clasificacion else ''
                    })
                
                # Si es una línea continuación (sin nombre de muestra pero con datos)
                elif muestra_actual and pd.notna(df.iloc[i, 2]):
                    n_tamiz = df.iloc[i, 2]
                    abertura = df.iloc[i, 3] if pd.notna(df.iloc[i, 3]) else 0
                    peso_retenido = df.iloc[i, 4] if pd.notna(df.iloc[i, 4]) else 0
                    pct_retenido = df.iloc[i, 5] if pd.notna(df.iloc[i, 5]) else 0
                    pct_pasa = df.iloc[i, 6] if pd.notna(df.iloc[i, 6]) else 0
                    
                    analisis.append({
                        'muestra': muestra_actual,
                        'n_tamiz': int(n_tamiz) if isinstance(n_tamiz, (int, float)) else n_tamiz,
                        'abertura_mm': float(abertura) if isinstance(abertura, (int, float)) else 0,
                        'peso_retenido': float(peso_retenido) if isinstance(peso_retenido, (int, float)) else 0,
                        'pct_retenido': round(float(pct_retenido), 2) if isinstance(pct_retenido, (int, float)) else 0,
                        'pct_pasa': round(float(pct_pasa), 2) if isinstance(pct_pasa, (int, float)) else 0,
                        'clasificacion': ''
                    })
            
            self.data = {
                'muestras': muestras,
                'analisis_granulometrico': analisis
            }
            
            return self.data
            
        except Exception as e:
            print(f"❌ Error al cargar clasificación: {str(e)}")
            import traceback
            traceback.print_exc()
            return []
    
    def _extraer_muestra_basica(self, df, num_muestra, fila_inicio, col_offset):
        """Extraer datos básicos de una muestra"""
        try:
            platon = float(df.iloc[fila_inicio, col_offset + 1]) if pd.notna(df.iloc[fila_inicio, col_offset + 1]) else 0
            muestra = float(df.iloc[fila_inicio + 1, col_offset + 1]) if pd.notna(df.iloc[fila_inicio + 1, col_offset + 1]) else 0
            n10 = float(df.iloc[fila_inicio + 2, col_offset + 1]) if pd.notna(df.iloc[fila_inicio + 2, col_offset + 1]) else 0
            n40 = float(df.iloc[fila_inicio + 3, col_offset + 1]) if pd.notna(df.iloc[fila_inicio + 3, col_offset + 1]) else 0
            n200 = float(df.iloc[fila_inicio + 4, col_offset + 1]) if pd.notna(df.iloc[fila_inicio + 4, col_offset + 1]) else 0
            fondo = float(df.iloc[fila_inicio + 5, col_offset + 1]) if pd.notna(df.iloc[fila_inicio + 5, col_offset + 1]) else 0
            total = float(df.iloc[fila_inicio + 6, col_offset + 1]) if pd.notna(df.iloc[fila_inicio + 6, col_offset + 1]) else 0
            
            return {
                'numero': num_muestra,
                'platon': platon,
                'muestra': muestra,
                'n10': n10,
                'n40': n40,
                'n200': n200,
                'fondo': fondo,
                'total_muestra': total
            }
        except Exception as e:
            print(f"Error extrayendo muestra {num_muestra}: {e}")
            return None
    
    def transform_data(self):
        """Transformar y limpiar datos"""
        if not self.data:
            return []
        
        # Ya están transformados en load_data
        return self.data
    
    def get_muestras(self):
        """Obtener datos de muestras básicas"""
        if not self.data or 'muestras' not in self.data:
            return []
        
        return self.data['muestras']
    
    def get_analisis_granulometrico(self):
        """Obtener datos de análisis granulométrico"""
        if not self.data or 'analisis_granulometrico' not in self.data:
            return []
        
        return self.data['analisis_granulometrico']
    
    def get_all_data(self):
        """Obtener todos los datos procesados"""
        return self.data if self.data else {}
    
    def get_muestra_by_number(self, num_muestra):
        """Obtener una muestra específica por número"""
        if not self.data:
            return None
        
        # Buscar muestra básica
        muestra_basica = next((m for m in self.data.get('muestras', []) if m['numero'] == num_muestra), None)
        
        # Buscar análisis granulométrico de esa muestra
        analisis = [a for a in self.data.get('analisis_granulometrico', []) if a['muestra'] == num_muestra]
        
        # Obtener clasificación
        clasificacion = ''
        for a in analisis:
            if a.get('clasificacion'):
                clasificacion = a['clasificacion']
                break
        
        return {
            'numero': num_muestra,
            'datos_basicos': muestra_basica,
            'analisis': analisis,
            'clasificacion': clasificacion
        }
    
    def get_summary(self):
        """Obtener resumen de datos"""
        if not self.data:
            return {}
        
        return {
            'total_muestras': len(self.data.get('muestras', [])),
            'total_analisis': len(self.data.get('analisis_granulometrico', [])),
            'muestras': [m['numero'] for m in self.data.get('muestras', [])]
        }
    
    def export_to_csv(self, output_path=None):
        """Exportar datos a CSV"""
        if not self.data:
            raise ValueError("No hay datos para exportar")
        
        if output_path is None:
            output_path = f"clasificacion_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        # Exportar análisis granulométrico
        df = pd.DataFrame(self.data.get('analisis_granulometrico', []))
        df.to_csv(output_path, index=False, encoding='utf-8-sig')
        
        return output_path
