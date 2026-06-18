"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun, Bell, Globe, Shield, Palette, Monitor, Settings, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/auth";
import { usersService } from "@/services/users.service";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const PREFS_KEY = "nucleos_prefs";

function loadPrefs() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
  } catch {
    return {};
  }
}

function savePrefs(prefs: Record<string, unknown>) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { logout } = useAuth();

  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifStreaks, setNotifStreaks] = useState(true);
  const [idioma, setIdioma] = useState("pt-BR");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    const p = loadPrefs();
    if (p.notifPush !== undefined) setNotifPush(p.notifPush);
    if (p.notifEmail !== undefined) setNotifEmail(p.notifEmail);
    if (p.notifStreaks !== undefined) setNotifStreaks(p.notifStreaks);
    if (p.idioma) setIdioma(p.idioma);
  }, []);

  const salvar = async () => {
    const prefs = { notifPush, notifEmail, notifStreaks, idioma };
    savePrefs(prefs);
    try {
      await usersService.updatePreferences(prefs);
    } catch {
      // silently ignore if endpoint unavailable — localStorage already saved
    }
    toast({ title: "Configurações salvas!" });
  };

  const handleDeleteAccount = async () => {
    try {
      await usersService.deleteAccount();
      await logout();
      toast({ title: "Conta excluída.", variant: "destructive" });
      router.replace("/");
    } catch {
      toast({ title: "Erro ao excluir conta. Tente novamente.", variant: "destructive" });
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 md:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8">
            <Settings className="h-3.5 w-3.5 text-primary" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight">Configurações</h1>
        </div>
      </div>

      <div className="p-5 md:p-6 max-w-2xl mx-auto space-y-4">
        {/* Aparência */}
        <Card className="overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-border/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Tema</p>
                <p className="text-xs text-muted-foreground/60">
                  Claro, escuro ou seguir o sistema
                </p>
              </div>
              <Select value={theme || "system"} onValueChange={setTheme}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-3.5 w-3.5" />
                      Claro
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-3.5 w-3.5" />
                      Escuro
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-3.5 w-3.5" />
                      Sistema
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Idioma */}
        <Card className="overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-border/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Idioma
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Select value={idioma} onValueChange={setIdioma}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground/60 mt-2">
              Suporte multilíngue completo em breve.
            </p>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-border/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-orange-500" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 divide-y divide-border/25">
            {[
              {
                label: "Notificações push",
                desc: "Receba alertas no navegador",
                value: notifPush,
                set: setNotifPush,
              },
              {
                label: "Notificações por email",
                desc: "Resumo semanal por email",
                value: notifEmail,
                set: setNotifEmail,
              },
              {
                label: "Alertas de streak",
                desc: "Aviso quando seu streak estiver em risco",
                value: notifStreaks,
                set: setNotifStreaks,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3.5"
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <Switch checked={item.value} onCheckedChange={item.set} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-border/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={() => router.push("/dashboard/perfil")}
            >
              Alterar dados do perfil
            </Button>
            <Button
              variant="outline"
              className="w-full text-sm text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Excluir minha conta
            </Button>
          </CardContent>
        </Card>

        <Button onClick={salvar} className="w-full">
          Salvar configurações
        </Button>
      </div>

      {/* Diálogo de confirmação de exclusão de conta */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conta permanentemente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os seus núcleos, blocos,
              hábitos, tarefas e progresso serão apagados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-0 pb-2">
            <p className="text-xs text-muted-foreground mb-2">
              Digite <strong>EXCLUIR</strong> para confirmar:
            </p>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="EXCLUIR"
              className="text-sm"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirm("")}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteConfirm !== "EXCLUIR"}
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-40"
            >
              Excluir conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
