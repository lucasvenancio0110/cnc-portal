/**
 * Funções de persistência com LocalStorage
 * Preparado para migração futura para Supabase
 */

import { AppState, SavedFields, SavedSession } from "../types";

const STORAGE_KEY = "cnc_portal_passagem_turno_v1";
const THEME_KEY = "cnc_portal_theme_v1";

/**
 * Salva a sessão completa (estado + campos)
 */
export function saveSession(state: AppState, fields: SavedFields): void {
  try {
    const session: SavedSession = { state, fields };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error("Erro ao salvar sessão:", e);
  }
}

/**
 * Carrega a sessão completa
 */
export function loadSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedSession;
  } catch (e) {
    console.error("Erro ao carregar sessão:", e);
    return null;
  }
}

/**
 * Limpa a sessão
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Erro ao limpar sessão:", e);
  }
}

/**
 * Salva o tema (claro/escuro)
 */
export function saveTheme(theme: "light" | "dark"): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error("Erro ao salvar tema:", e);
  }
}

/**
 * Carrega o tema salvo
 */
export function loadTheme(): "light" | "dark" {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return (saved === "light" ? "light" : "dark") as "light" | "dark";
  } catch (e) {
    return "dark";
  }
}

/**
 * Exporta a sessão como JSON para backup
 */
export function exportSession(state: AppState, fields: SavedFields): string {
  const session: SavedSession = { state, fields };
  return JSON.stringify(session, null, 2);
}

/**
 * Importa uma sessão de um JSON
 */
export function importSession(json: string): SavedSession | null {
  try {
    return JSON.parse(json) as SavedSession;
  } catch (e) {
    console.error("Erro ao importar sessão:", e);
    return null;
  }
}
