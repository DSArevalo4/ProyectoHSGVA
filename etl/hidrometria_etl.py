"""
ETL para procesamiento de datos de Hidrometría
"""

import pandas as pd
import numpy as np
from datetime import datetime
import os


class HidrometriaETL:
    """Clase para procesar datos de ensayo de hidrometría"""
    
    def __init__(self, filepath):
        self.filepath = filepath
        self.data = None
        self.metadata = {}
        
    def extract(self):
        """Extraer datos del archivo Excel"""
        try:
            # Leer todas las hojas del archivo
            excel_file = pd.ExcelFile(self.filepath)
            sheets = {}
            
            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(self.filepath, sheet_name=sheet_name)
                sheets[sheet_name] = df
            
            self.data = sheets
            return True
        except Exception as e:
            print(f"Error al extraer datos de hidrometría: {e}")
            return False
    
    def transform(self):
        """Transformar y limpiar los datos"""
        if not self.data:
            return False
        
        try:
            transformed_data = {}
            
            for sheet_name, df in self.data.items():
                # Limpiar datos
                df_clean = df.dropna(how='all')  # Eliminar filas completamente vacías
                df_clean = df_clean.dropna(axis=1, how='all')  # Eliminar columnas completamente vacías
                
                # Extraer metadatos si están en las primeras filas
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
        
        # Buscar información común en las primeras filas
        for idx in range(min(10, len(df))):
            row = df.iloc[idx]
            row_str = ' '.join([str(x) for x in row if pd.notna(x)])
            
            # Buscar patrones comunes
            if 'proyecto' in row_str.lower():
                metadata['proyecto'] = row_str
            elif 'muestra' in row_str.lower():
                metadata['muestra'] = row_str
            elif 'fecha' in row_str.lower():
                metadata['fecha'] = row_str
        
        return metadata
    
    def load(self):
        """Cargar datos procesados"""
        return self.data
    
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
            # Convertir DataFrame a diccionario
            json_data[sheet_name] = df.to_dict(orient='records')
        
        return json_data
    
    def get_analysis(self):
        """Obtener análisis de los datos de hidrometría"""
        if not self.data:
            self.process()
        
        analysis = {
            'total_sheets': len(self.data) if self.data else 0,
            'summary': {},
            'statistics': {}
        }
        
        if self.data:
            for sheet_name, df in self.data.items():
                analysis['summary'][sheet_name] = {
                    'rows': len(df),
                    'columns': len(df.columns),
                    'column_names': df.columns.tolist()
                }
                
                # Calcular estadísticas básicas para columnas numéricas
                numeric_cols = df.select_dtypes(include=[np.number]).columns
                if len(numeric_cols) > 0:
                    analysis['statistics'][sheet_name] = df[numeric_cols].describe().to_dict()
        
        return analysis
    
    def calculate_grain_size_distribution(self, data):
        """Calcular distribución granulométrica"""
        # Implementar cálculos específicos de hidrometría
        # (se puede expandir según los datos específicos del Excel)
        
        result = {
            'calculated': True,
            'method': 'hidrometria',
            'timestamp': datetime.now().isoformat()
        }
        
        return result
