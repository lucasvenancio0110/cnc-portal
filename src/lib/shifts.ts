/**
 * Lógica de turnos (atual e próximo)
 */

/**
 * Retorna o próximo turno baseado no turno atual
 */
export function getDefaultNextShift(currentShift: number): number {
  const shift = Number(currentShift) || 2;
  if (shift === 1) return 2;
  if (shift === 2) return 3;
  return 1;
}

/**
 * Valida se um número é um turno válido (1, 2 ou 3)
 */
export function isValidShift(shift: any): shift is 1 | 2 | 3 {
  return [1, 2, 3].includes(Number(shift));
}

/**
 * Retorna o label do turno
 */
export function getShiftLabel(shift: number): string {
  switch (Number(shift)) {
    case 1:
      return "1° TURNO";
    case 2:
      return "2° TURNO";
    case 3:
      return "3° TURNO";
    default:
      return "TURNO";
  }
}

/**
 * Retorna o heading para setups futuros
 */
export function getFutureSetupHeading(shift: number): string {
  return `SETUPS ${Number(shift)}°T`;
}

/**
 * Sincroniza o próximo turno se necessário
 */
export function syncNextShift(currentShift: number, nextShift: number): number {
  const current = Number(currentShift) || 2;
  const next = Number(nextShift) || 0;

  // Se o próximo turno for inválido ou igual ao atual, retorna o padrão
  if (!isValidShift(next) || next === current) {
    return getDefaultNextShift(current);
  }

  return next;
}
