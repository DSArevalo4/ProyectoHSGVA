"""
Procesador de clasificación de suelos (SUCS y AASHTO)
"""


class ClasificacionProcessor:
    def clasificar_sucs(self, porcentaje_grava, porcentaje_arena, porcentaje_finos, 
                        limite_liquido=None, indice_plasticidad=None):
        """
        Clasificar suelo según SUCS (Unified Soil Classification System)
        
        Args:
            porcentaje_grava: % retenido en tamiz #4
            porcentaje_arena: % que pasa #4 y retiene #200
            porcentaje_finos: % que pasa tamiz #200
            limite_liquido: Límite líquido (opcional)
            indice_plasticidad: Índice de plasticidad (opcional)
            
        Returns:
            dict: Clasificación SUCS
        """
        # Validar que sumen 100%
        total = porcentaje_grava + porcentaje_arena + porcentaje_finos
        if abs(total - 100) > 1:
            raise ValueError(f"Los porcentajes deben sumar 100% (actual: {total}%)")
        
        # Determinar tipo principal
        if porcentaje_finos > 50:
            # Suelo fino
            return self._clasificar_fino_sucs(limite_liquido, indice_plasticidad)
        elif porcentaje_grava > porcentaje_arena:
            # Grava
            return self._clasificar_grava_sucs(porcentaje_finos, limite_liquido, indice_plasticidad)
        else:
            # Arena
            return self._clasificar_arena_sucs(porcentaje_finos, limite_liquido, indice_plasticidad)
    
    def _clasificar_fino_sucs(self, ll, ip):
        """Clasificar suelo fino"""
        if ll is None or ip is None:
            return {
                'simbolo': 'M/C',
                'nombre': 'Limo o Arcilla',
                'descripcion': 'Se requieren límites de Atterberg para clasificación precisa'
            }
        
        # Carta de plasticidad
        if ll < 50:
            # Baja compresibilidad
            if ip > 7 and ip > 0.73 * (ll - 20):
                simbolo = 'CL'
                nombre = 'Arcilla de baja plasticidad'
            elif ip < 4:
                simbolo = 'ML-CL'
                nombre = 'Limo-Arcilla'
            else:
                simbolo = 'ML'
                nombre = 'Limo de baja plasticidad'
        else:
            # Alta compresibilidad
            if ip > 0.73 * (ll - 20):
                simbolo = 'CH'
                nombre = 'Arcilla de alta plasticidad'
            else:
                simbolo = 'MH'
                nombre = 'Limo de alta plasticidad'
        
        return {
            'simbolo': simbolo,
            'nombre': nombre,
            'descripcion': f'LL={ll}%, IP={ip}%',
            'tipo': 'Suelo Fino'
        }
    
    def _clasificar_grava_sucs(self, finos, ll, ip):
        """Clasificar grava"""
        if finos < 5:
            simbolo = 'GW/GP'
            nombre = 'Grava bien/mal graduada'
            descripcion = 'Se requiere análisis granulométrico completo'
        elif finos > 12:
            if ip is not None and ip > 7:
                simbolo = 'GC'
                nombre = 'Grava arcillosa'
            else:
                simbolo = 'GM'
                nombre = 'Grava limosa'
            descripcion = f'{finos}% finos'
        else:
            simbolo = 'GW-GM/GC'
            nombre = 'Grava con finos'
            descripcion = f'{finos}% finos (caso borde)'
        
        return {
            'simbolo': simbolo,
            'nombre': nombre,
            'descripcion': descripcion,
            'tipo': 'Grava'
        }
    
    def _clasificar_arena_sucs(self, finos, ll, ip):
        """Clasificar arena"""
        if finos < 5:
            simbolo = 'SW/SP'
            nombre = 'Arena bien/mal graduada'
            descripcion = 'Se requiere análisis granulométrico completo'
        elif finos > 12:
            if ip is not None and ip > 7:
                simbolo = 'SC'
                nombre = 'Arena arcillosa'
            else:
                simbolo = 'SM'
                nombre = 'Arena limosa'
            descripcion = f'{finos}% finos'
        else:
            simbolo = 'SW-SM/SC'
            nombre = 'Arena con finos'
            descripcion = f'{finos}% finos (caso borde)'
        
        return {
            'simbolo': simbolo,
            'nombre': nombre,
            'descripcion': descripcion,
            'tipo': 'Arena'
        }
    
    def clasificar_aashto(self, porcentaje_pasa_200, limite_liquido, indice_plasticidad):
        """
        Clasificar suelo según AASHTO
        
        Args:
            porcentaje_pasa_200: % que pasa tamiz #200
            limite_liquido: Límite líquido
            indice_plasticidad: Índice de plasticidad
            
        Returns:
            dict: Clasificación AASHTO
        """
        F = porcentaje_pasa_200
        LL = limite_liquido
        IP = indice_plasticidad
        
        # Calcular índice de grupo
        if F <= 35:
            IG = 0
        else:
            a = max(0, F - 35)
            b = max(0, F - 15)
            c = max(0, LL - 40)
            d = max(0, IP - 10)
            
            IG = (a * 0.2) + (0.005 * a * c) + (0.01 * b * d)
            IG = max(0, min(20, round(IG)))
        
        # Determinar grupo
        if F <= 35:
            # Materiales granulares
            if F <= 15 and IP <= 6:
                grupo = 'A-1-a'
                descripcion = 'Fragmentos de roca, grava y arena'
            elif F <= 25 and IP <= 6:
                grupo = 'A-1-b'
                descripcion = 'Grava y arena'
            elif F <= 10 and IP == 0:
                grupo = 'A-3'
                descripcion = 'Arena fina'
            else:
                if IP <= 10:
                    grupo = 'A-2-4'
                    descripcion = 'Grava y arena limosa o arcillosa'
                else:
                    grupo = 'A-2-7'
                    descripcion = 'Grava y arena arcillosa'
        else:
            # Materiales limo-arcillosos
            if LL <= 40:
                if IP <= 10:
                    grupo = 'A-4'
                    descripcion = 'Suelos limosos'
                else:
                    grupo = 'A-6'
                    descripcion = 'Suelos arcillosos'
            else:
                if IP <= 10:
                    grupo = 'A-5'
                    descripcion = 'Suelos limosos elásticos'
                else:
                    grupo = 'A-7-5' if IP <= (LL - 30) else 'A-7-6'
                    descripcion = 'Suelos arcillosos elásticos'
        
        # Calificación
        if IG == 0:
            calificacion = 'Excelente a Bueno'
        elif IG <= 4:
            calificacion = 'Bueno a Regular'
        elif IG <= 8:
            calificacion = 'Regular a Malo'
        else:
            calificacion = 'Malo'
        
        return {
            'grupo': f"{grupo} ({int(IG)})" if IG > 0 else grupo,
            'indice_grupo': int(IG),
            'descripcion': descripcion,
            'calificacion': calificacion,
            'uso_sugerido': self._uso_aashto(grupo, IG)
        }
    
    def _uso_aashto(self, grupo, ig):
        """Determinar uso sugerido según AASHTO"""
        if grupo.startswith('A-1') or grupo == 'A-3':
            return 'Excelente para subrasante y base'
        elif grupo.startswith('A-2'):
            return 'Bueno para subrasante, regular para base'
        elif grupo.startswith('A-4') or grupo.startswith('A-5'):
            return 'Regular para subrasante'
        else:
            return 'No recomendado para vías, requiere estabilización'
