/**
 * Mapa de máquinas (TNLs) por célula
 * Referência: Passagem de Turno Beta V1.01
 */

export const CELULAS: Record<string, number[]> = {
  "01": [2, 5, 15, 19, 23, 24, 25, 26, 27, 29, 30, 35, 46, 47, 48],
  "02": [3, 4, 7, 8, 13, 16, 17, 18, 28, 31, 32, 49, 50, 51, 143],
  "03": [9, 10, 33, 34, 36, 37, 39, 40, 41, 43, 44],
  "04": [42, 52, 53, 57, 58, 59, 60, 61, 64, 65, 66],
  "05": [69, 72, 83, 85, 87, 88, 89, 90, 91, 92, 93, 94, 95],
  "06": [67, 68, 73, 74, 75, 76, 77, 79, 81, 82, 84, 86],
  "07": [45, 54, 55, 56, 62, 63, 70, 71, 78, 80, 102, 103, 110, 111],
  "08": [96, 98, 104, 107, 112, 113, 115, 116, 118, 119, 121, 122],
  "09": [97, 99, 100, 101, 105, 106, 108, 109, 114, 117, 120, 123],
  "10": [6, 124, 125, 126, 127, 128, 129, 130, 134, 135, 136, 137, 138, 139, 140, 141, 142, 144, 145],
};

export const CELL_ORDER = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];

export const GENERAL_CELL = "GERAL";

/**
 * Retorna todas as máquinas mapeadas
 */
export function getMappedMachines(): number[] {
  const all = Object.values(CELULAS).flat();
  return [...new Set(all)].sort((a, b) => a - b);
}

/**
 * Retorna as máquinas de uma célula específica
 */
export function getMachinesForCell(cell: string): number[] {
  if (cell === "SEM_MAPA") return [];
  if (cell === GENERAL_CELL) return [];
  return CELULAS[cell] || [];
}

/**
 * Retorna a célula de uma máquina (TNL)
 */
export function getCellForMachine(tnl: number): string | null {
  for (const [cell, machines] of Object.entries(CELULAS)) {
    if (machines.includes(tnl)) {
      return cell;
    }
  }
  return null;
}

/**
 * Verifica se uma TNL está mapeada
 */
export function isMachineMapped(tnl: number): boolean {
  return getCellForMachine(tnl) !== null;
}

/**
 * Retorna máquinas não mapeadas de uma lista
 */
export function getUnmappedMachines(allTnls: number[]): number[] {
  const mapped = new Set(getMappedMachines());
  return allTnls.filter(tnl => !mapped.has(tnl)).sort((a, b) => a - b);
}

/**
 * Formata um número de TNL com padding de 3 dígitos
 */
export function padTnl(tnl: number): string {
  return String(Number(tnl)).padStart(3, "0");
}
