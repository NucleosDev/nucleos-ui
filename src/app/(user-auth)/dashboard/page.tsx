"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BadgeCheck,
  Flame,
  Zap,
  Plus,
  Bell,
  Layers,
  Award,
  Sparkles,
  Calendar,
  Target,
  ChevronRight,
  BookOpen,
  Briefcase,
  Heart,
  Dumbbell,
  Wallet,
  Globe,
  Star,
  MoreHorizontal,
  Trash2,
  Edit3,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/auth";
import { useNucleos } from "@/hooks/useNucleo";
import { useGamificacao } from "@/hooks/use-gamificacao";
import { nucleosService } from "@/services/nucleos.service";
// import { notificacoesService } from "@/services/notificacoes.service";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { Nucleo, NucleoTipo } from "@/types/nucleo";

const TIPO_ICONS: Record<NucleoTipo, React.ElementType> = {
  estudo: BookOpen,
  pessoal: Heart,
  profissional: Briefcase,
  projeto: Target,
  hobby: Star,
  fitness: Dumbbell,
  financas: Wallet,
  idiomas: Globe,
};

const TIPO_COLORS: Record<NucleoTipo, string> = {
  estudo: "#4D7CFF",
  pessoal: "#FF6B6B",
  profissional: "#0077BE",
  projeto: "#00C9A7",
  hobby: "#FFD700",
  fitness: "#FF8C42",
  financas: "#2EBD59",
  idiomas: "#9B59B6",
};

function NucleoCard({
  nucleo,
  onEdit,
  onDelete,
  onClick,
}: {
  nucleo: Nucleo;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  const Icon = TIPO_ICONS[nucleo.tipo as NucleoTipo] || Layers;
  const color =
    nucleo.corDestaque || TIPO_COLORS[nucleo.tipo as NucleoTipo] || "#4D7CFF";

  return (
    <div
      className="group relative bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div
        className="h-16 w-full"
        style={{
          background: `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`,
        }}
      />
      <div className="p-4 -mt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-border bg-background shadow-sm">
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Edit3 className="w-3.5 h-3.5 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="font-semibold text-sm truncate">{nucleo.nome}</h3>
        {nucleo.descricao && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {nucleo.descricao}
          </p>
        )}
        <Badge
          variant="outline"
          className="mt-2 text-xs"
          style={{ borderColor: `${color}40`, color }}
        >
          {nucleo.tipo}
        </Badge>
      </div>
    </div>
  );
}

const TIPOS: NucleoTipo[] = [
  "pessoal",
  "profissional",
  "estudo",
  "projeto",
  "hobby",
  "fitness",
  "financas",
  "idiomas",
];

function NucleoFormModal({
  open,
  onClose,
  onSaved,
  nucleo,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  nucleo?: Nucleo | null;
}) {
  const isEdit = !!nucleo;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    tipo: "pessoal" as NucleoTipo,
    corDestaque: "#4D7CFF",
  });

  useEffect(() => {
    if (nucleo) {
      setForm({
        nome: nucleo.nome || "",
        descricao: nucleo.descricao || "",
        tipo: (nucleo.tipo as NucleoTipo) || "pessoal",
        corDestaque: nucleo.corDestaque || "#4D7CFF",
      });
    } else {
      setForm({
        nome: "",
        descricao: "",
        tipo: "pessoal",
        corDestaque: "#4D7CFF",
      });
    }
  }, [nucleo, open]);

  const handleSubmit = async () => {
    if (!form.nome.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      if (isEdit && nucleo) {
        await nucleosService.updateNucleo(nucleo.id, {
          nome: form.nome,
          descricao: form.descricao,
          tipo: form.tipo,
          corDestaque: form.corDestaque,
        });
      } else {
        await nucleosService.createNucleo({
          nome: form.nome,
          descricao: form.descricao,
          tipo: form.tipo,
          corDestaque: form.corDestaque,
        });
      }
      toast({ title: isEdit ? "Núcleo atualizado!" : "Núcleo criado!" });
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            {isEdit ? "Editar" : "Novo"} Núcleo
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm font-medium block mb-1.5">Nome *</label>
            <Input
              placeholder="Ex: Desenvolvimento Pessoal"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Descrição
            </label>
            <Textarea
              placeholder="Sobre o que é esse núcleo?"
              value={form.descricao}
              onChange={(e) =>
                setForm((f) => ({ ...f, descricao: e.target.value }))
              }
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Tipo</label>
            <Select
              value={form.tipo}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, tipo: v as NucleoTipo }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS.map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Cor destaque
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.corDestaque}
                onChange={(e) =>
                  setForm((f) => ({ ...f, corDestaque: e.target.value }))
                }
                className="w-10 h-10 rounded-lg cursor-pointer border border-border"
              />
              <span className="text-sm text-muted-foreground">
                {form.corDestaque}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { nucleos, loading: nucleosLoading, reload, remove } = useNucleos();
  const { level, currentStreak, conquistas } = useGamificacao();
  const [showForm, setShowForm] = useState(false);
  const [editNucleo, setEditNucleo] = useState<Nucleo | null>(null);
  const [notifCount, setNotifCount] = useState(0);

  // useEffect(() => {
  //   const loadNotificacoes = async () => {
  //     try {
  //       const data = await notificacoesService.getNotificacoes();
  //       setNotifCount(
  //         Array.isArray(data) ? data.filter((n: any) => !n.read).length : 0,
  //       );
  //     } catch {
  //       // Erro ignorado
  //     }
  //   };
  //   loadNotificacoes();
  // }, []);

  const firstName = (user?.fullName || "Usuário").split(" ")[0];
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });
  const xpPct = level
    ? Math.min(Math.round((level.currentXp / level.nextLevelXp) * 100), 100)
    : 0;

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Excluir "${nome}"?`)) return;
    try {
      await remove(id);
      toast({ title: "Núcleo excluído" });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold">Início</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-semibold tabular-nums">
                {currentStreak}d
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs font-semibold">
                Nv.{level?.level ?? "–"}
              </span>
            </div>
            <button
              onClick={() => router.push("/dashboard/notificacoes")}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <Bell className="w-5 h-5" />
              {notifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              Olá, {firstName}!{" "}
              <BadgeCheck className="w-7 h-7 text-primary/80" />
            </h1>
            <p className="text-muted-foreground mt-1 text-sm capitalize">
              {formattedDate} · Tudo certo por aí?
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Núcleo
          </Button>
        </div>

        {/* XP Bar */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Nível {level?.level ?? 1}
                </p>
                <p className="text-xs text-muted-foreground">
                  {level?.currentXp ?? 0} / {level?.nextLevelXp ?? 100} XP
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-primary">{xpPct}%</span>
          </div>
          <Progress value={xpPct} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Núcleos",
              value: nucleos.length,
              icon: Layers,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              label: "Streak",
              value: `${currentStreak}d`,
              icon: Flame,
              color: "text-orange-500",
              bg: "bg-orange-500/10",
            },
            {
              label: "XP Total",
              value: (level?.totalXpEarned ?? 0).toLocaleString("pt-BR"),
              icon: Zap,
              color: "text-yellow-500",
              bg: "bg-yellow-500/10",
            },
            {
              label: "Conquistas",
              value: conquistas.length,
              icon: Award,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`${s.bg} p-2.5 rounded-lg shrink-0`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Nucleos */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Meus Núcleos
            </h2>
            <button
              onClick={() => router.push("/dashboard/nucleos")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {nucleosLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : nucleos.length === 0 ? (
            <div
              onClick={() => setShowForm(true)}
              className="border-2 border-dashed border-border rounded-xl py-12 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium">Crie seu primeiro núcleo</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Organize sua vida em áreas de foco
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nucleos.slice(0, 7).map((n) => (
                <NucleoCard
                  key={n.id}
                  nucleo={n}
                  onClick={() => router.push(`/dashboard/nucleos/${n.id}`)}
                  onEdit={() => setEditNucleo(n)}
                  onDelete={() => handleDelete(n.id, n.nome)}
                />
              ))}
              <button
                onClick={() => setShowForm(true)}
                className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 py-8 hover:border-primary/40 hover:bg-muted/20 transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Novo</span>
              </button>
            </div>
          )}
        </section>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Insights IA",
              icon: Sparkles,
              href: "/dashboard/insights",
              color: "text-violet-500",
              bg: "bg-violet-500/10",
            },
            {
              label: "Calendário",
              icon: Calendar,
              href: "/dashboard/calendario",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              label: "Conquistas",
              icon: Trophy,
              href: "/dashboard/conquistas",
              color: "text-yellow-500",
              bg: "bg-yellow-500/10",
            },
            {
              label: "Perfil",
              icon: BadgeCheck,
              href: "/dashboard/perfil",
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all text-left"
            >
              <div className={`${item.bg} p-2.5 rounded-lg`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </main>

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground p-3.5 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
      >
        <Plus className="w-5 h-5" />
      </button>

      <NucleoFormModal
        open={showForm && !editNucleo}
        onClose={() => setShowForm(false)}
        onSaved={reload}
      />
      <NucleoFormModal
        open={!!editNucleo}
        onClose={() => setEditNucleo(null)}
        onSaved={reload}
        nucleo={editNucleo}
      />
    </div>
  );
}
