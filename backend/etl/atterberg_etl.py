"""
ETL para procesar datos de Límites de Atterberg
"""

import pandas as pd
import os
from datetime import datetime


class AtterbergETL:
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
            
            # Extraer datos de Límite Líquido (filas 3-5)
            limite_liquido = []
            for i in range(3, 6):  # Filas 3, 4, 5 (índices en pandas)
                ensayo = {
                    'tipo': 'Límite Líquido',
                    'ensayo': int(df.iloc[i, 1]) if pd.notna(df.iloc[i, 1]) else i-2,
                    'caso': str(df.iloc[i, 2]) if pd.notna(df.iloc[i, 2]) else '',
                    'n_golpes': int(df.iloc[i, 3]) if pd.notna(df.iloc[i, 3]) else 0,
                    'recipiente': float(df.iloc[i, 4]) if pd.notna(df.iloc[i, 4]) else 0,
                    'recipiente_suelo_h': float(df.iloc[i, 5]) if pd.notna(df.iloc[i, 5]) else 0,
                    'recipiente_suelo_s': float(df.iloc[i, 6]) if pd.notna(df.iloc[i, 6]) else 0
                }
                
                # Calcular valores derivados
                ww = ensayo['recipiente_suelo_h'] - ensayo['recipiente_suelo_s']
                ws = ensayo['recipiente_suelo_s'] - ensayo['recipiente']
                w_percent = (ww / ws * 100) if ws != 0 else 0
                
                ensayo['ww'] = round(ww, 2)
                ensayo['ws'] = round(ws, 2)
                ensayo['w_percent'] = round(w_percent, 2)
                
                limite_liquido.append(ensayo)
            
            # Extraer datos de Límite Plástico (filas 14-16)
            limite_plastico = []
            for i in range(14, 17):  # Filas 14, 15, 16
                ensayo = {
                    'tipo': 'Límite Plástico',
                    'ensayo': int(df.iloc[i, 1]) if pd.notna(df.iloc[i, 1]) else i-13,
                    'recipiente': float(df.iloc[i, 2]) if pd.notna(df.iloc[i, 2]) else 0,
                    'recipiente_suelo_h': float(df.iloc[i, 3]) if pd.notna(df.iloc[i, 3]) else 0,
                    'recipiente_suelo_s': float(df.iloc[i, 4]) if pd.notna(df.iloc[i, 4]) else 0
                }
                
                # Calcular valores derivados
                ww = ensayo['recipiente_suelo_h'] - ensayo['recipiente_suelo_s']
                ws = ensayo['recipiente_suelo_s'] - ensayo['recipiente']
                w_percent = (ww / ws * 100) if ws != 0 else 0
                
                ensayo['ww'] = round(ww, 2)
                ensayo['ws'] = round(ws, 2)
                ensayo['w_percent'] = round(w_percent, 2)
                
                limite_plastico.append(ensayo)
            
            # Extraer valores calculados finales
            ll_value = float(df.iloc[24, 2]) if pd.notna(df.iloc[24, 2]) else 0
            lp_value = float(df.iloc[25, 2]) if pd.notna(df.iloc[25, 2]) else 0
            ip_value = float(df.iloc[26, 2]) if pd.notna(df.iloc[26, 2]) else 0
            
            self.data = {
                'limite_liquido': limite_liquido,
                'limite_plastico': limite_plastico,
                'll': round(ll_value, 2),
                'lp': round(lp_value, 2),
                'ip': round(ip_value, 2)
            }
            
            return self.data
            
        except Exception as e:
            print(f"❌ Error al cargar Atterberg: {str(e)}")
            import traceback
            traceback.print_exc()
            return []
    
    def transform_data(self):
        """Transformar y limpiar datos"""
        if not self.data:
            return []
        
        # Ya están transformados en load_data
        return self.data
    
    def get_limite_liquido_data(self):
        """Extraer datos de límite líquido"""
        if not self.data or 'limite_liquido' not in self.data:
            return []
        
        return self.data['limite_liquido']
    
    def get_limite_plastico_data(self):
        """Extraer datos de límite plástico"""
        if not self.data or 'limite_plastico' not in self.data:
            return []
        
        return self.data['limite_plastico']
    
    def get_all_data(self):
        """Obtener todos los datos procesados"""
        return self.data if self.data else {}
    
    def get_summary(self):
        """Obtener resumen de datos"""
        if not self.data:
            return {}
        
        return {
            'LL': self.data.get('ll', 0),
            'LP': self.data.get('lp', 0),
            'IP': self.data.get('ip', 0),
            'ensayos_ll': len(self.data.get('limite_liquido', [])),
            'ensayos_lp': len(self.data.get('limite_plastico', []))
        }
    
    def export_to_csv(self, output_path=None):
        """Exportar datos a CSV"""
        if not self.data:
            raise ValueError("No hay datos para exportar")
        
        if output_path is None:
            output_path = f"atterberg_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        # Combinar límite líquido y plástico
        all_records = []
        all_records.extend(self.data.get('limite_liquido', []))
        all_records.extend(self.data.get('limite_plastico', []))
        
        df = pd.DataFrame(all_records)
        df.to_csv(output_path, index=False, encoding='utf-8-sig')
        
        return output_path
