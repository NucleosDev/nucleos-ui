"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Search, Grid3X3, List, BookOpen, Briefcase, Heart, Target, Star, Dumbbell, Wallet, Globe, Layers, Edit3, Trash2, MoreHorizontal } from "lucide-react";
import { useNucleos } from "@/hooks/use-nucleos";
import { nucleosService } from "@/services/nucleos.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import type { Nucleo } from "@/types/nucleo";

const TIPO_ICONS: Record<string, React.ElementType> = { estudo: BookOpen, pessoal: Heart, profissional: Briefcase, projeto: Target, hobby: Star, fitness: Dumbbell, financas: Wallet, idiomas: Globe };
const TIPO_COLORS: Record<string, string> = { estudo: "#4D7CFF", pessoal: "#FF6B6B", profissional: "#0077BE", projeto: "#00C9A7", hobby: "#FFD700", fitness: "#FF8C42", financas: "#2EBD59", idiomas: "#9B59B6" };
const TIPOS = ["pessoal","profissional","estudo","projeto","hobby","fitness","financas","idiomas"];

function NucleoFormModal({ open, onClose, onSaved, nucleo }: { open: boolean; onClose: () => void; onSaved: () => void; nucleo?: Nucleo | null }) {
  const isEdit = !!nucleo;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: nucleo?.nome || "", descricao: nucleo?.descricao || "", tipo: nucleo?.tipo || "pessoal", corDestaque: nucleo?.corDestaque || "#4D7CFF" });
  const handleSubmit = async () => {
    if (!form.nome.trim()) { toast({ title: "Nome obrigatório", variant: "destructive" }); return; }
    setLoading(true);
    try {
      if (isEdit && nucleo) await nucleosService.updateNucleo(nucleo.id, form);
      else await nucleosService.createNucleo(form);
      toast({ title: isEdit ? "Núcleo atualizado!" : "Núcleo criado!" });
      onSaved(); onClose();
    } catch { toast({ title: "Erro", variant: "destructive" }); }
    finally { setLoading(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{isEdit ? "Editar" : "Novo"} Núcleo</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div><label className="text-sm font-medium block mb-1.5">Nome *</label><Input placeholder="Ex: Desenvolvimento Pessoal" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /></div>
          <div><label className="text-sm font-medium block mb-1.5">Descrição</label><Textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={2} /></div>
          <div><label className="text-sm font-medium block mb-1.5">Tipo</label><Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent></Select></div>
          <div><label className="text-sm font-medium block mb-1.5">Cor</label><div className="flex items-center gap-3"><input type="color" value={form.corDestaque} onChange={e => setForm(f => ({ ...f, corDestaque: e.target.value }))} className="w-10 h-10 rounded-lg cursor-pointer border border-border" /><span className="text-sm text-muted-foreground">{form.corDestaque}</span></div></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={handleSubmit} disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function NucleosPage() {
  const router = useRouter();
  const { nucleos, loading, reload, remove } = useNucleos();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [editNucleo, setEditNucleo] = useState<Nucleo | null>(null);

  const filtered = nucleos.filter(n => n.nome.toLowerCase().includes(search.toLowerCase()) || n.descricao?.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Excluir "${nome}"?`)) return;
    try { await remove(id); toast({ title: "Excluído" }); }
    catch { toast({ title: "Erro", variant: "destructive" }); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
            <span className="font-semibold">Meus Núcleos</span>
            <Badge variant="outline" className="text-xs">{nucleos.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Buscar núcleos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-56 h-8 text-sm" /></div>
            <Button variant="ghost" size="icon" onClick={() => setView(v => v === "grid" ? "list" : "grid")} className="w-8 h-8">{view === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}</Button>
            <Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-1" />Novo</Button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div onClick={() => setShowForm(true)} className="border-2 border-dashed border-border rounded-xl py-20 flex flex-col items-center gap-4 cursor-pointer hover:border-primary/40 transition-all">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"><Plus className="w-7 h-7 text-primary" /></div>
            <p className="font-medium text-muted-foreground">{search ? "Nenhum resultado" : "Crie seu primeiro núcleo"}</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(n => {
              const Icon = TIPO_ICONS[n.tipo] || Layers;
              const color = n.corDestaque || TIPO_COLORS[n.tipo] || "#4D7CFF";
              return (
                <div key={n.id} className="group bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-md transition-all" onClick={() => router.push(`/dashboard/nucleos/${n.id}`)}>
                  <div className="h-14" style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)` }} />
                  <div className="p-3 -mt-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-background border border-border shadow-sm"><Icon className="w-4 h-4" style={{ color }} /></div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}><Button variant="ghost" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-3 h-3" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); setEditNucleo(n); }}><Edit3 className="w-3.5 h-3.5 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={e => { e.stopPropagation(); handleDelete(n.id, n.nome); }}><Trash2 className="w-3.5 h-3.5 mr-2" />Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="font-semibold text-sm truncate">{n.nome}</p>
                    <Badge variant="outline" className="mt-1 text-xs" style={{ borderColor: `${color}40`, color }}>{n.tipo}</Badge>
                  </div>
                </div>
              );
            })}
            <button onClick={() => setShowForm(true)} className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 py-10 hover:border-primary/40 hover:bg-muted/20 transition-all cursor-pointer"><Plus className="w-5 h-5 text-muted-foreground" /><span className="text-xs text-muted-foreground">Novo</span></button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(n => {
              const Icon = TIPO_ICONS[n.tipo] || Layers;
              const color = n.corDestaque || TIPO_COLORS[n.tipo] || "#4D7CFF";
              return (
                <div key={n.id} className="group flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/40 cursor-pointer transition-all" onClick={() => router.push(`/dashboard/nucleos/${n.id}`)}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}><Icon className="w-5 h-5" style={{ color }} /></div>
                  <div className="flex-1 min-w-0"><p className="font-semibold text-sm">{n.nome}</p>{n.descricao && <p className="text-xs text-muted-foreground truncate">{n.descricao}</p>}</div>
                  <Badge variant="outline" className="text-xs hidden sm:flex" style={{ borderColor: `${color}40`, color }}>{n.tipo}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}><Button variant="ghost" size="icon" className="w-7 h-7 opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-3.5 h-3.5" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={e => { e.stopPropagation(); setEditNucleo(n); }}><Edit3 className="w-3.5 h-3.5 mr-2" />Editar</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={e => { e.stopPropagation(); handleDelete(n.id, n.nome); }}><Trash2 className="w-3.5 h-3.5 mr-2" />Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <NucleoFormModal open={showForm && !editNucleo} onClose={() => setShowForm(false)} onSaved={reload} />
      <NucleoFormModal open={!!editNucleo} onClose={() => setEditNucleo(null)} onSaved={reload} nucleo={editNucleo} />
    </div>
  );
}
