/**
 * Parser do relatório bruto
 * Extrai TNLs, seções e cria records estruturados
 * Preserva a informação original do grupo
 */

import { MachineRecord, FutureItem } from "../types";
import {
  normalizeHeader,
  extractTnl,
  extractEmoji,
  extractReason,
  isNA,
  normalizeTnlLine,
  uniqueNumbers,
  uniqueStrings,
} from "./utils";

export const ACTIVE_TYPES = [
  "maintenance",
  "maintenance_prod",
  "setup_active",
  "setup_start",
  "adjustment",
  "manual_pending",
];

export const SECTION_LABELS: Record<string, string> = {
  maintenance: "MANUTENÇÃO PARADA",
  maintenance_prod: "MANUTENÇÃO PRODUZINDO",
  setup_active: "SETUP",
  setup_start: "PRÓXIMOS SETUPS",
  future: "SETUP FUTURO",
  manual_pending: "REEDIÇÃO MANUAL",
  decision: "DECISÃO DA RONDA",
};

/**
 * Detecta a seção de uma linha de header
 */
export function detectSection(line: string): {
  type: string;
  heading?: string;
} | null {
  const h = normalizeHeader(line);

  if (h === "MAQUINAS EM MANUTENCAO PARADA")
    return { type: "maintenance" };
  if (h === "MAQUINAS EM MANUTENCAO PRODUZINDO")
    return { type: "maintenance_prod" };
  if (h === "MAQUINAS EM SETUP" || h === "SETUP")
    return { type: "setup_active" };
  if (h === "PROXIMOS SETUPS") return { type: "setup_start" };

  const f = h.match(/^SETUPS?\s*([123])\s*T(?:URNO)?$/);
  if (f) return { type: "future", heading: `SETUPS ${f[1]}°T` };

  if (h === "MAQUINAS EM AJUSTES" || h === "MAQUINAS EM AJUSTE")
    return { type: "adjustment" };

  if (
    [
      "ORDENS PARA SELECAO",
      "BOM TRABALHO",
      "SITUACAO DO SETOR",
      "OBSERVACOES",
      "DESENVOLVIMENTO",
      "BANCADA CHECK POINT",
      "CQ FECHAMENTO",
      "CQ REINSPECAO",
      "AJUSTES CONCLUIDOS",
      "SETUPS CONCLUIDOS",
      "MANUTENCOES CONCLUIDAS",
      "RESTANTE OK",
    ].includes(h)
  )
    return { type: "ignore" };

  return null;
}

/**
 * Cria um record a partir de dados
 */
export function createRecord({
  tnl,
  type,
  displayText,
  rawText,
  sourceSection,
  emoji = "🔴",
  }: {
    tnl: number;
    type: string;
    displayText: string;
    rawText: string;
    sourceSection: string;
    emoji?: string;
  }): MachineRecord {
  return {
    id: 0, // Será preenchido pelo state
    tnl: Number(tnl),
    type: type as any,
    displayText: String(displayText || "").trim(),
    rawText: String(rawText || "").trim(),
    sourceSection,
    emoji,
  };
}

/**
 * Gera o texto de manutenção parada
 */
export function maintenanceText(tnl: number, reason: string = ""): string {
  return `TNL ${String(tnl).padStart(3, "0")} - ${reason || "MANUTENÇÃO"}`;
}

/**
 * Gera o texto de manutenção produzindo
 */
export function maintenanceProducingText(tnl: number, reason: string = ""): string {
  return `TNL ${String(tnl).padStart(3, "0")} - ${reason || "MANUTENÇÃO PRODUZINDO"}`;
}

/**
 * Gera o texto de setup ativo
 */
export function setupActiveText(tnl: number, emoji: string = "🔴"): string {
  return `${emoji} TNL ${String(tnl).padStart(3, "0")} - EM SETUP`;
}

/**
 * Gera o texto de próximo setup
 */
export function setupStartText(tnl: number, emoji: string = "🔴"): string {
  return `${emoji} TNL ${String(tnl).padStart(3, "0")} - PRÓXIMO SETUP`;
}

/**
 * Gera o texto de ajuste
 */
export function adjustmentText(tnl: number, reason: string = ""): string {
  return `TNL ${String(tnl).padStart(3, "0")} - ${reason || "AJUSTE"}`;
}

/**
 * Ordena records por TNL
 */
export function sortByTnl<T extends { tnl: number; displayText?: string; rawText?: string }>(records: T[]): T[] {
  return [...records].sort(
    (a, b) =>
      Number(a.tnl) - Number(b.tnl) ||
      String(a.displayText || a.rawText || "").localeCompare(
        String(b.displayText || b.rawText || ""),
        "pt-BR"
      )
  );
}

/**
 * Retorna records ativos (não ignorados)
 */
export function getActiveRecords(records: MachineRecord[]): MachineRecord[] {
  return records.filter(r => ACTIVE_TYPES.includes(r.type));
}

/**
 * Retorna records de uma TNL específica
 */
export function getRecordsOfTnl(records: MachineRecord[], tnl: number): MachineRecord[] {
  return records.filter(r => Number(r.tnl) === Number(tnl));
}

/**
 * Retorna todas as TNLs operacionais (ativas + futuras)
 */
export function getAllOperationalTnls(records: MachineRecord[], futureItems: FutureItem[]): number[] {
  const fromRecords = getActiveRecords(records).map(r => r.tnl);
  const fromFuture = futureItems.map(x => x.tnl);
  return uniqueNumbers([...fromRecords, ...fromFuture]);
}

/**
 * Detecta a categoria de um tipo
 */
export function categoryOfType(type: string): string {
  if (type === "maintenance" || type === "maintenance_prod") return "maintenance";
  if (type === "setup_active" || type === "setup_start") return "setup";
  if (type === "adjustment") return "adjustment";
  return "";
}

/**
 * Retorna categorias de uma TNL
 */
export function getCategoriesOfTnl(records: MachineRecord[], tnl: number): string[] {
  return [
    ...new Set(
      getRecordsOfTnl(records, tnl)
        .map(r => categoryOfType(r.type))
        .filter(Boolean)
    ),
  ];
}

/**
 * Verifica se uma TNL tem conflito (múltiplas categorias)
 */
export function hasConflict(records: MachineRecord[], tnl: number): boolean {
  return getCategoriesOfTnl(records, tnl).length > 1;
}

/**
 * Parser principal: importa um relatório bruto e cria records
 */
export function parseReport(
  raw: string,
  nextTurnHeading: string
): {
  records: MachineRecord[];
  futureItems: FutureItem[];
  reviewLines: string[];
  reasons: { [key: string]: { [key: string]: string[] } };
} {
  const records: MachineRecord[] = [];
  const futureItems: FutureItem[] = [];
  const reviewLines: string[] = [];
  const reasons: { [key: string]: { [key: string]: string[] } } = {
    maintenance: {},
  };

  let section = "ignore";
  let futureHeading = nextTurnHeading;
  let nextId = 1;
  let nextFutureId = 1;

  raw.split("\n").forEach((rawLine) => {
    const line = String(rawLine || "").trim();
    if (!line) return;

    const detected = detectSection(line);
    if (detected) {
      section = detected.type;
      if (detected.heading) futureHeading = detected.heading;
      return;
    }

    const tnl = extractTnl(line);
    if (!tnl) {
      if (
        [
          "maintenance",
          "maintenance_prod",
          "setup_active",
          "setup_start",
          "adjustment",
          "future",
        ].includes(section) &&
        !isNA(line)
      ) {
        reviewLines.push(`${SECTION_LABELS[section] || section}: ${line}`);
      }
      return;
    }

    const concluded = line.includes("✅");
    const emoji = extractEmoji(line);
    const reason = extractReason(line);

    // Manutenção
    if (section === "maintenance" || section === "maintenance_prod") {
      if (reason) {
        if (!reasons.maintenance[String(tnl)]) {
          reasons.maintenance[String(tnl)] = [];
        }
        reasons.maintenance[String(tnl)] = uniqueStrings([
          ...reasons.maintenance[String(tnl)],
          reason,
        ]);
      }
      if (!concluded) {
        records.push({
          id: nextId++,
          tnl,
          type: section as any,
          displayText:
            section === "maintenance"
              ? maintenanceText(tnl, reason)
              : maintenanceProducingText(tnl, reason),
          rawText: line,
          sourceSection: section,
          emoji,
        });
      }
      return;
    }

    // Setup
    if (section === "setup_active" || section === "setup_start") {
      if (!concluded) {
        records.push({
          id: nextId++,
          tnl,
          type: section as any,
          displayText:
            section === "setup_active"
              ? setupActiveText(tnl, emoji)
              : setupStartText(tnl, emoji),
          rawText: line,
          sourceSection: section,
          emoji,
        });
      }
      return;
    }

    // Ajuste
    if (section === "adjustment") {
      if (!concluded) {
        records.push({
          id: nextId++,
          tnl,
          type: "adjustment",
          displayText: adjustmentText(tnl, ""),
          rawText: line,
          sourceSection: "adjustment",
          emoji,
        });
      }
      return;
    }

    // Setup futuro
    if (section === "future") {
      if (!concluded) {
        futureItems.push({
          id: nextFutureId++,
          tnl,
          heading: futureHeading,
          displayText: normalizeTnlLine(line),
          rawText: line,
          sourceSection: "future",
          emoji,
          reviewed: false,
        });
      }
    }
  });

  return {
    records: sortByTnl(records),
    futureItems: sortByTnl(futureItems),
    reviewLines,
    reasons,
  };
}
