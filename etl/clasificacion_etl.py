"""
ETL para procesamiento de datos de Clasificación de Suelos
"""

import pandas as pd
import numpy as np
from datetime import datetime
import os


class ClasificacionETL:
    """Clase para procesar datos de clasificación de suelos"""
    
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
            print(f"Error al extraer datos de clasificación: {e}")
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
    
    def classify_sucs(self, data):
        """
        Clasificar suelo según sistema SUCS
        (Unified Soil Classification System)
        """
        
        # Extraer datos necesarios
        finos = data.get('finos', 0)  # % pasa tamiz #200
        ll = data.get('limite_liquido', 0)
        ip = data.get('indice_plasticidad', 0)
        cu = data.get('coef_uniformidad', 0)
        cc = data.get('coef_curvatura', 0)
        
        clasificacion = ''
        descripcion = ''
        
        # Clasificación basada en % de finos
        if finos < 5:
            # Suelos gruesos sin finos
            if data.get('grava', 0) > data.get('arena', 0):
                # Gravas
                if cu >= 4 and 1 <= cc <= 3:
                    clasificacion = 'GW'
                    descripcion = 'Grava bien gradada'
                else:
                    clasificacion = 'GP'
                    descripcion = 'Grava mal gradada'
            else:
                # Arenas
                if cu >= 6 and 1 <= cc <= 3:
                    clasificacion = 'SW'
                    descripcion = 'Arena bien gradada'
                else:
                    clasificacion = 'SP'
                    descripcion = 'Arena mal gradada'
        
        elif 5 <= finos <= 12:
            # Clasificación dual requerida
            clasificacion = 'Clasificación dual requerida'
            descripcion = 'Entre 5% y 12% de finos'
        
        else:  # finos > 12
            # Suelos gruesos con finos
            if data.get('grava', 0) > data.get('arena', 0):
                # Gravas con finos
                if ip > 7 and self._above_a_line(ll, ip):
                    clasificacion = 'GC'
                    descripcion = 'Grava arcillosa'
                else:
                    clasificacion = 'GM'
                    descripcion = 'Grava limosa'
            else:
                # Arenas con finos
                if ip > 7 and self._above_a_line(ll, ip):
                    clasificacion = 'SC'
                    descripcion = 'Arena arcillosa'
                else:
                    clasificacion = 'SM'
                    descripcion = 'Arena limosa'
        
        # Si más del 50% pasa #200, es suelo fino
        if finos > 50:
            if ll < 50:
                # Baja compresibilidad
                if ip > 7 and self._above_a_line(ll, ip):
                    clasificacion = 'CL'
                    descripcion = 'Arcilla de baja plasticidad'
                elif ip < 4:
                    clasificacion = 'ML'
                    descripcion = 'Limo de baja plasticidad'
                else:
                    clasificacion = 'ML-CL'
                    descripcion = 'Limo arcilloso de baja plasticidad'
            else:
                # Alta compresibilidad
                if self._above_a_line(ll, ip):
                    clasificacion = 'CH'
                    descripcion = 'Arcilla de alta plasticidad'
                else:
                    clasificacion = 'MH'
                    descripcion = 'Limo de alta plasticidad'
        
        return {
            'sistema': 'SUCS',
            'clasificacion': clasificacion,
            'descripcion': descripcion,
            'criterios': {
                'finos': finos,
                'limite_liquido': ll,
                'indice_plasticidad': ip
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def _above_a_line(self, ll, ip):
        """Verificar si está sobre la línea A en carta de plasticidad"""
        # Línea A: IP = 0.73(LL - 20)
        ip_line_a = 0.73 * (ll - 20)
        return ip > ip_line_a
    
    def classify_aashto(self, data):
        """
        Clasificar suelo según sistema AASHTO
        """
        
        finos = data.get('finos', 0)  # % pasa #200
        ll = data.get('limite_liquido', 0)
        ip = data.get('indice_plasticidad', 0)
        
        clasificacion = ''
        descripcion = ''
        
        # Calcular Índice de Grupo
        ig = self._calculate_group_index(finos, ll, ip)
        
        if finos <= 35:
            # Materiales granulares
            if finos <= 15:
                if ll == 0 and ip == 0:
                    clasificacion = 'A-1-a'
                    descripcion = 'Fragmento de piedra, grava y arena'
                else:
                    clasificacion = 'A-1-b'
                    descripcion = 'Grava y arena'
            elif finos <= 25:
                clasificacion = 'A-2-4' if ll <= 40 else 'A-2-6'
                descripcion = 'Grava y arena limosa o arcillosa'
            else:
                clasificacion = 'A-3'
                descripcion = 'Arena fina'
        else:
            # Materiales limo-arcillosos
            if ll <= 40:
                if ip <= 10:
                    clasificacion = 'A-4'
                    descripcion = 'Suelos limosos'
                else:
                    clasificacion = 'A-5'
                    descripcion = 'Suelos limosos'
            else:
                if ip <= 10:
                    clasificacion = 'A-6'
                    descripcion = 'Suelos arcillosos'
                else:
                    clasificacion = 'A-7-5' if ip <= (ll - 30) else 'A-7-6'
                    descripcion = 'Suelos arcillosos'
        
        return {
            'sistema': 'AASHTO',
            'clasificacion': f'{clasificacion} ({ig})',
            'descripcion': descripcion,
            'indice_grupo': ig,
            'criterios': {
                'finos': finos,
                'limite_liquido': ll,
                'indice_plasticidad': ip
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_group_index(self, f, ll, ip):
        """Calcular índice de grupo (IG)"""
        # IG = (F-35)[0.2+0.005(LL-40)] + 0.01(F-15)(IP-10)
        
        if f <= 35:
            return 0
        
        term1 = (f - 35) * (0.2 + 0.005 * (ll - 40)) if ll > 40 else 0
        term2 = 0.01 * (f - 15) * (ip - 10) if f > 15 and ip > 10 else 0
        
        ig = term1 + term2
        
        # Redondear y limitar entre 0 y 20
        ig = max(0, min(20, round(ig)))
        
        return int(ig)
