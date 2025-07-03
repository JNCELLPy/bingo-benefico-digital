
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import { EspacioPublicitario } from '@/types/rifa';

const GestorPublicidad: React.FC = () => {
  const [espacios, setEspacios] = useState<EspacioPublicitario[]>([
    {
      id: '1',
      ubicacion: 'banner_principal',
      titulo: 'RIFAS GARNÚ - Tu Suerte Te Espera',
      contenido: 'Participa en nuestras rifas y gana increíbles premios',
      activo: true,
      orden: 1
    }
  ]);

  const [editando, setEditando] = useState<EspacioPublicitario | null>(null);
  const [nuevoEspacio, setNuevoEspacio] = useState({
    ubicacion: 'cabecera' as const,
    titulo: '',
    contenido: '',
    imagen: '',
    enlace: '',
    activo: true,
    orden: 1
  });

  const ubicaciones = [
    { value: 'cabecera', label: 'Cabecera' },
    { value: 'lateral_izquierda', label: 'Lateral Izquierda' },
    { value: 'lateral_derecha', label: 'Lateral Derecha' },
    { value: 'pie', label: 'Pie de Página' },
    { value: 'banner_principal', label: 'Banner Principal' }
  ];

  const agregarEspacio = () => {
    const espacio: EspacioPublicitario = {
      ...nuevoEspacio,
      id: Date.now().toString()
    };
    setEspacios([...espacios, espacio]);
    setNuevoEspacio({
      ubicacion: 'cabecera',
      titulo: '',
      contenido: '',
      imagen: '',
      enlace: '',
      activo: true,
      orden: 1
    });
  };

  const actualizarEspacio = (id: string, campo: keyof EspacioPublicitario, valor: any) => {
    setEspacios(espacios.map(e => 
      e.id === id ? { ...e, [campo]: valor } : e
    ));
  };

  const eliminarEspacio = (id: string) => {
    setEspacios(espacios.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Image className="mr-2 h-5 w-5" />
            Gestión de Espacios Publicitarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Ubicación</Label>
              <Select value={nuevoEspacio.ubicacion} onValueChange={(value: any) => setNuevoEspacio({...nuevoEspacio, ubicacion: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ubicaciones.map(ub => (
                    <SelectItem key={ub.value} value={ub.value}>{ub.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Título</Label>
              <Input
                value={nuevoEspacio.titulo}
                onChange={(e) => setNuevoEspacio({...nuevoEspacio, titulo: e.target.value})}
                placeholder="Título del anuncio"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label>Contenido</Label>
              <Textarea
                value={nuevoEspacio.contenido}
                onChange={(e) => setNuevoEspacio({...nuevoEspacio, contenido: e.target.value})}
                placeholder="Descripción del anuncio"
                rows={3}
              />
            </div>
            
            <div>
              <Label>URL de Imagen</Label>
              <Input
                value={nuevoEspacio.imagen}
                onChange={(e) => setNuevoEspacio({...nuevoEspacio, imagen: e.target.value})}
                placeholder="https://..."
              />
            </div>
            
            <div>
              <Label>Enlace (opcional)</Label>
              <Input
                value={nuevoEspacio.enlace}
                onChange={(e) => setNuevoEspacio({...nuevoEspacio, enlace: e.target.value})}
                placeholder="https://..."
              />
            </div>
          </div>
          
          <Button onClick={agregarEspacio} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Espacio Publicitario
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {espacios.map(espacio => (
          <Card key={espacio.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-semibold">{espacio.titulo}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {ubicaciones.find(u => u.value === espacio.ubicacion)?.label}
                    </span>
                    <Switch
                      checked={espacio.activo}
                      onCheckedChange={(checked) => actualizarEspacio(espacio.id, 'activo', checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{espacio.contenido}</p>
                  {espacio.enlace && (
                    <p className="text-xs text-blue-600 mt-1">{espacio.enlace}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => eliminarEspacio(espacio.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GestorPublicidad;
