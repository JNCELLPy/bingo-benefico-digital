
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shuffle, ShoppingCart, Trash2 } from 'lucide-react';

interface SelectorAleatorioProps {
  numerosDisponibles: number[];
  precioNumero: number;
  onSeleccionConfirmada: (numeros: number[]) => void;
}

const SelectorAleatorio: React.FC<SelectorAleatorioProps> = ({
  numerosDisponibles,
  precioNumero,
  onSeleccionConfirmada
}) => {
  const [cantidad, setCantidad] = useState(1);
  const [numerosSeleccionados, setNumerosSeleccionados] = useState<number[]>([]);

  const seleccionarAleatorio = () => {
    if (cantidad > numerosDisponibles.length) {
      alert('No hay suficientes números disponibles');
      return;
    }

    const numerosDisponiblesCopia = [...numerosDisponibles];
    const seleccionados: number[] = [];

    for (let i = 0; i < cantidad; i++) {
      const indiceAleatorio = Math.floor(Math.random() * numerosDisponiblesCopia.length);
      const numeroSeleccionado = numerosDisponiblesCopia[indiceAleatorio];
      seleccionados.push(numeroSeleccionado);
      numerosDisponiblesCopia.splice(indiceAleatorio, 1);
    }

    setNumerosSeleccionados(seleccionados.sort((a, b) => a - b));
  };

  const eliminarNumero = (numero: number) => {
    setNumerosSeleccionados(numerosSeleccionados.filter(n => n !== numero));
  };

  const confirmarCompra = () => {
    if (numerosSeleccionados.length === 0) {
      alert('Selecciona al menos un número');
      return;
    }
    onSeleccionConfirmada(numerosSeleccionados);
    setNumerosSeleccionados([]);
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const total = numerosSeleccionados.length * precioNumero;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shuffle className="mr-2 h-5 w-5" />
          Selector Aleatorio de Números
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cantidad">Cantidad de números</Label>
            <Input
              id="cantidad"
              type="number"
              min="1"
              max={numerosDisponibles.length}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={seleccionarAleatorio} className="w-full">
              <Shuffle className="mr-2 h-4 w-4" />
              Seleccionar
            </Button>
          </div>
        </div>

        {numerosSeleccionados.length > 0 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Números Seleccionados:</h3>
              <div className="flex flex-wrap gap-2">
                {numerosSeleccionados.map(numero => (
                  <Badge 
                    key={numero} 
                    className="bg-blue-500 text-white px-3 py-1 cursor-pointer hover:bg-red-500 transition-colors"
                    onClick={() => eliminarNumero(numero)}
                  >
                    {numero} 
                    <Trash2 className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {numerosSeleccionados.length} números × {formatearMoneda(precioNumero)}
                  </p>
                  <p className="text-lg font-bold">
                    Total: {formatearMoneda(total)}
                  </p>
                </div>
                <Button onClick={confirmarCompra} size="lg" className="bg-green-500 hover:bg-green-600">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Comprar
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p>Números disponibles: {numerosDisponibles.length}</p>
          <p>Precio por número: {formatearMoneda(precioNumero)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectorAleatorio;
