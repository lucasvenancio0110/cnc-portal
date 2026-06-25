/**
 * Paleta oficial de cores por status
 * Referência: Passagem de Turno Beta V1.01
 */

export const STATUS_COLORS = {
  // Setup: azul
  setup: {
    bg: "rgba(42, 161, 152, 0.2)",
    text: "#c8f5ef",
    border: "rgba(42, 161, 152, 0.5)",
    badge: "blue",
  },
  // Ajuste: laranja
  adjustment: {
    bg: "rgba(139, 104, 31, 0.26)",
    text: "#fde68a",
    border: "rgba(178, 142, 58, 0.32)",
    badge: "amber",
  },
  // Manutenção: vermelho forte
  maintenance: {
    bg: "rgba(143, 47, 50, 0.26)",
    text: "#fecaca",
    border: "rgba(184, 73, 76, 0.58)",
    badge: "red",
  },
  // Conflito: vermelho claro
  conflict: {
    bg: "rgba(143, 47, 50, 0.28)",
    text: "#fecaca",
    border: "rgba(184, 73, 76, 0.48)",
    badge: "red",
  },
  // Liberada: verde
  released: {
    bg: "rgba(47, 107, 79, 0.22)",
    text: "#bbf7d0",
    border: "rgba(47, 107, 79, 0.5)",
    badge: "green",
  },
  // Observações: branco/neutro
  observation: {
    bg: "rgba(255, 255, 255, 0.08)",
    text: "#e2e8f0",
    border: "rgba(255, 255, 255, 0.1)",
    badge: "gray",
  },
};

export const BADGE_COLORS = {
  blue: { bg: "rgba(42, 161, 152, 0.2)", text: "#c8f5ef" },
  amber: { bg: "rgba(139, 104, 31, 0.26)", text: "#fde68a" },
  red: { bg: "rgba(143, 47, 50, 0.26)", text: "#fecaca" },
  green: { bg: "rgba(47, 107, 79, 0.22)", text: "#bbf7d0" },
  gray: { bg: "rgba(255, 255, 255, 0.08)", text: "#e2e8f0" },
};

/**
 * Retorna a cor para um tipo de status
 */
export function getStatusColor(status: string) {
  switch (status) {
    case "setup":
    case "setup_active":
    case "setup_start":
      return STATUS_COLORS.setup;
    case "adjustment":
      return STATUS_COLORS.adjustment;
    case "maintenance":
    case "maintenance_prod":
      return STATUS_COLORS.maintenance;
    case "conflict":
      return STATUS_COLORS.conflict;
    case "released":
      return STATUS_COLORS.released;
    case "observation":
    case "development":
      return STATUS_COLORS.observation;
    default:
      return STATUS_COLORS.observation;
  }
}

/**
 * Retorna o label curto para um tipo de status
 */
export function getStatusLabel(type: string): string {
  switch (type) {
    case "maintenance":
      return "MANUTENÇÃO";
    case "maintenance_prod":
      return "MANUT. PRODUZINDO";
    case "setup_active":
      return "SETUP";
    case "setup_start":
      return "INICIAR SETUP";
    case "adjustment":
      return "AJUSTE";
    case "manual_pending":
      return "REDEFINIR STATUS";
    case "development":
      return "DESENVOLVIMENTO";
    case "observation":
      return "OBSERVAÇÃO";
    default:
      return "INFORMAÇÃO";
  }
}

/**
 * Retorna a classe CSS de badge para um tipo
 */
export function getBadgeClass(type: string): string {
  switch (type) {
    case "setup":
    case "setup_active":
    case "setup_start":
      return "blue";
    case "adjustment":
    case "manual_pending":
      return "amber";
    case "maintenance":
    case "maintenance_prod":
      return "red";
    case "conflict":
      return "red";
    case "released":
      return "green";
    default:
      return "gray";
  }
}
