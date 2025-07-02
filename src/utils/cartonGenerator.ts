
export const generarCartonBingo = (): number[][] => {
  const carton: number[][] = [[], [], [], [], []];
  
  // Rangos para cada columna del bingo
  const rangos = [
    [1, 15],   // B
    [16, 30],  // I
    [31, 45],  // N
    [46, 60],  // G
    [61, 75]   // O
  ];

  for (let col = 0; col < 5; col++) {
    const numerosDisponibles = [];
    const [min, max] = rangos[col];
    
    // Generar números disponibles para esta columna
    for (let i = min; i <= max; i++) {
      numerosDisponibles.push(i);
    }
    
    // Seleccionar 5 números únicos para esta columna
    for (let fila = 0; fila < 5; fila++) {
      if (col === 2 && fila === 2) {
        // Espacio libre en el centro (N)
        carton[fila][col] = 0;
      } else {
        const indiceAleatorio = Math.floor(Math.random() * numerosDisponibles.length);
        const numeroSeleccionado = numerosDisponibles.splice(indiceAleatorio, 1)[0];
        carton[fila][col] = numeroSeleccionado;
      }
    }
  }

  return carton;
};

export const generarQRCode = (cartonId: string): string => {
  // En una implementación real, aquí generarías un QR code real
  return `QR_${cartonId}_${Date.now()}`;
};

export const validarCartonGanador = (
  carton: number[][],
  numerosLlamados: number[]
): { esGanador: boolean; tipoGanador: string; lineasGanadoras: number[] } => {
  const result = {
    esGanador: false,
    tipoGanador: '',
    lineasGanadoras: [] as number[]
  };

  // Verificar bingo completo
  let numerosCompletos = 0;
  for (let fila = 0; fila < 5; fila++) {
    for (let col = 0; col < 5; col++) {
      const numero = carton[fila][col];
      if (numero === 0 || numerosLlamados.includes(numero)) {
        numerosCompletos++;
      }
    }
  }

  if (numerosCompletos === 25) {
    result.esGanador = true;
    result.tipoGanador = 'bingo_completo';
    return result;
  }

  // Verificar líneas horizontales
  for (let fila = 0; fila < 5; fila++) {
    let lineaCompleta = true;
    for (let col = 0; col < 5; col++) {
      const numero = carton[fila][col];
      if (numero !== 0 && !numerosLlamados.includes(numero)) {
        lineaCompleta = false;
        break;
      }
    }
    if (lineaCompleta) {
      result.esGanador = true;
      result.tipoGanador = result.tipoGanador || 'linea';
      result.lineasGanadoras.push(fila);
    }
  }

  // Verificar líneas verticales
  for (let col = 0; col < 5; col++) {
    let lineaCompleta = true;
    for (let fila = 0; fila < 5; fila++) {
      const numero = carton[fila][col];
      if (numero !== 0 && !numerosLlamados.includes(numero)) {
        lineaCompleta = false;
        break;
      }
    }
    if (lineaCompleta) {
      result.esGanador = true;
      result.tipoGanador = result.tipoGanador || 'linea';
      result.lineasGanadoras.push(col + 5); // +5 para diferenciar de filas
    }
  }

  // Verificar diagonales
  let diagonalPrincipal = true;
  let diagonalSecundaria = true;

  for (let i = 0; i < 5; i++) {
    // Diagonal principal
    const numeroPrincipal = carton[i][i];
    if (numeroPrincipal !== 0 && !numerosLlamados.includes(numeroPrincipal)) {
      diagonalPrincipal = false;
    }

    // Diagonal secundaria
    const numeroSecundaria = carton[i][4 - i];
    if (numeroSecundaria !== 0 && !numerosLlamados.includes(numeroSecundaria)) {
      diagonalSecundaria = false;
    }
  }

  if (diagonalPrincipal) {
    result.esGanador = true;
    result.tipoGanador = result.tipoGanador || 'diagonal';
    result.lineasGanadoras.push(10); // 10 para diagonal principal
  }

  if (diagonalSecundaria) {
    result.esGanador = true;
    result.tipoGanador = result.tipoGanador || 'diagonal';
    result.lineasGanadoras.push(11); // 11 para diagonal secundaria
  }

  return result;
};
