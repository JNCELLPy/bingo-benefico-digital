
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Carton } from '@/types/bingo';
import { generarCartonBingo } from '@/utils/cartonGenerator';

interface CrearCartonProps {
  sorteoId: string;
  precio: number;
  onCartonCreado: (carton: Omit<Carton, 'id'>) => void;
}

const CrearCarton: React.FC<CrearCartonProps> = ({ sorteoId, precio, onCartonCreado }) => {
  const [cantidad, setCantidad] = useState(1);
  const [tipo, setTipo] = useState<'digital' | 'fisico'>('digital');
  const [generando, setGenerando] = useState(false);

  const generarCartones = async () => {
    setGenerando(true);
    
    try {
      for (let i = 0; i < cantidad; i++) {
        const numeros = generarCartonBingo();
        
        const nuevoCarton: Omit<Carton, 'id'> = {
          numeros,
          jugadorId: 'usuario-actual', // Esto debería venir del contexto de autenticación
          sorteoId,
          precio,
          fechaCompra: new Date().toISOString(),
          estado: 'activo',
          qrCode: `QR-${Date.now()}-${i}`,
          tipo
        };
        
        onCartonCreado(nuevoCarton);
      }
      
      // Resetear formulario
      setCantidad(1);
      setTipo('digital');
      
    } catch (error) {
      console.error('Error generando cartones:', error);
    } finally {
      setGenerando(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generar Cartones de Bingo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="cantidad">Cantidad de Cartones</Label>
            <Input
              id="cantidad"
              type="number"
              min="1"
              max="50"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="tipo">Tipo de Cartón</Label>
            <Select value={tipo} onValueChange={(value: 'digital' | 'fisico') => setTipo(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital">Digital</SelectItem>
                <SelectItem value="fisico">Físico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Precio Total</Label>
            <div className="text-2xl font-bold text-green-600">
              {formatearMoneda(precio * cantidad)}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Resumen:</h4>
          <ul className="text-sm space-y-1">
            <li>• {cantidad} cartón{cantidad > 1 ? 'es' : ''} de tipo {tipo}</li>
            <li>• Precio por cartón: {formatearMoneda(precio)}</li>
            <li>• Total a pagar: {formatearMoneda(precio * cantidad)}</li>
            <li>• Los cartones se generan automáticamente con números aleatorios</li>
          </ul>
        </div>
        
        <Button 
          onClick={generarCartones} 
          disabled={generando}
          className="w-full"
          size="lg"
        >
          {generando ? 'Generando...' : `Generar ${cantidad} Cartón${cantidad > 1 ? 'es' : ''}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CrearCarton;
