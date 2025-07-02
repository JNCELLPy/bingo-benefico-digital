
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '@/types/bingo';

interface AuthContextType {
  usuario: Usuario | null;
  iniciarSesion: (email: string, password: string) => Promise<boolean>;
  cerrarSesion: () => void;
  registrarUsuario: (datos: Partial<Usuario>, password: string) => Promise<boolean>;
  actualizarUsuario: (datos: Partial<Usuario>) => void;
  cargando: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Cargar usuario del localStorage al iniciar
    const usuarioGuardado = localStorage.getItem('usuario_bingo');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  const iniciarSesion = async (email: string, password: string): Promise<boolean> => {
    setCargando(true);
    try {
      // Simulación de autenticación - aquí conectarías con Supabase
      const usuarioSimulado: Usuario = {
        id: '1',
        email,
        nombre: 'Juan',
        apellido: 'Pérez',
        cedula: '12345678',
        telefono: '+595981234567',
        fechaNacimiento: '1990-01-01',
        rol: email.includes('admin') ? 'admin' : 'jugador',
        estado: 'verificado',
        saldo: 50000,
        fechaRegistro: new Date().toISOString(),
        verificacionFacial: true
      };

      setUsuario(usuarioSimulado);
      localStorage.setItem('usuario_bingo', JSON.stringify(usuarioSimulado));
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    } finally {
      setCargando(false);
    }
  };

  const registrarUsuario = async (datos: Partial<Usuario>, password: string): Promise<boolean> => {
    setCargando(true);
    try {
      // Aquí conectarías con Supabase para registrar el usuario
      const nuevoUsuario: Usuario = {
        id: Date.now().toString(),
        email: datos.email!,
        nombre: datos.nombre!,
        apellido: datos.apellido!,
        cedula: datos.cedula!,
        telefono: datos.telefono!,
        fechaNacimiento: datos.fechaNacimiento!,
        rol: 'jugador',
        estado: 'pendiente',
        saldo: 0,
        fechaRegistro: new Date().toISOString(),
        verificacionFacial: false
      };

      console.log('Usuario registrado:', nuevoUsuario);
      return true;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return false;
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuario_bingo');
  };

  const actualizarUsuario = (datos: Partial<Usuario>) => {
    if (usuario) {
      const usuarioActualizado = { ...usuario, ...datos };
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario_bingo', JSON.stringify(usuarioActualizado));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        iniciarSesion,
        cerrarSesion,
        registrarUsuario,
        actualizarUsuario,
        cargando
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
