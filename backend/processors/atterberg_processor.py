"""
Procesador de cálculos de Límites de Atterberg
"""

import numpy as np
from scipy.interpolate import interp1d


class AtterbergProcessor:
    def calcular_limite_liquido(self, datos):
        """
        Calcular límite líquido según ASTM D4318
        
        Args:
            datos: Lista de dict con 'golpes' y 'humedad'
            
        Returns:
            float: Límite líquido interpolado a 25 golpes
        """
        if not datos or len(datos) < 2:
            raise ValueError("Se requieren al menos 2 puntos de datos")
        
        golpes = [d['golpes'] for d in datos]
        humedades = [d['humedad'] for d in datos]
        
        # Verificar que hay datos en ambos lados de 25 golpes
        if max(golpes) < 25 or min(golpes) > 25:
            raise ValueError("Los datos deben incluir puntos antes y después de 25 golpes")
        
        # Interpolación logarítmica
        log_golpes = np.log10(golpes)
        log_25 = np.log10(25)
        
        # Crear función de interpolación
        f = interp1d(log_golpes, humedades, kind='linear', fill_value='extrapolate')
        limite_liquido = float(f(log_25))
        
        return round(limite_liquido, 2)
    
    def calcular_limite_plastico(self, datos):
        """
        Calcular límite plástico (promedio de determinaciones)
        
        Args:
            datos: Lista de valores de humedad
            
        Returns:
            float: Promedio del límite plástico
        """
        if not datos:
            raise ValueError("Se requiere al menos un valor")
        
        humedades = [d if isinstance(d, (int, float)) else d['humedad'] for d in datos]
        limite_plastico = np.mean(humedades)
        
        return round(limite_plastico, 2)
    
    def calcular_indice_plasticidad(self, limite_liquido, limite_plastico):
        """
        Calcular índice de plasticidad
        
        Args:
            limite_liquido: Límite líquido (%)
            limite_plastico: Límite plástico (%)
            
        Returns:
            dict: Índice de plasticidad y clasificación
        """
        if limite_liquido <= limite_plastico:
            return {
                'ip': 0,
                'clasificacion': 'No Plástico',
                'descripcion': 'El suelo no presenta plasticidad'
            }
        
        ip = limite_liquido - limite_plastico
        
        # Clasificación según IP
        if ip == 0:
            clasificacion = 'No Plástico'
            descripcion = 'Sin plasticidad'
        elif ip < 7:
            clasificacion = 'Baja Plasticidad'
            descripcion = 'Plasticidad baja'
        elif ip < 17:
            clasificacion = 'Media Plasticidad'
            descripcion = 'Plasticidad media'
        else:
            clasificacion = 'Alta Plasticidad'
            descripcion = 'Plasticidad alta'
        
        return {
            'ip': round(ip, 2),
            'clasificacion': clasificacion,
            'descripcion': descripcion,
            'formula': f"IP = LL - LP = {limite_liquido:.2f} - {limite_plastico:.2f} = {ip:.2f}"
        }
    
    def generar_curva_fluidez(self, datos):
        """
        Generar puntos para la curva de fluidez
        
        Args:
            datos: Lista de dict con 'golpes' y 'humedad'
            
        Returns:
            dict: Puntos de la curva y límite líquido
        """
        golpes = np.array([d['golpes'] for d in datos])
        humedades = np.array([d['humedad'] for d in datos])
        
        # Generar curva suave
        golpes_curva = np.logspace(np.log10(min(golpes)), np.log10(max(golpes)), 100)
        log_golpes = np.log10(golpes)
        log_golpes_curva = np.log10(golpes_curva)
        
        f = interp1d(log_golpes, humedades, kind='linear', fill_value='extrapolate')
        humedades_curva = f(log_golpes_curva)
        
        # Calcular LL
        limite_liquido = float(f(np.log10(25)))
        
        return {
            'curva': {
                'golpes': golpes_curva.tolist(),
                'humedades': humedades_curva.tolist()
            },
            'datos_originales': {
                'golpes': golpes.tolist(),
                'humedades': humedades.tolist()
            },
            'limite_liquido': round(limite_liquido, 2)
        }
