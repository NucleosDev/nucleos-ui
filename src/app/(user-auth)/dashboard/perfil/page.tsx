"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, User, Mail, Shield, Zap, Flame, Trophy,
  LogOut, Calendar, Award, Target, Camera, Loader2,
} from "lucide-react";
import { useAuth } from "@/auth";
import { usersService } from "@/services/users.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { GlassModal, GlassInput, GlassModalFooter, GlassButton } from "@/components/ui/glass-modal";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGamification } from "@/hooks/useGamification";
import { LiquidGlass } from "@/components/ui/liquid-glass";

export default function PerfilPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { useStats, useAchievements } = useGamification();
  const { data: statsData } = useStats();
  const { data: achievementsData = [] } = useAchievements();

  const [editando,         setEditando]         = useState(false);
  const [nome,             setNome]             = useState(user?.fullName || "");
  const [telefone,         setTelefone]         = useState(user?.phone    || "");
  const [salvando,         setSalvando]         = useState(false);
  const [avatarUrl,        setAvatarUrl]        = useState(user?.avatarUrl || "");
  const [novaAvatarUrl,    setNovaAvatarUrl]    = useState("");
  const [showAvatarModal,  setShowAvatarModal]  = useState(false);
  const [showDeleteModal,  setShowDeleteModal]  = useState(false);
  const [deletando,        setDeletando]        = useState(false);

  const email    = user?.email || "";
  const level    = {
    level:        statsData?.level        ?? 1,
    currentXp:    statsData?.currentXp    ?? 0,
    nextLevelXp:  statsData?.nextLevelXp  ?? 100,
    totalXpEarned: statsData?.totalXp     ?? 0,
  };
  const streak   = statsData?.currentStreak ?? 0;
  const conquistas          = achievementsData.filter((a: any) => a.unlocked);
  const conquistasBloqueadas = achievementsData.filter((a: any) => !a.unlocked);
  const xpPct    = Math.min(Math.round((level.currentXp / level.nextLevelXp) * 100), 100);
  const initials = (nome || "U").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  useEffect(() => {
    if (user) {
      setNome(user.fullName     || "");
      setTelefone(user.phone    || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const handleOpenAvatarModal = () => { setNovaAvatarUrl(avatarUrl); setShowAvatarModal(true); };

  const handleSaveAvatar = async () => {
    if (!novaAvatarUrl.trim()) {
      toast({ title: "URL inválida", variant: "destructive" });
      return;
    }
    try { new URL(novaAvatarUrl); } catch {
      toast({ title: "URL inválida", description: "Use https://...", variant: "destructive" });
      return;
    }
    setSalvando(true);
    try {
      await usersService.updateProfile({ avatarUrl: novaAvatarUrl });
      setAvatarUrl(novaAvatarUrl);
      toast({ title: "Avatar atualizado!" });
      setShowAvatarModal(false);
      await usersService.getMe();
    } catch {
      toast({ title: "Erro ao atualizar avatar", variant: "destructive" });
    } finally { setSalvando(false); }
  };

  const salvar = async () => {
    if (!nome.trim()) { toast({ title: "Nome não pode estar vazio", variant: "destructive" }); return; }
    setSalvando(true);
    try {
      const payload: Record<string, string> = { fullName: nome };
      if (telefone) payload.phone = telefone;
      await usersService.updateProfile(payload);
      toast({ title: "Perfil atualizado!" });
      setEditando(false);
    } catch {
      toast({ title: "Erro ao atualizar perfil", variant: "destructive" });
    } finally { setSalvando(false); }
  };

  const handleDeleteAccount = async () => {
    setDeletando(true);
    try {
      await usersService.deleteAccount();
      await logout();
      router.push("/entrar");
    } catch {
      toast({ title: "Erro ao deletar conta", variant: "destructive" });
    } finally { setDeletando(false); setShowDeleteModal(false); }
  };

  const handleLogout = async () => { await logout(); router.push("/entrar"); };

  return (
    <div className="flex-1 overflow-auto">
      {/* Page header */}
      <div className="px-5 md:px-7 pt-7 pb-5 flex items-center gap-3 border-b border-border/40">
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-base font-semibold">Meu Perfil</h1>
      </div>

      <div className="px-5 md:px-7 py-6 max-w-3xl mx-auto space-y-5">

        {/* Avatar + hero */}
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="relative group cursor-pointer" onClick={handleOpenAvatarModal}>
            <Avatar className="w-24 h-24 ring-4 ring-primary/15">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary/30 to-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)]">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold">{nome}</h2>
            <p className="text-sm text-muted-foreground/60">{email}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { icon: Zap,    label: `Nível ${level.level}`,       color: "text-amber-500",  bg: "bg-amber-500/8"  },
              { icon: Flame,  label: `${streak} dias de streak`,   color: "text-orange-500", bg: "bg-orange-500/8" },
              { icon: Trophy, label: `${conquistas.length} conquistas`, color: "text-amber-500", bg: "bg-amber-500/8" },
            ].map((pill) => {
              const Icon = pill.icon;
              return (
                <div key={pill.label} className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5", pill.bg)}>
                  <Icon className={cn("h-3.5 w-3.5 shrink-0", pill.color)} />
                  <span className={cn("text-xs font-semibold", pill.color)}>{pill.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* XP Progress */}
        <div className="relative rounded-[var(--radius-lg)] border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/8 to-primary/5 backdrop-blur-sm p-5 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
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
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Streak atual",    value: streak,                   suffix: "dias" },
            { label: "XP hoje",         value: statsData?.todayXp ?? 0,  suffix: "XP"   },
            { label: "Total de ações",  value: statsData?.totalActions ?? 0, suffix: ""  },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-[var(--radius-lg)] border border-border/40 bg-card/50 backdrop-blur-sm py-3 px-2"
            >
              <span className="text-xl font-bold tabular-nums text-primary">{s.value}</span>
              <span className="text-[10px] text-muted-foreground/50">{s.suffix ? `${s.label} (${s.suffix})` : s.label}</span>
            </div>
          ))}
        </div>

        {/* Personal info */}
        <section className="rounded-[var(--radius-lg)] border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Informações Pessoais</p>
          </div>
          <div className="p-4">
            {editando ? (
              <div className="space-y-3">
                <GlassInput
                  label="Nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                />
                <GlassInput
                  label="Telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground/70">Email</label>
                  <input
                    value={email}
                    disabled
                    className="w-full px-3 py-2 text-sm rounded-xl bg-muted/20 border border-border/30 text-muted-foreground/60 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-muted-foreground/40">O email não pode ser alterado</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <LiquidGlass
                    variant="button"
                    radius="8px"
                    onClick={salvar}
                    className={cn("text-sm font-medium text-white", salvando && "opacity-60 pointer-events-none")}
                  >
                    <span className="flex items-center gap-1.5 px-4 py-2">
                      {salvando && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {salvando ? "Salvando..." : "Salvar"}
                    </span>
                  </LiquidGlass>
                  <LiquidGlass
                    variant="button"
                    radius="8px"
                    onClick={() => { setEditando(false); setNome(user?.fullName || ""); setTelefone(user?.phone || ""); }}
                    className="text-sm font-medium text-white/70"
                  >
                    <span className="px-4 py-2 block">Cancelar</span>
                  </LiquidGlass>
                </div>
              </div>
            ) : (
              <div>
                {[
                  { icon: User,     label: "Nome",         value: nome  },
                  { icon: Mail,     label: "Email",        value: email },
                  ...(telefone ? [{ icon: null as null, label: "Telefone",      value: telefone }] : []),
                  { icon: Calendar, label: "Membro desde", value: user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
                      : "Janeiro 2024"
                  },
                ].map((row, i, arr) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.label}
                      className={cn("flex items-center gap-3 py-3", i < arr.length - 1 && "border-b border-border/25")}
                    >
                      <div className="w-4 shrink-0">
                        {Icon && <Icon className="h-4 w-4 text-muted-foreground/40" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground/40">{row.label}</p>
                        <p className="text-sm font-medium text-foreground">{row.value}</p>
                      </div>
                    </div>
                  );
                })}
                <LiquidGlass
                  variant="button"
                  radius="8px"
                  onClick={() => setEditando(true)}
                  className="mt-3 text-xs font-medium text-white/70"
                >
                  <span className="flex items-center gap-1.5 px-3 py-1.5">
                    Editar informações
                  </span>
                </LiquidGlass>
              </div>
            )}
          </div>
        </section>

        {/* Achievements */}
        <section className="rounded-[var(--radius-lg)] border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-semibold">Conquistas</p>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {conquistas.length === 0 && conquistasBloqueadas.length === 0 && (
              <p className="col-span-2 text-sm text-muted-foreground/50 text-center py-4">Nenhuma conquista ainda</p>
            )}
            {conquistas.map((c: any) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/15">
                <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{c.nome}</p>
                  {c.unlockedAt && (
                    <p className="text-[10px] text-muted-foreground/50">
                      Desbloqueada em {new Date(c.unlockedAt).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-px rounded-full shrink-0">
                  +{c.xp_recompensa ?? 100} XP
                </span>
              </div>
            ))}
            {conquistasBloqueadas.slice(0, 4).map((c: any) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 opacity-50">
                <Target className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{c.nome}</p>
                  <p className="text-[10px] text-muted-foreground/50">Ainda não desbloqueada</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Danger zone */}
        <section className="rounded-[var(--radius-lg)] border border-destructive/20 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <Shield className="h-4 w-4 text-destructive" />
            <p className="text-sm font-semibold text-destructive">Área de Risco</p>
          </div>
          <div className="p-4 space-y-2.5">
            <LiquidGlass
              variant="button"
              radius="8px"
              onClick={handleLogout}
              className="w-full text-sm font-medium text-white/80"
            >
              <span className="flex items-center justify-center gap-2 px-4 py-2.5">
                <LogOut className="h-4 w-4" />
                Sair da conta
              </span>
            </LiquidGlass>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
              style={{ background: "hsl(var(--destructive))", boxShadow: "0 4px 12px hsl(var(--destructive) / 0.25)" }}
            >
              Deletar conta
            </button>
          </div>
        </section>

      </div>

      {/* Avatar modal */}
      <GlassModal open={showAvatarModal} onClose={() => !salvando && setShowAvatarModal(false)} size="max-w-sm">
        <div className="px-5 pt-5 pb-2 space-y-4">
          <h3 className="text-sm font-semibold">Alterar avatar</h3>
          <div className="flex justify-center">
            <Avatar className="w-20 h-20 ring-4 ring-primary/15">
              <AvatarImage src={novaAvatarUrl || undefined} />
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
          </div>
          <GlassInput
            label="URL da imagem"
            value={novaAvatarUrl}
            onChange={(e) => setNovaAvatarUrl(e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
          />
          <p className="text-[10px] text-muted-foreground/40">URL válida para JPG, PNG ou GIF</p>
        </div>
        <GlassModalFooter>
          <GlassButton variant="outline" onClick={() => setShowAvatarModal(false)} disabled={salvando}>
            Cancelar
          </GlassButton>
          <LiquidGlass
            variant="button"
            radius="12px"
            onClick={handleSaveAvatar}
            className={cn("text-sm font-medium text-white min-w-[90px]", salvando && "opacity-50 pointer-events-none")}
          >
            <span className="flex items-center justify-center gap-1.5 px-4 py-2">
              {salvando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {salvando ? "Salvando..." : "Salvar"}
            </span>
          </LiquidGlass>
        </GlassModalFooter>
      </GlassModal>

      {/* Delete account confirmation */}
      <GlassModal open={showDeleteModal} onClose={() => !deletando && setShowDeleteModal(false)} size="max-w-sm">
        <div className="px-5 pt-5 pb-2 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <Shield className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Tem certeza?</h3>
              <p className="mt-1 text-xs text-muted-foreground/70 leading-relaxed">
                Esta ação não pode ser desfeita. Sua conta e todos os dados serão removidos permanentemente.
              </p>
            </div>
          </div>
        </div>
        <GlassModalFooter>
          <GlassButton variant="outline" onClick={() => setShowDeleteModal(false)} disabled={deletando}>
            Cancelar
          </GlassButton>
          <LiquidGlass
            variant="button"
            radius="12px"
            onClick={handleDeleteAccount}
            className={cn("text-sm font-medium text-red-300 min-w-[90px]", deletando && "opacity-50 pointer-events-none")}
          >
            <span className="flex items-center justify-center gap-1.5 px-4 py-2">
              {deletando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {deletando ? "Deletando..." : "Sim, deletar"}
            </span>
          </LiquidGlass>
        </GlassModalFooter>
      </GlassModal>
    </div>
  );
}
