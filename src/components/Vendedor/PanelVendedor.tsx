
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Ticket, 
  Percent, 
  AlertTriangle,
  Eye,
  X
} from 'lucide-react';

interface VentaItem {
  id: string;
  tipo: 'bingo' | 'rifa';
  numeroCarton: string;
  precio: number;
  fechaVenta: string;
  estado: 'confirmado' | 'pendiente' | 'anulado';
  comision: number;
}

const PanelVendedor: React.FC = () => {
  const [ventas] = useState<VentaItem[]>([
    {
      id: '1',
      tipo: 'bingo',
      numeroCarton: 'B-001234',
      precio: 15000,
      fechaVenta: '2024-01-15',
      estado: 'confirmado',
      comision: 600
    },
    {
      id: '2',
      tipo: 'rifa',
      numeroCarton: 'R-567890',
      precio: 10000,
      fechaVenta: '2024-01-15',
      estado: 'confirmado',
      comision: 400
    }
  ]);

  const [solicitandoAnulacion, setSolicitandoAnulacion] = useState<string | null>(null);

  const totalVentas = ventas.filter(v => v.estado === 'confirmado').length;
  const montoTotal = ventas
    .filter(v => v.estado === 'confirmado')
    .reduce((sum, v) => sum + v.precio, 0);
  const comisionTotal = ventas
    .filter(v => v.estado === 'confirmado')
    .reduce((sum, v) => sum + v.comision, 0);

  const solicitarAnulacion = (ventaId: string) => {
    setSolicitandoAnulacion(ventaId);
    // Aquí se enviaría la notificación al super admin
    console.log('Solicitud de anulación enviada al super admin para venta:', ventaId);
    alert('Solicitud de anulación enviada al super administrador');
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel de Vendedor</h1>
      
      {/* Resumen de Ventas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Boletas Vendidas</p>
                <p className="text-2xl font-bold">{totalVentas}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monto Total</p>
                <p className="text-2xl font-bold">{formatearMoneda(montoTotal)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Comisiones (4%)</p>
                <p className="text-2xl font-bold">{formatearMoneda(comisionTotal)}</p>
              </div>
              <Percent className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles de Ventas */}
      <Tabs defaultValue="ventas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ventas">Mis Ventas</TabsTrigger>
          <TabsTrigger value="comisiones">Comisiones</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ventas.map((venta) => (
                  <div key={venta.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold">{venta.numeroCarton}</p>
                        <p className="text-sm text-muted-foreground">
                          {venta.tipo.toUpperCase()} - {venta.fechaVenta}
                        </p>
                      </div>
                      <Badge className={
                        venta.estado === 'confirmado' ? 'bg-green-500' :
                        venta.estado === 'pendiente' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }>
                        {venta.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">{formatearMoneda(venta.precio)}</p>
                        <p className="text-sm text-green-600">
                          Comisión: {formatearMoneda(venta.comision)}
                        </p>
                      </div>
                      {venta.estado === 'confirmado' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => solicitarAnulacion(venta.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Anular
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comisiones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desglose de Comisiones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span>Comisión por Bingo (4%)</span>
                  <span className="font-semibold">
                    {formatearMoneda(
                      ventas
                        .filter(v => v.tipo === 'bingo' && v.estado === 'confirmado')
                        .reduce((sum, v) => sum + v.comision, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span>Comisión por Rifa (4%)</span>
                  <span className="font-semibold">
                    {formatearMoneda(
                      ventas
                        .filter(v => v.tipo === 'rifa' && v.estado === 'confirmado')
                        .reduce((sum, v) => sum + v.comision, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded border-t-2 border-purple-200">
                  <span className="font-semibold">Total de Comisiones</span>
                  <span className="font-bold text-lg">{formatearMoneda(comisionTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PanelVendedor;
