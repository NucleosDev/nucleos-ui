# NUCLEOS UI AUDIT — Redesign UX/UI das Páginas Autenticadas

> Gerado em: 2026-06-15 | Status: FASE 0 COMPLETA — aguardando aprovação para editar produção

---

## DIAGNÓSTICO EXECUTIVO

O app tem uma base sólida (glass system, Framer Motion, Button component com ArrowRight, estrutura de cards). O problema é **inconsistência sistêmica**: cada página/componente resolveu design de forma local, sem um contrato visual compartilhado.

**Principais famílias de problema:**
1. Sistema de cores dos blocos diverge completamente da spec
2. PageHeader existe em algumas páginas mas nunca como componente reutilizável
3. Títulos gradient (`from-[#4D7CFF] to-[#00C9A7]`) ausentes na maioria das páginas autenticadas
4. Inline button styling bypassa o `<Button>` component em vários lugares críticos
5. Empty states incompletos ou ausentes
6. Orbit.svg nunca aparece em nenhuma página autenticada (nem mesmo na /chatbot)

---

## EXPLORE A — Dashboard, Conquistas, Gamificação, Perfil

### `src/app/(user-auth)/dashboard/page.tsx`

| # | Severidade | Problema | Localização |
|---|---|---|---|
| A1 | CRITICAL | "Novo Núcleo" botão com `className` inline (`bg-primary text-primary-foreground ...`) em vez de `<Button>` | ~linha 145-151 |
| A2 | HIGH | Títulos de seção "XP esta semana", "Meus Núcleos" sem gradient | ~linhas 248-250, 309-310 |
| A3 | HIGH | Nenhum empty state quando não há núcleos | — |
| A4 | MEDIUM | Greeting tem gradient correto ✓ mas `max-w-[1400px]` diverge de outras páginas (`max-w-3xl`) | ~linha 154 |
| A5 | MEDIUM | `CardHeader className="px-4 pb-0 pt-0"` inconsistente com padding padrão | ~linha 197 |
| A6 | MEDIUM | Nenhum logo (Orbit.svg, lettermark) usado | — |

### `src/app/(user-auth)/dashboard/conquistas/page.tsx`

| # | Severidade | Problema | Localização |
|---|---|---|---|
| A7 | HIGH | Header próprio (sticky) sem ser PageHeader component | ~linhas 94-103 |
| A8 | HIGH | "Progresso Geral" e títulos de conquistas sem gradient | ~linhas 119-121, 232-236 |
| A9 | MEDIUM | Empty state de conquistas: ícone pequeno, sem CTA button | ~linhas 306-315 |
| A10 | LOW | Badge de contagem e badge de XP com estilos inline divergentes | linhas 101, 123 |
| A11 | LOW | Conquistas bloqueadas usam `opacity-60` (parecem quebradas) — preferir grayscale/desaturation | ~linha 286 |

### `src/app/(user-auth)/dashboard/gamificacao/page.tsx`

| # | Severidade | Problema | Localização |
|---|---|---|---|
| A12 | HIGH | Header próprio sem ser PageHeader component | ~linhas 78-82 |
| A13 | HIGH | "Histórico de XP" e títulos de seção sem gradient | ~linha 94-96 |
| A14 | MEDIUM | Streak badge com inline className (orange) em vez de Badge component | ~linhas 101-105 |
| A15 | MEDIUM | Nenhum empty state quando não há histórico de XP | — |

### `src/app/(user-auth)/dashboard/perfil/page.tsx`

| # | Severidade | Problema | Localização |
|---|---|---|---|
| A16 | HIGH | Nome do usuário `<h2>` sem gradient | ~linha 195 |
| A17 | HIGH | "Informações Pessoais", "Conquistas", "Área de Risco" sem gradient | ~linhas 290, 407, 458 |
| A18 | MEDIUM | Stats pills com `className` inline em vez de Badge/component | ~linhas 200-237 |
| A19 | MEDIUM | Conquistas no perfil têm visual diferente de conquistas.page.tsx | ~linhas 418-450 |
| A20 | LOW | Opacity `opacity-50` em conquistas bloqueadas | ~linha 444 |
| A21 | LOW | Nenhum logo usado (perfil seria boa localização para lettermark) | — |

---

## EXPLORE B — Chatbot, Calendário, Insights, Foco, Notificações, Inbox, Configurações

### `src/app/(user-auth)/dashboard/chatbot/page.tsx`

| # | Severidade | Problema | Localização |
|---|---|---|---|
| B1 | CRITICAL | Página só renderiza `<OrbitWorkspace />` sem nenhum PageHeader | linha 1 |
| B2 | CRITICAL | Orbit.svg ausente como hero graphic | — |
| B3 | CRITICAL | Título "Orbit" em texto plano, sem gradient | orbit-workspace.tsx ~linha 611 |
| B4 | HIGH | Textarea pequena (rows=4) — deveria ser min-h-[120px] e mais prominente | orbit-workspace.tsx ~linha 701-715 |
| B5 | HIGH | Border do input area muito sutil (`border-border/30`) — deveria ser glassmorphism | — |

### `src/app/(user-auth)/dashboard/calendario/page.tsx`

| # | Severidade | Problema | Localização |
|---|---|---|---|
| B6 | HIGH | Título "Calendário" sem gradient | ~linha 98 |
| B7 | MEDIUM | CTA button no empty state está `disabled` (line 208) — sem explicação | ~linha 208 |
| B8 | LOW | PageHeader existe ✓ mas título não usa gradient | ~linhas 93-155 |

### `src/app/(user-auth)/dashboard/insights/page.tsx`

| # | Severidade | Problema | Localização |
|---|---|---|---|
| B9 | HIGH | Título "O Espelho" sem gradient | ~linha 197 |
| B10 | LOW | PageHeader existe ✓, buttons corretos ✓, estrutura boa | — |

### `src/app/(user-auth)/dashboard/foco/page.tsx`

| # | Severidade | Problema | Localização |
|---|---|---|---|
| B11 | INFO | Página renderiza `<FocusSession />` em fullscreen (modal imersivo) — correto por design | — |
| B12 | MEDIUM | Timer display deveria ter gradient no número | FocusSession.tsx |

### `src/app/(user-auth)/dashboard/notificacoes/page.tsx`

| # | Severidade | Problema | Localização |
|---|---|---|---|
| B13 | HIGH | Título "Notificações" sem gradient | ~linha 121 |
| B14 | MEDIUM | Notification items em `<motion.div>` sem usar Card component | ~linhas 162-211 |
| B15 | LOW | PageHeader existe ✓, empty state existe ✓ | — |

### `src/app/(user-auth)/dashboard/inbox/page.tsx`

| # | Severidade | Problema | Localização |
|---|---|---|---|
| B16 | HIGH | Título "Inbox" sem gradient | ~linha 220 |
| B17 | MEDIUM | Um botão com inline className em vez de `<Button>` | ~linhas 230-238 |
| B18 | LOW | PageHeader existe ✓, empty state existe ✓, gradient em itens lidos/não-lidos ✓ | — |

### `src/app/(user-auth)/dashboard/configuracoes/page.tsx`

| # | Severidade | Problema | Localização |
|---|---|---|---|
| B19 | HIGH | Título "Configurações" sem gradient | ~linha 35 |
| B20 | LOW | PageHeader existe ✓, Button components corretos ✓, Card structure ✓ | — |

---

## EXPLORE C — BlocoCard e todos os CRUDs

### PROBLEMA SISTÊMICO #1 — Sistema de cores completamente errado

**`src/components/blocos/BlocoCard.tsx`** define as cores base que todo o sistema herdaria — mas elas divergem da spec:

| Tipo | Cor atual (BlocoCard.tsx) | Cor spec | Delta |
|---|---|---|---|
| tarefas | `text-primary-400` `bg-primary-500/10` | `text-[#4D7CFF]` `bg-[#4D7CFF]/8` | opacity /10 → /8; primary pode diferir |
| calendario | `text-indigo-400` `bg-indigo-500/10` | `text-amber-500` `bg-amber-500/8` | **ERRADO** — cor completamente diferente |
| habitos | `text-green-400` `bg-teal-500/10` | `text-emerald-500` `bg-emerald-500/8` | teal ≠ emerald |
| lista | `text-cyan-400` `bg-cyan-500/10` | `text-violet-500` `bg-violet-500/8` | **ERRADO** — cor completamente diferente |
| timers | `text-orange-400` `bg-orange-500/10` | `text-cyan-500` `bg-cyan-500/8` | **ERRADO** — cor completamente diferente |
| colecoes | `text-emerald-400` `bg-emerald-500/10` | `text-indigo-500` `bg-indigo-500/8` | **ERRADO** — cor completamente diferente |
| notas | `text-purple-400` `bg-purple-500/10` | `text-pink-500` `bg-pink-500/8` | purple ≠ pink |

**Todos os tipos:** falta `border-[COLOR]/20`

### PROBLEMA SISTÊMICO #2 — Accent lateral, não superior

`BlocoCard.tsx` ~linhas 330-335: tem uma faixa de accent **lateral** (`inset-y-0 left-0 w-[3px]`). A spec pede `border-t-2` (accent superior). Precisa mudar a abordagem arquitetural do card.

### `src/components/blocos/BlocoCard.tsx`

| # | Severidade | Problema |
|---|---|---|
| C1 | CRITICAL | Sistema de cores diverge da spec em 5 de 7 tipos |
| C2 | HIGH | Accent lateral em vez de border-t-2 |
| C3 | HIGH | Ícone de `notas` usa `BookOpen` (spec: `FileText`) |
| C4 | MEDIUM | Opacidade `/10` em vez de `/8` |

### `src/components/blocos/cruds/TarefasBlocoCard.tsx`

| # | Severidade | Problema |
|---|---|---|
| C5 | HIGH | Botões "Diário"/"Nova" com className inline | ~linhas 164-181 |
| C6 | HIGH | Sem Framer Motion no render de views (kanban/lista) | ~linhas 186-202 |
| C7 | MEDIUM | Empty state delega para subcomponentes — não verificável direto |

### `src/components/blocos/cruds/HabitosBlocoCard.tsx`

| # | Severidade | Problema |
|---|---|---|
| C8 | HIGH | Botão "Novo hábito" com className inline | ~linhas 109-116 |
| C9 | HIGH | Empty state: CTA é link de texto, não `<Button>` | ~linha 129-134 |
| C10 | HIGH | Itens de hábito sem Framer Motion | ~linhas 136-150 |

### `src/components/blocos/cruds/ListasBlocoCard.tsx`

| # | Severidade | Problema |
|---|---|---|
| C11 | CRITICAL | Empty state usa `style={{ color: "#06b6d4" }}` — cor errada (cyan em vez de violet) | ~linhas 65-99 |
| C12 | CRITICAL | Botões CTA com `style={{...}}` inline (contorna completamente o sistema) | ~linhas 78-89 |
| C13 | HIGH | "Nova lista" button com inline styles | ~linhas 112-119 |
| C14 | HIGH | `ListaExpandivel` sem Framer Motion | ~linha 104 |

### `src/components/blocos/cruds/CalendarioBlocoCard.tsx`

| # | Severidade | Problema |
|---|---|---|
| C15 | MEDIUM | Sem empty state próprio (delega para CalendarioCard) | ~linhas 61-75 |

### `src/components/blocos/cruds/TimersBlocoCard.tsx`

| # | Severidade | Problema |
|---|---|---|
| C16 | HIGH | Empty state muito simples (h-7 w-7, sem subtítulo, sem CTA) | ~linhas 301-305 |
| C17 | HIGH | Submit button com gradient hardcoded `from-orange-500 to-amber-500` (deveria ser cyan por spec) | ~linha 242-265 |
| C18 | HIGH | Timer cards sem Framer Motion | ~linhas 277-290 |
| C19 | MEDIUM | Botões view toggle com className inline | ~linhas 164-170 |

### `src/components/blocos/BlocoDeNotas.tsx`

| # | Severidade | Problema |
|---|---|---|
| C20 | HIGH | Sem nenhum empty state visual | — |

### `src/components/blocos/cruds/ColecoesBlocoCard.tsx`

| # | Severidade | Problema |
|---|---|---|
| C21 | CRITICAL | Empty state com `style={{ background: "linear-gradient(135deg, #10b98122...)" }}` — cor emerald errada (spec: indigo) | ~linhas 71-129 |
| C22 | CRITICAL | Botões "Tabela rápida"/"Vazia" com `bg-emerald-500` inline (spec: indigo) | ~linhas 92-111 |
| C23 | HIGH | "Nova Tabela" com `text-emerald-600` inline | ~linha 137-147 |

---

## RESUMO CONSOLIDADO POR SEVERIDADE

### CRITICAL (bloqueia o visual do produto)
- C1 — Sistema de cores de blocos diverge em 5/7 tipos
- C2 — Accent lateral em vez de border-t-2 em todos os cards
- C11, C21 — Empty states de Lista e Coleções com cores completamente erradas via `style={}` inline
- B1-B5 — Chatbot sem PageHeader, sem Orbit.svg hero, sem gradient no título

### HIGH (inconsistência visual óbvia)
- Títulos de todas as páginas autenticadas sem gradient (A7-A8, A12-A13, A16-A17, B6, B9, B13, B16, B19)
- Botões inline em vez de `<Button>` (A1, B17, C5, C8, C9, C12-C13, C16-C17)
- Framer Motion ausente em 4 componentes CRUD (C6, C10, C14, C18)
- Empty states incompletos (A9, C16, C20)

### MEDIUM (polish)
- Stats pills/badges com className inline em vez de Badge component
- Orbit.svg nunca aparece em nenhuma página autenticada
- Spacing inconsistente entre páginas

### LOW (refinamento)
- Opacity /10 em vez de /8 nos backgrounds dos blocos
- Ícone `notas`: BookOpen → FileText
- Conquistas bloqueadas com `opacity-50/60` em vez de grayscale

---

## CHECKLIST DAS FASES (atualizar após cada fase)

### FASE 1 — Componente base
- [ ] Criar `src/components/user/page-header.tsx`
- [ ] Verificar/adicionar `variant="glass"` em `button.tsx`
- [ ] Confirmar que `<Button variant="default">` injeta ArrowRight

### FASE 2 — Writer A (dashboard, conquistas, gamificacao)
- [ ] `dashboard/page.tsx` — gradient greeting, botões padronizados, empty state
- [ ] `conquistas/page.tsx` — PageHeader, gradient títulos, empty state com CTA
- [ ] `gamificacao/page.tsx` — PageHeader, gradient títulos, empty state XP

### FASE 2 — Writer B (perfil, configuracoes, notificacoes, inbox)
- [ ] `perfil/page.tsx` — gradient nome, PageHeader, badges padronizados
- [ ] `configuracoes/page.tsx` — gradient título no PageHeader
- [ ] `notificacoes/page.tsx` — gradient título no PageHeader
- [ ] `inbox/page.tsx` — gradient título no PageHeader

### FASE 3 — Orbit (chatbot)
- [ ] `chatbot/page.tsx` — PageHeader + Orbit.svg hero + gradient "Orbit"
- [ ] `orbit-workspace.tsx` — glassmorphism input, result cards com cores R5, prominent textarea

### FASE 4 — Writer A (calendario, insights, foco)
- [ ] `calendario/page.tsx` — gradient título, fix disabled CTA
- [ ] `insights/page.tsx` — gradient título
- [ ] `foco/page.tsx` — gradient no número do timer

### FASE 4 — Writer B (blocos)
- [ ] `BlocoCard.tsx` — corrigir todas as 7 cores + border-t-2 + ícone notas
- [ ] `TarefasBlocoCard.tsx` — botões + Framer Motion
- [ ] `HabitosBlocoCard.tsx` — botões + empty state + Framer Motion
- [ ] `ListasBlocoCard.tsx` — cores corretas (violet), remover inline styles
- [ ] `CalendarioBlocoCard.tsx` — cores corretas (amber)
- [ ] `TimersBlocoCard.tsx` — cores corretas (cyan), empty state, Framer Motion
- [ ] `BlocoDeNotas.tsx` — empty state
- [ ] `ColecoesBlocoCard.tsx` — cores corretas (indigo), remover inline styles

### FASE 5 — Review final
- [ ] Zero botões com `className="bg-primary..."` inline
- [ ] Todas as páginas com `<PageHeader>`
- [ ] Gradient nos títulos principais
- [ ] Orbit.svg visível em /dashboard/chatbot
- [ ] Empty states com ícone + título + subtítulo + CTA
- [ ] Bloco cards com border-t-2 na cor do tipo
- [ ] `npm run build` — zero TypeScript errors
