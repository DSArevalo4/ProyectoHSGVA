"""
Procesador de datos general para el sistema
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os


class DataProcessor:
    """Clase para procesamiento general de datos"""
    
    def __init__(self):
        self.projects_data = []
        self.cache = {}
    
    def get_dashboard_kpis(self):
        """Obtener KPIs para el dashboard"""
        
        kpis = {
            'proyectos_activos': {
                'valor': 12,
                'cambio': '+3',
                'porcentaje': '+25%',
                'tendencia': 'up'
            },
            'ensayos_realizados': {
                'valor': 48,
                'cambio': '+8',
                'porcentaje': '+20%',
                'tendencia': 'up'
            },
            'ensayos_completados': {
                'valor': 45,
                'porcentaje': '93.75%',
                'cambio': '45/48',
                'tendencia': 'stable'
            },
            'tiempo_promedio': {
                'valor': '2.5h',
                'cambio': '-0.5h',
                'porcentaje': '-17%',
                'tendencia': 'down'
            }
        }
        
        return kpis
    
    def get_projects_summary(self):
        """Obtener resumen de proyectos"""
        
        # Datos de ejemplo (en producción vendría de base de datos)
        projects = [
            {
                'id': 'P-001',
                'nombre': 'Edificio Central',
                'fecha': '20/11/2025',
                'ensayos': 5,
                'estado': 'completado',
                'progreso': 100
            },
            {
                'id': 'P-002',
                'nombre': 'Puente Norte',
                'fecha': '19/11/2025',
                'ensayos': 4,
                'estado': 'en-proceso',
                'progreso': 75
            },
            {
                'id': 'P-003',
                'nombre': 'Vía Sur',
                'fecha': '18/11/2025',
                'ensayos': 6,
                'estado': 'completado',
                'progreso': 100
            },
            {
                'id': 'P-004',
                'nombre': 'Plaza Comercial',
                'fecha': '17/11/2025',
                'ensayos': 3,
                'estado': 'completado',
                'progreso': 100
            },
            {
                'id': 'P-005',
                'nombre': 'Residencial Este',
                'fecha': '16/11/2025',
                'ensayos': 4,
                'estado': 'en-proceso',
                'progreso': 50
            },
            {
                'id': 'P-006',
                'nombre': 'Torre Empresarial',
                'fecha': '15/11/2025',
                'ensayos': 7,
                'estado': 'completado',
                'progreso': 100
            },
            {
                'id': 'P-007',
                'nombre': 'Centro Comercial',
                'fecha': '14/11/2025',
                'ensayos': 5,
                'estado': 'pendiente',
                'progreso': 0
            }
        ]
        
        return projects
    
    def calculate_moisture_content(self, data):
        """
        Calcular contenido de humedad
        
        Parámetros:
        - peso_recipiente: Peso del recipiente vacío (g)
        - peso_humedo: Peso recipiente + suelo húmedo (g)
        - peso_seco: Peso recipiente + suelo seco (g)
        """
        
        try:
            peso_recipiente = float(data.get('peso_recipiente', 0))
            peso_humedo = float(data.get('peso_humedo', 0))
            peso_seco = float(data.get('peso_seco', 0))
            
            # Validaciones
            if peso_humedo <= peso_recipiente:
                return {'error': 'El peso húmedo debe ser mayor que el peso del recipiente'}
            
            if peso_seco <= peso_recipiente:
                return {'error': 'El peso seco debe ser mayor que el peso del recipiente'}
            
            if peso_seco > peso_humedo:
                return {'error': 'El peso seco debe ser menor que el peso húmedo'}
            
            # Cálculos
            peso_agua = peso_humedo - peso_seco
            peso_suelo_seco = peso_seco - peso_recipiente
            humedad = (peso_agua / peso_suelo_seco) * 100
            
            # Clasificación
            if humedad < 10:
                clasificacion = 'Muy Seco'
            elif humedad < 20:
                clasificacion = 'Seco'
            elif humedad < 30:
                clasificacion = 'Húmedo'
            else:
                clasificacion = 'Muy Húmedo'
            
            return {
                'success': True,
                'humedad': round(humedad, 2),
                'peso_agua': round(peso_agua, 2),
                'peso_suelo_seco': round(peso_suelo_seco, 2),
                'clasificacion': clasificacion,
                'calculos': {
                    'paso1': f'Peso del agua = {peso_humedo:.2f} - {peso_seco:.2f} = {peso_agua:.2f} g',
                    'paso2': f'Peso suelo seco = {peso_seco:.2f} - {peso_recipiente:.2f} = {peso_suelo_seco:.2f} g',
                    'paso3': f'Humedad = ({peso_agua:.2f} / {peso_suelo_seco:.2f}) × 100 = {humedad:.2f}%'
                },
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {'error': f'Error en el cálculo: {str(e)}'}
    
    def calculate_soil_phases(self, data):
        """
        Calcular fases del suelo (relaciones volumétricas y gravimétricas)
        
        Parámetros:
        - peso_total: Peso total del suelo (g)
        - volumen_total: Volumen total (cm³)
        - humedad: Contenido de humedad (%)
        - gravedad_especifica: Gravedad específica de sólidos (Gs)
        """
        
        try:
            Wt = float(data.get('peso_total', 0))
            Vt = float(data.get('volumen_total', 0))
            w = float(data.get('humedad', 0)) / 100  # Convertir a decimal
            Gs = float(data.get('gravedad_especifica', 2.65))  # Valor típico
            
            if Wt <= 0 or Vt <= 0:
                return {'error': 'Los valores deben ser mayores a cero'}
            
            # Cálculos de pesos
            Ws = Wt / (1 + w)  # Peso de sólidos
            Ww = Wt - Ws  # Peso del agua
            
            # Cálculos de volúmenes
            gamma_w = 1.0  # Densidad del agua (g/cm³)
            Vs = Ws / (Gs * gamma_w)  # Volumen de sólidos
            Vw = Ww / gamma_w  # Volumen de agua
            Vv = Vt - Vs  # Volumen de vacíos
            Va = Vv - Vw  # Volumen de aire
            
            # Relaciones volumétricas
            e = Vv / Vs  # Relación de vacíos
            n = Vv / Vt * 100  # Porosidad (%)
            S = Vw / Vv * 100  # Grado de saturación (%)
            
            # Relaciones gravimétricas
            gamma = Wt / Vt  # Densidad total (g/cm³)
            gamma_d = Ws / Vt  # Densidad seca (g/cm³)
            gamma_sat = (Ws + Vv * gamma_w) / Vt  # Densidad saturada (g/cm³)
            
            return {
                'success': True,
                'pesos': {
                    'total': round(Wt, 2),
                    'solidos': round(Ws, 2),
                    'agua': round(Ww, 2)
                },
                'volumenes': {
                    'total': round(Vt, 2),
                    'solidos': round(Vs, 2),
                    'vacios': round(Vv, 2),
                    'agua': round(Vw, 2),
                    'aire': round(Va, 2)
                },
                'relaciones_volumetricas': {
                    'relacion_vacios': round(e, 3),
                    'porosidad': round(n, 2),
                    'saturacion': round(S, 2)
                },
                'densidades': {
                    'total': round(gamma, 3),
                    'seca': round(gamma_d, 3),
                    'saturada': round(gamma_sat, 3)
                },
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {'error': f'Error en el cálculo: {str(e)}'}
    
    def export_to_excel(self, data):
        """Exportar datos a Excel"""
        
        try:
            # Crear DataFrame
            df = pd.DataFrame(data.get('samples', []))
            
            # Nombre de archivo
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'export_{timestamp}.xlsx'
            filepath = os.path.join('exports', filename)
            
            # Crear directorio si no existe
            os.makedirs('exports', exist_ok=True)
            
            # Guardar Excel
            df.to_excel(filepath, index=False, sheet_name='Datos')
            
            return filepath
            
        except Exception as e:
            raise Exception(f'Error al exportar a Excel: {str(e)}')
    
    def export_to_pdf(self, data):
        """Exportar informe a PDF"""
        
        # Implementación futura con reportlab o similar
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'informe_{timestamp}.pdf'
            filepath = os.path.join('exports', filename)
            
            # Por ahora retornar path de ejemplo
            return filepath
            
        except Exception as e:
            raise Exception(f'Error al exportar a PDF: {str(e)}')
