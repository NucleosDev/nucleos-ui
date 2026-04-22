"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
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
  Link as LinkIcon,
  X,
} from "lucide-react";
import { useAuth } from "@/auth";
import { usersService } from "@/services/users.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
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

// Dados mockados para gamificação (enquanto não tem API)
const MOCK_LEVEL = {
  level: 7,
  currentXp: 2450,
  nextLevelXp: 3000,
  totalXpEarned: 12500,
};

const MOCK_CONQUISTAS = [
  { id: "1", nome: "Primeiro Nucleo", desbloqueada: true, data: "2024-01-15" },
  { id: "2", nome: "7 Dias de Streak", desbloqueada: true, data: "2024-01-20" },
  { id: "3", nome: "30 Tarefas", desbloqueada: false },
  { id: "4", nome: "Mestre dos Hábitos", desbloqueada: false },
];

const MOCK_ESTATISTICAS = {
  totalNucleos: 4,
  totalTarefas: 47,
  totalHabitos: 12,
  mediaDia: 3.2,
};

export default function PerfilPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [telefone, setTelefone] = useState(user?.phone || "");
  const [salvando, setSalvando] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [editandoAvatar, setEditandoAvatar] = useState(false);
  const [novaAvatarUrl, setNovaAvatarUrl] = useState("");
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [deletando, setDeletando] = useState(false);

  // Dados mockados de gamificação
  const level = MOCK_LEVEL;
  const currentStreak = 12;
  const conquistas = MOCK_CONQUISTAS.filter((c) => c.desbloqueada);
  const conquistasBloqueadas = MOCK_CONQUISTAS.filter((c) => !c.desbloqueada);
  const estatisticas = MOCK_ESTATISTICAS;

  const initials = (nome || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const xpPct = Math.min(
    Math.round((level.currentXp / level.nextLevelXp) * 100),
    100,
  );

  // Carregar dados do usuário ao montar
  useEffect(() => {
    if (user) {
      setNome(user.fullName || "");
      setEmail(user.email || "");
      setTelefone(user.phone || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const handleOpenAvatarDialog = () => {
    setNovaAvatarUrl(avatarUrl);
    setEditandoAvatar(true);
    setShowAvatarDialog(true);
  };

  const handleSaveAvatar = async () => {
    if (!novaAvatarUrl.trim()) {
      toast({
        title: "URL inválida",
        description: "Digite uma URL válida para o avatar",
        variant: "destructive",
      });
      return;
    }

    // Validar URL
    try {
      new URL(novaAvatarUrl);
    } catch {
      toast({
        title: "URL inválida",
        description: "Digite uma URL válida (ex: https://...)",
        variant: "destructive",
      });
      return;
    }

    setSalvando(true);
    try {
      // Chamar API para atualizar avatar
      await usersService.updateProfile({ avatarUrl: novaAvatarUrl });

      setAvatarUrl(novaAvatarUrl);
      toast({ title: "Avatar atualizado com sucesso!" });
      setShowAvatarDialog(false);
      setEditandoAvatar(false);

      // Recarregar dados do usuário
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
      const payload: any = { fullName: nome };
      if (telefone) payload.phone = telefone;

      // Chamar API para atualizar perfil
      await usersService.updateProfile(payload);

      toast({ title: "Perfil atualizado com sucesso!" });
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
      toast({ title: "Conta deletada com sucesso" });
      await logout();
      router.push("/entrar");
    } catch {
      toast({ title: "Erro ao deletar conta", variant: "destructive" });
    } finally {
      setDeletando(false);
      setShowDeleteAccountDialog(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/entrar");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="font-semibold">Meu Perfil</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Avatar + nome + stats */}
        <div className="flex flex-col items-center gap-4 py-4">
          <div
            className="relative group cursor-pointer"
            onClick={handleOpenAvatarDialog}
          >
            <Avatar className="w-24 h-24 ring-4 ring-primary/20">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold">{nome}</h1>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs font-semibold">Nível {level.level}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-semibold">
                {currentStreak} dias
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1.5">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs font-semibold">
                {conquistas.length} conquistas
              </span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">
                Progresso — Nível {level.level}
              </span>
              <span className="text-muted-foreground">
                {level.currentXp.toLocaleString()}/
                {level.nextLevelXp.toLocaleString()} XP
              </span>
            </div>
            <Progress value={xpPct} className="h-2.5 bg-secondary" />
            <p className="text-xs text-muted-foreground mt-3">
              Total acumulado: {level.totalXpEarned.toLocaleString("pt-BR")} XP
            </p>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {estatisticas.totalNucleos}
              </p>
              <p className="text-xs text-muted-foreground">Nucleos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {estatisticas.totalTarefas}
              </p>
              <p className="text-xs text-muted-foreground">Tarefas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {estatisticas.totalHabitos}
              </p>
              <p className="text-xs text-muted-foreground">Hábitos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {estatisticas.mediaDia}
              </p>
              <p className="text-xs text-muted-foreground">Média/dia</p>
            </CardContent>
          </Card>
        </div>

        {/* Info pessoal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editando ? (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Nome completo
                  </label>
                  <Input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Telefone
                  </label>
                  <Input
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Email
                  </label>
                  <Input value={email} disabled className="bg-muted/50" />
                  <p className="text-xs text-muted-foreground mt-1">
                    O email não pode ser alterado
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={salvar} disabled={salvando} size="sm">
                    {salvando ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
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
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Nome</p>
                    <p className="text-sm font-medium">{nome}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{email}</p>
                  </div>
                </div>
                {telefone && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Telefone
                        </p>
                        <p className="text-sm font-medium">{telefone}</p>
                      </div>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Membro desde
                    </p>
                    <p className="text-sm font-medium">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
                            month: "long",
                            year: "numeric",
                          })
                        : "Janeiro 2024"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditando(true)}
                  className="mt-2"
                >
                  Editar informações
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conquistas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {conquistas.map((conquista) => (
                <div
                  key={conquista.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{conquista.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      Desbloqueada em{" "}
                      {new Date(conquista.data!).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    +100 XP
                  </Badge>
                </div>
              ))}
              {conquistasBloqueadas.map((conquista) => (
                <div
                  key={conquista.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 opacity-60"
                >
                  <Target className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{conquista.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      Ainda não desbloqueada
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <Shield className="w-4 h-4" />
              Área de Risco
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" onClick={handleLogout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sair da conta
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteAccountDialog(true)}
              className="w-full"
            >
              Deletar conta
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Dialog para editar avatar com URL */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar avatar</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {/* Preview do avatar atual */}
            <div className="relative">
              <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                <AvatarImage src={novaAvatarUrl || undefined} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Campo para URL */}
            <div className="w-full space-y-2">
              <label className="text-sm font-medium">URL da imagem</label>
              <div className="flex gap-2">
                <Input
                  value={novaAvatarUrl}
                  onChange={(e) => setNovaAvatarUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Insira uma URL válida para sua foto de perfil (JPG, PNG, GIF)
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAvatarDialog(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveAvatar}
              disabled={salvando}
              className="flex-1"
            >
              {salvando ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão de conta */}
      <AlertDialog
        open={showDeleteAccountDialog}
        onOpenChange={setShowDeleteAccountDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente
              sua conta e remover todos os seus dados do nosso servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deletando}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletando ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Sim, deletar minha conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
