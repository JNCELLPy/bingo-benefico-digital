
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import CrearRifa from '@/components/Rifa/CrearRifa';
import RifaCard from '@/components/Rifa/RifaCard';
import SorteadorRifa from '@/components/Rifa/SorteadorRifa';
import BuscadorBoletas from '@/components/Rifa/BuscadorBoletas';
import CuentaRegresiva from '@/components/Rifa/CuentaRegresiva';
import HistorialPremios from '@/components/Rifa/HistorialPremios';
import SelectorAleatorio from '@/components/Rifa/SelectorAleatorio';
import EspacioPublicitario from '@/components/Publicidad/EspacioPublicitario';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Gift, Clock, Trophy, Star } from 'lucide-react';
import { Rifa, EspacioPublicitario as TipoEspacioPublicitario } from '@/types/rifa';
import { generarPremiosInstantaneos } from '@/utils/premiosInstantaneos';

const Rifas = () => {
  const { usuario } = useAuth();
  const [rifas, setRifas] = useState<Rifa[]>([
    {
      id: '1',
      nombre: 'Rifa del Día de la Madre',
      descripcion: 'Participa y gana increíbles premios para mamá',
      fechaSorteo: '2024-12-15',
      horaSorteo: '20:00',
      estado: 'activa',
      precioNumero: 15000,
      numerosDisponibles: Array.from({ length: 100 }, (_, i) => i + 1),
      numerosVendidos: [1, 5, 12, 23, 34, 45, 56, 67, 78, 89],
      premios: [
        {
          id: '1',
          nombre: 'Spa Completo',
          descripcion: 'Día de relajación completo',
          valor: 2500000,
          posicion: 1
        },
        {
          id: '2',  
          nombre: 'Cena Romántica',
          descripcion: 'Para dos personas',
          valor: 800000,
          posicion: 2
        },
        {
          id: '3',
          nombre: 'Voucher de Compras',
          descripcion: 'Para shopping',
          valor: 500000,
          posicion: 3
        }
      ],
      premiosInstantaneos: [],
      configuracion: {
        numeroMinimo: 1,
        numeroMaximo: 100,
        permitirMultiplesNumeros: true,
        mostrarCompradores: true,
        sorteoAutomatico: true,
        pausaEntrePremios: 30,
        premiosInstantaneosActivos: true
      }
    }
  ]);

  const [espaciosPublicitarios] = useState<TipoEspacioPublicitario[]>([
    {
      id: '1',
      ubicacion: 'banner_principal',
      titulo: '🎉 RIFAS GARNÚ - Tu Suerte Te Espera 🎉',
      contenido: 'Participa en nuestras rifas y gana increíbles premios. ¡Premios instantáneos disponibles!',
      activo: true,
      orden: 1
    },
    {
      id: '2',
      ubicacion: 'lateral_derecha',
      titulo: '¡Descarga nuestra App!',
      contenido: 'Disponible en Google Play y App Store',
      activo: true,
      orden: 1
    }
  ]);
  
  const [rifaEnSorteo, setRifaEnSorteo] = useState<Rifa | null>(null);
  const [mostrarCreador, setMostrarCreador] = useState(false);
  const [mostrarSelector, setMostrarSelector] = useState<string | null>(null);

  const crearRifa = (nuevaRifa: Omit<Rifa, 'id'>) => {
    const numerosDisponibles = Array.from(
      { length: nuevaRifa.configuracion.numeroMaximo - nuevaRifa.configuracion.numeroMinimo + 1 }, 
      (_, i) => nuevaRifa.configuracion.numeroMinimo + i
    );
    
    const premiosInstantaneos = nuevaRifa.configuracion.premiosInstantaneosActivos 
      ? generarPremiosInstantaneos(numerosDisponibles)
      : [];

    const rifa: Rifa = {
      ...nuevaRifa,
      id: Date.now().toString(),
      numerosDisponibles,
      premiosInstantaneos
    };
    setRifas([...rifas, rifa]);
    setMostrarCreador(false);
  };

  const comprarNumerosAleatorios = (rifaId: string, numeros: number[]) => {
    // Aquí iría la lógica para procesar la compra
    console.log('Comprando números:', numeros, 'para rifa:', rifaId);
    
    // Actualizar números vendidos
    setRifas(rifas.map(r => 
      r.id === rifaId 
        ? { ...r, numerosVendidos: [...r.numerosVendidos, ...numeros] }
        : r
    ));
    
    setMostrarSelector(null);
    alert(`¡Compra exitosa! Números adquiridos: ${numeros.join(', ')}`);
  };

  const verDetalles = (rifaId: string) => {
    console.log('Ver detalles de rifa:', rifaId);
  };

  const iniciarSorteo = (rifaId: string) => {
    const rifa = rifas.find(r => r.id === rifaId);
    if (rifa) {
      setRifaEnSorteo(rifa);
      setRifas(rifas.map(r => 
        r.id === rifaId ? { ...r, estado: 'sorteando' } : r
      ));
    }
  };

  const onNumeroGanador = (rifaId: string, premioId: string, numeroGanador: number) => {
    setRifas(rifas.map(r => 
      r.id === rifaId 
        ? { 
            ...r, 
            premios: r.premios.map(p => 
              p.id === premioId 
                ? { ...p, numeroGanador, ganadorId: 'usuario123', fechaGanador: new Date().toISOString() }
                : p
            )
          }
        : r
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

  const obtenerEspaciosPorUbicacion = (ubicacion: string) => {
    return espaciosPublicitarios
      .filter(e => e.ubicacion === ubicacion && e.activo)
      .sort((a, b) => a.orden - b.orden);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4">
          {obtenerEspaciosPorUbicacion('banner_principal').map(espacio => (
            <div key={espacio.id} className="text-center">
              <h1 className="text-4xl font-bold mb-2">{espacio.titulo}</h1>
              <p className="text-xl">{espacio.contenido}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Espacios Publicitarios Cabecera */}
      <div className="bg-white shadow-sm py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-4">
            {obtenerEspaciosPorUbicacion('cabecera').map(espacio => (
              <EspacioPublicitario key={espacio.id} espacio={espacio} className="flex-1 max-w-sm" />
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex">
          {/* Publicidad Lateral Izquierda */}
          <div className="hidden lg:block w-64 mr-6">
            <div className="sticky top-8 space-y-4">
              {obtenerEspaciosPorUbicacion('lateral_izquierda').map(espacio => (
                <EspacioPublicitario key={espacio.id} espacio={espacio} />
              ))}
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">Sistema de Rifas</h2>
                <p className="text-muted-foreground">Participa en rifas emocionantes y gana increíbles premios</p>
              </div>
              {esAdmin && (
                <Button onClick={() => setMostrarCreador(!mostrarCreador)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {mostrarCreador ? 'Ocultar' : 'Crear Rifa'}
                </Button>
              )}
            </div>

            {/* Rifas Activas con Cuenta Regresiva */}
            {rifas.filter(r => r.estado === 'activa').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  Rifas Activas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rifas.filter(r => r.estado === 'activa').map(rifa => (
                    <CuentaRegresiva
                      key={rifa.id}
                      fechaSorteo={rifa.fechaSorteo}
                      horaSorteo={rifa.horaSorteo}
                      nombreRifa={rifa.nombre}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Buscador de Boletas */}
            <div className="mb-8">
              <BuscadorBoletas />
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

            {/* Selector Aleatorio */}
            {mostrarSelector && (
              <div className="mb-8">
                {(() => {
                  const rifa = rifas.find(r => r.id === mostrarSelector);
                  return rifa ? (
                    <SelectorAleatorio
                      numerosDisponibles={rifa.numerosDisponibles.filter(n => !rifa.numerosVendidos.includes(n))}
                      precioNumero={rifa.precioNumero}
                      onSeleccionConfirmada={(numeros) => comprarNumerosAleatorios(rifa.id, numeros)}
                    />
                  ) : null;
                })()}
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
                <TabsTrigger value="historial">Historial de Premios</TabsTrigger>
                {esAdmin && <TabsTrigger value="administrar">Administrar</TabsTrigger>}
              </TabsList>

              <TabsContent value="activas" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rifas.filter(r => r.estado === 'activa').map(rifa => (
                    <div key={rifa.id} className="space-y-4">
                      <RifaCard
                        rifa={rifa}
                        onComprarNumero={() => setMostrarSelector(rifa.id)}
                        onVerDetalles={verDetalles}
                      />
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setMostrarSelector(mostrarSelector === rifa.id ? null : rifa.id)}
                      >
                        <Shuffle className="mr-2 h-4 w-4" />
                        Selección Aleatoria
                      </Button>
                    </div>
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
                      onComprarNumero={() => setMostrarSelector(rifa.id)}
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
                        onComprarNumero={() => {}}
                        onVerDetalles={verDetalles}
                      />
                      {rifa.premios.some(p => p.numeroGanador) && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-yellow-500 text-lg px-3 py-1">
                            ¡Finalizada!
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="historial" className="space-y-4">
                <HistorialPremios />
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
                                {rifa.configuracion.premiosInstantaneosActivos && (
                                  <Badge variant="outline">
                                    Premios Instantáneos
                                  </Badge>
                                )}
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
          </div>

          {/* Publicidad Lateral Derecha */}
          <div className="hidden lg:block w-64 ml-6">
            <div className="sticky top-8 space-y-4">
              {obtenerEspaciosPorUbicacion('lateral_derecha').map(espacio => (
                <EspacioPublicitario key={espacio.id} espacio={espacio} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Espacios Publicitarios Pie */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {obtenerEspaciosPorUbicacion('pie').map(espacio => (
              <EspacioPublicitario key={espacio.id} espacio={espacio} />
            ))}
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">🎉 RIFAS GARNÚ</h3>
              <p className="text-sm">Tu suerte te espera - Rifas con premios instantáneos</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Rifas;
