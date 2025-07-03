
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EspacioPublicitario as TipoEspacioPublicitario } from '@/types/rifa';

interface EspacioPublicitarioProps {
  espacio: TipoEspacioPublicitario;
  className?: string;
}

const EspacioPublicitario: React.FC<EspacioPublicitarioProps> = ({ espacio, className = '' }) => {
  if (!espacio.activo) return null;

  const handleClick = () => {
    if (espacio.enlace) {
      window.open(espacio.enlace, '_blank');
    }
  };

  return (
    <Card className={`${className} ${espacio.enlace ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`} onClick={handleClick}>
      <CardContent className="p-4">
        {espacio.imagen && (
          <img 
            src={espacio.imagen} 
            alt={espacio.titulo}
            className="w-full h-auto rounded mb-2"
          />
        )}
        {espacio.titulo && (
          <h3 className="font-semibold text-sm mb-1">{espacio.titulo}</h3>
        )}
        {espacio.contenido && (
          <p className="text-xs text-muted-foreground">{espacio.contenido}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EspacioPublicitario;
