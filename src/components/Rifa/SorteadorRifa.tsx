
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Trophy, Users } from 'lucide-react';
import { Rifa } from '@/types/rifa';

interface SorteadorRifaProps {
  rifa: Rifa;
  onNumeroGanador: (rifaId: string, numeroGanador: number) => void;
  onFinalizarSorteo: (rifaId: string) => void;
}

const SorteadorRifa: React.FC<SorteadorRifaProps> = ({
  rifa,
  onNumeroGanador,
  onFinalizarSorteo
}) => {
  const [sorteando, setSorteando] = useState(false);
  const [numeroActual, setNumeroActual] = useState<number | null>(null);
  const [numeroGanador, setNumeroGanador] = useState<number | null>(null);
  const [velocidad, setVelocidad] = useState(100);

  const iniciarSorteo = () => {
    if (rifa.numerosVendidos.length === 0) {
      alert('No hay números vendidos para sortear');
      return;
    }

    setSorteando(true);
    setNumeroGanador(null);
    
    const intervalo = setInterval(() => {
      const numeroAleatorio = rifa.numerosVendidos[
        Math.floor(Math.random() * rifa.numerosVendidos.length)
      ];
      setNumeroActual(numeroAleatorio);
    }, velocidad);

    // Finalizar después de 3 segundos con velocidad decreciente
    setTimeout(() => {
      clearInterval(intervalo);
      
      // Sorteo final
      const ganador = rifa.numerosVendidos[
        Math.floor(Math.random() * rifa.numerosVendidos.length)
      ];
      
      setNumeroActual(ganador);
      setNumeroGanador(ganador);
      setSorteando(false);
      
      // Notificar el ganador
      onNumeroGanador(rifa.id, ganador);
      
      // Narrar el resultado
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `¡El número ganador es ${ganador}!`
        );
        utterance.lang = 'es-ES';
        speechSynthesis.speak(utterance);
      }
    }, 3000);
  };

  const finalizarSorteo = () => {
    onFinalizarSorteo(rifa.id);
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
      {/* Panel Principal del Sorteo */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Sorteo de Rifa: {rifa.nombre}
          </CardTitle>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary">
              {rifa.numerosVendidos.length} números vendidos
            </Badge>
            <Badge variant="secondary">
              {rifa.premios.length} premios
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Número Ganador */}
          <div className="text-center mb-6">
            {numeroActual && (
              <div className={`
                bg-white text-purple-600 rounded-full w-40 h-40 mx-auto 
                flex items-center justify-center text-6xl font-bold shadow-lg
                ${sorteando ? 'animate-bounce' : ''}
                ${numeroGanador ? 'ring-8 ring-yellow-400 bg-yellow-100' : ''}
              `}>
                {numeroActual}
              </div>
            )}
            
            {numeroGanador && (
              <div className="mt-4">
                <p className="text-2xl font-bold text-yellow-300">
                  ¡NÚMERO GANADOR!
                </p>
                <p className="text-lg">
                  Premio: {formatearMoneda(rifa.premios[0]?.valor || 0)}
                </p>
              </div>
            )}
          </div>

          {/* Controles */}
          <div className="flex justify-center space-x-4">
            {!sorteando && !numeroGanador && (
              <Button 
                onClick={iniciarSorteo}
                size="lg"
                className="bg-green-500 hover:bg-green-600"
              >
                <Play className="mr-2 h-5 w-5" />
                Iniciar Sorteo
              </Button>
            )}
            
            {sorteando && (
              <Button 
                disabled
                size="lg"
                className="bg-yellow-500"
              >
                <Pause className="mr-2 h-5 w-5" />
                Sorteando...
              </Button>
            )}
            
            {numeroGanador && (
              <Button 
                onClick={finalizarSorteo}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Square className="mr-2 h-5 w-5" />
                Finalizar Sorteo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información de la Rifa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Números Participantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-1">
              {rifa.numerosVendidos.sort((a, b) => a - b).map(numero => (
                <div
                  key={numero}
                  className={`
                    w-8 h-8 rounded flex items-center justify-center text-xs font-semibold
                    ${numero === numeroGanador 
                      ? 'bg-yellow-500 text-white ring-2 ring-yellow-400' 
                      : 'bg-blue-100 text-blue-800'
                    }
                  `}
                >
                  {numero}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Premios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rifa.premios.map((premio, index) => (
                <div key={premio.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-semibold">{index + 1}° {premio.nombre}</p>
                    <p className="text-sm text-muted-foreground">{premio.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatearMoneda(premio.valor)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SorteadorRifa;
