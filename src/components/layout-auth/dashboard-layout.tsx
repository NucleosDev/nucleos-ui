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
  Aperture,
  Menu,
  CalendarDays,
  Trophy,
  BarChart3,
  Bell,
  User,
  Settings,
  Grid2x2PlusIcon,
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
import Image from "next/image";
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
      label: "Nucleos",
      icon: Aperture,
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
      icon: Grid2x2PlusIcon,
      href: "/dashboard",
    },
    {
      id: "calendario",
      label: "Calendário",
      icon: CalendarDays,
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
      title: "Nucleos ativos",
      description:
        recentNucleos.length > 0
          ? recentNucleos.map((n) => n.nome).join(", ")
          : "Nenhum Nucleo criado ainda.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="px-3 py-3 space-y-1">
        <p className="px-3 text-xs font-medium uppercase tracking-wider mb-4">
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:scale-[1.01]",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-background hover:text-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
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
  const pathname = usePathname();

  {
    /* Sidebar Fechada */
  }

  if (collapsed) {
    return (
      <aside className="hidden md:flex w-16 border-r border-none flex-col items-center gap-8 transition-all duration-300 ease-in-out sticky top-0 bg-none backdrop-blur-md z-100 pb-0 py-4">
        {/* espaçamento do header */}
        <div className="">
          <Link
            href="/dashboard"
            className="hover:opacity-80 transition-opacity"
          >
            <Image src={"/icon.svg"} height={32} width={32} alt="logo" />
          </Link>
        </div>

        {/* Main icons */}
        <div className="flex flex-col items-center gap-2">
          {[
            { icon: Grid2x2PlusIcon, href: "/dashboard", label: "Dashboard" },
            { icon: Aperture, href: "/dashboard/nucleos", label: "Nucleos" },
            { icon: Layers, href: "/dashboard/blocos", label: "Blocos" },
            {
              icon: Activity,
              href: "/dashboard/atividades",
              label: "Atividades",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "p-2 rounded-lg transition-all group relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent/60 text-muted-background hover:text-foreground",
                )}
                title={item.label}
              >
                <Icon className="w-5 h-5 hover:text-foreground" />
              </Link>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col items-center gap-2">
          <Link
            href="/dashboard/configuracoes"
            className="p-2 rounded-lg hover:bg-accent/60 text-muted-background hover:text-foreground"
            title="Configurações"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="
    hidden md:flex
    w-72
    flex-col
    border-r border-border/60
    sticky top-0
    h-screen
    text-background
    bg-foreground
    backdrop-blur-xl
dark:bg-popover/80 
dark:shadow-xl 

dark:bg-gradient-to-r 
dark:from-primary/10 
dark:to-transparent 

dark:text-foreground
    overflow-y-auto
    transition-all duration-300 ease-in-out

    z-30
  "
    >
      {/* Logo que sobrepõe - posicionada para cobrir a borda do header */}
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
          <Link href="/dashboard" className="block">
            <div className="p-5">
              <NucleosLogo
                size={
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? "md"
                    : "lg"
                }
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Conteúdo da sidebar com padding extra no topo para compensar a logo */}
      <div className="pt-24">
        <SidebarContentComponent
          collapsed={collapsed}
          userData={userData}
          nucleosCount={nucleosCount}
          blocosCount={blocosCount}
          recentNucleos={recentNucleos}
        />
      </div>
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
  const pathname = usePathname();

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

  // Mobile: menu em sheet
  if (isMobile) {
    return (
      <div className="flex">
        <Sheet open={isMobileMenuOpen} onOpenChange={onMobileMenuClose}>
          <SheetContent side="left" className="w-72 p-0">
            <div className="pt-12">
              <SidebarContentComponent
                {...sidebarProps}
                isMobile={true}
                onClose={onMobileMenuClose}
              />
            </div>
          </SheetContent>
        </Sheet>
        <main className="flex-1 overflow-auto pb-16">{children}</main>
      </div>
    );
  }

  // Desktop: sidebar fixa
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebarDesktop {...sidebarProps} />

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
