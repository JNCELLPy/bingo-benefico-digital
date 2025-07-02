
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, AlertCircle } from 'lucide-react';

interface RetiroFormProps {
  montoRetiro: string;
  setMontoRetiro: (valor: string) => void;
  procesarRetiro: () => void;
  formatearMoneda: (valor: number) => string;
  saldoDisponible: number;
}

const RetiroForm: React.FC<RetiroFormProps> = ({
  montoRetiro,
  setMontoRetiro,
  procesarRetiro,
  formatearMoneda,
  saldoDisponible
}) => {
  return (
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
            max={saldoDisponible}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Saldo disponible: {formatearMoneda(saldoDisponible)}
          </p>
        </div>

        <Button 
          onClick={procesarRetiro} 
          className="w-full"
          disabled={!montoRetiro || parseInt(montoRetiro) <= 0 || parseInt(montoRetiro) > saldoDisponible}
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
  );
};

export default RetiroForm;
