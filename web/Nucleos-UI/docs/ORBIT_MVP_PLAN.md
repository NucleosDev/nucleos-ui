# ORBIT_MVP_PLAN.md — Checklist de Execução
> Atualizado: 2026-06-13

North Star: o usuário despeja bagunça mental no Orbit → Nucleos interpreta e organiza em blocos reais → persiste no banco → usuário revisa e confirma em 1 clique.

---

## Fase 0 — Exploração (concluída)
- [x] Explorar serviços front (src/services/)
- [x] Explorar rotas backend (nucleos-srv/back-end/src/api/routes/)
- [x] Explorar interpreter.ts + orbit-workspace.tsx + chatbot page
- [x] Explorar dashboard + capture-field + blocos CRUD
- [x] Criar docs/ORBIT_AUDIT.md
- [x] Criar docs/ORBIT_MVP_PLAN.md

## Fase 0.5 — Supabase Setup (additive layer)
- [ ] `npm install @supabase/supabase-js @supabase/ssr`
- [ ] Adicionar vars no `.env.local`
- [ ] Criar `utils/supabase/client.ts`
- [ ] Criar `utils/supabase/server.ts`
- [ ] Criar `utils/supabase/middleware.ts`
- [ ] Integrar no `src/middleware.ts`
- [ ] Realtime subscription no orbit-workspace (invalida React Query pós-criação)
- [ ] Commit: `feat: supabase sdk — auth session + realtime subscriptions`

## Fase 1 — Vertical Slice: Orbit no Dashboard, 1 Tarefa Persiste
- [ ] Embed `<OrbitWorkspace />` no `dashboard/page.tsx` como hero element
- [ ] Verificar fluxo CREATE_TASK end-to-end com backend rodando (porta 5000)
- [ ] Confirmar persistência após reload da página
- [ ] Commit: `feat: orbit no dashboard — vertical slice tarefa`

## Fase 2 — Motor Completo (interpreter.ts)
- [ ] Adicionar tipo `CREATE_LIST` (compras + financeiro)
  - [ ] Keywords: comprar, falta, lista de compras, pagar, boleto, fatura, R$
  - [ ] Extrair items (split em vírgula após keyword)
  - [ ] Extrair valor R$ se presente
- [ ] Adicionar tipo `CREATE_TIMER`
  - [ ] Pattern: `\d+\s*(h|min)` + keywords foco/estudar/pomodoro/sprint
  - [ ] Converter para minutos
- [ ] Adicionar tipo `CREATE_NOTE`
  - [ ] Trigger: prefixos "ideia:", "nota:", "anotação:", etc.
  - [ ] Fallback: texto > 80 chars sem keywords de ação
- [ ] Parsing horário absoluto: `/às\s+(\d{1,2})h(\d{2})?/i` e `\b(\d{1,2})h(\d{2})\b`
- [ ] Parsing data absoluta: `/\bdia\s+(\d{1,2})\b/i`, `/\b(\d{1,2})\/(\d{1,2})\b/i`
- [ ] Combinar diaSemana + hora no mesmo segmento ("terça às 15h")
- [ ] Computar `diasSemana[]` para hábitos ("todo dia" → [0..6], "dias de semana" → [1..5])
- [ ] Refinamento de confiança (base 0.5 + bonuses por keyword/data/hora)
- [ ] CAPTURE retornado para inputs completamente ambíguos
- [ ] Commit: `feat: interpreter — lista, timer, nota, horário e data absolutos`

## Fase 3 — Revisão em 1 Clique (orbit-workspace.tsx)
- [ ] Dropdown inline de **tipo** no CommandCard (ícones + labels)
- [ ] Dropdown inline de **núcleo** (lista nucleos[] + "Criar novo")
- [ ] DatePicker inline por item
- [ ] Botão **descartar** por item (ícone X, remove do `commands[]`)
- [ ] Destaque visual: `confidence < 0.65` → borda laranja + badge "Revisar"
- [ ] State `editOverrides: Record<id, Partial<OrbitCommand>>`
- [ ] Mesclar overrides no momento da confirmação
- [ ] Commit: `feat: revisão orbit — edição inline em 1 clique`

## Fase 4 — Construção Real de Todos os Tipos (orbit-workspace.tsx)
- [ ] Handler `CREATE_LIST` → bloco "lista" → lista → items (loop)
- [ ] Handler `CREATE_EVENT` → direto para `/calendario` (sem bloco)
- [ ] Handler `CREATE_TIMER` → bloco "timers" → `/timers/start`
- [ ] Handler `CREATE_NOTE` → bloco "notas" → `PATCH /blocos/{id}/content`
- [ ] Criação automática de núcleo se não existir (`POST /nucleos`)
- [ ] Erro por item → `results[]` com status "error" + botão "Tentar novamente"
- [ ] Falha num item não cancela os demais
- [ ] Invalidação de React Query após criar (+ Supabase realtime)
- [ ] Commit: `feat: orbit builder — todos os tipos + criação de núcleo`

## Fase 5 — Polimento dos Blocos
- [ ] Smoke test: TarefasBlocoCard (abrir, criar, editar, salvar, reload)
- [ ] Smoke test: HabitosBlocoCard
- [ ] Smoke test: ListasBlocoCard
- [ ] Smoke test: CalendarioBlocoCard
- [ ] Smoke test: TimersBlocoCard
- [ ] Smoke test: BlocoDeNotas
- [ ] Smoke test: ColecoesBlocoCard
- [ ] Corrigir edge cases encontrados
- [ ] Commit se houver correções: `fix: blocos crud — polimento pós-smoke-test`

## Fase 5.5 — Memória de Correção Determinística
- [ ] Criar `src/lib/orbit/user-corrections.ts`
  - [ ] `saveCorrection(pattern, tipo, nucleoTipo, nucleoId?)`
  - [ ] `getCorrections(userId)` → localStorage `nucleos:orbit:corrections:{userId}`
  - [ ] `applyOverrides(commands[], userId)` → substituir tipo/nucleo com override
- [ ] Em `interpreter.ts`: chamar `applyOverrides()` APÓS parse normal
- [ ] Em `orbit-workspace.tsx`: chamar `saveCorrection()` ao editar inline (Fase 3)
- [ ] Extrair keyword: primeiras 2-3 palavras significativas do rawText
- [ ] Chip "Exemplo": botão que injeta a frase demo no campo de input
- [ ] Commit: `feat: orbit memory — correção determinística + chip exemplo`

## Fase 6 — Teste de Aceitação Ponta a Ponta
- [ ] Subir backend (porta 5000) + front (`pnpm dev`)
- [ ] Digitar frase de aceitação:
  > "reunião com cliente terça às 15h, pagar boleto da internet R$120, comprar leite e café, estudar React 1h todo dia, ligar pra minha mãe sábado"
- [ ] Verificar 5 blocos interpretados: evento, lista financeiro, lista compras, hábito, tarefa
- [ ] Ajustar 1-2 items em 1 clique → confirmar
- [ ] Recarregar página → tudo persiste e abre corretamente
- [ ] Teste de memória: mover item para núcleo X → confirmar → re-digitar → item já em X
- [ ] `pnpm build` sem erros
- [ ] `pnpm lint` sem erros
- [ ] Documentar evidência (logs terminal + comportamento observado)
- [ ] Commit final: `feat: orbit mvp — aceitação ponta a ponta`
