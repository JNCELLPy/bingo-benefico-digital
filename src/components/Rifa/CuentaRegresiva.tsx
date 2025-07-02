
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar } from 'lucide-react';

interface CuentaRegresivaProps {
  fechaSorteo: string;
  horaSorteo: string;
  nombreRifa: string;
}

const CuentaRegresiva: React.FC<CuentaRegresivaProps> = ({
  fechaSorteo,
  horaSorteo,
  nombreRifa
}) => {
  const [tiempoRestante, setTiempoRestante] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  });

  useEffect(() => {
    const calcularTiempoRestante = () => {
      const fechaSorteoCompleta = new Date(`${fechaSorteo}T${horaSorteo}`);
      const ahora = new Date();
      const diferencia = fechaSorteoCompleta.getTime() - ahora.getTime();

      if (diferencia > 0) {
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        setTiempoRestante({ dias, horas, minutos, segundos });
      } else {
        setTiempoRestante({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
      }
    };

    calcularTiempoRestante();
    const intervalo = setInterval(calcularTiempoRestante, 1000);

    return () => clearInterval(intervalo);
  }, [fechaSorteo, horaSorteo]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PY', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const esSorteoHoy = () => {
    const fechaSorteoCompleta = new Date(`${fechaSorteo}T${horaSorteo}`);
    const ahora = new Date();
    return fechaSorteoCompleta.toDateString() === ahora.toDateString();
  };

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Próximo Sorteo: {nombreRifa}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          {/* Fecha y Hora */}
          <div className="flex justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{formatearFecha(fechaSorteo)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>{horaSorteo}</span>
            </div>
          </div>

          {/* Cuenta Regresiva */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-3xl font-bold">{tiempoRestante.dias}</div>
              <div className="text-sm">Días</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-3xl font-bold">{tiempoRestante.horas}</div>
              <div className="text-sm">Horas</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-3xl font-bold">{tiempoRestante.minutos}</div>
              <div className="text-sm">Minutos</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-3xl font-bold animate-pulse">{tiempoRestante.segundos}</div>
              <div className="text-sm">Segundos</div>
            </div>
          </div>

          {esSorteoHoy() && (
            <div className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg font-semibold animate-pulse">
              ¡SORTEO HOY!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CuentaRegresiva;
