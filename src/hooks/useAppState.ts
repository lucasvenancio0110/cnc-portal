/**
 * Hook para gerenciar o estado da aplicação
 * Inclui lógica de decisões, ronda e persistência
 */

import { useState, useCallback, useEffect } from "react";
import { AppState, SavedFields } from "../types";
import { saveSession, loadSession, clearSession } from "../lib/storage";
import { parseReport } from "../lib/parser";
import { getDefaultNextShift, getFutureSetupHeading } from "../lib/shifts";
import { getUnmappedMachines } from "../lib/machines";
import { uniqueNumbers } from "../lib/utils";

/**
 * Estado inicial em branco
 */
function createBlankState(): AppState {
  return {
    raw: "",
    records: [],
    futureItems: [],
    devObsItems: [],
    generalInfoItems: [],
    reviewLines: [],
    generalDevelopmentLines: [],
    generalObservationLines: [],
    reasons: { maintenance: {}, adjustment: {} },
    completed: { adjustments: [], setups: [], maintenances: [] },
    reviewedTnls: {},
    resolvedConflicts: {},
    confirmedDecisions: {},
    decisionOrder: 0,
    actionHistory: [],
    nextId: 1,
    nextFutureId: 1,
    nextDevObsId: 1,
    nextGeneralId: 1,
  };
}

/**
 * Estado inicial dos campos
 */
function createBlankFields(): SavedFields {
  return {
    currentShift: "2",
    nextShift: "3",
    checkpoint: "00",
    cqFechamento: "00",
    cqReinspecao: "00",
    sel1: "00",
    sel2: "00",
    sel3: "00",
    selAll: "00",
    selTnc: "00",
    development: "",
    observations: "",
    selectedCell: "01",
    finalOutput: "",
  };
}

export function useAppState() {
  const [state, setState] = useState<AppState>(createBlankState());
  const [fields, setFields] = useState<SavedFields>(createBlankFields());

  // Carrega sessão ao montar
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setState(saved.state);
      setFields(saved.fields);
    }
  }, []);

  // Salva sessão quando muda
  const persistSession = useCallback(() => {
    saveSession(state, fields);
  }, [state, fields]);

  // Importa relatório bruto
  const importReport = useCallback((raw: string) => {
    const nextTurn = getDefaultNextShift(Number(fields.currentShift) || 2);
    const heading = getFutureSetupHeading(nextTurn);
    const parsed = parseReport(raw, heading);

    setState(prev => ({
      ...createBlankState(),
      raw,
      records: parsed.records,
      futureItems: parsed.futureItems,
      reviewLines: parsed.reviewLines,
      reasons: { ...prev.reasons, ...parsed.reasons },
      nextId: Math.max(...parsed.records.map(r => r.id), 0) + 1,
      nextFutureId: Math.max(...parsed.futureItems.map(f => f.id), 0) + 1,
    }));
  }, [fields.currentShift]);

  // Limpa a sessão
  const clearCurrentSession = useCallback(() => {
    if (window.confirm("Deseja limpar toda a sessão?")) {
      setState(createBlankState());
      setFields(createBlankFields());
      clearSession();
    }
  }, []);

  // Atualiza um campo
  const updateField = useCallback((key: keyof SavedFields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  }, []);

  // Retorna máquinas não mapeadas
  const getUnmappedTnls = useCallback((): number[] => {
    const allTnls = uniqueNumbers([
      ...state.records.filter(r => ["maintenance", "maintenance_prod", "setup_active", "setup_start", "adjustment"].includes(r.type)).map(r => r.tnl),
      ...state.futureItems.map(f => f.tnl),
    ]);
    return getUnmappedMachines(allTnls);
  }, [state]);

  // Retorna se há máquinas não mapeadas
  const hasUnmappedTnls = useCallback((): boolean => {
    return getUnmappedTnls().length > 0;
  }, [getUnmappedTnls]);

  return {
    state,
    fields,
    setState,
    setFields,
    persistSession,
    importReport,
    clearCurrentSession,
    updateField,
    getUnmappedTnls,
    hasUnmappedTnls,
  };
}
