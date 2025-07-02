
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Calendar, Trophy, ShoppingCart } from 'lucide-react';
import { Rifa } from '@/types/rifa';

interface RifaCardProps {
  rifa: Rifa;
  onComprarNumero: (rifaId: string) => void;
  onVerDetalles: (rifaId: string) => void;
}

const RifaCard: React.FC<RifaCardProps> = ({ rifa, onComprarNumero, onVerDetalles }) => {
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const calcularTiempoRestante = () => {
    const fechaHoraSorteo = new Date(`${rifa.fechaSorteo.split('T')[0]}T${rifa.horaSorteo}`);
    const ahora = new Date();
    const tiempoRestante = fechaHoraSorteo.getTime() - ahora.getTime();
    
    if (tiempoRestante <= 0) return null;
    
    const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
    const horas = Math.floor((tiempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
    
    return { dias, horas, minutos };
  };

  const tiempoRestante = calcularTiempoRestante();
  const porcentajeVendido = (rifa.numerosVendidos.length / rifa.numerosDisponibles.length) * 100;
  
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'programada': return 'bg-blue-500';
      case 'activa': return 'bg-green-500';
      case 'sorteando': return 'bg-yellow-500';
      case 'finalizada': return 'bg-gray-500';
      case 'cancelada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{rifa.nombre}</CardTitle>
          <Badge className={getEstadoColor(rifa.estado)}>
            {rifa.estado.toUpperCase()}
          </Badge>
        </div>
        <p className="text-muted-foreground">{rifa.descripcion}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Información del Sorteo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm">
              {new Date(rifa.fechaSorteo).toLocaleDateString('es-PY')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="text-sm">{rifa.horaSorteo}</span>
          </div>
        </div>

        {/* Tiempo Restante */}
        {tiempoRestante && rifa.estado === 'activa' && (
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-lg">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-1">Tiempo Restante</p>
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{tiempoRestante.dias}</div>
                  <div className="text-xs text-gray-500">Días</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{tiempoRestante.horas}</div>
                  <div className="text-xs text-gray-500">Horas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{tiempoRestante.minutos}</div>
                  <div className="text-xs text-gray-500">Min</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progreso de Venta */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Números Vendidos</span>
            <span>{rifa.numerosVendidos.length} / {rifa.numerosDisponibles.length}</span>
          </div>
          <Progress value={porcentajeVendido} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {porcentajeVendido.toFixed(1)}% vendido
          </p>
        </div>

        {/* Precio */}
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">Precio por número</span>
            <span className="text-lg font-bold text-green-600">
              {formatearMoneda(rifa.precioNumero)}
            </span>
          </div>
        </div>

        {/* Premios */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">Premios</span>
          </div>
          <div className="space-y-1">
            {rifa.premios.slice(0, 2).map((premio, index) => (
              <div key={premio.id} className="flex justify-between text-sm">
                <span>{index + 1}° {premio.nombre}</span>
                <span className="font-semibold">{formatearMoneda(premio.valor)}</span>
              </div>
            ))}
            {rifa.premios.length > 2 && (
              <p className="text-xs text-muted-foreground">
                +{rifa.premios.length - 2} premios más
              </p>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex space-x-2">
          <Button 
            onClick={() => onComprarNumero(rifa.id)}
            disabled={rifa.estado !== 'activa'}
            className="flex-1"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Comprar Número
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onVerDetalles(rifa.id)}
            className="flex-1"
          >
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RifaCard;
