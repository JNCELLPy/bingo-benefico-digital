
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, Trophy, Users, Clock } from 'lucide-react';
import { Rifa } from '@/types/rifa';

interface SorteadorRifaProps {
  rifa: Rifa;
  onNumeroGanador: (rifaId: string, premioId: string, numeroGanador: number) => void;
  onFinalizarSorteo: (rifaId: string) => void;
}

const SorteadorRifa: React.FC<SorteadorRifaProps> = ({
  rifa,
  onNumeroGanador,
  onFinalizarSorteo
}) => {
  const [sorteando, setSorteando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [premioActual, setPremioActual] = useState(0);
  const [numeroActual, setNumeroActual] = useState<number | null>(null);
  const [tiempoRestantePausa, setTiempoRestantePausa] = useState(0);
  const [premiosGanados, setPremiosGanados] = useState<{[key: string]: number}>({});

  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    
    if (tiempoRestantePausa > 0) {
      intervalo = setInterval(() => {
        setTiempoRestantePausa(prev => {
          if (prev <= 1) {
            continuarSorteo();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [tiempoRestantePausa]);

  const iniciarSorteoAutomatico = () => {
    if (rifa.numerosVendidos.length === 0) {
      alert('No hay números vendidos para sortear');
      return;
    }

    setSorteando(true);
    setPausado(false);
    setPremioActual(0);
    setPremiosGanados({});
    sortearPremio(0);
  };

  const sortearPremio = (indicePremio: number) => {
    if (indicePremio >= rifa.premios.length) {
      // Todos los premios han sido sorteados
      setSorteando(false);
      onFinalizarSorteo(rifa.id);
      return;
    }

    const premio = rifa.premios[indicePremio];
    setPremioActual(indicePremio);
    
    // Animación de sorteo
    let contador = 0;
    const maxContador = 30;
    
    const intervaloSorteo = setInterval(() => {
      const numeroAleatorio = rifa.numerosVendidos[
        Math.floor(Math.random() * rifa.numerosVendidos.length)
      ];
      setNumeroActual(numeroAleatorio);
      contador++;

      if (contador >= maxContador) {
        clearInterval(intervaloSorteo);
        
        // Número ganador final
        const ganador = rifa.numerosVendidos[
          Math.floor(Math.random() * rifa.numerosVendidos.length)
        ];
        
        setNumeroActual(ganador);
        setPremiosGanados(prev => ({...prev, [premio.id]: ganador}));
        onNumeroGanador(rifa.id, premio.id, ganador);
        
        // Narrar el resultado
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(
            `${premio.nombre}: ¡El número ganador es ${ganador}!`
          );
          utterance.lang = 'es-ES';
          speechSynthesis.speak(utterance);
        }

        // Pausa antes del siguiente sorteo
        if (indicePremio < rifa.premios.length - 1) {
          setTiempoRestantePausa(rifa.configuracion.pausaEntrePremios || 30);
          setPausado(true);
        } else {
          // Último premio, finalizar
          setTimeout(() => {
            setSorteando(false);
            onFinalizarSorteo(rifa.id);
          }, 3000);
        }
      }
    }, 100);
  };

  const continuarSorteo = () => {
    setPausado(false);
    setTiempoRestantePausa(0);
    setTimeout(() => {
      sortearPremio(premioActual + 1);
    }, 1000);
  };

  const pausarSorteo = () => {
    setPausado(true);
    setSorteando(false);
  };

  const finalizarSorteo = () => {
    setSorteando(false);
    setPausado(false);
    setTiempoRestantePausa(0);
    onFinalizarSorteo(rifa.id);
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const premioEnCurso = rifa.premios[premioActual];

  return (
    <div className="space-y-6">
      {/* Panel Principal del Sorteo */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            🎉 RIFAS GARNÚ - {rifa.nombre}
          </CardTitle>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary">
              {rifa.numerosVendidos.length} números vendidos
            </Badge>
            <Badge variant="secondary">
              Premio {premioActual + 1} de {rifa.premios.length}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Premio Actual */}
          {premioEnCurso && (
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold mb-2">
                {premioEnCurso.nombre}
              </h2>
              <p className="text-lg">
                {formatearMoneda(premioEnCurso.valor)}
              </p>
            </div>
          )}

          {/* Número Ganador */}
          <div className="text-center mb-6">
            {numeroActual && (
              <div className={`
                bg-white text-purple-600 rounded-full w-40 h-40 mx-auto 
                flex items-center justify-center text-6xl font-bold shadow-lg
                ${sorteando && !pausado ? 'animate-bounce' : ''}
                ${premiosGanados[premioEnCurso?.id] ? 'ring-8 ring-yellow-400 bg-yellow-100' : ''}
              `}>
                {numeroActual}
              </div>
            )}
            
            {premiosGanados[premioEnCurso?.id] && (
              <div className="mt-4">
                <p className="text-2xl font-bold text-yellow-300">
                  ¡NÚMERO GANADOR!
                </p>
              </div>
            )}
          </div>

          {/* Pausa entre sorteos */}
          {tiempoRestantePausa > 0 && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-4">
                <Clock className="h-6 w-6" />
                <span className="text-xl font-bold">
                  Próximo sorteo en: {tiempoRestantePausa}s
                </span>
              </div>
              <Progress 
                value={(30 - tiempoRestantePausa) / 30 * 100} 
                className="w-64 mx-auto mt-2"
              />
            </div>
          )}

          {/* Controles */}
          <div className="flex justify-center space-x-4">
            {!sorteando && !pausado && Object.keys(premiosGanados).length === 0 && (
              <Button 
                onClick={iniciarSorteoAutomatico}
                size="lg"
                className="bg-green-500 hover:bg-green-600"
              >
                <Play className="mr-2 h-5 w-5" />
                Iniciar Sorteo Automático
              </Button>
            )}
            
            {sorteando && !pausado && tiempoRestantePausa === 0 && (
              <Button 
                onClick={pausarSorteo}
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                <Pause className="mr-2 h-5 w-5" />
                Pausar
              </Button>
            )}

            {pausado && tiempoRestantePausa === 0 && (
              <Button 
                onClick={continuarSorteo}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Play className="mr-2 h-5 w-5" />
                Continuar
              </Button>
            )}
            
            <Button 
              onClick={finalizarSorteo}
              size="lg"
              className="bg-red-500 hover:bg-red-600"
            >
              <Square className="mr-2 h-5 w-5" />
              Finalizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progreso del Sorteo */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso del Sorteo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rifa.premios.map((premio, index) => (
              <div key={premio.id} className={`
                flex justify-between items-center p-3 rounded
                ${index === premioActual ? 'bg-blue-100 border-2 border-blue-500' : ''}
                ${premiosGanados[premio.id] ? 'bg-green-100 border-2 border-green-500' : ''}
              `}>
                <div>
                  <p className="font-semibold">{index + 1}° {premio.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatearMoneda(premio.valor)}
                  </p>
                </div>
                <div className="text-right">
                  {premiosGanados[premio.id] && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Ganador: {premiosGanados[premio.id]}
                    </div>
                  )}
                  {index === premioActual && !premiosGanados[premio.id] && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                      Sorteando...
                    </div>
                  )}
                  {index > premioActual && (
                    <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                      Pendiente
                    </div>
                  )}
                </div>
              </div>
            ))}
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
            <div className="grid grid-cols-10 gap-1 max-h-64 overflow-y-auto">
              {rifa.numerosVendidos.sort((a, b) => a - b).map(numero => (
                <div
                  key={numero}
                  className={`
                    w-8 h-8 rounded flex items-center justify-center text-xs font-semibold
                    ${Object.values(premiosGanados).includes(numero)
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
              Resumen de Premios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Premios:</span>
                <span className="font-bold">
                  {formatearMoneda(rifa.premios.reduce((total, p) => total + p.valor, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Premios Entregados:</span>
                <span className="font-bold text-green-600">
                  {Object.keys(premiosGanados).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Premios Pendientes:</span>
                <span className="font-bold text-orange-600">
                  {rifa.premios.length - Object.keys(premiosGanados).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SorteadorRifa;
