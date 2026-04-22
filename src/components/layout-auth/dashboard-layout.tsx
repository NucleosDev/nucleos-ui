"use client";

import { NucleoCardMini } from "@/components/nucleo/ui/nucleo-card-nano";
import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/auth";
import { MessageSquare } from "lucide-react";
import {
  Zap,
  Flame,
  Layers,
  Activity,
  Lightbulb,
  Sparkles,
  LayoutGrid,
  Menu,
  Calendar,
  Trophy,
  BarChart3,
  Bell,
  User,
  Settings,
  LayoutPanelLeft,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useDashboard";
import { useNucleos } from "@/hooks/useNucleo";
import { useTotalBlocosCount } from "@/hooks/useBlocos";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBlocos } from "@/hooks/useBlocos";
import { useColecoes } from "@/hooks/useColecoes";
import { useTimers } from "@/hooks/useTimers";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NucleosLogo from "@/components/nucleo/NucleosLogo";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
  collapsed?: boolean;
  isMobile?: boolean;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

interface DashboardSidebarProps {
  collapsed: boolean;
  userData: {
    fullName?: string;
    avatarUrl?: string;
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
  blocosData?: any[];
  colecoesData?: any[];
  timersData?: any[];
  isMobile?: boolean;
  onClose?: () => void;
}

// Componente de conteúdo da sidebar (reutilizável para desktop e mobile)
function SidebarContentComponent({
  userData,
  nucleosCount,
  blocosCount,
  recentNucleos,
  isMobile,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const xpPercent = Math.min(
    ((userData.currentXp || 0) / (userData.nextLevelXp || 100)) * 100,
    100,
  );

  const getInitials = () => {
    if (!userData.fullName) return "U";
    return userData.fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const mainLinks = [
    {
      id: "nucleos",
      label: "Núcleos",
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

  const dashboardLinks = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutPanelLeft,
      href: "/dashboard",
    },
    {
      id: "calendario",
      label: "Calendário",
      icon: Calendar,
      href: "/dashboard/calendario",
    },
    {
      id: "conquistas",
      label: "Conquistas",
      icon: Trophy,
      href: "/dashboard/conquistas",
    },
    {
      id: "insights",
      label: "Insights",
      icon: BarChart3,
      href: "/dashboard/insights",
    },
    {
      id: "notificacoes",
      label: "Notificações",
      icon: Bell,
      href: "/dashboard/notificacoes",
    },
    {
      id: "chat-bot",
      label: "Chat-Bot",
      icon: MessageSquare,
      href: "/dashboard/chatbot",
    },

    { id: "perfil", label: "Perfil", icon: User, href: "/dashboard/perfil" },
    {
      id: "configuracoes",
      label: "Configurações",
      icon: Settings,
      href: "/dashboard/configuracoes",
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
      title: "Núcleos ativos",
      description:
        recentNucleos.length > 0
          ? recentNucleos.map((n) => n.nome).join(", ")
          : "Nenhum Núcleo criado ainda.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex flex-col">
      <div>
        <div className="flex flex-col ">
          {/* Header com Logo (centralizado) */}
          <div className="p-6 flex flex-col items-center justify-center text-center border-b border-border">
            <Link
              href="/dashboard"
              className="hover:opacity-80 transition-opacity"
              onClick={onClose}
            >
              <NucleosLogo size="md" />{" "}
              {/* ou size="md" dependendo do que você quer */}
            </Link>

            {isMobile && onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute right-2 top-2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Informações do usuário (sem avatar) */}
          <div className="p-4 border-b border-border">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold truncate">
                {userData.fullName || "Meu Workspace"}
              </p>

              <div className="flex items-center justify-center gap-2 mt-0.5">
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
          </div>
        </div>
      </div>

      {/* Perfil do usuário */}

      {/* Links principais */}
      <nav className="px-2 py-2 space-y-0.5">
        <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Principal
        </p>
        {mainLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href || pathname?.startsWith(link.href + "/");
          return (
            <Link
              key={link.id}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </div>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium tabular-nums">
                {link.count}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Links de navegação */}
      <div className="px-2 py-2 space-y-0.5">
        <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Navegação
        </p>
        {dashboardLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.id}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Insights */}
      <div className="px-3 py-3">
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

      {/* Atividades recentes */}
      <div className="px-3 py-3 border-t border-border">
        <p className="text-xs font-medium text-left uppercase mb-2">
          Atividades recentes
        </p>
        <div className="space-y-1">
          {recentNucleos.length > 0 ? (
            recentNucleos.map((nucleo) => (
              <div key={nucleo.id} onClick={onClose}>
                <NucleoCardMini
                  id={nucleo.id}
                  nome={nucleo.nome}
                  tipo={nucleo.tipo}
                  nivel={nucleo.level || 1}
                  iconId={nucleo.iconId}
                  iconUrl={nucleo.icon?.iconUrl}
                  corDestaque={nucleo.corDestaque}
                />
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              Nenhuma atividade ainda
            </p>
          )}
        </div>
      </div>

      {/* Barra de progresso XP */}
      <div className="p-3 border-t border-border mt-auto">
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
    </div>
  );
}

function DashboardSidebarDesktop({
  collapsed,
  userData,
  nucleosCount,
  blocosCount,
  recentNucleos,
}: DashboardSidebarProps) {
  if (collapsed) {
    return (
      <aside className="hidden md:flex w-12 border-r border-border flex-col items-center py-4 transition-all duration-300 ease-in-out">
        {/* Espaço vazio - o botão de toggle está no header */}
      </aside>
    );
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border transition-all duration-300 ease-in-out overflow-y-auto">
      <SidebarContentComponent
        collapsed={collapsed}
        userData={userData}
        nucleosCount={nucleosCount}
        blocosCount={blocosCount}
        recentNucleos={recentNucleos}
      />
    </aside>
  );
}

// ========== LAYOUT PRINCIPAL ==========
export function DashboardLayout({
  children,
  collapsed = false,
  isMobile = false,
  isMobileMenuOpen = false,
  onMobileMenuClose = () => {},
}: DashboardLayoutProps) {
  const { logout } = useAuth();

  const { data: user } = useCurrentUser();
  const { data: nucleos } = useNucleos();
  const { data: totalBlocos = 0 } = useTotalBlocosCount(nucleos || []);

  const { blocos: blocosData = [] } = useBlocos();
  const { colecoes: colecoesData = [] } = useColecoes();
  const { timers: timersData = [] } = useTimers();

  const userData = {
    fullName: user?.fullName || user?.email?.split("@")[0] || "Usuário",
    avatarUrl: user?.avatarUrl || "",
    level: 5,
    currentXp: 340,
    nextLevelXp: 500,
    streak: 12,
  };

  const nucleosCount = nucleos?.length || 0;
  const recentNucleos = (nucleos || []).slice(0, 3).map((nucleo) => ({
    id: nucleo.id,
    nome: nucleo.nome,
    tipo: nucleo.tipo,
    level: (nucleo as any)?.level || 1,
    iconId: nucleo.iconId,
    icon: (nucleo as any)?.icon,
    corDestaque: nucleo.corDestaque,
  }));

  const sidebarProps = {
    collapsed,
    userData,
    nucleosCount,
    blocosCount: totalBlocos,
    recentNucleos,
    blocosData,
    colecoesData,
    timersData,
  };

  // Mobile: sem sidebar fixa, apenas o conteúdo (o menu está no header mobile)
  if (isMobile) {
    return (
      <div className="flex">
        <main className="flex-1 overflow-auto pb-16">{children}</main>
      </div>
    );
  }

  // Desktop: sidebar fixa
  return (
    <div className="flex">
      <DashboardSidebarDesktop {...sidebarProps} />

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
