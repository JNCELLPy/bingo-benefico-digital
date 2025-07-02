
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { Sorteo } from '@/types/bingo';
import TableroBingo from '@/components/Bingo/TableroBingo';
import UltimosNumeros from '@/components/Bingo/UltimosNumeros';

interface SorteoEnVivoProps {
  sorteo: Sorteo;
  onNuevoNumero: (numero: number) => void;
  onFinalizarSorteo: () => void;
}

const SorteoEnVivo: React.FC<SorteoEnVivoProps> = ({
  sorteo,
  onNuevoNumero,
  onFinalizarSorteo
}) => {
  const [enCurso, setEnCurso] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [ultimoNumero, setUltimoNumero] = useState<number | null>(null);
  const [numerosDisponibles, setNumerosDisponibles] = useState<number[]>([]);
  const [intervaloRef, setIntervaloRef] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Inicializar números disponibles (1-75 para bingo tradicional)
    const numeros = Array.from({ length: 75 }, (_, i) => i + 1);
    const disponibles = numeros.filter(num => !sorteo.numerosLlamados.includes(num));
    setNumerosDisponibles(disponibles);
  }, [sorteo.numerosLlamados]);

  const sacarProximoNumero = () => {
    if (numerosDisponibles.length === 0) {
      setEnCurso(false);
      setPausado(false);
      onFinalizarSorteo();
      return;
    }

    const indiceAleatorio = Math.floor(Math.random() * numerosDisponibles.length);
    const numeroSacado = numerosDisponibles[indiceAleatorio];
    
    setUltimoNumero(numeroSacado);
    setNumerosDisponibles(prev => prev.filter(num => num !== numeroSacado));
    onNuevoNumero(numeroSacado);

    // Narrar el número (si hay soporte de síntesis de voz)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${obtenerLetraBingo(numeroSacado)} ${numeroSacado}`
      );
      utterance.lang = 'es-ES';
      speechSynthesis.speak(utterance);
    }
  };

  const obtenerLetraBingo = (numero: number): string => {
    if (numero <= 15) return 'B';
    if (numero <= 30) return 'I';
    if (numero <= 45) return 'N';
    if (numero <= 60) return 'G';
    return 'O';
  };

  const iniciarSorteo = () => {
    setEnCurso(true);
    setPausado(false);
    
    const intervalo = setInterval(() => {
      if (numerosDisponibles.length > 0) {
        sacarProximoNumero();
      } else {
        clearInterval(intervalo);
        setEnCurso(false);
        setPausado(false);
        onFinalizarSorteo();
      }
    }, sorteo.configuracion.tiempoEntreBolas * 1000);

    setIntervaloRef(intervalo);
  };

  const pausarSorteo = () => {
    setPausado(true);
    setEnCurso(false);
    if (intervaloRef) {
      clearInterval(intervaloRef);
      setIntervaloRef(null);
    }
  };

  const continuarSorteo = () => {
    setPausado(false);
    setEnCurso(true);
    
    const intervalo = setInterval(() => {
      if (numerosDisponibles.length > 0) {
        sacarProximoNumero();
      } else {
        clearInterval(intervalo);
        setEnCurso(false);
        setPausado(false);
        onFinalizarSorteo();
      }
    }, sorteo.configuracion.tiempoEntreBolas * 1000);

    setIntervaloRef(intervalo);
  };

  const finalizarSorteo = () => {
    setEnCurso(false);
    setPausado(false);
    if (intervaloRef) {
      clearInterval(intervaloRef);
      setIntervaloRef(null);
    }
    onFinalizarSorteo();
  };

  return (
    <div className="space-y-6">
      {/* Panel de Control Principal */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {sorteo.nombre}
          </CardTitle>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary">
              {sorteo.numerosLlamados.length} números llamados
            </Badge>
            <Badge variant="secondary">
              {numerosDisponibles.length} restantes
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Número Actual */}
          <div className="text-center mb-6">
            {ultimoNumero && (
              <div className="bg-white text-purple-600 rounded-full w-32 h-32 mx-auto flex items-center justify-center text-4xl font-bold shadow-lg">
                <div>
                  <div className="text-lg">{obtenerLetraBingo(ultimoNumero)}</div>
                  <div>{ultimoNumero}</div>
                </div>
              </div>
            )}
          </div>

          {/* Controles */}
          <div className="flex justify-center space-x-4">
            {!enCurso && !pausado && (
              <Button 
                onClick={iniciarSorteo}
                size="lg"
                className="bg-green-500 hover:bg-green-600"
              >
                <Play className="mr-2 h-5 w-5" />
                {sorteo.numerosLlamados.length === 0 ? 'Iniciar Sorteo' : 'Iniciar'}
              </Button>
            )}
            
            {enCurso && !pausado && (
              <Button 
                onClick={pausarSorteo}
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                <Pause className="mr-2 h-5 w-5" />
                Pausar
              </Button>
            )}

            {pausado && (
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
              onClick={sacarProximoNumero}
              disabled={enCurso || numerosDisponibles.length === 0}
              size="lg"
              variant="outline"
              className="bg-white text-purple-600 border-white hover:bg-purple-50"
            >
              Sacar Número Manual
            </Button>
            
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

      {/* Tablero de Bingo y Últimos Números */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TableroBingo 
            numerosLlamados={sorteo.numerosLlamados}
            ultimoNumero={ultimoNumero}
          />
        </div>
        <div>
          <UltimosNumeros 
            numerosLlamados={sorteo.numerosLlamados}
            cantidadMostrar={8}
          />
        </div>
      </div>
    </div>
  );
};

export default SorteoEnVivo;
