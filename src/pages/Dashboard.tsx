
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import CartonBingo from '@/components/Bingo/CartonBingo';
import SorteoEnVivo from '@/components/Sorteo/SorteoEnVivo';
import PanelAdministrativo from '@/components/Admin/PanelAdministrativo';
import BilleteraVirtual from '@/components/Billetera/BilleteraVirtual';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  ShoppingCart, 
  Trophy, 
  Calendar,
  Users,
  Gamepad2
} from 'lucide-react';
import { Carton, Sorteo } from '@/types/bingo';

const Dashboard = () => {
  const { usuario } = useAuth();
  const [sorteoActivo, setSorteoActivo] = useState<Sorteo | null>(null);
  
  // Datos de ejemplo
  const [misCartones] = useState<Carton[]>([
    {
      id: '1',
      numeros: [
        [12, 18, 32, 47, 63],
        [5, 21, 35, 52, 68],
        [9, 24, 0, 58, 71], // 0 representa el espacio libre
        [3, 19, 41, 54, 67],
        [14, 28, 43, 49, 75]
      ],
      jugadorId: usuario?.id || '',
      sorteoId: '1',
      precio: 15000,
      fechaCompra: new Date().toISOString(),
      estado: 'activo',
      qrCode: 'QR123456',
      tipo: 'digital'
    }
  ]);

  const [proximosSorteos] = useState<Sorteo[]>([
    {
      id: '1',
      nombre: 'Bingo Nocturno',
      fecha: new Date().toDateString(),
      hora: '20:00',
      estado: 'programado',
      precioCarton: 15000,
      premios: [
        {
          id: '1',
          nombre: 'Primer Premio',
          descripcion: 'Bingo completo',
          valor: 500000,
          tipo: 'bingo_completo',
          cantidad: 1
        }
      ],
      numerosLlamados: [],
      cartones: [],
      ganadores: [],
      configuracion: {
        modalidadBingo: 'tradicional',
        tiempoEntreBolas: 5,
        permitirMultiplesGanadores: true,
        verificacionAutomatica: true
      }
    }
  ]);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const renderizarContenidoPorRol = () => {
    if (!usuario) return null;

    switch (usuario.rol) {
      case 'super_admin':
      case 'admin':
        return <PanelAdministrativo />;
      
      default:
        return (
          <div className="space-y-6">
            {/* Resumen Rápido */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Mis Cartones</p>
                      <p className="text-2xl font-bold">{misCartones.length}</p>
                    </div>
                    <Gamepad2 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Saldo</p>
                      <p className="text-2xl font-bold">{formatearMoneda(usuario.saldo)}</p>
                    </div>
                    <Trophy className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Próximos Sorteos</p>
                      <p className="text-2xl font-bold">{proximosSorteos.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Premios Ganados</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contenido Principal */}
            <Tabs defaultValue="sorteos" className="space-y-4">
              <TabsList>
                <TabsTrigger value="sorteos">Sorteos</TabsTrigger>
                <TabsTrigger value="cartones">Mis Cartones</TabsTrigger>
                <TabsTrigger value="billetera">Billetera</TabsTrigger>
              </TabsList>

              <TabsContent value="sorteos" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Sorteos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {proximosSorteos.map((sorteo) => (
                        <div key={sorteo.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold text-lg">{sorteo.nombre}</h3>
                            <p className="text-muted-foreground">
                              {sorteo.fecha} a las {sorteo.hora}
                            </p>
                            <p className="text-sm">
                              Precio del cartón: {formatearMoneda(sorteo.precioCarton)}
                            </p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Badge variant="outline">{sorteo.estado}</Badge>
                            <Button>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Comprar Cartón
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cartones" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {misCartones.map((carton) => (
                    <CartonBingo 
                      key={carton.id} 
                      carton={carton} 
                      mostrarControles={true}
                    />
                  ))}
                </div>
                {misCartones.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No tienes cartones</h3>
                      <p className="text-muted-foreground mb-4">
                        Compra tu primer cartón para participar en los sorteos
                      </p>
                      <Button>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Comprar Cartón
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="billetera">
                <BilleteraVirtual />
              </TabsContent>
            </Tabs>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderizarContenidoPorRol()}
      </main>
    </div>
  );
};

export default Dashboard;
