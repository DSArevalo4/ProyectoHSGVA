"""
Procesador de cálculos de Contenido de Humedad
"""


class HumedadProcessor:
    def calcular_humedad(self, peso_recipiente, peso_humedo, peso_seco):
        """
        Calcular contenido de humedad según ASTM D2216
        
        Args:
            peso_recipiente: Peso del recipiente vacío (g)
            peso_humedo: Peso del recipiente + suelo húmedo (g)
            peso_seco: Peso del recipiente + suelo seco (g)
            
        Returns:
            dict: Resultados del cálculo
        """
        # Validaciones
        if peso_humedo <= peso_recipiente:
            raise ValueError("El peso húmedo debe ser mayor que el peso del recipiente")
        
        if peso_seco <= peso_recipiente:
            raise ValueError("El peso seco debe ser mayor que el peso del recipiente")
        
        if peso_seco > peso_humedo:
            raise ValueError("El peso seco debe ser menor que el peso húmedo")
        
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
            'humedad': round(humedad, 2),
            'peso_agua': round(peso_agua, 2),
            'peso_suelo_seco': round(peso_suelo_seco, 2),
            'clasificacion': clasificacion,
            'calculos': {
                'paso1': f"Peso del Agua = {peso_humedo:.2f} - {peso_seco:.2f} = {peso_agua:.2f} g",
                'paso2': f"Peso Suelo Seco = {peso_seco:.2f} - {peso_recipiente:.2f} = {peso_suelo_seco:.2f} g",
                'paso3': f"Humedad = ({peso_agua:.2f} / {peso_suelo_seco:.2f}) × 100 = {humedad:.2f} %"
            }
        }
