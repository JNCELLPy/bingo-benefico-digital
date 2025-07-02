
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import CrearRifa from '@/components/Rifa/CrearRifa';
import RifaCard from '@/components/Rifa/RifaCard';
import SorteadorRifa from '@/components/Rifa/SorteadorRifa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Gift, Clock, Trophy } from 'lucide-react';
import { Rifa } from '@/types/rifa';

const Rifas = () => {
  const { usuario } = useAuth();
  const [rifas, setRifas] = useState<Rifa[]>([
    {
      id: '1',
      nombre: 'Rifa del Día de la Madre',
      descripcion: 'Participa y gana increíbles premios para mamá',
      fechaSorteo: '2024-05-10T00:00:00.000Z',
      horaSorteo: '20:00',
      estado: 'activa',
      precioNumero: 10000,
      numerosDisponibles: Array.from({ length: 100 }, (_, i) => i + 1),
      numerosVendidos: [1, 5, 12, 23, 34, 45, 56, 67, 78, 89],
      premios: [
        {
          id: '1',
          nombre: 'Spa Completo',
          descripcion: 'Día de relajación completo',
          valor: 500000,
          posicion: 1
        },
        {
          id: '2',
          nombre: 'Cena Romántica',
          descripcion: 'Para dos personas',
          valor: 200000,
          posicion: 2
        }
      ],
      configuracion: {
        numeroMinimo: 1,
        numeroMaximo: 100,
        permitirMultiplesNumeros: true,
        mostrarCompradores: true,
        sorteoAutomatico: false
      }
    }
  ]);
  
  const [rifaEnSorteo, setRifaEnSorteo] = useState<Rifa | null>(null);
  const [mostrarCreador, setMostrarCreador] = useState(false);

  const crearRifa = (nuevaRifa: Omit<Rifa, 'id'>) => {
    const rifa: Rifa = {
      ...nuevaRifa,
      id: Date.now().toString()
    };
    setRifas([...rifas, rifa]);
    setMostrarCreador(false);
  };

  const comprarNumero = (rifaId: string) => {
    // Aquí iría la lógica para comprar números
    console.log('Comprando número para rifa:', rifaId);
  };

  const verDetalles = (rifaId: string) => {
    // Aquí iría la lógica para ver detalles
    console.log('Ver detalles de rifa:', rifaId);
  };

  const iniciarSorteo = (rifaId: string) => {
    const rifa = rifas.find(r => r.id === rifaId);
    if (rifa) {
      setRifaEnSorteo(rifa);
      // Actualizar estado de la rifa
      setRifas(rifas.map(r => 
        r.id === rifaId ? { ...r, estado: 'sorteando' } : r
      ));
    }
  };

  const onNumeroGanador = (rifaId: string, numeroGanador: number) => {
    setRifas(rifas.map(r => 
      r.id === rifaId ? { ...r, numeroGanador, estado: 'finalizada' } : r
    ));
  };

  const onFinalizarSorteo = (rifaId: string) => {
    setRifas(rifas.map(r => 
      r.id === rifaId ? { ...r, estado: 'finalizada' } : r
    ));
    setRifaEnSorteo(null);
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
            <h1 className="text-3xl font-bold">Sistema de Rifas</h1>
            <p className="text-muted-foreground">Participa en rifas emocionantes y gana increíbles premios</p>
          </div>
          {esAdmin && (
            <Button onClick={() => setMostrarCreador(!mostrarCreador)}>
              <Plus className="mr-2 h-4 w-4" />
              {mostrarCreador ? 'Ocultar' : 'Crear Rifa'}
            </Button>
          )}
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rifas Activas</p>
                  <p className="text-2xl font-bold">{rifas.filter(r => r.estado === 'activa').length}</p>
                </div>
                <Gift className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Próximos Sorteos</p>
                  <p className="text-2xl font-bold">{rifas.filter(r => r.estado === 'programada').length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rifas Finalizadas</p>
                  <p className="text-2xl font-bold">{rifas.filter(r => r.estado === 'finalizada').length}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Premios</p>
                  <p className="text-2xl font-bold">
                    {formatearMoneda(
                      rifas.reduce((total, rifa) => 
                        total + rifa.premios.reduce((suma, premio) => suma + premio.valor, 0), 0
                      )
                    )}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sorteo en Vivo */}
        {rifaEnSorteo && (
          <div className="mb-8">
            <SorteadorRifa 
              rifa={rifaEnSorteo}
              onNumeroGanador={onNumeroGanador}
              onFinalizarSorteo={onFinalizarSorteo}
            />
          </div>
        )}

        {/* Creador de Rifas */}
        {mostrarCreador && esAdmin && (
          <div className="mb-8">
            <CrearRifa onCrearRifa={crearRifa} />
          </div>
        )}

        {/* Lista de Rifas */}
        <Tabs defaultValue="activas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activas">Rifas Activas</TabsTrigger>
            <TabsTrigger value="programadas">Programadas</TabsTrigger>
            <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
            {esAdmin && <TabsTrigger value="administrar">Administrar</TabsTrigger>}
          </TabsList>

          <TabsContent value="activas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rifas.filter(r => r.estado === 'activa').map(rifa => (
                <RifaCard
                  key={rifa.id}
                  rifa={rifa}
                  onComprarNumero={comprarNumero}
                  onVerDetalles={verDetalles}
                />
              ))}
            </div>
            {rifas.filter(r => r.estado === 'activa').length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay rifas activas</h3>
                  <p className="text-muted-foreground">
                    Las rifas aparecerán aquí cuando estén disponibles para participar
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="programadas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rifas.filter(r => r.estado === 'programada').map(rifa => (
                <RifaCard
                  key={rifa.id}
                  rifa={rifa}
                  onComprarNumero={comprarNumero}
                  onVerDetalles={verDetalles}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="finalizadas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rifas.filter(r => r.estado === 'finalizada').map(rifa => (
                <div key={rifa.id} className="relative">
                  <RifaCard
                    rifa={rifa}
                    onComprarNumero={comprarNumero}
                    onVerDetalles={verDetalles}
                  />
                  {rifa.numeroGanador && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-lg px-3 py-1">
                        Ganador: {rifa.numeroGanador}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {esAdmin && (
            <TabsContent value="administrar" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {rifas.map(rifa => (
                  <Card key={rifa.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">{rifa.nombre}</h3>
                          <p className="text-muted-foreground">{rifa.descripcion}</p>
                          <div className="flex space-x-4 mt-2">
                            <Badge className={
                              rifa.estado === 'activa' ? 'bg-green-500' :
                              rifa.estado === 'programada' ? 'bg-blue-500' :
                              rifa.estado === 'finalizada' ? 'bg-gray-500' :
                              'bg-red-500'
                            }>
                              {rifa.estado}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {rifa.numerosVendidos.length} números vendidos
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {rifa.estado === 'activa' && (
                            <Button onClick={() => iniciarSorteo(rifa.id)}>
                              Iniciar Sorteo
                            </Button>
                          )}
                          <Button variant="outline" onClick={() => verDetalles(rifa.id)}>
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Rifas;
