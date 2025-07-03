
import { PremioInstantaneo } from '@/types/rifa';

export const generarPremiosInstantaneos = (numerosDisponibles: number[]): PremioInstantaneo[] => {
  const premios: PremioInstantaneo[] = [];
  const numerosTotales = numerosDisponibles.length;
  
  // Configurar probabilidades
  const probabilidades = {
    gratis: 0.05, // 5% boleta gratis
    premio5000: 0.03, // 3% gana 5.000
    premio10000: 0.02, // 2% gana 10.000
    premio15000: 0.015, // 1.5% gana 15.000
    premio25000: 0.01, // 1% gana 25.000
    premio50000: 0.005 // 0.5% gana 50.000
  };

  // Calcular cantidad de premios por tipo
  const cantidadGratis = Math.floor(numerosTotales * probabilidades.gratis);
  const cantidad5000 = Math.floor(numerosTotales * probabilidades.premio5000);
  const cantidad10000 = Math.floor(numerosTotales * probabilidades.premio10000);
  const cantidad15000 = Math.floor(numerosTotales * probabilidades.premio15000);
  const cantidad25000 = Math.floor(numerosTotales * probabilidades.premio25000);
  const cantidad50000 = Math.floor(numerosTotales * probabilidades.premio50000);

  // Crear array de todos los números disponibles
  const numerosParaPremios = [...numerosDisponibles];
  
  // Función para seleccionar números aleatorios
  const seleccionarNumerosAleatorios = (cantidad: number): number[] => {
    const seleccionados: number[] = [];
    for (let i = 0; i < cantidad && numerosParaPremios.length > 0; i++) {
      const indice = Math.floor(Math.random() * numerosParaPremios.length);
      const numero = numerosParaPremios.splice(indice, 1)[0];
      seleccionados.push(numero);
    }
    return seleccionados;
  };

  // Generar premios gratis
  const numerosGratis = seleccionarNumerosAleatorios(cantidadGratis);
  numerosGratis.forEach(numero => {
    premios.push({
      id: `gratis-${numero}`,
      numeroRifa: numero,
      tipo: 'gratis',
      valor: 0,
      reclamado: false
    });
  });

  // Generar premios de 5.000
  const numeros5000 = seleccionarNumerosAleatorios(cantidad5000);
  numeros5000.forEach(numero => {
    premios.push({
      id: `5000-${numero}`,
      numeroRifa: numero,
      tipo: 'monto',
      valor: 5000,
      reclamado: false
    });
  });

  // Generar premios de 10.000
  const numeros10000 = seleccionarNumerosAleatorios(cantidad10000);
  numeros10000.forEach(numero => {
    premios.push({
      id: `10000-${numero}`,
      numeroRifa: numero,
      tipo: 'monto',
      valor: 10000,
      reclamado: false
    });
  });

  // Generar premios de 15.000
  const numeros15000 = seleccionarNumerosAleatorios(cantidad15000);
  numeros15000.forEach(numero => {
    premios.push({
      id: `15000-${numero}`,
      numeroRifa: numero,
      tipo: 'monto',
      valor: 15000,
      reclamado: false
    });
  });

  // Generar premios de 25.000
  const numeros25000 = seleccionarNumerosAleatorios(cantidad25000);
  numeros25000.forEach(numero => {
    premios.push({
      id: `25000-${numero}`,
      numeroRifa: numero,
      tipo: 'monto',
      valor: 25000,
      reclamado: false
    });
  });

  // Generar premios de 50.000
  const numeros50000 = seleccionarNumerosAleatorios(cantidad50000);
  numeros50000.forEach(numero => {
    premios.push({
      id: `50000-${numero}`,
      numeroRifa: numero,
      tipo: 'monto',
      valor: 50000,
      reclamado: false
    });
  });

  return premios;
};

export const verificarPremioInstantaneo = (numero: number, premios: PremioInstantaneo[]): PremioInstantaneo | null => {
  return premios.find(p => p.numeroRifa === numero && !p.reclamado) || null;
};

export const formatearPremioInstantaneo = (premio: PremioInstantaneo): string => {
  if (premio.tipo === 'gratis') {
    return '¡BOLETA GRATIS!';
  }
  
  return `¡GANASTE ${new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0
  }).format(premio.valor)}!`;
};
