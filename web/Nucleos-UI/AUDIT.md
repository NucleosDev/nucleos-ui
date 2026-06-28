# AUDIT.md — Nucleos Product Truth · May 2026

> Auditoria completa: backend x frontend, UX, design system, engenharia.

---

## 1. Backend Pronto, Ignorado pelo Frontend

| Endpoint | Situação |
|---|---|
| `GET /progress/energy` | Backend funcional (cálculo dinâmico por nível + streak). **Nenhum componente consome isso.** |
| `POST /progress/energy/consume` | Backend funcional. **Não exposto em nenhuma tela.** |
| `GET /plans` + `GET /plans/subscription` | Backend funcional (PlansController). **Sem tela de planos ou gerenciamento de assinatura no dashboard.** |
| `GET /insights` | InsightsController existe. insights/page.tsx **está 100% comentado** — página morta. |
| `GET /calendario` global | CalendarioController funcional. calendario/page.tsx **está 100% comentado** — página morta, sidebar linka para página vazia. |

---

## 2. Funcionalidades Quebradas / Páginas Mortas

| Arquivo | Problema |
|---|---|
| `src/app/.../dashboard/calendario/page.tsx` | **COMENTADO COMPLETAMENTE.** Link na sidebar leva a página em branco. |
| `src/app/.../dashboard/insights/page.tsx` | **COMENTADO COMPLETAMENTE.** Link na sidebar leva a página em branco. |
| `src/components/user/dashboard-content.tsx` | **COMENTADO COMPLETAMENTE.** (dashboard/page.tsx foi reconstruído inline — ok.) |
| `TarefasBlocoCard.tsx` → `handleDeleteTask` | Usa `confirm()` nativo do browser — fora do design system. |

---

## 3. Componentes Visualmente Inconsistentes

| Componente | Problema |
|---|---|
| `BlocoDeNotas.tsx` | Usa `<Card>` + `<Textarea>` + `<Button>` shadcn padrão. **Completamente fora do design system.** Único bloco que parece uma UI genérica. Manual save button (não autosave). |
| `NucleoCard.tsx` | Ainda referencia `https://picsum.photos/seed/${id}/400/200` para imagem de capa. `nucleo-core-card.tsx` foi corrigido na sessão anterior, mas `nucleo-card.tsx` não. |
| `ListasBlocoCard` / `ColecoesBlocoCard` | Usam cores hardcoded inline (`#06b6d4`, `#10b981`) em vez de CSS tokens. |
| `BlocoCard.tsx` `BLOCK_META` | Usa `accentBg` como hex strings hardcoded (`"#eff6ff"`) — não segue `--glass-bg` / `--surface-*` tokens. |

---

## 4. CRUDs Ainda Parecem CRUDs

| Componente | Problema |
|---|---|
| `BlocoDeNotas` | Textarea + botão Salvar. Experiência de 2018. |
| `GerenciarCamposModal` | Não lido — provavelmente usa dialogs genéricos. |
| `AdicionarItemColecaoModal` | Usa Dialog padrão, não redesenhado no design system atual. |
| `CriarHabitoModal` | Usa inputs genéricos — não usa GlassInput do glass-modal. |
| `AddTaskDialog` | Não lido, provavelmente usa Dialog genérico. |

---

## 5. Problemas de UX Cognitiva

| Problema | Impacto |
|---|---|
| Canvas: cada bloco tem borda + padding + drag handle → parece "blocos separados", não documento contínuo | Alto — destrói sensação de Notion |
| BlocoDeNotas como widget opaco | Interrompe o fluxo cognitivo dentro do canvas |
| Calendário global morto | Usuário clica no link da sidebar e vê página vazia |
| Insights global morto | Idem |
| Energy system invisível | Feature de gamificação sem toque no produto |
| confirm() nativo para deletar tarefa | Fricção, fora do design |

---

## 6. Componentes Importados que Precisam de Redesign

| Componente | Status |
|---|---|
| `<AlertDialog>` | Design system ok — já usa glass via card tokens |
| `<Sheet>` | Não inspecionado — pode precisar de blur |
| `<DropdownMenu>` | Não redesenhado para glass |
| `<Dialog>` | Não inspecionado nos modals de CRUD |
| `GlassModal` | Próprio, bom — já é glass |
| Modais de criação de habito/tarefa | Usam Dialog padrão em vez de GlassModal |

---

## Prioridade de Execução

1. **BlocoDeNotas** → redesign total (maior incongruência visual)
2. **NucleoCard** → remover picsum
3. **calendario/page.tsx** → restaurar página real
4. **insights/page.tsx** → restaurar página real
5. **Canvas** → fluidez contínua, SortableDocumentBlock menos fragmentado
6. **KanbanBoard** → migrar para @dnd-kit com animações spring
7. **Energy system** → wiring na UI
8. **confirm() nativos** → substituir por AlertDialog
