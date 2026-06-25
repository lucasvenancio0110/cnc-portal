/**
 * Gerador do relatório final para WhatsApp
 * Formata com asteriscos para negrito e preserva a estrutura
 */

import { MachineRecord, FutureItem, AppState } from "../types";
import { getShiftLabel } from "./shifts";
import { formatList, formatCompleted, uniqueStrings } from "./utils";

/**
 * Extrai texto de um record para o relatório
 */
export function getRecordText(record: MachineRecord): string {
  return record.displayText || record.rawText || "";
}

/**
 * Extrai texto de um item futuro para o relatório
 */
export function getFutureItemText(item: FutureItem): string {
  return item.displayText || item.rawText || "";
}

/**
 * Retorna linhas de desenvolvimento do estado
 */
export function getDevLines(state: AppState): string[] {
  const lines: string[] = [];

  // Linhas gerais de desenvolvimento
  if (state.generalDevelopmentLines && state.generalDevelopmentLines.length > 0) {
    lines.push(...state.generalDevelopmentLines);
  }

  // Items de desenvolvimento
  if (state.devObsItems) {
    state.devObsItems
      .filter(item => item.kind === "development" && item.status !== "removed")
      .forEach(item => {
        lines.push(item.text);
      });
  }

  // Items gerais de desenvolvimento
  if (state.generalInfoItems) {
    state.generalInfoItems
      .filter(item => item.kind === "development" && item.status !== "removed")
      .forEach(item => {
        lines.push(item.text);
      });
  }

  return uniqueStrings(lines);
}

/**
 * Retorna linhas de observações do estado
 */
export function getObsLines(state: AppState): string[] {
  const lines: string[] = [];

  // Linhas gerais de observações
  if (state.generalObservationLines && state.generalObservationLines.length > 0) {
    lines.push(...state.generalObservationLines);
  }

  // Items de observação
  if (state.devObsItems) {
    state.devObsItems
      .filter(item => item.kind === "observation" && item.status !== "removed")
      .forEach(item => {
        lines.push(item.text);
      });
  }

  // Items gerais de observação
  if (state.generalInfoItems) {
    state.generalInfoItems
      .filter(item => item.kind === "observation" && item.status !== "removed")
      .forEach(item => {
        lines.push(item.text);
      });
  }

  return uniqueStrings(lines);
}

/**
 * Retorna blocos de setups futuros formatados
 */
export function renderFutureBlocks(state: AppState): string {
  if (!state.futureItems || state.futureItems.length === 0) {
    return "";
  }

  const grouped: { [key: string]: FutureItem[] } = {};
  state.futureItems.forEach(item => {
    const heading = item.heading || "SETUP FUTURO";
    if (!grouped[heading]) {
      grouped[heading] = [];
    }
    grouped[heading].push(item);
  });

  return Object.entries(grouped)
    .map(([heading, items]: [string, FutureItem[]]) => {
      const lines = items.map(item => getFutureItemText(item));
      return `*${heading}:*\n${formatList(lines)}`;
    })
    .join("\n\n");
}

/**
 * Gera o relatório completo para WhatsApp
 */
export function generateWhatsAppReport(
  state: AppState,
  currentShift: number,
  checkpoint: string,
  cqFechamento: string,
  cqReinspecao: string,
  sel1: string,
  sel2: string,
  sel3: string,
  selAll: string,
  selTnc: string
): string {
  // Filtra records ativos por tipo
  const activeRecords = state.records.filter(r =>
    ["maintenance", "maintenance_prod", "setup_active", "setup_start", "adjustment"].includes(r.type)
  );

  const maint = activeRecords
    .filter(r => r.type === "maintenance")
    .sort((a, b) => a.tnl - b.tnl)
    .map(r => getRecordText(r));

  const prod = activeRecords
    .filter(r => r.type === "maintenance_prod")
    .sort((a, b) => a.tnl - b.tnl)
    .map(r => getRecordText(r));

  const setup = activeRecords
    .filter(r => r.type === "setup_active" || r.type === "setup_start")
    .sort((a, b) => a.tnl - b.tnl)
    .map(r => getRecordText(r));

  const adj = activeRecords
    .filter(r => r.type === "adjustment")
    .sort((a, b) => a.tnl - b.tnl)
    .map(r => getRecordText(r));

  const shiftLabel = getShiftLabel(currentShift);
  const devLines = getDevLines(state);
  const obsLines = getObsLines(state);
  const futureBlocks = renderFutureBlocks(state);

  return `*${shiftLabel}*
*SITUAÇÃO DO SETOR ⬇️⬇️⬇️*

*BANCADA – CHECK POINT:*
${checkpoint || "00"}

*ORDENS PARA SELEÇÃO:*

Seleção 1° turno: ${sel1 || "00"}
Seleção 2° turno: ${sel2 || "00"}
Seleção 3° turno: ${sel3 || "00"}
Os 3 turnos: ${selAll || "00"}
Seleção TNC: ${selTnc || "00"}

*CQ FECHAMENTO:*
${cqFechamento || "00"}

*CQ REINSPEÇÃO:*
${cqReinspecao || "00"}

*MÁQUINAS EM MANUTENÇÃO PARADA:*
${formatList(maint)}

*MÁQUINAS EM MANUTENÇÃO PRODUZINDO:*
${formatList(prod)}

*SETUP:*
${formatList(setup)}

*MAQUINAS EM AJUSTES:*
${formatList(adj)}

${futureBlocks ? futureBlocks + "\n\n" : ""}
*AJUSTES CONCLUÍDOS:*
${formatCompleted(state.completed.adjustments)}

*SETUPS CONCLUÍDOS:*
${formatCompleted(state.completed.setups)}

*MANUTENÇÕES CONCLUÍDAS:*
${formatCompleted(state.completed.maintenances)}

*DESENVOLVIMENTO:*
${formatList(devLines)}

*OBSERVAÇÕES:*
${formatList(obsLines)}

*RESTANTE OK !*`;
}

/**
 * Copia texto para a área de transferência
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores antigos
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    }
  } catch (e) {
    console.error("Erro ao copiar:", e);
    return false;
  }
}
