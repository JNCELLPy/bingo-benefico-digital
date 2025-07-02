
import React from 'react';
import { Carton } from '@/types/bingo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartonBingoProps {
  carton: Carton;
  numerosLlamados?: number[];
  tamaño?: 'pequeño' | 'mediano' | 'grande';
  mostrarControles?: boolean;
}

const CartonBingo: React.FC<CartonBingoProps> = ({ 
  carton, 
  numerosLlamados = [], 
  tamaño = 'mediano',
  mostrarControles = false 
}) => {
  const estaLlamado = (numero: number) => numerosLlamados.includes(numero);
  
  const obtenerTamañoCelda = () => {
    switch (tamaño) {
      case 'pequeño': return 'w-8 h-8 text-xs';
      case 'grande': return 'w-16 h-16 text-xl';
      default: return 'w-12 h-12 text-sm';
    }
  };

  const verificarLinea = () => {
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
    
    return false;
  };

  const verificarBingoCompleto = () => {
    return carton.numeros.every(fila => 
      fila.every(num => numerosLlamados.includes(num))
    );
  };

  const tieneLinea = verificarLinea();
  const tieneBingo = verificarBingoCompleto();

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return (
    <Card className={`transition-all duration-300 ${tieneBingo ? 'ring-4 ring-green-500 bg-green-50' : tieneLinea ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Cartón #{carton.id.slice(-6)}</CardTitle>
          <div className="flex space-x-2">
            <Badge variant={carton.tipo === 'digital' ? 'default' : 'secondary'}>
              {carton.tipo === 'digital' ? 'Digital' : 'Físico'}
            </Badge>
            {tieneBingo && <Badge className="bg-green-500">¡BINGO!</Badge>}
            {tieneLinea && !tieneBingo && <Badge className="bg-yellow-500">¡LÍNEA!</Badge>}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Precio: {formatearPrecio(carton.precio)}
        </p>
      </CardHeader>
      
      <CardContent>
        {/* Encabezados B-I-N-G-O */}
        <div className="grid grid-cols-5 gap-1 mb-2">
          {['B', 'I', 'N', 'G', 'O'].map((letra, index) => (
            <div key={letra} className="text-center font-bold text-lg text-blue-600 py-2">
              {letra}
            </div>
          ))}
        </div>
        
        {/* Números del cartón */}
        <div className="grid grid-cols-5 gap-1">
          {carton.numeros.map((fila, filaIndex) =>
            fila.map((numero, colIndex) => (
              <div
                key={`${filaIndex}-${colIndex}`}
                className={`
                  ${obtenerTamañoCelda()}
                  border-2 rounded-lg flex items-center justify-center font-bold
                  transition-all duration-300
                  ${estaLlamado(numero) 
                    ? 'bg-blue-500 text-white border-blue-600 scale-110' 
                    : 'bg-white border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                {colIndex === 2 && filaIndex === 2 ? (
                  <span className="text-xl">★</span>
                ) : (
                  numero
                )}
              </div>
            ))
          )}
        </div>

        {mostrarControles && (
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm">
              <QrCode className="mr-2 h-4 w-4" />
              Ver QR
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartonBingo;
