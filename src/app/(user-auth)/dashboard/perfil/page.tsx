"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Shield, Zap, Flame, Trophy, LogOut } from "lucide-react";
import { useAuth } from "@/auth";
import { useGamificacao } from "@/hooks/use-gamificacao";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function PerfilPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { level, currentStreak, conquistas } = useGamificacao();
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(user?.fullName || "");
  const [salvando, setSalvando] = useState(false);

  const initials = (user?.fullName || "U").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  const xpPct = level ? Math.min(Math.round((level.currentXp / level.nextLevelXp) * 100), 100) : 0;

  const salvar = async () => {
    setSalvando(true);
    await new Promise(r => setTimeout(r, 500));
    toast({ title: "Perfil atualizado!" });
    setEditando(false);
    setSalvando(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/entrar");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
          <span className="font-semibold">Meu Perfil</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Avatar + nome */}
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h1 className="text-xl font-bold">{user?.fullName}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1.5"><Zap className="w-3.5 h-3.5 text-yellow-500" /><span className="text-xs font-semibold">Nível {level?.level ?? 1}</span></div>
            <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1.5"><Flame className="w-3.5 h-3.5 text-orange-500" /><span className="text-xs font-semibold">{currentStreak} dias</span></div>
            <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1.5"><Trophy className="w-3.5 h-3.5 text-yellow-500" /><span className="text-xs font-semibold">{conquistas.length}</span></div>
          </div>
        </div>

        {/* XP */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between text-sm mb-2"><span className="font-medium">Progresso — Nível {level?.level ?? 1}</span><span className="text-muted-foreground">{level?.currentXp ?? 0}/{level?.nextLevelXp ?? 100} XP</span></div>
            <Progress value={xpPct} className="h-2.5" />
            <p className="text-xs text-muted-foreground mt-2">Total ganho: {(level?.totalXpEarned ?? 0).toLocaleString("pt-BR")} XP</p>
          </CardContent>
        </Card>

        {/* Info pessoal */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4 text-primary" />Informações Pessoais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {editando ? (
              <>
                <div><label className="text-xs font-medium text-muted-foreground block mb-1">Nome completo</label><Input value={nome} onChange={e => setNome(e.target.value)} /></div>
                <div className="flex gap-2">
                  <Button onClick={salvar} disabled={salvando} size="sm">{salvando ? "Salvando..." : "Salvar"}</Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditando(false)}>Cancelar</Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3"><User className="w-4 h-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Nome</p><p className="text-sm font-medium">{user?.fullName}</p></div></div>
                <Separator />
                <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{user?.email}</p></div></div>
                <Button variant="outline" size="sm" onClick={() => setEditando(true)} className="mt-2">Editar informações</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/20">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2 text-destructive"><Shield className="w-4 h-4" />Conta</CardTitle></CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleLogout} className="w-full"><LogOut className="w-4 h-4 mr-2" />Sair da conta</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
