
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Grid3X3 } from 'lucide-react';
import { Carton } from '@/types/bingo';

interface DetectorGanadoresProps {
  cartones: Carton[];
  numerosLlamados: number[];
}

export interface ResultadoGanador {
  cartonId: string;
  jugadorId: string;
  tipoGanador: 'linea' | 'forma' | 'bingo_completo';
  patron?: string;
}

const DetectorGanadores: React.FC<DetectorGanadoresProps> = ({ cartones, numerosLlamados }) => {
  
  const verificarLinea = (carton: Carton): boolean => {
    // Verificar líneas horizontales
    for (let fila of carton.numeros) {
      if (fila.every(num => numerosLlamados.includes(num))) {
        return true;
      }
    }
    
    // Verificar líneas verticales
    for (let col = 0; col < 5; col++) {
      if (carton.numeros.every(fila => numerosLlamados.includes(fila[col]))) {
        return true;
      }
    }
    
    // Verificar diagonales
    const diagonal1 = [
      carton.numeros[0][0], carton.numeros[1][1], carton.numeros[2][2], 
      carton.numeros[3][3], carton.numeros[4][4]
    ];
    const diagonal2 = [
      carton.numeros[0][4], carton.numeros[1][3], carton.numeros[2][2], 
      carton.numeros[3][1], carton.numeros[4][0]
    ];
    
    return diagonal1.every(num => numerosLlamados.includes(num)) ||
           diagonal2.every(num => numerosLlamados.includes(num));
  };

  const verificarForma = (carton: Carton): string | null => {
    // Verificar X
    const diagonal1 = [
      carton.numeros[0][0], carton.numeros[1][1], carton.numeros[2][2], 
      carton.numeros[3][3], carton.numeros[4][4]
    ];
    const diagonal2 = [
      carton.numeros[0][4], carton.numeros[1][3], carton.numeros[2][2], 
      carton.numeros[3][1], carton.numeros[4][0]
    ];
    
    if (diagonal1.every(num => numerosLlamados.includes(num)) &&
        diagonal2.every(num => numerosLlamados.includes(num))) {
      return 'X';
    }
    
    // Verificar T
    const primeraFila = carton.numeros[0];
    const columnaMedia = carton.numeros.map(fila => fila[2]);
    
    if (primeraFila.every(num => numerosLlamados.includes(num)) &&
        columnaMedia.every(num => numerosLlamados.includes(num))) {
      return 'T';
    }
    
    // Verificar L
    const primeraColumna = carton.numeros.map(fila => fila[0]);
    const ultimaFila = carton.numeros[4];
    
    if (primeraColumna.every(num => numerosLlamados.includes(num)) &&
        ultimaFila.every(num => numerosLlamados.includes(num))) {
      return 'L';
    }
    
    // Verificar U
    const columna1 = carton.numeros.map(fila => fila[0]);
    const columna5 = carton.numeros.map(fila => fila[4]);
    const filaInferior = carton.numeros[4];
    
    if (columna1.every(num => numerosLlamados.includes(num)) &&
        columna5.every(num => numerosLlamados.includes(num)) &&
        filaInferior.every(num => numerosLlamados.includes(num))) {
      return 'U';
    }
    
    return null;
  };

  const verificarBingoCompleto = (carton: Carton): boolean => {
    return carton.numeros.every(fila => 
      fila.every(num => numerosLlamados.includes(num))
    );
  };

  const analizarGanadores = (): ResultadoGanador[] => {
    const ganadores: ResultadoGanador[] = [];
    
    cartones.forEach(carton => {
      // Verificar bingo completo (tiene prioridad)
      if (verificarBingoCompleto(carton)) {
        ganadores.push({
          cartonId: carton.id,
          jugadorId: carton.jugadorId,
          tipoGanador: 'bingo_completo'
        });
        return;
      }
      
      // Verificar formas
      const forma = verificarForma(carton);
      if (forma) {
        ganadores.push({
          cartonId: carton.id,
          jugadorId: carton.jugadorId,
          tipoGanador: 'forma',
          patron: forma
        });
        return;
      }
      
      // Verificar líneas
      if (verificarLinea(carton)) {
        ganadores.push({
          cartonId: carton.id,
          jugadorId: carton.jugadorId,
          tipoGanador: 'linea'
        });
      }
    });
    
    return ganadores;
  };

  const ganadores = analizarGanadores();
  
  const obtenerIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'bingo_completo': return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'forma': return <Star className="h-5 w-5 text-purple-500" />;
      case 'linea': return <Grid3X3 className="h-5 w-5 text-blue-500" />;
      default: return null;
    }
  };

  const obtenerColorBadge = (tipo: string) => {
    switch (tipo) {
      case 'bingo_completo': return 'bg-yellow-500';
      case 'forma': return 'bg-purple-500';
      case 'linea': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5" />
          Detector de Ganadores
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ganadores.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay ganadores detectados aún
          </p>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Badge className="bg-green-500 text-lg px-4 py-2">
                {ganadores.length} Ganador{ganadores.length > 1 ? 'es' : ''} Detectado{ganadores.length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {ganadores.map((ganador, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center space-x-3">
                    {obtenerIconoTipo(ganador.tipoGanador)}
                    <div>
                      <p className="font-semibold">
                        Cartón #{ganador.cartonId.slice(-6)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Jugador: {ganador.jugadorId}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={obtenerColorBadge(ganador.tipoGanador)}>
                      {ganador.tipoGanador.replace('_', ' ').toUpperCase()}
                      {ganador.patron && ` (${ganador.patron})`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Estadísticas */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {ganadores.filter(g => g.tipoGanador === 'linea').length}
            </div>
            <div className="text-sm text-blue-800">Líneas</div>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {ganadores.filter(g => g.tipoGanador === 'forma').length}
            </div>
            <div className="text-sm text-purple-800">Formas</div>
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {ganadores.filter(g => g.tipoGanador === 'bingo_completo').length}
            </div>
            <div className="text-sm text-yellow-800">Bingos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectorGanadores;
