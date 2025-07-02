
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Wallet, 
  LogOut, 
  Settings, 
  Bell,
  Menu
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { usuario, cerrarSesion } = useAuth();

  const formatearSaldo = (saldo: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(saldo);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-white text-blue-600 p-2 rounded-lg font-bold text-xl">
              B
            </div>
            <div>
              <h1 className="text-2xl font-bold">BingoMax</h1>
              <p className="text-sm opacity-90">Sistema de Bingo y Rifas</p>
            </div>
          </div>

          {/* Usuario y Navegación */}
          {usuario && (
            <div className="flex items-center space-x-4">
              {/* Saldo */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4" />
                  <span className="font-semibold">
                    {formatearSaldo(usuario.saldo)}
                  </span>
                </div>
              </div>

              {/* Notificaciones */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 text-xs">
                  3
                </Badge>
              </Button>

              {/* Menú de Usuario */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="bg-white/20 p-2 rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{usuario.nombre} {usuario.apellido}</p>
                      <p className="text-xs opacity-75 capitalize">{usuario.rol.replace('_', ' ')}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Wallet className="mr-2 h-4 w-4" />
                    Mi Billetera
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={cerrarSesion}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
