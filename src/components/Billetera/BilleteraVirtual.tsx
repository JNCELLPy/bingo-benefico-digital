import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Plus, 
  Minus, 
  CreditCard, 
  Building2, 
  Smartphone,
  History,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Transaccion, SolicitudRetiro } from '@/types/bingo';

const BilleteraVirtual = () => {
  const { usuario, actualizarUsuario } = useAuth();
  const [montoRecarga, setMontoRecarga] = useState('');
  const [montoRetiro, setMontoRetiro] = useState('');
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('tarjeta');

  const [transacciones] = useState<Transaccion[]>([
    {
      id: '1',
      usuarioId: usuario?.id || '',
      tipo: 'recarga',
      monto: 100000,
      descripcion: 'Recarga con tarjeta',
      fecha: new Date().toISOString(),
      estado: 'completada',
      metodoPago: 'Tarjeta de Crédito'
    },
    {
      id: '2',
      usuarioId: usuario?.id || '',
      tipo: 'compra_carton',
      monto: -15000,
      descripcion: 'Compra cartón Bingo Nocturno',
      fecha: new Date(Date.now() - 86400000).toISOString(),
      estado: 'completada'
    }
  ]);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const procesarRecarga = () => {
    const monto = parseInt(montoRecarga);
    if (monto > 0 && usuario) {
      actualizarUsuario({ saldo: usuario.saldo + monto });
      setMontoRecarga('');
      // Aquí integrarías con el procesador de pagos
      alert(`Recarga de ${formatearMoneda(monto)} procesada exitosamente`);
    }
  };

  const procesarRetiro = () => {
    const monto = parseInt(montoRetiro);
    if (monto > 0 && usuario && monto <= usuario.saldo) {
      // En un sistema real, esto crearía una solicitud de retiro
      setMontoRetiro('');
      alert(`Solicitud de retiro por ${formatearMoneda(monto)} enviada. Será procesada en 48-72 horas.`);
    }
  };

  const obtenerIconoTransaccion = (tipo: string) => {
    switch (tipo) {
      case 'recarga': return <Plus className="h-4 w-4 text-green-600" />;
      case 'retiro': return <Minus className="h-4 w-4 text-red-600" />;
      case 'compra_carton': return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'premio': return <CheckCircle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (!usuario) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Mi Billetera</h1>
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Wallet className="h-8 w-8" />
            <span className="text-lg">Saldo Disponible</span>
          </div>
          <div className="text-4xl font-bold">
            {formatearMoneda(usuario.saldo)}
          </div>
        </div>
      </div>

      <Tabs defaultValue="recarga" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recarga">Recargar</TabsTrigger>
          <TabsTrigger value="retiro">Retirar</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="recarga" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Recargar Saldo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monto-recarga">Monto a Recargar</Label>
                <Input
                  id="monto-recarga"
                  type="number"
                  placeholder="Ingrese el monto en guaraníes"
                  value={montoRecarga}
                  onChange={(e) => setMontoRecarga(e.target.value)}
                />
              </div>

              <div>
                <Label>Método de Pago</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  <Button
                    variant={metodoSeleccionado === 'tarjeta' ? 'default' : 'outline'}
                    onClick={() => setMetodoSeleccionado('tarjeta')}
                    className="flex items-center justify-center p-4 h-auto"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    <div>
                      <div className="font-semibold">Tarjeta</div>
                      <div className="text-xs">Crédito/Débito</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant={metodoSeleccionado === 'banco' ? 'default' : 'outline'}
                    onClick={() => setMetodoSeleccionado('banco')}
                    className="flex items-center justify-center p-4 h-auto"
                  >
                    <Building2 className="mr-2 h-5 w-5" />
                    <div>
                      <div className="font-semibold">Transferencia</div>
                      <div className="text-xs">Bancaria</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant={metodoSeleccionado === 'digital' ? 'default' : 'outline'}
                    onClick={() => setMetodoSeleccionado('digital')}
                    className="flex items-center justify-center p-4 h-auto"
                  >
                    <Smartphone className="mr-2 h-5 w-5" />
                    <div>
                      <div className="font-semibold">Billetera Digital</div>
                      <div className="text-xs">Tigo Money, etc.</div>
                    </div>
                  </Button>
                </div>
              </div>

              <Button 
                onClick={procesarRecarga} 
                className="w-full"
                disabled={!montoRecarga || parseInt(montoRecarga) <= 0}
              >
                Recargar {montoRecarga && formatearMoneda(parseInt(montoRecarga))}
              </Button>

              <div className="text-sm text-muted-foreground">
                <p>• Las recargas se procesan inmediatamente</p>
                <p>• Monto mínimo: ₲ 10.000</p>
                <p>• Sin comisiones por recarga</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retiro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Minus className="mr-2 h-5 w-5" />
                Retirar Saldo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monto-retiro">Monto a Retirar</Label>
                <Input
                  id="monto-retiro"
                  type="number"
                  placeholder="Ingrese el monto en guaraníes"
                  value={montoRetiro}
                  onChange={(e) => setMontoRetiro(e.target.value)}
                  max={usuario.saldo}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Saldo disponible: {formatearMoneda(usuario.saldo)}
                </p>
              </div>

              <Button 
                onClick={procesarRetiro} 
                className="w-full"
                disabled={!montoRetiro || parseInt(montoRetiro) <= 0 || parseInt(montoRetiro) > usuario.saldo}
              >
                Solicitar Retiro
              </Button>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-800">Información sobre retiros:</p>
                    <ul className="list-disc list-inside mt-2 text-yellow-700">
                      <li>Los retiros son procesados en 48-72 horas hábiles</li>
                      <li>Monto mínimo de retiro: ₲ 50.000</li>
                      <li>Requiere verificación de identidad</li>
                      <li>Se realizan por transferencia bancaria</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BilleteraVirtual;
