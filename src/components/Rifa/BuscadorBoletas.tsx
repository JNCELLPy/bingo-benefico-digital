
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, QrCode, Ticket } from 'lucide-react';

interface Boleta {
  id: string;
  numero: number;
  qrCode: string;
  rifaId: string;
  rifaNombre: string;
  comprador: string;
  fechaCompra: string;
  estado: 'pagado' | 'reservado' | 'ganador';
  precio: number;
}

const BuscadorBoletas: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [boletaEncontrada, setBoletaEncontrada] = useState<Boleta | null>(null);
  const [buscando, setBuscando] = useState(false);

  // Datos de ejemplo
  const boletas: Boleta[] = [
    {
      id: '1',
      numero: 25,
      qrCode: 'QR123456',
      rifaId: '1',
      rifaNombre: 'Rifa del Día de la Madre',
      comprador: 'Juan Pérez',
      fechaCompra: '2024-01-15',
      estado: 'pagado',
      precio: 10000
    },
    {
      id: '2',
      numero: 50,
      qrCode: 'QR789012',
      rifaId: '1',
      rifaNombre: 'Rifa del Día de la Madre',
      comprador: 'María González',
      fechaCompra: '2024-01-14',
      estado: 'pagado',
      precio: 10000
    }
  ];

  const buscarBoleta = () => {
    setBuscando(true);
    
    // Simular búsqueda
    setTimeout(() => {
      const encontrada = boletas.find(
        b => b.numero.toString() === busqueda || 
             b.qrCode.toLowerCase().includes(busqueda.toLowerCase())
      );
      
      setBoletaEncontrada(encontrada || null);
      setBuscando(false);
    }, 1000);
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
        <CardTitle className="flex items-center">
          <Search className="mr-2 h-5 w-5" />
          Buscador de Boletas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Ingresa número de boleta o código QR"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && buscarBoleta()}
          />
          <Button onClick={buscarBoleta} disabled={!busqueda || buscando}>
            {buscando ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>

        <div className="flex space-x-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Ticket className="mr-1 h-4 w-4" />
            <span>Por número</span>
          </div>
          <div className="flex items-center">
            <QrCode className="mr-1 h-4 w-4" />
            <span>Por código QR</span>
          </div>
        </div>

        {boletaEncontrada && (
          <div className="mt-4 p-4 border rounded-lg bg-green-50">
            <h3 className="font-semibold text-lg mb-2">Boleta Encontrada</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Número:</strong> {boletaEncontrada.numero}</p>
                <p><strong>Rifa:</strong> {boletaEncontrada.rifaNombre}</p>
                <p><strong>Comprador:</strong> {boletaEncontrada.comprador}</p>
              </div>
              <div>
                <p><strong>Código QR:</strong> {boletaEncontrada.qrCode}</p>
                <p><strong>Fecha:</strong> {boletaEncontrada.fechaCompra}</p>
                <p><strong>Precio:</strong> {formatearMoneda(boletaEncontrada.precio)}</p>
              </div>
            </div>
            <div className="mt-2">
              <Badge className={
                boletaEncontrada.estado === 'pagado' ? 'bg-green-500' :
                boletaEncontrada.estado === 'reservado' ? 'bg-yellow-500' :
                'bg-gold-500'
              }>
                {boletaEncontrada.estado.toUpperCase()}
              </Badge>
            </div>
          </div>
        )}

        {busqueda && !boletaEncontrada && !buscando && (
          <div className="mt-4 p-4 border rounded-lg bg-red-50">
            <p className="text-red-600">No se encontró ninguna boleta con ese criterio.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuscadorBoletas;
