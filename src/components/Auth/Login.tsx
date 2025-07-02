
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Lock, Mail, User, Phone, Calendar, CreditCard } from 'lucide-react';

const Login = () => {
  const { iniciarSesion, registrarUsuario } = useAuth();
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Estados para login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para registro
  const [datosRegistro, setDatosRegistro] = useState({
    email: '',
    password: '',
    confirmarPassword: '',
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    fechaNacimiento: ''
  });

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const exito = await iniciarSesion(email, password);
      if (!exito) {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    // Validaciones
    if (datosRegistro.password !== datosRegistro.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      setCargando(false);
      return;
    }

    if (datosRegistro.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setCargando(false);
      return;
    }

    // Validar mayoría de edad
    const fechaNac = new Date(datosRegistro.fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    if (edad < 18) {
      setError('Debes ser mayor de 18 años para registrarte');
      setCargando(false);
      return;
    }

    try {
      const exito = await registrarUsuario(datosRegistro, datosRegistro.password);
      if (exito) {
        alert('Registro exitoso. Tu cuenta está pendiente de verificación.');
      } else {
        setError('Error al registrar usuario');
      }
    } catch (err) {
      setError('Error al registrar usuario');
    } finally {
      setCargando(false);
    }
  };

  const actualizarDatosRegistro = (campo: string, valor: string) => {
    setDatosRegistro(prev => ({ ...prev, [campo]: valor }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="bg-white text-blue-600 p-4 rounded-full inline-block mb-4">
            <div className="text-3xl font-bold">B</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">BingoMax</h1>
          <p className="text-white/80">Sistema de Bingo y Rifas Online</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Bienvenido</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="registro">Registrarse</TabsTrigger>
              </TabsList>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <TabsContent value="login">
                <form onSubmit={manejarLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={mostrarPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tu contraseña"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={cargando}
                  >
                    {cargando ? 'Iniciando...' : 'Iniciar Sesión'}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Button variant="link" size="sm">
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="registro">
                <form onSubmit={manejarRegistro} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="nombre"
                          value={datosRegistro.nombre}
                          onChange={(e) => actualizarDatosRegistro('nombre', e.target.value)}
                          placeholder="Tu nombre"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        value={datosRegistro.apellido}
                        onChange={(e) => actualizarDatosRegistro('apellido', e.target.value)}
                        placeholder="Tu apellido"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cedula">Cédula de Identidad</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="cedula"
                        value={datosRegistro.cedula}
                        onChange={(e) => actualizarDatosRegistro('cedula', e.target.value)}
                        placeholder="12345678"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="telefono"
                        value={datosRegistro.telefono}
                        onChange={(e) => actualizarDatosRegistro('telefono', e.target.value)}
                        placeholder="+595981234567"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fechaNacimiento"
                        type="date"
                        value={datosRegistro.fechaNacimiento}
                        onChange={(e) => actualizarDatosRegistro('fechaNacimiento', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email-registro">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email-registro"
                        type="email"
                        value={datosRegistro.email}
                        onChange={(e) => actualizarDatosRegistro('email', e.target.value)}
                        placeholder="tu@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password-registro">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password-registro"
                        type="password"
                        value={datosRegistro.password}
                        onChange={(e) => actualizarDatosRegistro('password', e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmar-password">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmar-password"
                        type="password"
                        value={datosRegistro.confirmarPassword}
                        onChange={(e) => actualizarDatosRegistro('confirmarPassword', e.target.value)}
                        placeholder="Repite tu contraseña"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
                    <p>• Debes ser mayor de 18 años</p>
                    <p>• Tu cuenta será verificada antes de la activación</p>
                    <p>• Necesitarás subir fotos de tu cédula y selfie</p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    disabled={cargando}
                  >
                    {cargando ? 'Registrando...' : 'Crear Cuenta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-white/80 text-sm">
          <p>Al registrarte, aceptas nuestros términos y condiciones</p>
          <p>Sistema seguro y confiable • Paraguay 🇵🇾</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
