
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Gift } from 'lucide-react';

interface PremioGanado {
  id: string;
  rifaNombre: string;
  numeroGanador: number;
  premioNombre: string;
  premioValor: number;
  ganador: string;
  fechaSorteo: string;
}

const HistorialPremios: React.FC = () => {
  const premiosGanados: PremioGanado[] = [
    {
      id: '1',
      rifaNombre: 'Rifa Navideña 2023',
      numeroGanador: 45,
      premioNombre: 'Televisor Smart 55"',
      premioValor: 2500000,
      ganador: 'María González',
      fechaSorteo: '2023-12-24'
    },
    {
      id: '2',
      rifaNombre: 'Rifa de Año Nuevo',
      numeroGanador: 12,
      premioNombre: 'Motocicleta',
      premioValor: 8000000,
      ganador: 'Carlos Rodríguez',
      fechaSorteo: '2023-12-31'
    },
    {
      id: '3',
      rifaNombre: 'Rifa del Día de la Madre',
      numeroGanador: 78,
      premioNombre: 'Spa Completo',
      premioValor: 500000,
      ganador: 'Ana Martínez',
      fechaSorteo: '2024-05-10'
    }
  ];

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5" />
          Historial de Premios Sorteados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {premiosGanados.map((premio) => (
            <div key={premio.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{premio.rifaNombre}</h3>
                  <p className="text-muted-foreground">{premio.premioNombre}</p>
                </div>
                <Badge className="bg-yellow-500 text-white">
                  Número {premio.numeroGanador}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    <strong>Valor:</strong> {formatearMoneda(premio.premioValor)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    <strong>Ganador:</strong> {premio.ganador}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">
                    <strong>Fecha:</strong> {formatearFecha(premio.fechaSorteo)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {premiosGanados.length === 0 && (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay premios sorteados aún</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistorialPremios;
