
import React from 'react';
import { Wallet } from 'lucide-react';

interface SaldoDisplayProps {
  saldo: number;
  formatearMoneda: (valor: number) => string;
}

const SaldoDisplay: React.FC<SaldoDisplayProps> = ({ saldo, formatearMoneda }) => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">Mi Billetera</h1>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Wallet className="h-8 w-8" />
          <span className="text-lg">Saldo Disponible</span>
        </div>
        <div className="text-4xl font-bold">
          {formatearMoneda(saldo)}
        </div>
      </div>
    </div>
  );
};

export default SaldoDisplay;
