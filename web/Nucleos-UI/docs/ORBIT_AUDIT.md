# ORBIT_AUDIT.md — Contratos Reais de APIs e Estado dos Componentes
> Atualizado: 2026-06-13 | Fase 0 completa

---

## 1. CONTRATOS DE SERVIÇO FRONT-END

### Fluxo de Criação por Tipo

| Tipo | Passo 1 — Bloco | Passo 2 — Registro |
|------|----------------|-------------------|
| Tarefa | `POST /blocos` `{nucleoId, tipo:"tarefas", titulo}` | `POST /tarefas` `{blocoId, titulo, prioridade?, dataVencimento?}` |
| Hábito | `POST /blocos` `{nucleoId, tipo:"habitos", titulo}` | `POST /habitos` `{blocoId, nome, frequencia?, diasSemana?, metaVezes?}` |
| Lista/Compras | `POST /blocos` `{nucleoId, tipo:"lista", titulo}` | `POST /listas` `{blocoId, nome, tipoLista}` → `POST /listas/items` `{listaId, conteudo}` por item |
| Lista/Financeiro | `POST /blocos` `{nucleoId, tipo:"lista", titulo}` | `POST /listas` `{blocoId, nome, tipoLista:"financeiro"}` → `POST /listas/items` com valor |
| Evento | — (sem bloco intermediário) | `POST /calendario` `{nucleoId, titulo, dataEvento, duracaoMinutos?}` |
| Timer | `POST /blocos` `{nucleoId, tipo:"timers", titulo}` | `POST /timers/start` `{StartTimerPayload}` |
| Nota | `POST /blocos` `{nucleoId, tipo:"notas", titulo}` | `PATCH /blocos/{id}/content` `{html, tipo:"notas"}` |
| Núcleo novo | — | `POST /nucleos` `{nome, tipo: NucleoTipo, corDestaque?}` |

**IMPORTANTE: Sem batch-create.** Orquestrar chamadas individuais com erro tratado por item.

---

## 2. PAYLOADS CONFIRMADOS (backend DTOs)

```typescript
// Tarefa
{ blocoId: string; titulo: string; prioridade?: "alta"|"media"|"baixa"; dataVencimento?: Date }

// Hábito
{ blocoId: string; nome: string; frequencia?: string; diasSemana?: number[]; metaVezes?: number }

// Lista
{ blocoId: string; nome: string; tipoLista?: "generica"|"compras"|"financeiro" }

// Item de Lista
{ listaId: string; conteudo: string; valor?: number; categoria?: string }

// Evento (calendario)
{ nucleoId: string; titulo: string; descricao?: string; dataEvento: string|Date; duracaoMinutos?: number }

// Timer
{ /* confirmar payload exato no timers.routes.ts */ }

// Bloco
{ nucleoId: string; tipo: BlocoTipo; titulo?: string; posicao?: number; configuracoes?: Record<string,any>; parentId?: string|null }

// Núcleo
{ nome: string; descricao?: string; tipo?: NucleoTipo; corDestaque?: string; imagemCapa?: string; iconId?: string }
```

---

## 3. ENUMS DE TIPOS

```typescript
type BlocoTipo =
  | "tarefas" | "habitos" | "habito" | "timer" | "timers" | "notas"
  | "lista" | "calendario" | "calculo" | "colecoes" | "canvas"
  | "paragraph" | "h1" | "h2" | "h3" | "quote" | "code"
  | "bullet-list" | "numbered-list" | "todo" | "divider" | "column-layout"

type NucleoTipo =
  | "pessoal" | "profissional" | "estudo" | "projeto"
  | "hobby" | "fitness" | "financas" | "idiomas" | string
```

---

## 4. ESTADO ATUAL DO ORBIT

### interpreter.ts (434 linhas)

**Tipos de comando suportados:**
- `CREATE_TASK` — default para a maioria dos inputs
- `CREATE_HABIT` — keywords: "todo dia", "diariamente", "toda semana", "começar a", "hábito de", etc.
- `CREATE_EVENT` — keywords de reunião/consulta + referência de data/hora
- `CAPTURE` — definido no tipo mas **nunca retornado**

**Gaps identificados:**
- Lista/compras: não suportado
- Lista/financeiro: não suportado
- Timer/foco: não suportado
- Nota: não suportado
- Hora absoluta ("às 15h", "15h30"): **não reconhecida**
- Data absoluta ("dia 20", "15/06"): **não reconhecida**
- `diasSemana` nos hábitos: detectado mas **sempre undefined**
- Segmentação composta: split por vírgula/`;`/"e" — sem semântica

### orbit-workspace.tsx (660 linhas)

**Estado gerenciado:**
```
inputText, commands[], selected: Set<string>, isProcessing, hasProcessed,
creationStatus: "idle"|"creating"|"done"|"error", results[], purgatoryItems[]
```

**Review UI:**
- Chips de resumo (contagem por tipo)
- CommandCard por item: checkbox, ícone tipo, badge núcleo, título, prioridade, data, período
- "Selecionar Todos" / "Limpar" + botão "Criar N itens"

**Handlers de backend (atuais):**
- `CREATE_TASK` → cria bloco "tarefas" se não existir → `POST /tarefas`
- `CREATE_HABIT` → cria bloco "habitos" se não existir → `POST /habitos`
- `CREATE_EVENT` → **sem handler** (não cria nada)
- `CREATE_LIST`, `CREATE_TIMER`, `CREATE_NOTE` → **inexistentes**

**Localização:** `/dashboard/chatbot` (wrapper de 5 linhas, invisível ao usuário logado)

### capture-field.tsx

- Salva em `localStorage['nucleos:purgatory']`
- **NÃO é duplicata do Orbit** — captura leve/ephemeral
- orbit-workspace.tsx lê o purgatory via `getPurgatoryItems()`
- No dashboard: aparece antes dos núcleos, **sem interpretação automática**

### Dashboard (page.tsx) — layout atual

```
Dashboard
├── Greeting + VibeCheckWidget
├── ReentryBanner
├── CaptureField               ← captura leve (purgatory)
├── ProximaAcao
├── TimelineContextual
├── BadgeAII (desktop)
├── NucleosOverview (últimos 3)
├── StatsQuadrant
│   └── 4x QuadrantCell (Level, Streak, Achievements, Energy)
├── QuickActions
└── XPSparklineWidget + WeeklyPulseWidget
```

**OrbitWorkspace: AUSENTE do dashboard.**

---

## 5. ESTADO DOS BLOCOS CRUD

| Componente | Tipo | Status |
|-----------|------|--------|
| TarefasBlocoCard.tsx | tarefas | ✅ Funcional |
| HabitosBlocoCard.tsx | habitos | ✅ Funcional |
| ListasBlocoCard.tsx | lista | ✅ Funcional |
| CalendarioBlocoCard.tsx | calendario | ✅ Funcional |
| ColecoesBlocoCard.tsx | colecoes | ✅ Funcional |
| TimersBlocoCard.tsx | timers | ✅ Funcional |
| BlocoDeNotas.tsx | notas | ✅ Funcional (auto-save 800ms) |

---

## 6. GAMIFICAÇÃO — NÃO QUEBRAR

- Hook: `useGamification()` — stats, achievements, leaderboard, streak, energy, XP history
- Hook: `useGamificationSocket()` — WebSocket para XP ao vivo
- Serviço: `gamificacao.service.ts`
- **Dependência crítica:** as ações de gamificação são acionadas pelos handlers Express. Escrever direto no Supabase bypassa esses triggers → gamificação quebra.

---

## 7. SUPABASE — CAMADA ADDITIVE

**Decisão:** Express como writer (preserva gamificação). Supabase SDK no front para:
- Auth session refresh (middleware Next.js)
- Realtime subscriptions: quando Express persiste blocos, front recebe atualização sem polling

**Credenciais:**
```
NEXT_PUBLIC_SUPABASE_URL=https://eeoiggastcrxfvcrurgx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_aA0_efZWNEvVqEYm_owqrA_k7fMyoqR
```

**Tabelas relevantes para subscriptions:**
- `blocos` (filtro: `nucleo_id` em lista do usuário)
- `tarefas` (filtro: `bloco_id`)

---

## 8. ROTEAMENTO DO BACKEND

```
/Auth               → authRoutes
/nucleos            → nucleosRoutes
/                   → blocosRoutes (base path — GET/POST /blocos, etc.)
/tarefas            → tarefasRoutes
/habitos            → habitosRoutes
/listas             → listasRoutes
/colecoes           → colecoesRoutes
/calendario         → calendarioRoutes
/timers             → timersRoutes
/gamificacao        → gamificacaoRoutes
/progress           → progressRoutes
/users              → usersRoutes
/notifications      → notificationsRoutes
```

**Porta dev:** 5000 (`npm run dev` em `nucleos-srv/back-end/`)

**Cache Redis invalidation keys:**
- `blocos:nucleo:{id}` — ao criar/editar bloco
- `tarefas:bloco:{id}` — ao criar/editar tarefa
- `habitos:bloco:{id}` — ao criar/editar hábito
- `listas:bloco:{id}` — ao criar/editar lista
- `nucleos:user:{id}` — ao criar/editar núcleo
