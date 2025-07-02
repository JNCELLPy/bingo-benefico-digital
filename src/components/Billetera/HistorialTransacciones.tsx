
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  History,
  Plus, 
  Minus, 
  CreditCard, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Transaccion } from '@/types/bingo';

interface HistorialTransaccionesProps {
  transacciones: Transaccion[];
  formatearMoneda: (valor: number) => string;
}

const HistorialTransacciones: React.FC<HistorialTransaccionesProps> = ({
  transacciones,
  formatearMoneda
}) => {
  const obtenerIconoTransaccion = (tipo: string) => {
    switch (tipo) {
      case 'recarga': return <Plus className="h-4 w-4 text-green-600" />;
      case 'retiro': return <Minus className="h-4 w-4 text-red-600" />;
      case 'compra_carton': return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'premio': return <CheckCircle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="mr-2 h-5 w-5" />
          Historial de Transacciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transacciones.map((transaccion) => (
            <div key={transaccion.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {obtenerIconoTransaccion(transaccion.tipo)}
                <div>
                  <p className="font-medium">{transaccion.descripcion}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaccion.fecha).toLocaleDateString('es-PY')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaccion.monto > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaccion.monto > 0 ? '+' : ''}{formatearMoneda(Math.abs(transaccion.monto))}
                </p>
                <Badge variant={transaccion.estado === 'completada' ? 'default' : 'secondary'}>
                  {transaccion.estado}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistorialTransacciones;
