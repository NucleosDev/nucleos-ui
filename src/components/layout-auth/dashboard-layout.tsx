"use client";
import { NucleoCardMini } from "@/components/nucleo/ui/nucleo-card-nano";
import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/auth";
import {
  Zap,
  Flame,
  ChevronRight,
  Layers,
  Activity,
  Lightbulb,
  Sparkles,
  LayoutGrid,
  PanelsTopLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useDashboard";
import { useNucleos } from "@/hooks/useNucleo";
import { useTotalBlocosCount } from "@/hooks/useBlocos";

// ========== COMPONENTE DA SIDEBAR ==========
interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout?: () => void;
  className?: string;
  userData: {
    fullName?: string;
    level?: number;
    currentXp?: number;
    nextLevelXp?: number;
    streak?: number;
  };
  nucleosCount: number;
  blocosCount: number;
  recentNucleos: Array<{
    id: string;
    nome: string;
    tipo?: string;
    level?: number;
    iconId?: string | null;
    icon?: { iconUrl?: string };
    corDestaque?: string;
  }>;
}

function DashboardSidebar({
  collapsed,
  onToggleCollapse,
  onLogout,
  className,
  userData,
  nucleosCount,
  blocosCount,
  recentNucleos,
}: DashboardSidebarProps) {
  const xpPercent = Math.min(
    ((userData.currentXp || 0) / (userData.nextLevelXp || 100)) * 100,
    100,
  );

  const mainLinks = [
    {
      id: "nucleos",
      label: "Nucleos",
      icon: LayoutGrid,
      href: "/dashboard/nucleos",
      count: nucleosCount,
    },
    {
      id: "blocos",
      label: "Blocos",
      icon: Layers,
      href: "/dashboard/blocos",
      count: blocosCount,
    },
    {
      id: "atividades",
      label: "Atividades Recentes",
      icon: Activity,
      href: "/dashboard/atividades",
      count: 0,
    },
  ];

  const insights = [
    {
      id: "streak",
      title: "Streak",
      description: `${userData.streak || 0} dias consecutivos! Continue assim.`,
      icon: Flame,
    },
    {
      id: "nucleos-recentes",
      title: "Nucleos ativos",
      description:
        recentNucleos.length > 0
          ? recentNucleos.map((n) => n.nome).join(", ")
          : "Nenhum Nucleo criado ainda.",
      icon: Sparkles,
    },
  ];

  // Estado colapsado (barra fina)
  if (collapsed) {
    return (
      <aside
        className={cn(
          "w-12 border-r border-border h-full flex flex-col items-center py-4 transition-all duration-300 ease-in-out",
          className,
        )}
      >
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
          aria-label="Expandir menu"
        >
          <PanelsTopLeft className="h-4 w-4 text-primary transition-transform duration-300" />
        </button>
      </aside>
    );
  }

  // Estado expandido
  return (
    <aside
      className={cn(
        "w-64 flex flex-col h-full border-r border-border transition-all duration-300 ease-in-out",
        className,
      )}
    >
      {/* Cabeçalho do usuário */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-primary">
            {userData.fullName?.charAt(0) || "U"}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">
            {userData.fullName || "Meu Workspace"}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-muted-foreground">
                Nv.{userData.level || 1}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="text-xs text-muted-foreground">
                {userData.streak || 0}d
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 ml-auto shrink-0"
          onClick={onToggleCollapse}
          aria-label="Recolher menu"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Links principais */}
      <nav className="px-2 py-2 space-y-0.5 flex-">
        <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Principal
        </p>
        {mainLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.id}
              href={link.href}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </div>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium tabular-nums">
                {link.count}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Atividades recentes */}
      <div className="px-3 py-3 border-t border-border">
        <div>
          <p className="text-xs font-medium text-left uppercase mb-2">
            Atividades recentes
          </p>
          <div className="space-y-1">
            {recentNucleos.length > 0 ? (
              recentNucleos.map((nucleo) => (
                <NucleoCardMini
                  key={nucleo.id}
                  id={nucleo.id}
                  nome={nucleo.nome}
                  tipo={nucleo.tipo}
                  nivel={nucleo.level || 1}
                  iconId={nucleo.iconId}
                  iconUrl={nucleo.icon?.iconUrl}
                  corDestaque={nucleo.corDestaque}
                />
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                Nenhuma atividade ainda
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-semibold">Insights para você</span>
        </div>
        <div className="space-y-3">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div
                key={insight.id}
                className="bg-background/60 rounded-lg p-3 border border-border/50"
              >
                <div className="flex items-start gap-2">
                  <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barra de progresso XP */}
      {/* Espaço flexível para empurrar o conteúdo para baixo */}
      <div className="flex-1" />

      {/* Barra de progresso XP */}
      <div className="p-3 border-t border-border ">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span className="font-medium">
            XP para nível {(userData.level || 1) + 1}
          </span>
          <span>
            {userData.currentXp || 0}/{userData.nextLevelXp || 100}
          </span>
        </div>
        <Progress value={xpPercent} className="h-1.5" />
      </div>

      {/* Logout */}
      {/* {onLogout && (
        <div className="p-3 border-t border-border shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive"
            onClick={onLogout}
          >
            Sair
          </Button>
        </div>
      )} */}
    </aside>
  );
}

// ========== LAYOUT PRINCIPAL ==========
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const { data: user } = useCurrentUser();
  const { data: nucleos } = useNucleos();
  const { data: totalBlocos = 0 } = useTotalBlocosCount(nucleos || []);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const handleLogout = async () => {
    await logout();
  };

  const userData = {
    fullName: user?.fullName || user?.email?.split("@")[0] || "Usuário",
    level: 5,
    currentXp: 340,
    nextLevelXp: 500,
    streak: 12,
  };

  const nucleosCount = nucleos?.length || 0;

  // Mapeia os núcleos com todas as propriedades necessárias
  const recentNucleos = (nucleos || []).slice(0, 3).map((nucleo) => ({
    id: nucleo.id,
    nome: nucleo.nome,
    tipo: nucleo.tipo,
    level: (nucleo as any)?.level || 1,
    iconId: nucleo.iconId,
    icon: (nucleo as any)?.icon,
    corDestaque: nucleo.corDestaque,
  }));

  const sidebarContent = (
    <DashboardSidebar
      collapsed={collapsed}
      onToggleCollapse={() => setCollapsed(!collapsed)}
      onLogout={handleLogout}
      userData={userData}
      nucleosCount={nucleosCount}
      blocosCount={totalBlocos}
      recentNucleos={recentNucleos}
    />
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block h-full shrink-0">{sidebarContent}</div>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
