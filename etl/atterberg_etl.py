"""
ETL para procesamiento de datos de Límites de Atterberg
"""

import pandas as pd
import numpy as np
from datetime import datetime
import os


class AtterbergETL:
    """Clase para procesar datos de límites de Atterberg"""
    
    def __init__(self, filepath):
        self.filepath = filepath
        self.data = None
        self.metadata = {}
        
    def extract(self):
        """Extraer datos del archivo Excel"""
        try:
            excel_file = pd.ExcelFile(self.filepath)
            sheets = {}
            
            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(self.filepath, sheet_name=sheet_name)
                sheets[sheet_name] = df
            
            self.data = sheets
            return True
        except Exception as e:
            print(f"Error al extraer datos de Atterberg: {e}")
            return False
    
    def transform(self):
        """Transformar y limpiar los datos"""
        if not self.data:
            return False
        
        try:
            transformed_data = {}
            
            for sheet_name, df in self.data.items():
                df_clean = df.dropna(how='all')
                df_clean = df_clean.dropna(axis=1, how='all')
                
                metadata = self._extract_metadata(df_clean)
                if metadata:
                    self.metadata[sheet_name] = metadata
                
                transformed_data[sheet_name] = df_clean
            
            self.data = transformed_data
            return True
        except Exception as e:
            print(f"Error al transformar datos: {e}")
            return False
    
    def _extract_metadata(self, df):
        """Extraer metadatos del dataframe"""
        metadata = {}
        
        for idx in range(min(10, len(df))):
            row = df.iloc[idx]
            row_str = ' '.join([str(x) for x in row if pd.notna(x)])
            
            if 'proyecto' in row_str.lower():
                metadata['proyecto'] = row_str
            elif 'muestra' in row_str.lower():
                metadata['muestra'] = row_str
            elif 'fecha' in row_str.lower():
                metadata['fecha'] = row_str
        
        return metadata
    
    def process(self):
        """Proceso ETL completo"""
        if not os.path.exists(self.filepath):
            return {
                'error': 'Archivo no encontrado',
                'filepath': self.filepath,
                'data': None
            }
        
        if self.extract() and self.transform():
            return {
                'success': True,
                'filepath': self.filepath,
                'sheets': list(self.data.keys()),
                'metadata': self.metadata,
                'data': self._prepare_for_json()
            }
        else:
            return {
                'error': 'Error en el proceso ETL',
                'filepath': self.filepath,
                'data': None
            }
    
    def _prepare_for_json(self):
        """Preparar datos para serialización JSON"""
        json_data = {}
        
        for sheet_name, df in self.data.items():
            json_data[sheet_name] = df.to_dict(orient='records')
        
        return json_data
    
    def calculate_limits(self, data):
        """
        Calcular límites de Atterberg
        
        Parámetros:
        - data: diccionario con datos de ensayo
        """
        
        result = {
            'limite_liquido': None,
            'limite_plastico': None,
            'indice_plasticidad': None,
            'clasificacion': None
        }
        
        # Calcular Límite Líquido (LL)
        if 'll_data' in data:
            ll_data = data['ll_data']  # Lista de [golpes, humedad]
            result['limite_liquido'] = self._calculate_liquid_limit(ll_data)
        
        # Calcular Límite Plástico (LP)
        if 'lp_data' in data:
            lp_data = data['lp_data']  # Lista de valores de humedad
            result['limite_plastico'] = self._calculate_plastic_limit(lp_data)
        
        # Calcular Índice de Plasticidad (IP)
        if result['limite_liquido'] and result['limite_plastico']:
            result['indice_plasticidad'] = result['limite_liquido'] - result['limite_plastico']
            result['clasificacion'] = self._classify_plasticity(result['indice_plasticidad'])
        
        result['timestamp'] = datetime.now().isoformat()
        
        return result
    
    def _calculate_liquid_limit(self, ll_data):
        """
        Calcular límite líquido mediante curva de fluidez
        
        Método: Interpolar para obtener humedad a 25 golpes
        """
        
        if not ll_data or len(ll_data) < 2:
            return None
        
        # Convertir a arrays numpy
        golpes = np.array([point[0] for point in ll_data])
        humedad = np.array([point[1] for point in ll_data])
        
        # Realizar regresión logarítmica
        # w = a - b * log(N)
        log_golpes = np.log10(golpes)
        
        # Ajuste lineal en escala log
        coeffs = np.polyfit(log_golpes, humedad, 1)
        
        # Calcular humedad a 25 golpes
        ll = coeffs[0] * np.log10(25) + coeffs[1]
        
        return round(ll, 2)
    
    def _calculate_plastic_limit(self, lp_data):
        """
        Calcular límite plástico como promedio de determinaciones
        """
        
        if not lp_data:
            return None
        
        lp = np.mean(lp_data)
        
        return round(lp, 2)
    
    def _classify_plasticity(self, ip):
        """Clasificar según índice de plasticidad"""
        
        if ip == 0:
            return 'No plástico'
        elif 0 < ip < 7:
            return 'Baja plasticidad'
        elif 7 <= ip < 17:
            return 'Media plasticidad'
        else:
            return 'Alta plasticidad'
    
    def get_plasticity_chart_data(self):
        """
        Obtener datos para carta de plasticidad de Casagrande
        """
        
        # Línea A: IP = 0.73(LL - 20)
        ll_range = np.linspace(0, 100, 100)
        linea_a = 0.73 * (ll_range - 20)
        linea_a[linea_a < 0] = 0
        
        # Línea U: IP = 0.9(LL - 8)
        linea_u = 0.9 * (ll_range - 8)
        linea_u[linea_u < 0] = 0
        
        chart_data = {
            'linea_a': {
                'll': ll_range.tolist(),
                'ip': linea_a.tolist()
            },
            'linea_u': {
                'll': ll_range.tolist(),
                'ip': linea_u.tolist()
            },
            'regiones': {
                'CL': {'ll_min': 0, 'll_max': 50, 'descripcion': 'Arcillas de baja plasticidad'},
                'ML': {'ll_min': 0, 'll_max': 50, 'descripcion': 'Limos de baja plasticidad'},
                'CH': {'ll_min': 50, 'll_max': 100, 'descripcion': 'Arcillas de alta plasticidad'},
                'MH': {'ll_min': 50, 'll_max': 100, 'descripcion': 'Limos de alta plasticidad'}
            }
        }
        
        return chart_data
    
    def generate_fluidity_curve(self, ll_data):
        """
        Generar datos para curva de fluidez
        """
        
        if not ll_data or len(ll_data) < 2:
            return None
        
        golpes = np.array([point[0] for point in ll_data])
        humedad = np.array([point[1] for point in ll_data])
        
        # Generar curva suavizada
        log_golpes = np.log10(golpes)
        coeffs = np.polyfit(log_golpes, humedad, 1)
        
        # Generar puntos para la curva
        golpes_curve = np.logspace(np.log10(10), np.log10(50), 50)
        humedad_curve = coeffs[0] * np.log10(golpes_curve) + coeffs[1]
        
        return {
            'data_points': {
                'golpes': golpes.tolist(),
                'humedad': humedad.tolist()
            },
            'curve': {
                'golpes': golpes_curve.tolist(),
                'humedad': humedad_curve.tolist()
            },
            'regression': {
                'slope': float(coeffs[0]),
                'intercept': float(coeffs[1])
            },
            'limite_liquido_25': float(coeffs[0] * np.log10(25) + coeffs[1])
        }
