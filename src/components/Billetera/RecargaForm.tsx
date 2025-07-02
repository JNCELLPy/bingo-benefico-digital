
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, CreditCard, Building2, Smartphone } from 'lucide-react';

interface RecargaFormProps {
  montoRecarga: string;
  setMontoRecarga: (valor: string) => void;
  metodoSeleccionado: string;
  setMetodoSeleccionado: (metodo: string) => void;
  procesarRecarga: () => void;
  formatearMoneda: (valor: number) => string;
}

const RecargaForm: React.FC<RecargaFormProps> = ({
  montoRecarga,
  setMontoRecarga,
  metodoSeleccionado,
  setMetodoSeleccionado,
  procesarRecarga,
  formatearMoneda
}) => {
  return (
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
  );
};

export default RecargaForm;
