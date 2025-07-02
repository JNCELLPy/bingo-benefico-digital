
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TableroBingoProps {
  numerosLlamados: number[];
  ultimoNumero?: number;
}

const TableroBingo: React.FC<TableroBingoProps> = ({ 
  numerosLlamados, 
  ultimoNumero 
}) => {
  const columnas = [
    { letra: 'B', rango: [1, 15], color: 'bg-red-500' },
    { letra: 'I', rango: [16, 30], color: 'bg-blue-500' },
    { letra: 'N', rango: [31, 45], color: 'bg-green-500' },
    { letra: 'G', rango: [46, 60], color: 'bg-yellow-500' },
    { letra: 'O', rango: [61, 75], color: 'bg-purple-500' }
  ];

  const obtenerNumerosPorColumna = (min: number, max: number) => {
    return Array.from({ length: max - min + 1 }, (_, i) => i + min);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Tablero de Bingo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          {columnas.map((columna) => (
            <div key={columna.letra} className="space-y-2">
              {/* Encabezado de columna */}
              <div className={`
                ${columna.color} text-white text-center py-2 rounded-t-lg font-bold text-lg
              `}>
                {columna.letra}
              </div>
              
              {/* Números de la columna */}
              <div className="space-y-1">
                {obtenerNumerosPorColumna(columna.rango[0], columna.rango[1]).map(numero => (
                  <div
                    key={numero}
                    className={`
                      w-full h-8 rounded flex items-center justify-center text-sm font-semibold
                      ${numerosLlamados.includes(numero)
                        ? `${columna.color} text-white`
                        : 'bg-gray-200 text-gray-600'
                      }
                      ${numero === ultimoNumero ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
                    `}
                  >
                    {numero}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TableroBingo;
