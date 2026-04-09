"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, FileText, List, Calendar, Timer, MoreHorizontal,
  Trash2, Edit3, CheckSquare, CheckCircle2, Circle, Clock, Flame,
  Zap, ChevronDown, ChevronUp, GripVertical, X, Check, RefreshCw,
  BookOpen, Briefcase, Heart, Target, Star, Dumbbell, Wallet, Globe, Layers,
} from "lucide-react";

const TIPO_ICONS: Record<string, React.ElementType> = {
  estudo: BookOpen, pessoal: Heart, profissional: Briefcase,
  projeto: Target, hobby: Star, fitness: Dumbbell, financas: Wallet, idiomas: Globe,
};
import { useNucleoDetail } from "@/hooks/use-nucleos";
import { tarefasService, habitosService, listasService, Tarefa, Habito, Lista, ItemLista } from "@/services/tarefas.service";
import { calendarioService } from "@/services/calendario.service";
import { timersService } from "@/services/timers.service";
import { blocosService } from "@/services/blocos.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { CalendarioEvento } from "@/types/calendar";
import type { Timer as TimerType } from "@/types/calendar";

// ===== BLOCO DE TAREFAS =====
function BlocoTarefas({ blocoId }: { blocoId: string }) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titulo: "", descricao: "", prioridade: "media" as const, dataVencimento: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    tarefasService.getTarefas(blocoId).then(setTarefas).catch(() => {}).finally(() => setLoading(false));
  }, [blocoId]);

  const create = async () => {
    if (!form.titulo.trim()) return;
    setSaving(true);
    try {
      const nova = await tarefasService.createTarefa({ ...form, blocoId, posicao: tarefas.length, status: "pendente" });
      setTarefas(p => [...p, nova]);
      setShowForm(false);
      setForm({ titulo: "", descricao: "", prioridade: "media", dataVencimento: "" });
      toast({ title: "Tarefa criada!" });
    } catch { toast({ title: "Erro ao criar tarefa", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const concluir = async (id: string) => {
    try {
      await tarefasService.concluirTarefa(id);
      setTarefas(p => p.map(t => t.id === id ? { ...t, status: "concluida" as const } : t));
      toast({ title: "✅ Tarefa concluída! +20 XP" });
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  const deletar = async (id: string) => {
    try {
      await tarefasService.deleteTarefa(id);
      setTarefas(p => p.filter(t => t.id !== id));
    } catch { toast({ title: "Erro ao excluir", variant: "destructive" }); }
  };

  const prioColors = { baixa: "text-slate-500", media: "text-blue-500", alta: "text-orange-500", urgente: "text-red-500" };
  const pendentes = tarefas.filter(t => t.status !== "concluida");
  const concluidas = tarefas.filter(t => t.status === "concluida");

  return (
    <div className="space-y-3">
      {loading ? <Skeleton className="h-20" /> : (
        <>
          <div className="space-y-2">
            {pendentes.map(t => (
              <div key={t.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg group hover:bg-muted/50 transition-colors">
                <button onClick={() => concluir(t.id)} className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors">
                  <Circle className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.titulo}</p>
                  {t.descricao && <p className="text-xs text-muted-foreground">{t.descricao}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium ${prioColors[t.prioridade] || "text-muted-foreground"}`}>{t.prioridade}</span>
                    {t.dataVencimento && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(t.dataVencimento).toLocaleDateString("pt-BR")}</span>}
                  </div>
                </div>
                <button onClick={() => deletar(t.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            {concluidas.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg opacity-60">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-sm line-through text-muted-foreground truncate flex-1">{t.titulo}</p>
              </div>
            ))}
          </div>

          {showForm ? (
            <div className="border border-border rounded-lg p-3 space-y-3 bg-card">
              <Input placeholder="Título da tarefa" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} autoFocus onKeyDown={e => { if (e.key === "Enter") create(); if (e.key === "Escape") setShowForm(false); }} />
              <div className="flex gap-2">
                <Select value={form.prioridade} onValueChange={v => setForm(f => ({ ...f, prioridade: v as any }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{["baixa","media","alta","urgente"].map(p => <SelectItem key={p} value={p} className="text-xs capitalize">{p}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="date" className="h-8 text-xs flex-1" value={form.dataVencimento} onChange={e => setForm(f => ({ ...f, dataVencimento: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={create} disabled={saving} className="h-7 text-xs">{saving ? "..." : "Criar"}</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowForm(false)} className="h-7 text-xs">Cancelar</Button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowForm(true)} className="w-full flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors border border-dashed border-border">
              <Plus className="w-4 h-4" /> Adicionar tarefa
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ===== BLOCO DE HÁBITOS =====
function BlocoHabitos({ blocoId }: { blocoId: string }) {
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", frequencia: "diaria", metaVezes: 1 });
  const [registros, setRegistros] = useState<Record<string, boolean>>({});

  useEffect(() => {
    habitosService.getHabitos(blocoId).then(setHabitos).catch(() => {}).finally(() => setLoading(false));
  }, [blocoId]);

  const create = async () => {
    if (!form.nome.trim()) return;
    try {
      const novo = await habitosService.createHabito({ ...form, blocoId });
      setHabitos(p => [...p, novo]);
      setShowForm(false);
      setForm({ nome: "", frequencia: "diaria", metaVezes: 1 });
      toast({ title: "Hábito criado! 🔥" });
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  const registrar = async (id: string) => {
    if (registros[id]) return;
    try {
      await habitosService.registrarHabito(id, { data: new Date().toISOString(), vezesCompletadas: 1 });
      setRegistros(p => ({ ...p, [id]: true }));
      toast({ title: "Hábito registrado! +10 XP 🔥" });
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  return (
    <div className="space-y-3">
      {loading ? <Skeleton className="h-20" /> : (
        <>
          <div className="space-y-2">
            {habitos.map(h => (
              <div key={h.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <button
                  onClick={() => registrar(h.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${registros[h.id] ? "bg-emerald-500 text-white" : "bg-muted border border-border hover:border-primary text-muted-foreground"}`}
                >
                  {registros[h.id] ? <Check className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{h.nome}</p>
                  <p className="text-xs text-muted-foreground">{h.frequencia} · meta: {h.metaVezes}x</p>
                </div>
                {registros[h.id] && <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">Feito!</Badge>}
              </div>
            ))}
          </div>
          {showForm ? (
            <div className="border border-border rounded-lg p-3 space-y-3 bg-card">
              <Input placeholder="Nome do hábito" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} autoFocus />
              <div className="flex gap-2">
                <Select value={form.frequencia} onValueChange={v => setForm(f => ({ ...f, frequencia: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{["diaria","semanal","mensal"].map(f => <SelectItem key={f} value={f} className="text-xs capitalize">{f}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" min={1} max={10} className="h-8 text-xs w-20" value={form.metaVezes} onChange={e => setForm(f => ({ ...f, metaVezes: Number(e.target.value) }))} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={create} className="h-7 text-xs">Criar</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowForm(false)} className="h-7 text-xs">Cancelar</Button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowForm(true)} className="w-full flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors border border-dashed border-border">
              <Plus className="w-4 h-4" /> Adicionar hábito
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ===== BLOCO DE LISTA =====
function BlocoLista({ blocoId }: { blocoId: string }) {
  const [listas, setListas] = useState<Lista[]>([]);
  const [itens, setItens] = useState<Record<string, ItemLista[]>>({});
  const [loading, setLoading] = useState(true);
  const [novoItem, setNovoItem] = useState<Record<string, string>>({});
  const [showNovaLista, setShowNovaLista] = useState(false);
  const [novaListaNome, setNovaListaNome] = useState("");

  useEffect(() => {
    listasService.getListas(blocoId).then(async (ls) => {
      setListas(ls);
      const entries = await Promise.all(ls.map(async l => [l.id, await listasService.getItens(l.id).catch(() => [])] as [string, ItemLista[]]));
      setItens(Object.fromEntries(entries));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [blocoId]);

  const criarLista = async () => {
    if (!novaListaNome.trim()) return;
    try {
      const nova = await listasService.createLista({ blocoId, nome: novaListaNome });
      setListas(p => [...p, nova]);
      setItens(p => ({ ...p, [nova.id]: [] }));
      setShowNovaLista(false);
      setNovaListaNome("");
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  const toggleItem = async (listaId: string, itemId: string) => {
    try {
      const updated = await listasService.toggleItem(itemId);
      setItens(p => ({ ...p, [listaId]: p[listaId].map(i => i.id === itemId ? updated : i) }));
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  return (
    <div className="space-y-4">
      {loading ? <Skeleton className="h-20" /> : listas.map(lista => (
        <div key={lista.id} className="bg-muted/20 rounded-lg p-3 space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2"><List className="w-3.5 h-3.5 text-muted-foreground" />{lista.nome}</h4>
          <div className="space-y-1.5">
            {(itens[lista.id] || []).map(item => (
              <div key={item.id} className="flex items-center gap-2">
                <button onClick={() => toggleItem(lista.id, item.id)} className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${item.checked ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
                  {item.checked && <Check className="w-2.5 h-2.5" />}
                </button>
                <span className={`text-sm ${item.checked ? "line-through text-muted-foreground" : ""}`}>{item.nome}</span>
                {item.valorTotal ? <span className="ml-auto text-xs text-muted-foreground">R$ {item.valorTotal.toFixed(2)}</span> : null}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Novo item..."
              value={novoItem[lista.id] || ""}
              onChange={e => setNovoItem(p => ({ ...p, [lista.id]: e.target.value }))}
              className="h-7 text-xs"
              onKeyDown={async e => {
                if (e.key === "Enter" && novoItem[lista.id]?.trim()) {
                  // seria: await itemListaService.createItem(...)
                  toast({ title: "Item adicionado (simulado)" });
                  setNovoItem(p => ({ ...p, [lista.id]: "" }));
                }
              }}
            />
            <Button size="sm" variant="ghost" className="h-7 text-xs px-2"><Plus className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
      ))}
      {showNovaLista ? (
        <div className="flex gap-2">
          <Input placeholder="Nome da lista" value={novaListaNome} onChange={e => setNovaListaNome(e.target.value)} className="h-8 text-sm" autoFocus onKeyDown={e => { if (e.key === "Enter") criarLista(); }} />
          <Button size="sm" onClick={criarLista} className="h-8">OK</Button>
          <Button size="sm" variant="ghost" onClick={() => setShowNovaLista(false)} className="h-8"><X className="w-4 h-4" /></Button>
        </div>
      ) : (
        <button onClick={() => setShowNovaLista(true)} className="w-full flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors border border-dashed border-border">
          <Plus className="w-4 h-4" /> Nova lista
        </button>
      )}
    </div>
  );
}

// ===== BLOCO DE TIMER =====
function BlocoTimer({ blocoId, nucleoId }: { blocoId: string; nucleoId: string }) {
  const [timers, setTimers] = useState<TimerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    timersService.getTimers(nucleoId).then(setTimers).catch(() => {}).finally(() => setLoading(false));
  }, [nucleoId]);

  useEffect(() => {
    if (!activeTimer) { setElapsed(0); return; }
    const interval = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const startNew = async () => {
    try {
      const timer = await timersService.createTimer(nucleoId, { titulo: "Sessão de foco" });
      await timersService.startTimer(timer.id);
      setTimers(p => [timer, ...p]);
      setActiveTimer(timer.id);
      toast({ title: "Timer iniciado! ⏱️" });
    } catch { toast({ title: "Erro ao iniciar timer", variant: "destructive" }); }
  };

  const stop = async () => {
    if (!activeTimer) return;
    try {
      await timersService.stopTimer(activeTimer);
      setActiveTimer(null);
      setElapsed(0);
      toast({ title: `Timer parado! ${Math.floor(elapsed / 60)}min focado.` });
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-4">
      {activeTimer ? (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
          <div className="text-5xl font-mono font-bold text-primary mb-4 tabular-nums">{fmt(elapsed)}</div>
          <p className="text-sm text-muted-foreground mb-4">Sessão de foco ativa</p>
          <Button onClick={stop} variant="destructive" size="sm"><X className="w-4 h-4 mr-2" />Parar</Button>
        </div>
      ) : (
        <button onClick={startNew} className="w-full flex flex-col items-center gap-3 p-8 bg-muted/30 border-2 border-dashed border-border rounded-xl hover:border-primary/40 hover:bg-muted/50 transition-all">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"><Timer className="w-7 h-7 text-primary" /></div>
          <div><p className="font-medium">Iniciar Pomodoro</p><p className="text-xs text-muted-foreground mt-0.5">1 min = 1 XP</p></div>
        </button>
      )}
      {timers.slice(0, 3).map(t => (
        <div key={t.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg text-sm">
          <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">{t.titulo || "Sessão"}</span>
          {t.duracaoSegundos && <span className="ml-auto text-xs tabular-nums">{fmt(t.duracaoSegundos)}</span>}
        </div>
      ))}
    </div>
  );
}

// ===== BLOCO DE CALENDÁRIO =====
function BlocoCalendario({ blocoId, nucleoId }: { blocoId: string; nucleoId: string }) {
  const [eventos, setEventos] = useState<CalendarioEvento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titulo: "", descricao: "", dataEvento: "", duracaoMinutos: 60 });

  useEffect(() => {
    calendarioService.getEventos(nucleoId).then(setEventos).catch(() => {}).finally(() => setLoading(false));
  }, [nucleoId]);

  const create = async () => {
    if (!form.titulo.trim() || !form.dataEvento) return;
    try {
      const novo = await calendarioService.createEvento(nucleoId, { ...form, dataEvento: new Date(form.dataEvento) });
      setEventos(p => [...p, novo]);
      setShowForm(false);
      setForm({ titulo: "", descricao: "", dataEvento: "", duracaoMinutos: 60 });
      toast({ title: "Evento criado! 📅" });
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  const proximos = eventos.filter(e => new Date(e.dataEvento as any) >= new Date()).slice(0, 5);

  return (
    <div className="space-y-3">
      {loading ? <Skeleton className="h-20" /> : (
        <>
          <div className="space-y-2">
            {proximos.map(e => (
              <div key={e.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-blue-600">{new Date(e.dataEvento as any).getDate()}</span>
                  <span className="text-xs text-blue-500/80">{new Date(e.dataEvento as any).toLocaleDateString("pt-BR", { month: "short" })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{e.titulo}</p>
                  {e.descricao && <p className="text-xs text-muted-foreground">{e.descricao}</p>}
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(e.dataEvento as any).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · {e.duracaoMinutos}min</p>
                </div>
              </div>
            ))}
            {proximos.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento próximo</p>}
          </div>
          {showForm ? (
            <div className="border border-border rounded-lg p-3 space-y-3 bg-card">
              <Input placeholder="Título do evento" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} autoFocus />
              <Input type="datetime-local" value={form.dataEvento} onChange={e => setForm(f => ({ ...f, dataEvento: e.target.value }))} className="text-sm" />
              <Input type="number" placeholder="Duração (min)" value={form.duracaoMinutos} onChange={e => setForm(f => ({ ...f, duracaoMinutos: Number(e.target.value) }))} className="text-sm h-8" />
              <div className="flex gap-2">
                <Button size="sm" onClick={create} className="h-7 text-xs">Criar</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowForm(false)} className="h-7 text-xs">Cancelar</Button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowForm(true)} className="w-full flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors border border-dashed border-border">
              <Plus className="w-4 h-4" /> Adicionar evento
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ===== BLOCO WRAPPER =====
const BLOCO_TIPOS: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  tarefa: { label: "Tarefas", icon: CheckSquare, color: "text-blue-500" },
  habito: { label: "Hábitos", icon: Flame, color: "text-orange-500" },
  lista: { label: "Lista", icon: List, color: "text-emerald-500" },
  timer: { label: "Timer", icon: Timer, color: "text-violet-500" },
  calendario: { label: "Calendário", icon: Calendar, color: "text-sky-500" },
  texto: { label: "Texto", icon: FileText, color: "text-slate-500" },
};

function BlocoWrapper({ bloco, nucleoId, onDelete }: { bloco: any; nucleoId: string; onDelete: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const meta = BLOCO_TIPOS[bloco.tipo] || { label: bloco.tipo, icon: FileText, color: "text-muted-foreground" };
  const Icon = meta.icon;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setCollapsed(p => !p)}>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${meta.color}`} />
          <span className="text-sm font-semibold">{bloco.titulo || meta.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="w-7 h-7"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete()}><Trash2 className="w-3.5 h-3.5 mr-2" />Remover bloco</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {collapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>
      {!collapsed && (
        <div className="p-4">
          {bloco.tipo === "tarefa" && <BlocoTarefas blocoId={bloco.id} />}
          {bloco.tipo === "habito" && <BlocoHabitos blocoId={bloco.id} />}
          {bloco.tipo === "lista" && <BlocoLista blocoId={bloco.id} />}
          {bloco.tipo === "timer" && <BlocoTimer blocoId={bloco.id} nucleoId={nucleoId} />}
          {bloco.tipo === "calendario" && <BlocoCalendario blocoId={bloco.id} nucleoId={nucleoId} />}
          {bloco.tipo === "texto" && <p className="text-sm text-muted-foreground">Bloco de texto em breve...</p>}
        </div>
      )}
    </div>
  );
}

// ===== MODAL ADICIONAR BLOCO =====
function AddBlocoModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (tipo: string, titulo: string) => void }) {
  const [tipo, setTipo] = useState("tarefa");
  const [titulo, setTitulo] = useState("");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Plus className="w-4 h-4 text-primary" />Adicionar Bloco</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(BLOCO_TIPOS).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <button key={key} onClick={() => { setTipo(key); setTitulo(meta.label); }} className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${tipo === key ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                  <Icon className={`w-5 h-5 ${meta.color}`} />
                  <span className="text-xs font-medium">{meta.label}</span>
                </button>
              );
            })}
          </div>
          <Input placeholder="Título do bloco (opcional)" value={titulo} onChange={e => setTitulo(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => { onAdd(tipo, titulo || BLOCO_TIPOS[tipo]?.label || tipo); onClose(); }}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ===== PÁGINA PRINCIPAL =====
export default function NucleoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { nucleo, blocos, loading, error, addBloco, removeBloco } = useNucleoDetail(id);
  const [showAddBloco, setShowAddBloco] = useState(false);

  const handleAddBloco = async (tipo: string, titulo: string) => {
    try {
      await addBloco(tipo, titulo);
      toast({ title: "Bloco adicionado!" });
    } catch { toast({ title: "Erro ao adicionar bloco", variant: "destructive" }); }
  };

  const handleRemoveBloco = async (blocoId: string) => {
    if (!confirm("Remover este bloco?")) return;
    try {
      await removeBloco(blocoId);
      toast({ title: "Bloco removido" });
    } catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  if (loading) return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-16 w-full" />
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
    </div>
  );

  if (error || !nucleo) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <p className="text-muted-foreground">{error || "Núcleo não encontrado"}</p>
      <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
    </div>
  );

  const color = nucleo.corDestaque || "#4D7CFF";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
            {(() => { const Icon = TIPO_ICONS[nucleo.tipo] || Layers; return <Icon className="w-5 h-5" style={{ color }} />; })()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">{nucleo.nome}</h1>
            {nucleo.descricao && <p className="text-xs text-muted-foreground truncate">{nucleo.descricao}</p>}
          </div>
          <Badge variant="outline" style={{ borderColor: `${color}40`, color }}>{nucleo.tipo}</Badge>
          <Button onClick={() => setShowAddBloco(true)} size="sm"><Plus className="w-4 h-4 mr-1" />Bloco</Button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {blocos.length === 0 ? (
          <div onClick={() => setShowAddBloco(true)} className="border-2 border-dashed border-border rounded-xl py-16 flex flex-col items-center gap-4 cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-all">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"><Plus className="w-7 h-7 text-primary" /></div>
            <div className="text-center"><p className="font-medium">Adicione seu primeiro bloco</p><p className="text-sm text-muted-foreground mt-1">Tarefas, hábitos, listas, timers ou calendário</p></div>
          </div>
        ) : (
          blocos.map(bloco => (
            <BlocoWrapper key={bloco.id} bloco={bloco} nucleoId={id} onDelete={() => handleRemoveBloco(bloco.id)} />
          ))
        )}
      </main>

      <AddBlocoModal open={showAddBloco} onClose={() => setShowAddBloco(false)} onAdd={handleAddBloco} />
    </div>
  );
}

