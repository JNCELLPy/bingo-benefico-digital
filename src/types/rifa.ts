
export interface Rifa {
  id: string;
  nombre: string;
  descripcion: string;
  fechaSorteo: string;
  horaSorteo: string;
  estado: 'programada' | 'activa' | 'sorteando' | 'finalizada' | 'cancelada';
  precioNumero: number;
  numerosDisponibles: number[];
  numerosVendidos: number[];
  numeroGanador?: number;
  premios: PremioRifa[];
  premiosInstantaneos: PremioInstantaneo[];
  imagen?: string;
  vendedorId?: string;
  configuracion: ConfiguracionRifa;
}

export interface PremioRifa {
  id: string;
  nombre: string;
  descripcion: string;
  valor: number;
  posicion: number; // 1er, 2do, 3er lugar
  imagen?: string;
  numeroGanador?: number;
  ganadorId?: string;
  fechaGanador?: string;
}

export interface PremioInstantaneo {
  id: string;
  numeroRifa: number;
  tipo: 'gratis' | 'monto';
  valor: number; // 0 para gratis, monto para premios en efectivo
  reclamado: boolean;
  compradorId?: string;
  fechaGanado?: string;
}

export interface NumeroRifa {
  id: string;
  numero: number;
  rifaId: string;
  compradorId: string;
  fechaCompra: string;
  estado: 'reservado' | 'pagado' | 'ganador';
  premioInstantaneo?: PremioInstantaneo;
}

export interface ConfiguracionRifa {
  numeroMinimo: number;
  numeroMaximo: number;
  permitirMultiplesNumeros: boolean;
  mostrarCompradores: boolean;
  sorteoAutomatico: boolean;
  pausaEntrePremios: number; // segundos entre sorteos
  premiosInstantaneosActivos: boolean;
}

export interface EspacioPublicitario {
  id: string;
  ubicacion: 'cabecera' | 'lateral_izquierda' | 'lateral_derecha' | 'pie' | 'banner_principal';
  titulo: string;
  contenido: string;
  imagen?: string;
  enlace?: string;
  activo: boolean;
  orden: number;
}
