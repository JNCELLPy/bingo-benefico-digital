
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  fechaNacimiento: string;
  rol: 'super_admin' | 'admin' | 'vendedor' | 'jugador';
  estado: 'pendiente' | 'verificado' | 'suspendido';
  saldo: number;
  fechaRegistro: string;
  fotosCedula?: string[];
  fotoSelfie?: string;
  verificacionFacial?: boolean;
}

export interface Carton {
  id: string;
  numeros: number[][];
  jugadorId: string;
  sorteoId: string;
  precio: number;
  fechaCompra: string;
  estado: 'activo' | 'usado' | 'ganador';
  qrCode: string;
  tipo: 'digital' | 'fisico';
}

export interface Sorteo {
  id: string;
  nombre: string;
  fecha: string;
  hora: string;
  estado: 'programado' | 'en_curso' | 'finalizado' | 'cancelado';
  precioCarton: number;
  premios: Premio[];
  numerosLlamados: number[];
  cartones: Carton[];
  ganadores: Ganador[];
  transmisionUrl?: string;
  configuracion: ConfiguracionSorteo;
}

export interface Premio {
  id: string;
  nombre: string;
  descripcion: string;
  valor: number;
  tipo: 'linea' | 'forma' | 'bingo_completo' | 'especial';
  cantidad: number;
  imagen?: string;
}

export interface Ganador {
  id: string;
  jugadorId: string;
  cartonId: string;
  premioId: string;
  fechaGanador: string;
  verificado: boolean;
  entregado: boolean;
}

export interface Transaccion {
  id: string;
  usuarioId: string;
  tipo: 'recarga' | 'compra_carton' | 'premio' | 'retiro';
  monto: number;
  descripcion: string;
  fecha: string;
  estado: 'pendiente' | 'completada' | 'rechazada';
  metodoPago?: string;
}

export interface ConfiguracionSorteo {
  modalidadBingo: 'tradicional' | 'rapido' | 'progresivo';
  tiempoEntreBolas: number;
  permitirMultiplesGanadores: boolean;
  verificacionAutomatica: boolean;
}

export interface SolicitudRetiro {
  id: string;
  usuarioId: string;
  monto: number;
  metodoPago: string;
  detallesCuenta: string;
  fecha: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaProceso?: string;
  notas?: string;
}
