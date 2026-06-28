"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Shield,
  Zap,
  Flame,
  Trophy,
  LogOut,
  Calendar,
  Award,
  Target,
  Camera,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/auth";
import { usersService } from "@/services/users.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGamification } from "@/hooks/useGamification";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PerfilPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { useStats, useAchievements } = useGamification();
  const { data: statsData } = useStats();
  const { data: achievementsData = [] } = useAchievements();

  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(user?.fullName || "");
  const [telefone, setTelefone] = useState(user?.phone || "");
  const [salvando, setSalvando] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [novaAvatarUrl, setNovaAvatarUrl] = useState("");
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletando, setDeletando] = useState(false);

  const email = user?.email || "";
  const level = {
    level: statsData?.level ?? 1,
    currentXp: statsData?.currentXp ?? 0,
    nextLevelXp: statsData?.nextLevelXp ?? 100,
    totalXpEarned: statsData?.totalXp ?? 0,
  };
  const streak = statsData?.currentStreak ?? 0;
  const conquistas = achievementsData.filter((a: any) => a.unlocked);
  const conquistasBloqueadas = achievementsData.filter((a: any) => !a.unlocked);
  const xpPct = Math.min(
    Math.round((level.currentXp / level.nextLevelXp) * 100),
    100,
  );
  const initials = (nome || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (user) {
      setNome(user.fullName || "");
      setTelefone(user.phone || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const handleOpenAvatarDialog = () => {
    setNovaAvatarUrl(avatarUrl);
    setShowAvatarDialog(true);
  };

  const handleSaveAvatar = async () => {
    if (!novaAvatarUrl.trim()) {
      toast({ title: "URL inválida", variant: "destructive" });
      return;
    }
    try {
      new URL(novaAvatarUrl);
    } catch {
      toast({
        title: "URL inválida",
        description: "Use https://...",
        variant: "destructive",
      });
      return;
    }
    setSalvando(true);
    try {
      await usersService.updateProfile({ avatarUrl: novaAvatarUrl });
      setAvatarUrl(novaAvatarUrl);
      toast({ title: "Avatar atualizado!" });
      setShowAvatarDialog(false);
      await usersService.getMe();
    } catch {
      toast({ title: "Erro ao atualizar avatar", variant: "destructive" });
    } finally {
      setSalvando(false);
    }
  };

  const salvar = async () => {
    if (!nome.trim()) {
      toast({ title: "Nome não pode estar vazio", variant: "destructive" });
      return;
    }
    setSalvando(true);
    try {
      const payload: Record<string, string> = { fullName: nome };
      if (telefone) payload.phone = telefone;
      await usersService.updateProfile(payload);
      toast({ title: "Perfil atualizado!" });
      setEditando(false);
    } catch {
      toast({ title: "Erro ao atualizar perfil", variant: "destructive" });
    } finally {
      setSalvando(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletando(true);
    try {
      await usersService.deleteAccount();
      await logout();
      router.push("/entrar");
    } catch {
      toast({ title: "Erro ao deletar conta", variant: "destructive" });
    } finally {
      setDeletando(false);
      setShowDeleteDialog(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/entrar");
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 md:px-6 h-14 flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8">
          <User className="h-3.5 w-3.5 text-primary" />
        </div>
        <h1 className="text-sm font-semibold tracking-tight">Meu Perfil</h1>
      </div>

      <div className="px-5 md:px-7 py-6 max-w-3xl mx-auto space-y-5">
        {/* Avatar + hero */}
        <div className="flex flex-col items-center gap-4 py-2">
          <div
            className="relative group cursor-pointer"
            onClick={handleOpenAvatarDialog}
          >
            <Avatar className="w-24 h-24 ring-4 ring-primary/15">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary/30 to-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold">{nome}</h2>
            <p className="text-sm text-muted-foreground/60">{email}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              {
                icon: Zap,
                label: `Nível ${level.level}`,
                color: "text-amber-500",
                bg: "bg-amber-500/8",
              },
              {
                icon: Flame,
                label: `${streak} dias de streak`,
                color: "text-orange-500",
                bg: "bg-orange-500/8",
              },
              {
                icon: Trophy,
                label: `${conquistas.length} conquistas`,
                color: "text-amber-500",
                bg: "bg-amber-500/8",
              },
            ].map((pill) => {
              const Icon = pill.icon;
              return (
                <div
                  key={pill.label}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5",
                    pill.bg,
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5 shrink-0", pill.color)} />
                  <span className={cn("text-xs font-semibold", pill.color)}>
                    {pill.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* XP Progress */}
        <Card className="bg-gradient-to-r from-primary/5 via-primary/8 to-primary/5 border-primary/20">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Nível {level.level}</p>
              </div>
              <span className="text-xs text-muted-foreground/60">
                {level.currentXp.toLocaleString()} / {level.nextLevelXp.toLocaleString()} XP
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
              />
            </div>
            <p className="text-[11px] text-muted-foreground/40 mt-2">
              Total acumulado: {level.totalXpEarned.toLocaleString("pt-BR")} XP
            </p>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Streak atual", value: streak, suffix: "dias" },
            { label: "XP hoje", value: statsData?.todayXp ?? 0, suffix: "XP" },
            { label: "Total de ações", value: statsData?.totalActions ?? 0, suffix: "" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-xl border border-border/40 bg-card/50 py-3 px-2"
            >
              <span className="text-xl font-bold tabular-nums text-primary">
                {s.value}
              </span>
              <span className="text-[10px] text-muted-foreground/50 text-center">
                {s.suffix ? `${s.label} (${s.suffix})` : s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Personal info */}
        <Card className="overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-border/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {editando ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground/70 block mb-1.5">
                    Nome completo
                  </label>
                  <Input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground/70 block mb-1.5">
                    Telefone
                  </label>
                  <Input
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground/70 block mb-1.5">
                    Email
                  </label>
                  <Input value={email} disabled className="bg-muted/50" />
                  <p className="text-[10px] text-muted-foreground/40 mt-1">
                    O email não pode ser alterado
                  </p>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button onClick={salvar} disabled={salvando} size="sm">
                    {salvando && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    )}
                    {salvando ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditando(false);
                      setNome(user?.fullName || "");
                      setTelefone(user?.phone || "");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {[
                  { icon: User, label: "Nome", value: nome },
                  { icon: Mail, label: "Email", value: email },
                  ...(telefone
                    ? [{ icon: null as null, label: "Telefone", value: telefone }]
                    : []),
                  {
                    icon: Calendar,
                    label: "Membro desde",
                    value: user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
                          month: "long",
                          year: "numeric",
                        })
                      : "Janeiro 2024",
                  },
                ].map((row, i, arr) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.label}
                      className={cn(
                        "flex items-center gap-3 py-3",
                        i < arr.length - 1 && "border-b border-border/25",
                      )}
                    >
                      <div className="w-4 shrink-0">
                        {Icon && (
                          <Icon className="h-4 w-4 text-muted-foreground/40" />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground/40">
                          {row.label}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {row.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditando(true)}
                  className="mt-3"
                >
                  Editar informações
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conquistas */}
        <Card className="overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-border/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {conquistas.length === 0 && conquistasBloqueadas.length === 0 && (
              <p className="col-span-2 text-sm text-muted-foreground/50 text-center py-4">
                Nenhuma conquista ainda
              </p>
            )}
            {conquistas.map((c: any) => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/15"
              >
                <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{c.nome}</p>
                  {c.unlockedAt && (
                    <p className="text-[10px] text-muted-foreground/50">
                      Desbloqueada em{" "}
                      {new Date(c.unlockedAt).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-px rounded-full shrink-0">
                  +{c.xp_recompensa ?? 100} XP
                </span>
              </div>
            ))}
            {conquistasBloqueadas.slice(0, 4).map((c: any) => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 opacity-50"
              >
                <Target className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{c.nome}</p>
                  <p className="text-[10px] text-muted-foreground/50">
                    Ainda não desbloqueada
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/20 overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-border/50">
            <CardTitle className="text-sm font-semibold text-destructive flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Área de Risco
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            <Button variant="outline" onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sair da conta
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full"
            >
              Deletar conta
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Avatar dialog */}
      <Dialog
        open={showAvatarDialog}
        onOpenChange={(open) => !salvando && setShowAvatarDialog(open)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar avatar</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="w-20 h-20 ring-4 ring-primary/15">
              <AvatarImage src={novaAvatarUrl || undefined} />
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="w-full space-y-2">
              <label className="text-sm font-medium">URL da imagem</label>
              <Input
                value={novaAvatarUrl}
                onChange={(e) => setNovaAvatarUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <p className="text-xs text-muted-foreground/60">
                URL válida para JPG, PNG ou GIF
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAvatarDialog(false)}
              disabled={salvando}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveAvatar}
              disabled={salvando}
              className="flex-1"
            >
              {salvando && (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              )}
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete account confirmation */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => !deletando && setShowDeleteDialog(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Sua conta e todos os dados serão
              removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deletando}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletando && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {deletando ? "Deletando..." : "Sim, deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
