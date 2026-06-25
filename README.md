# CNC Portal - Passagem de Turno Beta V1.01

Sistema modular e profissional de **Passagem de Turno** para gerenciamento de máquinas CNC, desenvolvido em **React + TypeScript + Vite**.

## Objetivo

Transformar o aplicativo original de arquivo único HTML em um projeto web modular, preparado para evoluir para um portal online com banco de dados, login, histórico e painel por máquinas.

## Funcionalidades Principais

### ✅ Implementado nesta versão

- **Parser Inteligente:** Extrai TNLs, seções e cria records estruturados preservando a informação original do grupo
- **Mapa de Máquinas:** Mapeamento completo das TNLs para células C01-C10 (com suporte a máquinas não mapeadas)
- **Paleta Oficial de Cores:** Setup (azul), Ajuste (laranja), Manutenção (vermelho), Conflito (vermelho claro), Liberada (verde), Observações (neutro)
- **Mobile-First:** Interface otimizada para chão de fábrica com bloqueio de zoom e inputs amigáveis
- **Tema Claro/Escuro:** Alternância com persistência em LocalStorage
- **Persistência Local:** Salva estado completo da sessão para recuperação
- **Relatório WhatsApp:** Gerador de relatório formatado com asteriscos para negrito

### 🚀 Próximas Fases

- **Fase 2:** Componentes React (Ronda, Cards, Modal de Decisão, Relatório)
- **Fase 3:** Lógica de Ronda e Decisões
- **Fase 4:** Integração Supabase (banco de dados, login, histórico)
- **Fase 5:** Painel de Máquinas e Dashboard
- **Fase 6:** PWA (Progressive Web App)

## Estrutura do Projeto

```
src/
├── main.tsx                 # Entrada da aplicação
├── App.tsx                  # Componente raiz
├── App.css                  # Estilos do App
├── types/
│   └── index.ts            # Tipos TypeScript (MachineRecord, AppState, etc)
├── lib/
│   ├── parser.ts           # Parser do relatório bruto
│   ├── reportBuilder.ts    # Gerador do relatório WhatsApp
│   ├── machines.ts         # Mapa de máquinas e células
│   ├── statusTheme.ts      # Paleta de cores por status
│   ├── storage.ts          # Persistência com LocalStorage
│   ├── shifts.ts           # Lógica de turnos
│   └── utils.ts            # Utilitários gerais
├── hooks/
│   └── useAppState.ts      # Hook para gerenciar estado
├── pages/                   # (Próximas fases)
│   ├── DadosPage.tsx
│   ├── RondaPage.tsx
│   └── RelatorioPage.tsx
├── components/              # (Próximas fases)
│   ├── AppHeader.tsx
│   ├── AppTabs.tsx
│   ├── MachineCompactCard.tsx
│   ├── DecisionModal.tsx
│   └── ...
└── styles/
    └── globals.css         # Estilos globais
```

## Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- npm ou pnpm

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/lucasvenancio0110/cnc-portal.git
cd cnc-portal

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (Vite) |
| `npm run build` | Compila TypeScript e faz build com Vite |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Verifica erros TypeScript e ESLint |

## Tecnologias

- **React 18:** Framework UI
- **TypeScript:** Type safety
- **Vite:** Build tool rápido
- **CSS Moderno:** Glassmorphism, tema claro/escuro
- **LocalStorage:** Persistência local (preparado para Supabase)

## Arquitetura

### Tipos Principais

- **MachineRecord:** Record individual do relatório (TNL, tipo, texto)
- **FutureItem:** Setup para próximo turno
- **DevObsItem:** Item de desenvolvimento ou observação
- **AppState:** Estado completo da aplicação
- **ConfirmedDecision:** Decisão confirmada na ronda

### Fluxo de Dados

1. **Importação:** Usuário cola relatório bruto
2. **Parsing:** Parser extrai TNLs e cria records
3. **Persistência:** Estado salvo em LocalStorage
4. **Ronda:** Usuário navega por células e toma decisões
5. **Relatório:** Sistema gera relatório final para WhatsApp
6. **Cópia:** Botão flutuante copia para clipboard

## Banco de Dados Futuro (Supabase)

### Tabelas Planejadas

```sql
-- Perfis de usuário
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  nome TEXT,
  perfil TEXT,
  turno INTEGER,
  created_at TIMESTAMP
);

-- Máquinas
CREATE TABLE machines (
  id UUID PRIMARY KEY,
  codigo INTEGER,
  celula TEXT,
  ativa BOOLEAN,
  created_at TIMESTAMP
);

-- Relatórios de turno
CREATE TABLE shift_reports (
  id UUID PRIMARY KEY,
  data DATE,
  turno_atual INTEGER,
  proximo_turno INTEGER,
  raw_report TEXT,
  final_report TEXT,
  created_by UUID,
  created_at TIMESTAMP
);

-- Items do relatório
CREATE TABLE report_items (
  id UUID PRIMARY KEY,
  report_id UUID,
  machine_code INTEGER,
  type TEXT,
  status TEXT,
  original_text TEXT,
  resolved BOOLEAN,
  created_at TIMESTAMP
);

-- Decisões
CREATE TABLE decisions (
  id UUID PRIMARY KEY,
  report_id UUID,
  item_id UUID,
  machine_code INTEGER,
  decision TEXT,
  decided_by UUID,
  decided_at TIMESTAMP
);

-- Histórico de máquinas
CREATE TABLE machine_history (
  id UUID PRIMARY KEY,
  machine_code INTEGER,
  event_type TEXT,
  old_status TEXT,
  new_status TEXT,
  source_report_id UUID,
  created_by UUID,
  created_at TIMESTAMP
);
```

## Paleta de Cores Oficial

| Status | Cor | Uso |
|--------|-----|-----|
| Setup | Azul (#2aa198) | Máquinas em setup |
| Ajuste | Laranja (#8b681f) | Máquinas em ajuste |
| Manutenção | Vermelho Forte (#8f2f32) | Manutenção parada |
| Conflito | Vermelho Claro | Múltiplas categorias |
| Liberada | Verde (#2f6b4f) | Máquinas liberadas |
| Observações | Neutro | Informações gerais |

## Regras Importantes

### Parser

- ✅ Preserva informação original do grupo
- ✅ Extrai TNLs com precisão
- ✅ Identifica seções automaticamente
- ✅ Suporta emojis (🔴, 🔵, 🟢)
- ✅ Detecta conclusões (✅)

### Mobile

- ✅ Sem zoom acidental no iPhone
- ✅ Sem zoom por duplo toque
- ✅ Inputs com tamanho correto (16px)
- ✅ Interface rápida e responsiva
- ✅ Safe area insets respeitados

### Relatório

- ✅ Formato WhatsApp com asteriscos para negrito
- ✅ Tela cheia sem rolagem interna
- ✅ Botão flutuante para copiar
- ✅ Preserva estrutura de seções
- ✅ Suporta múltiplos setups futuros

## Roadmap

### Beta Local (Atual)
- [x] Estrutura modular React + TypeScript
- [x] Parser do relatório bruto
- [x] Tipos TypeScript completos
- [ ] Componentes da Ronda
- [ ] Modal de Decisão
- [ ] Gerador de Relatório UI
- [ ] Testes unitários

### Fase 1: Supabase
- [ ] Integração Supabase
- [ ] Autenticação (login/logout)
- [ ] Salvar relatórios no banco
- [ ] Histórico de relatórios

### Fase 2: Dashboard
- [ ] Painel por máquina
- [ ] Gráficos de status
- [ ] Relatórios históricos
- [ ] Exportação de dados

### Fase 3: PWA
- [ ] Service Worker
- [ ] Offline support
- [ ] Install app
- [ ] Push notifications

## Preservação da Beta V1.01

Todas as funcionalidades e comportamentos da versão original foram preservados:

- ✅ Parser com detecção de seções
- ✅ Mapa de máquinas (C01-C10)
- ✅ Paleta de cores por status
- ✅ Bloqueio de zoom mobile
- ✅ Tema claro/escuro
- ✅ LocalStorage
- ✅ Relatório WhatsApp
- ✅ Botão de copiar

## Contribuindo

Este projeto é desenvolvido para uso interno. Para sugestões ou melhorias, abra uma issue ou pull request.

## Licença

Privado - Uso interno apenas.

---

**Desenvolvido com ❤️ para o chão de fábrica.**
