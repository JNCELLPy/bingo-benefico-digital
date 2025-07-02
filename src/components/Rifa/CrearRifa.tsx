
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { Rifa, PremioRifa } from '@/types/rifa';

interface CrearRifaProps {
  onCrearRifa: (rifa: Omit<Rifa, 'id'>) => void;
}

const CrearRifa: React.FC<CrearRifaProps> = ({ onCrearRifa }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaSorteo, setFechaSorteo] = useState<Date>();
  const [horaSorteo, setHoraSorteo] = useState('');
  const [precioNumero, setPrecioNumero] = useState(0);
  const [numeroMinimo, setNumeroMinimo] = useState(1);
  const [numeroMaximo, setNumeroMaximo] = useState(100);
  const [premios, setPremios] = useState<PremioRifa[]>([{
    id: '1',
    nombre: 'Primer Premio',
    descripcion: '',
    valor: 0,
    posicion: 1
  }]);

  const agregarPremio = () => {
    const nuevoPremio: PremioRifa = {
      id: Date.now().toString(),
      nombre: `Premio ${premios.length + 1}`,
      descripcion: '',
      valor: 0,
      posicion: premios.length + 1
    };
    setPremios([...premios, nuevoPremio]);
  };

  const eliminarPremio = (id: string) => {
    setPremios(premios.filter(p => p.id !== id));
  };

  const actualizarPremio = (id: string, campo: keyof PremioRifa, valor: any) => {
    setPremios(premios.map(p => 
      p.id === id ? { ...p, [campo]: valor } : p
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaSorteo || !horaSorteo) return;

    const numerosDisponibles = Array.from(
      { length: numeroMaximo - numeroMinimo + 1 }, 
      (_, i) => numeroMinimo + i
    );

    const nuevaRifa: Omit<Rifa, 'id'> = {
      nombre,
      descripcion,
      fechaSorteo: fechaSorteo.toISOString(),
      horaSorteo,
      estado: 'programada',
      precioNumero,
      numerosDisponibles,
      numerosVendidos: [],
      premios,
      configuracion: {
        numeroMinimo,
        numeroMaximo,
        permitirMultiplesNumeros: true,
        mostrarCompradores: true,
        sorteoAutomatico: false
      }
    };

    onCrearRifa(nuevaRifa);
    
    // Limpiar formulario
    setNombre('');
    setDescripcion('');
    setFechaSorteo(undefined);
    setHoraSorteo('');
    setPrecioNumero(0);
    setNumeroMinimo(1);
    setNumeroMaximo(100);
    setPremios([{
      id: '1',
      nombre: 'Primer Premio',
      descripcion: '',
      valor: 0,
      posicion: 1
    }]);
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nueva Rifa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre de la Rifa</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Rifa del Día de la Madre"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="precioNumero">Precio por Número</Label>
              <Input
                id="precioNumero"
                type="number"
                value={precioNumero}
                onChange={(e) => setPrecioNumero(Number(e.target.value))}
                placeholder="10000"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe la rifa..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Fecha del Sorteo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fechaSorteo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaSorteo ? format(fechaSorteo, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fechaSorteo}
                    onSelect={setFechaSorteo}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="hora">Hora del Sorteo</Label>
              <Input
                id="hora"
                type="time"
                value={horaSorteo}
                onChange={(e) => setHoraSorteo(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="numeroMinimo">Número Mín.</Label>
                <Input
                  id="numeroMinimo"
                  type="number"
                  value={numeroMinimo}
                  onChange={(e) => setNumeroMinimo(Number(e.target.value))}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="numeroMaximo">Número Máx.</Label>
                <Input
                  id="numeroMaximo"
                  type="number"
                  value={numeroMaximo}
                  onChange={(e) => setNumeroMaximo(Number(e.target.value))}
                  min="1"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Premios</Label>
              <Button type="button" onClick={agregarPremio} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Premio
              </Button>
            </div>
            
            <div className="space-y-4">
              {premios.map((premio, index) => (
                <div key={premio.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{index + 1}° Premio</h4>
                    {premios.length > 1 && (
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        onClick={() => eliminarPremio(premio.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Nombre del Premio</Label>
                      <Input
                        value={premio.nombre}
                        onChange={(e) => actualizarPremio(premio.id, 'nombre', e.target.value)}
                        placeholder="Ej: Televisor 50 pulgadas"
                      />
                    </div>
                    
                    <div>
                      <Label>Valor</Label>
                      <Input
                        type="number"
                        value={premio.valor}
                        onChange={(e) => actualizarPremio(premio.id, 'valor', Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <Label>Descripción</Label>
                      <Input
                        value={premio.descripcion}
                        onChange={(e) => actualizarPremio(premio.id, 'descripcion', e.target.value)}
                        placeholder="Descripción del premio"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Crear Rifa
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CrearRifa;
