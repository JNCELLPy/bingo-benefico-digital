
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Transaccion } from '@/types/bingo';
import SaldoDisplay from './SaldoDisplay';
import RecargaForm from './RecargaForm';
import RetiroForm from './RetiroForm';
import HistorialTransacciones from './HistorialTransacciones';

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
      alert(`Recarga de ${formatearMoneda(monto)} procesada exitosamente`);
    }
  };

  const procesarRetiro = () => {
    const monto = parseInt(montoRetiro);
    if (monto > 0 && usuario && monto <= usuario.saldo) {
      setMontoRetiro('');
      alert(`Solicitud de retiro por ${formatearMoneda(monto)} enviada. Será procesada en 48-72 horas.`);
    }
  };

  if (!usuario) return null;

  return (
    <div className="p-6 space-y-6">
      <SaldoDisplay 
        saldo={usuario.saldo} 
        formatearMoneda={formatearMoneda} 
      />

      <Tabs defaultValue="recarga" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recarga">Recargar</TabsTrigger>
          <TabsTrigger value="retiro">Retirar</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="recarga" className="space-y-4">
          <RecargaForm
            montoRecarga={montoRecarga}
            setMontoRecarga={setMontoRecarga}
            metodoSeleccionado={metodoSeleccionado}
            setMetodoSeleccionado={setMetodoSeleccionado}
            procesarRecarga={procesarRecarga}
            formatearMoneda={formatearMoneda}
          />
        </TabsContent>

        <TabsContent value="retiro" className="space-y-4">
          <RetiroForm
            montoRetiro={montoRetiro}
            setMontoRetiro={setMontoRetiro}
            procesarRetiro={procesarRetiro}
            formatearMoneda={formatearMoneda}
            saldoDisponible={usuario.saldo}
          />
        </TabsContent>

        <TabsContent value="historial" className="space-y-4">
          <HistorialTransacciones
            transacciones={transacciones}
            formatearMoneda={formatearMoneda}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BilleteraVirtual;
