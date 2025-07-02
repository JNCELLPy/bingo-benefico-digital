
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface UltimosNumerosProps {
  numerosLlamados: number[];
  cantidadMostrar?: number;
}

const UltimosNumeros: React.FC<UltimosNumerosProps> = ({ 
  numerosLlamados, 
  cantidadMostrar = 8 
}) => {
  const obtenerLetraBingo = (numero: number): string => {
    if (numero <= 15) return 'B';
    if (numero <= 30) return 'I';
    if (numero <= 45) return 'N';
    if (numero <= 60) return 'G';
    return 'O';
  };

  const ultimosNumeros = numerosLlamados.slice(-cantidadMostrar);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Clock className="mr-2 h-5 w-5" />
          Últimos {cantidadMostrar} Números
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {ultimosNumeros.map((numero, index) => (
            <div
              key={index}
              className={`
                flex items-center justify-center p-2 rounded-lg
                ${index === ultimosNumeros.length - 1 
                  ? 'bg-yellow-500 text-white ring-2 ring-yellow-400' 
                  : 'bg-blue-100 text-blue-800'
                }
              `}
            >
              <div className="text-center">
                <div className="text-xs font-semibold">
                  {obtenerLetraBingo(numero)}
                </div>
                <div className="text-lg font-bold">{numero}</div>
              </div>
            </div>
          ))}
        </div>
        {ultimosNumeros.length === 0 && (
          <p className="text-center text-muted-foreground">
            No hay números cantados aún
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UltimosNumeros;
