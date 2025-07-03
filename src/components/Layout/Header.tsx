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
  Play,
  Trophy,
  Gamepad2,
  BarChart3
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
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
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Navegación */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8" />
              <span className="text-xl font-bold">🎉 RIFAS GARNÚ</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className="hover:text-yellow-300 transition-colors flex items-center space-x-1"
              >
                <Home className="h-4 w-4" />
                <span>Inicio</span>
              </Link>
              <Link 
                to="/rifas" 
                className="hover:text-yellow-300 transition-colors flex items-center space-x-1"
              >
                <Gift className="h-4 w-4" />
                <span>Rifas</span>
              </Link>
              <Link 
                to="/bingo-vivo" 
                className="hover:text-yellow-300 transition-colors flex items-center space-x-1"
              >
                <Gamepad2 className="h-4 w-4" />
                <span>Bingo en Vivo</span>
              </Link>
              {esAdminOVendedor && (
                <Link 
                  to="/dashboard" 
                  className="hover:text-yellow-300 transition-colors flex items-center space-x-1"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Panel</span>
                </Link>
              )}
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
