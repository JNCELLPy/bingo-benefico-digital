
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
}

export interface NumeroRifa {
  id: string;
  numero: number;
  rifaId: string;
  compradorId: string;
  fechaCompra: string;
  estado: 'reservado' | 'pagado' | 'ganador';
}

export interface ConfiguracionRifa {
  numeroMinimo: number;
  numeroMaximo: number;
  permitirMultiplesNumeros: boolean;
  mostrarCompradores: boolean;
  sorteoAutomatico: boolean;
}
