
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import CartonBingo from '@/components/Bingo/CartonBingo';
import SorteoEnVivo from '@/components/Sorteo/SorteoEnVivo';
import DetectorGanadores from '@/components/Bingo/DetectorGanadores';
import CrearCarton from '@/components/Bingo/CrearCarton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Users, 
  Trophy, 
  Clock,
  Gamepad2,
  Target
} from 'lucide-react';
import { Carton, Sorteo } from '@/types/bingo';

const BingoEnVivo = () => {
  const { usuario } = useAuth();
  const [sorteoActual, setSorteoActual] = useState<Sorteo>({
    id: '1',
    nombre: 'Bingo Nocturno en Vivo',
    fecha: new Date().toDateString(),
    hora: '20:00',
    estado: 'en_curso',
    precioCarton: 15000,
    premios: [
      {
        id: '1',
        nombre: 'Bingo Completo',
        descripcion: 'Premio mayor',
        valor: 1000000,
        tipo: 'bingo_completo',
        cantidad: 1
      },
      {
        id: '2',
        nombre: 'Línea',
        descripcion: 'Primera línea',
        valor: 200000,
        tipo: 'linea',
        cantidad: 3
      },
      {
        id: '3',
        nombre: 'Forma X',
        descripcion: 'Forma especial',
        valor: 300000,
        tipo: 'forma',
        cantidad: 1
      }
    ],
    numerosLlamados: [12, 25, 38, 47, 63, 8, 19, 34, 52, 71],
    cartones: [],
    ganadores: [],
    configuracion: {
      modalidadBingo: 'tradicional',
      tiempoEntreBolas: 5,
      permitirMultiplesGanadores: true,
      verificacionAutomatica: true
    }
  });

  const [cartonesJugador, setCartonesJugador] = useState<Carton[]>([
    {
      id: '1',
      numeros: [
        [12, 18, 32, 47, 63],
        [5, 21, 35, 52, 68],
        [9, 24, 0, 58, 71], // 0 representa el espacio libre
        [3, 19, 41, 54, 67],
        [14, 28, 43, 49, 75]
      ],
      jugadorId: usuario?.id || 'demo',
      sorteoId: '1',
      precio: 15000,
      fechaCompra: new Date().toISOString(),
      estado: 'activo',
      qrCode: 'QR123456',
      tipo: 'digital'
    }
  ]);

  const [tiempoSorteo, setTiempoSorteo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoSorteo(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const onNuevoNumero = (numero: number) => {
    setSorteoActual(prev => ({
      ...prev,
      numerosLlamados: [...prev.numerosLlamados, numero]
    }));
  };

  const onFinalizarSorteo = () => {
    setSorteoActual(prev => ({
      ...prev,
      estado: 'finalizado'
    }));
  };

  const onCartonCreado = (carton: Omit<Carton, 'id'>) => {
    const nuevoCarton: Carton = {
      ...carton,
      id: Date.now().toString()
    };
    setCartonesJugador([...cartonesJugador, nuevoCarton]);
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const esAdmin = usuario?.rol === 'admin' || usuario?.rol === 'super_admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Bingo en Vivo</h1>
            <p className="text-muted-foreground">Participa en tiempo real en nuestro bingo</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-red-500 animate-pulse px-4 py-2">
              🔴 EN VIVO
            </Badge>
            <div className="text-lg font-mono font-bold">
              {formatearTiempo(tiempoSorteo)}
            </div>
          </div>
        </div>

        {/* Estadísticas del Sorteo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Números Llamados</p>
                  <p className="text-2xl font-bold">{sorteoActual.numerosLlamados.length}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mis Cartones</p>
                  <p className="text-2xl font-bold">{cartonesJugador.length}</p>
                </div>
                <Gamepad2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jugadores</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Premios Total</p>
                  <p className="text-2xl font-bold">
                    {formatearMoneda(
                      sorteoActual.premios.reduce((total, premio) => total + premio.valor, 0)
                    )}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jugar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="jugar">Jugar</TabsTrigger>
            <TabsTrigger value="cartones">Mis Cartones</TabsTrigger>
            <TabsTrigger value="ganadores">Ganadores</TabsTrigger>
            {esAdmin && <TabsTrigger value="control">Control</TabsTrigger>}
          </TabsList>

          <TabsContent value="jugar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cartones del Jugador */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Mis Cartones</h2>
                  <Button size="sm">Comprar Más Cartones</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cartonesJugador.map(carton => (
                    <CartonBingo
                      key={carton.id}
                      carton={carton}
                      numerosLlamados={sorteoActual.numerosLlamados}
                      tamaño="pequeño"
                    />
                  ))}
                </div>
              </div>

              {/* Panel Lateral */}
              <div className="space-y-4">
                {/* Último Número */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Último Número</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      {sorteoActual.numerosLlamados.length > 0 && (
                        <div className="bg-blue-500 text-white rounded-full w-24 h-24 mx-auto flex items-center justify-center text-3xl font-bold mb-4">
                          {sorteoActual.numerosLlamados[sorteoActual.numerosLlamados.length - 1]}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Próximos Premios */}
                <Card>
                  <CardHeader>
                    <CardTitle>Premios Disponibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sorteoActual.premios.map(premio => (
                        <div key={premio.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-semibold text-sm">{premio.nombre}</p>
                            <p className="text-xs text-muted-foreground">{premio.descripcion}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600 text-sm">
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
          </TabsContent>

          <TabsContent value="cartones" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CrearCarton
                  sorteoId={sorteoActual.id}
                  precio={sorteoActual.precioCarton}
                  onCartonCreado={onCartonCreado}
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cartones Actuales</h3>
                {cartonesJugador.map(carton => (
                  <CartonBingo
                    key={carton.id}
                    carton={carton}
                    numerosLlamados={sorteoActual.numerosLlamados}
                    tamaño="mediano"
                    mostrarControles={true}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ganadores" className="space-y-4">
            <DetectorGanadores
              cartones={cartonesJugador}
              numerosLlamados={sorteoActual.numerosLlamados}
            />
          </TabsContent>

          {esAdmin && (
            <TabsContent value="control" className="space-y-4">
              <SorteoEnVivo
                sorteo={sorteoActual}
                onNuevoNumero={onNuevoNumero}
                onFinalizarSorteo={onFinalizarSorteo}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default BingoEnVivo;
