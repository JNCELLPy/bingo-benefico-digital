
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Trophy, 
  Wallet, 
  Settings,
  BarChart3,
  DollarSign,
  UserCheck,
  AlertCircle
} from 'lucide-react';

const PanelAdministrativo = () => {
  const [estadisticas] = useState({
    usuariosActivos: 1247,
    sorteosHoy: 3,
    ventasHoy: 125000,
    premiosEntregados: 85000,
    usuariosPendientes: 12,
    retirosEnProceso: 8
  });

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel Administrativo</h1>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </Button>
      </div>

      {/* Tarjetas de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usuarios Activos</p>
                <p className="text-2xl font-bold">{estadisticas.usuariosActivos}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sorteos Hoy</p>
                <p className="text-2xl font-bold">{estadisticas.sorteosHoy}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ventas Hoy</p>
                <p className="text-2xl font-bold">{formatearMoneda(estadisticas.ventasHoy)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Premios Entregados</p>
                <p className="text-2xl font-bold">{formatearMoneda(estadisticas.premiosEntregados)}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Notificaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <UserCheck className="mr-2 h-5 w-5" />
              Usuarios Pendientes de Verificación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-orange-800">
                {estadisticas.usuariosPendientes}
              </span>
              <Button variant="outline" size="sm">
                Revisar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertCircle className="mr-2 h-5 w-5" />
              Retiros en Proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-red-800">
                {estadisticas.retirosEnProceso}
              </span>
              <Button variant="outline" size="sm">
                Procesar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas de Gestión */}
      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="sorteos">Sorteos</TabsTrigger>
          <TabsTrigger value="finanzas">Finanzas</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Juan Pérez</h4>
                    <p className="text-sm text-muted-foreground">juan@email.com</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">Pendiente</Badge>
                    <Button size="sm">Verificar</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">María González</h4>
                    <p className="text-sm text-muted-foreground">maria@email.com</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className="bg-green-500">Verificado</Badge>
                    <Button size="sm" variant="outline">Ver</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sorteos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Sorteos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">Crear Nuevo Sorteo</Button>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Bingo Nocturno</h4>
                      <p className="text-sm text-muted-foreground">Hoy 20:00</p>
                    </div>
                    <Badge className="bg-blue-500">Programado</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finanzas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión Financiera</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-semibold">Ingresos del Mes</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatearMoneda(2500000)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-semibold">Premios Pagados</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {formatearMoneda(1200000)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-semibold">Ganancia Neta</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatearMoneda(1300000)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reportes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reportes y Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generar Reporte de Ventas
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Reporte de Usuarios
                </Button>
                <Button variant="outline" className="w-full">
                  <Trophy className="mr-2 h-4 w-4" />
                  Reporte de Premios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PanelAdministrativo;
