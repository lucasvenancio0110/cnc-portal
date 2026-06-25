/**
 * Tipos TypeScript para o CNC Portal - Passagem de Turno Beta V1.01
 */

// Tipos de status para máquinas
export type RecordType = 
  | 'maintenance' 
  | 'maintenance_prod' 
  | 'setup_active' 
  | 'setup_start' 
  | 'adjustment' 
  | 'manual_pending'
  | 'development'
  | 'observation';

// Categorias de máquinas
export type Category = 'maintenance' | 'setup' | 'adjustment';

// Status de decisão
export type DecisionStatus = 
  | 'pass_adjustment' 
  | 'pass_setup' 
  | 'pass_maintenance' 
  | 'released' 
  | 'keep_observation' 
  | 'observation_resolved' 
  | 'removed';

// Record individual do relatório
export interface MachineRecord {
  id: number;
  tnl: number;
  type: RecordType;
  displayText: string;
  rawText: string;
  sourceSection: string;
  emoji: string;
}

// Item futuro (setup para próximo turno)
export interface FutureItem {
  id: number;
  tnl: number;
  heading: string;
  displayText: string;
  rawText: string;
  sourceSection: string;
  emoji: string;
  reviewed: boolean;
}

// Item de desenvolvimento ou observação
export interface DevObsItem {
  id: number;
  tnl: number;
  kind: 'development' | 'observation';
  text: string;
  rawText: string;
  reviewed: boolean;
  status: 'pending' | 'removed';
}

// Item geral (sem TNL)
export interface GeneralInfoItem {
  id: number;
  kind: 'development' | 'observation';
  text: string;
  rawText: string;
  reviewed: boolean;
  status: 'pending' | 'removed';
}

// Decisão confirmada
export interface ConfirmedDecision {
  tnl: number;
  label: string;
  time: string;
  before: MachineSnapshot;
  order: number;
}

// Snapshot de máquina para desfazer ações
export interface MachineSnapshot {
  tnl: number;
  records: MachineRecord[];
  future: FutureItem[];
  completed: {
    maintenance: boolean;
    setup: boolean;
    adjustment: boolean;
  };
  reviewed: boolean;
  resolved: boolean;
  confirmed: ConfirmedDecision | null;
  reasons: {
    maintenance: string[];
    adjustment: string;
  };
}

// Estado principal da aplicação
export interface AppState {
  raw: string;
  records: MachineRecord[];
  futureItems: FutureItem[];
  devObsItems: DevObsItem[];
  generalInfoItems: GeneralInfoItem[];
  reviewLines: string[];
  generalDevelopmentLines: string[];
  generalObservationLines: string[];
  reasons: {
    maintenance: { [key: string]: string[] };
    adjustment: { [key: string]: string };
  };
  completed: {
    adjustments: number[];
    setups: number[];
    maintenances: number[];
  };
  reviewedTnls: { [key: string]: boolean };
  resolvedConflicts: { [key: string]: boolean };
  confirmedDecisions: { [key: string]: ConfirmedDecision };
  decisionOrder: number;
  actionHistory: Array<{ tnl: number; before: MachineSnapshot }>;
  nextId: number;
  nextFutureId: number;
  nextDevObsId: number;
  nextGeneralId: number;
}

// Campos salvos da sessão
export interface SavedFields {
  currentShift: string;
  nextShift: string;
  checkpoint: string;
  cqFechamento: string;
  cqReinspecao: string;
  sel1: string;
  sel2: string;
  sel3: string;
  selAll: string;
  selTnc: string;
  development: string;
  observations: string;
  selectedCell: string;
  finalOutput: string;
}

// Sessão completa salva
export interface SavedSession {
  state: AppState;
  fields: SavedFields;
}

// Grupo de máquinas (para renderização)
export interface MachineGroup {
  kind: 'active' | 'future' | 'devobs' | 'general';
  tnl: number;
  item?: FutureItem | DevObsItem | GeneralInfoItem;
  records?: MachineRecord[];
}

// Configuração de tipo de record
export interface TypeConfig {
  short: string;
  badge: string;
}
