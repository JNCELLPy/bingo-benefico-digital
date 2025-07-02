
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Settings, 
  Wallet,
  Home,
  Gift,
  Play
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const navegarA = (ruta: string) => {
    navigate(ruta);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo y Navegación */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg">
                <div className="text-xl font-bold">B</div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">BingoMax</h1>
                <p className="text-xs text-gray-500">Sistema Integral</p>
              </div>
            </div>
            
            {/* Navegación */}
            <nav className="hidden md:flex space-x-1">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                onClick={() => navegarA('/')}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
              
              <Button
                variant={isActive('/rifas') ? 'default' : 'ghost'}
                onClick={() => navegarA('/rifas')}
                className="flex items-center space-x-2"
              >
                <Gift className="h-4 w-4" />
                <span>Rifas</span>
              </Button>
              
              <Button
                variant={isActive('/bingo-vivo') ? 'default' : 'ghost'}
                onClick={() => navegarA('/bingo-vivo')}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Bingo en Vivo</span>
              </Button>
            </nav>
          </div>

          {/* Usuario y Controles */}
          <div className="flex items-center space-x-4">
            {/* Saldo */}
            <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
              <Wallet className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-800">
                {formatearMoneda(usuario?.saldo || 0)}
              </span>
            </div>

            {/* Información del Usuario */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {usuario?.nombre} {usuario?.apellido}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={usuario?.rol === 'super_admin' || usuario?.rol === 'admin' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {usuario?.rol?.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge 
                    variant={usuario?.estado === 'verificado' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {usuario?.estado?.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={cerrarSesion}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación móvil */}
        <nav className="md:hidden flex justify-center space-x-1 mt-3 pt-3 border-t">
          <Button
            variant={isActive('/') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navegarA('/')}
            className="flex items-center space-x-1"
          >
            <Home className="h-4 w-4" />
            <span className="text-xs">Dashboard</span>
          </Button>
          
          <Button
            variant={isActive('/rifas') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navegarA('/rifas')}
            className="flex items-center space-x-1"
          >
            <Gift className="h-4 w-4" />
            <span className="text-xs">Rifas</span>
          </Button>
          
          <Button
            variant={isActive('/bingo-vivo') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navegarA('/bingo-vivo')}
            className="flex items-center space-x-1"
          >
            <Play className="h-4 w-4" />
            <span className="text-xs">Bingo</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
