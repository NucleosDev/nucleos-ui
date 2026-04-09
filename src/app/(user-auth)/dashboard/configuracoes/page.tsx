"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Moon, Sun, Bell, Globe, Shield, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifStreaks, setNotifStreaks] = useState(true);
  const [idioma, setIdioma] = useState("pt-BR");

  const salvar = () => toast({ title: "Configurações salvas!" });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/95">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
          <span className="font-semibold">Configurações</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Aparência */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-sm font-semibold flex items-center gap-2"><Palette className="w-4 h-4 text-primary" />Aparência</p>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Tema</p>
                <p className="text-xs text-muted-foreground">Escolha entre claro, escuro ou sistema</p>
              </div>
              <Select value={theme || "system"} onValueChange={setTheme}>
                <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light"><div className="flex items-center gap-2"><Sun className="w-3.5 h-3.5" />Claro</div></SelectItem>
                  <SelectItem value="dark"><div className="flex items-center gap-2"><Moon className="w-3.5 h-3.5" />Escuro</div></SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Idioma */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-sm font-semibold flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" />Idioma</p>
          </div>
          <div className="p-4">
            <Select value={idioma} onValueChange={setIdioma}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Notificações */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-sm font-semibold flex items-center gap-2"><Bell className="w-4 h-4 text-orange-500" />Notificações</p>
          </div>
          <div className="p-4 space-y-4">
            {[
              { label: "Notificações push", desc: "Receba alertas no navegador", value: notifPush, set: setNotifPush },
              { label: "Notificações por email", desc: "Resumo semanal por email", value: notifEmail, set: setNotifEmail },
              { label: "Alertas de streak", desc: "Aviso quando seu streak estiver em risco", value: notifStreaks, set: setNotifStreaks },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                <Switch checked={item.value} onCheckedChange={item.set} />
              </div>
            ))}
          </div>
        </section>

        {/* Privacidade */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-sm font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-500" />Privacidade</p>
          </div>
          <div className="p-4 space-y-3">
            <Button variant="outline" className="w-full text-sm" onClick={() => router.push("/dashboard/perfil")}>Alterar senha</Button>
            <Button variant="outline" className="w-full text-sm text-destructive hover:text-destructive" onClick={() => toast({ title: "Solicitação enviada. Entraremos em contato.", variant: "destructive" })}>Excluir minha conta</Button>
          </div>
        </section>

        <Button onClick={salvar} className="w-full">Salvar configurações</Button>
      </main>
    </div>
  );
}
