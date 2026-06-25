/**
 * Utilitários gerais para texto, parsing e manipulação de dados
 */

/**
 * Normaliza texto removendo acentos
 */
export function normalizeText(text: string): string {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Normaliza header para comparação
 */
export function normalizeHeader(text: string): string {
  return normalizeText(text)
    .replace(/[^A-Z0-9]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

/**
 * Limpa uma linha removendo caracteres especiais
 */
export function cleanLine(text: string): string {
  return String(text || "")
    .replace(/[✅❌]/g, "")
    .replace(/[•●]/g, " ")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extrai TNL de um texto
 */
export function extractTnl(text: string): number | null {
  const m = String(text || "").match(/TNL\s*0*(\d{1,3})/i);
  return m ? Number(m[1]) : null;
}

/**
 * Extrai emoji de um texto
 */
export function extractEmoji(text: string): string {
  const m = String(text || "").match(/(🔴|🔵|🟢)/);
  return m ? m[1] : "🔴";
}

/**
 * Extrai a razão/motivo de uma linha de TNL
 */
export function extractReason(text: string): string {
  const m = cleanLine(text).match(/TNL\s*0*\d{1,3}\s*-\s*(.+)$/i);
  return m ? m[1].trim() : "";
}

/**
 * Extrai hora de um texto (HH:MM ou HH)
 */
export function extractTime(text: string): string {
  const s = String(text || "");
  let m = s.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (m) return `${String(m[1]).padStart(2, "0")}:${m[2]}`;
  m = s.match(/\b([01]?\d|2[0-3])\s*[Hh]\b/);
  return m ? `${String(m[1]).padStart(2, "0")}:00` : "";
}

/**
 * Verifica se um texto é "NA" (não aplicável)
 */
export function isNA(text: string): boolean {
  return normalizeHeader(text).replace(/\s+/g, "") === "NA";
}

/**
 * Remove TNL prefix de um texto
 */
export function removeTnlPrefix(text: string, tnl?: number): string {
  let clean = cleanLine(text);
  if (tnl) {
    clean = clean
      .replace(new RegExp(`^\\s*(?:🔴\\s*)?TNL\\s*0*${Number(tnl)}\\s*-?\\s*`, "i"), "")
      .trim();
  } else {
    clean = clean.replace(/^\s*(?:🔴\s*)?TNL\s*0*\d{1,3}\s*-?\s*/i, "").trim();
  }
  return clean;
}

/**
 * Retorna números únicos de uma lista
 */
export function uniqueNumbers(list: any[]): number[] {
  return [...new Set(list.map(Number).filter(Number.isFinite))].sort((a, b) => a - b);
}

/**
 * Retorna strings únicas de uma lista
 */
export function uniqueStrings(list: any[]): string[] {
  return [...new Set(list.map(x => String(x || "").trim()).filter(Boolean))];
}

/**
 * Escapa HTML
 */
export function escapeHtml(text: string): string {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Formata uma lista para o relatório
 */
export function formatList(items: string[]): string {
  if (!items || items.length === 0) return "00";
  return items.join("\n");
}

/**
 * Formata números completados
 */
export function formatCompleted(tnls: number[]): string {
  if (!tnls || tnls.length === 0) return "00";
  return tnls.map(tnl => `TNL ${String(tnl).padStart(3, "0")}`).join("\n");
}

/**
 * Normaliza uma lista de razões de manutenção
 */
export function normalizeReasonList(reasons: any): string[] {
  if (Array.isArray(reasons)) {
    return uniqueStrings(reasons);
  }
  if (typeof reasons === "string") {
    return [reasons].filter(Boolean);
  }
  return [];
}

/**
 * Normaliza texto de ajuste
 */
export function normalizeAdjustmentText(text: string): string {
  const cleaned = cleanLine(text);
  return removeTnlPrefix(cleaned);
}

/**
 * Normaliza texto de TNL
 */
export function normalizeTnlLine(text: string): string {
  const tnl = extractTnl(text);
  if (!tnl) return cleanLine(text);
  return cleanLine(text).replace(/TNL\s*0*\d{1,3}/i, `TNL ${String(tnl).padStart(3, "0")}`);
}

/**
 * Cria uma chave normalizada para comparação
 */
export function normalizedKey(text: string): string {
  return normalizeText(cleanLine(text)).toUpperCase();
}
