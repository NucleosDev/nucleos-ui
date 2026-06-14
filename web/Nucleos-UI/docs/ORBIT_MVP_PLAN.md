# ORBIT_MVP_PLAN.md — Checklist de Execução
> Atualizado: 2026-06-14

North Star: o usuário despeja bagunça mental no Orbit → Nucleos interpreta e organiza em blocos reais → persiste no banco → usuário revisa e confirma em 1 clique.

---

## Fase 0 — Exploração ✅
- [x] Explorar serviços front (src/services/)
- [x] Explorar rotas backend (nucleos-srv/back-end/src/api/routes/)
- [x] Explorar interpreter.ts + orbit-workspace.tsx + chatbot page
- [x] Explorar dashboard + capture-field + blocos CRUD
- [x] Criar docs/ORBIT_AUDIT.md
- [x] Criar docs/ORBIT_MVP_PLAN.md

## Fase 0.5 — Supabase Setup (additive layer) ✅
- [x] `pnpm add @supabase/supabase-js @supabase/ssr`
- [x] Adicionar vars no `.env.local`
- [x] Criar `utils/supabase/client.ts`
- [x] Criar `utils/supabase/server.ts`
- [x] Criar `utils/supabase/middleware.ts`
- [x] Integrar no `src/middleware.ts`
- [x] React Query invalida caches após criar blocos
- [x] Commit: `feat: supabase sdk + docs de auditoria orbit`

## Fase 1 — Vertical Slice: Orbit no Dashboard ✅
- [x] Embed `<OrbitWorkspace compact />` no `dashboard/page.tsx` como hero element
- [x] Substituiu CaptureField como entrada principal
- [x] Commit: `feat: orbit mvp — motor completo, revisao inline, builder todos os tipos`

## Fase 2 — Motor Completo (interpreter.ts) ✅
- [x] Adicionar tipo `CREATE_LIST` (compras + financeiro)
  - [x] Keywords: comprar, falta, lista de compras, pagar, boleto, fatura, R$
  - [x] Extrair items (split em vírgula ou " e " após keyword)
  - [x] Extrair valor R$ se presente
- [x] Adicionar tipo `CREATE_TIMER`
  - [x] Pattern: `\d+\s*(h|min)` + keywords foco/estudar/pomodoro/sprint
  - [x] Converter para minutos
- [x] Adicionar tipo `CREATE_NOTE`
  - [x] Trigger: prefixos "ideia:", "nota:", "anotação:", etc.
  - [x] Fallback: texto > 80 chars sem keywords de ação
- [x] Parsing horário absoluto: `/às\s+(\d{1,2})h(\d{2})?/i`
- [x] Parsing data absoluta: `/\bdia\s+(\d{1,2})\b/i`, `/\b(\d{1,2})\/(\d{1,2})\b/i`
- [x] Combinar diaSemana + hora no mesmo segmento ("terça às 15h")
- [x] Computar `diasSemana[]` para hábitos ("todo dia" → [0..6], "dias de semana" → [1..5])
- [x] Refinamento de confiança (base 0.5 + bonuses por keyword/data/hora)
- [x] Prevenir split " e " quando segmento inicia com LIST_START_REGEX

## Fase 3 — Revisão em 1 Clique ✅
- [x] Dropdown inline de tipo no CommandCard (ícones + labels)
- [x] Dropdown inline de núcleo (lista nucleos[] + "Criar novo")
- [x] DatePicker inline por item
- [x] Botão descartar por item (ícone X, remove do `commands[]`)
- [x] Destaque visual: `confidence < 0.65` → borda laranja + badge "Revisar"
- [x] State `editOverrides: Record<id, Partial<OrbitCommand>>`
- [x] Mesclar overrides no momento da confirmação

## Fase 4 — Construção Real de Todos os Tipos ✅
- [x] Handler `CREATE_LIST` → bloco "lista" → lista → items (loop)
- [x] Handler `CREATE_EVENT` → direto para `/calendario` (sem bloco)
- [x] Handler `CREATE_TIMER` → `timers/start` com nucleoId direto
- [x] Handler `CREATE_NOTE` → bloco "notas" → `PATCH /blocos/{id}/content`
- [x] Criação automática de núcleo se não existir (`POST /nucleos`)
- [x] Erro por item → `results[]` com status "error"
- [x] Falha num item não cancela os demais
- [x] Invalidação de React Query após criar (nucleos, tarefas, habitos, listas, calendario, timers)

## Fase 5 — Polimento dos Blocos ✅
- [x] Todos 7 CRUDs verificados por Explore agent (funcionais)
- [ ] Smoke test visual com backend — QA manual

## Fase 5.5 — Memória de Correção Determinística ✅
- [x] Criar `src/lib/orbit/user-corrections.ts`
  - [x] `saveCorrection(userId, rawText, override)`
  - [x] `getCorrections(userId)` → localStorage `nucleos:orbit:corrections:{userId}`
  - [x] `applyOverrides(commands[], userId)` → substituir tipo/nucleo com override
- [x] Em `orbit-workspace.tsx`: chamar `applyOverrides()` em `handleProcess`
- [x] Chamar `saveCorrection()` ao editar tipo ou núcleo inline
- [x] Extrair pattern: primeiras 2-3 palavras significativas do rawText
- [x] Chip "Ver exemplo": injeta frase demo no campo de input

## Fase 6 — Teste de Aceitação ✅
- [x] Motor interpretou corretamente os 5 segmentos da frase canônica (smoke test offline)
  - [x] "reunião com cliente terça às 15h" → CREATE_EVENT, hora: 15:00
  - [x] "pagar boleto da internet R$120" → CREATE_LIST financeiro, valor: R$120
  - [x] "comprar leite e café" → CREATE_LIST compras, items: [leite, café]
  - [x] "estudar React 1h todo dia" → CREATE_HABIT diário
  - [x] "ligar pra minha mãe sábado" → CREATE_TASK
- [x] Fix regex items de lista: `\s*,\s*|\s+e\s+` (não `[,e]` que partia palavras como "leite")
- [x] Fix tipo `"generica"` → `"generico"` (match backend TipoLista)
- [x] Fix `new Date(dataVencimento)` → string direta (match assinatura tarefasService)
- [x] `npx tsc --noEmit` → zero erros
- [ ] Teste ponta a ponta com backend porta 5000 + reload — QA manual
- [x] Commit: `fix: erros de tipo ts + regex items de lista`

---

## Restrições Fixas ✅ Respeitadas
- Motor 100% determinístico — zero LLM/IA
- Sem batch-create no backend — chamadas individuais sequenciais
- Auth + núcleos + gamificação não tocados
