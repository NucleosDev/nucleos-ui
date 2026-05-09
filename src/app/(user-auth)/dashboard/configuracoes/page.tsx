"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Moon, Sun, Bell, Globe, Shield, Palette, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light",  label: "Claro",   icon: Sun     },
  { value: "dark",   label: "Escuro",  icon: Moon    },
  { value: "system", label: "Sistema", icon: Monitor },
] as const;

const LANG_OPTIONS = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "English (US)"       },
  { value: "es",    label: "Español"             },
];

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [notifPush,    setNotifPush]    = useState(true);
  const [notifEmail,   setNotifEmail]   = useState(true);
  const [notifStreaks, setNotifStreaks]  = useState(true);
  const [idioma,       setIdioma]       = useState("pt-BR");

  const salvar = () => toast({ title: "Configurações salvas!" });

  return (
    <div className="flex-1 overflow-auto">
      {/* Page header */}
      <div className="px-5 md:px-7 pt-7 pb-5 flex items-center gap-3 border-b border-border/40">
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)]"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-base font-semibold">Configurações</h1>
      </div>

      <div className="px-5 md:px-7 py-6 max-w-2xl mx-auto space-y-4">

        {/* Appearance */}
        <section className="rounded-[var(--radius-lg)] border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Aparência</p>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Tema</p>
                <p className="text-xs text-muted-foreground/60">Claro, escuro ou seguir o sistema</p>
              </div>
              <div className="flex items-center gap-0.5 p-1 rounded-lg bg-muted/40 border border-border/30 shrink-0">
                {THEME_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = (theme || "system") === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-[var(--duration-fast)]",
                        active
                          ? "bg-background text-foreground shadow-[var(--shadow-xs)]"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="rounded-[var(--radius-lg)] border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" />
            <p className="text-sm font-semibold">Idioma</p>
          </div>
          <div className="p-4">
            <select
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border/50 bg-background/60 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
            >
              {LANG_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-[var(--radius-lg)] border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <Bell className="h-4 w-4 text-orange-500" />
            <p className="text-sm font-semibold">Notificações</p>
          </div>
          <div className="px-4 divide-y divide-border/25">
            {[
              { label: "Notificações push",    desc: "Receba alertas no navegador",              value: notifPush,    set: setNotifPush    },
              { label: "Notificações por email",desc: "Resumo semanal por email",                value: notifEmail,   set: setNotifEmail   },
              { label: "Alertas de streak",    desc: "Aviso quando seu streak estiver em risco", value: notifStreaks,  set: setNotifStreaks },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{item.desc}</p>
                </div>
                <Switch checked={item.value} onCheckedChange={item.set} />
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section className="rounded-[var(--radius-lg)] border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            <p className="text-sm font-semibold">Privacidade</p>
          </div>
          <div className="p-4 space-y-2.5">
            <button
              onClick={() => router.push("/dashboard/perfil")}
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg border border-border/50 bg-background/40 text-sm font-medium text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)]"
            >
              Alterar senha
            </button>
            <button
              onClick={() =>
                toast({ title: "Solicitação enviada. Entraremos em contato.", variant: "destructive" })
              }
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg border border-destructive/30 text-sm font-medium text-destructive hover:bg-destructive/8 transition-colors duration-[var(--duration-fast)]"
            >
              Excluir minha conta
            </button>
          </div>
        </section>

        {/* Save */}
        <button
          onClick={salvar}
          className="w-full flex items-center justify-center px-4 py-2.5 rounded-[var(--radius-md)] bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-[var(--shadow-xs)]"
        >
          Salvar configurações
        </button>

      </div>
    </div>
  );
}
