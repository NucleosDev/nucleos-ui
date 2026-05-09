"use client";

import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { useGamification } from "@/hooks/useGamification";
import {
  Flame,
  CalendarDays,
  Trophy,
  BarChart3,
  Bell,
  User,
  Settings,
  Grid2x2,
  MessageSquare,
  Aperture,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useDashboard";
import { useNucleos } from "@/hooks/useNucleo";
import { useTotalBlocosCount } from "@/hooks/useBlocos";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
    energy?: number;
    maxEnergy?: number;
  };
  nucleosCount: number;
  blocosCount: number;
  recentNucleos: Array<{
    id: string;
    nome: string;
    tipo?: string;
    iconId?: string | null;
    corDestaque?: string;
  }>;
  onClose?: () => void;
}

const NAV_MAIN = [
  { id: "dashboard", label: "Início", icon: Grid2x2, href: "/dashboard" },
  {
    id: "nucleos",
    label: "Núcleos",
    icon: Aperture,
    href: "/dashboard/nucleos",
  },
  {
    id: "calendario",
    label: "Calendário",
    icon: CalendarDays,
    href: "/dashboard/calendario",
  },
  {
    id: "insights",
    label: "Insights",
    icon: BarChart3,
    href: "/dashboard/insights",
  },
];

const NAV_SECONDARY = [
  {
    id: "conquistas",
    label: "Conquistas",
    icon: Trophy,
    href: "/dashboard/conquistas",
  },
  {
    id: "chatbot",
    label: "Assistente",
    icon: MessageSquare,
    href: "/dashboard/chatbot",
  },
  {
    id: "notificacoes",
    label: "Notificações",
    icon: Bell,
    href: "/dashboard/notificacoes",
  },
];

const NAV_BOTTOM = [
  { id: "perfil", label: "Perfil", icon: User, href: "/dashboard/perfil" },
  {
    id: "configuracoes",
    label: "Configurações",
    icon: Settings,
    href: "/dashboard/configuracoes",
  },
];

const COLLAPSED_LINKS = [
  { icon: Grid2x2, href: "/dashboard", label: "Início" },
  { icon: Aperture, href: "/dashboard/nucleos", label: "Núcleos" },
  { icon: CalendarDays, href: "/dashboard/calendario", label: "Calendário" },
  { icon: BarChart3, href: "/dashboard/insights", label: "Insights" },
];

function NavLink({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative z-30",
        isActive
          ? "bg-primary/15 text-primary shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-white/10",
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
      <span className="flex-1">{label}</span>
      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />}
    </Link>
  );
}

function SidebarContent({ userData, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  const energyPct =
    userData.energy != null && userData.maxEnergy
      ? Math.round((userData.energy / userData.maxEnergy) * 100)
      : null;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto py-4 px-3 relative z-30">
      {/* Main nav */}
      <div className="space-y-1">
        <span className="px-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
          Principal
        </span>
        {NAV_MAIN.map((link) => (
          <NavLink
            key={link.id}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isActive={
              link.href === "/dashboard"
                ? pathname === link.href
                : pathname === link.href ||
                  pathname?.startsWith(link.href + "/")
            }
            onClick={onClose}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="mx-3 my-4 h-px bg-white/10" />

      {/* Secondary nav */}
      <div className="space-y-1">
        <span className="px-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
          Recursos
        </span>
        {NAV_SECONDARY.map((link) => (
          <NavLink
            key={link.id}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isActive={
              pathname === link.href || pathname?.startsWith(link.href + "/")
            }
            onClick={onClose}
          />
        ))}
      </div>

      {/* Gamification widgets */}
      <div className="mx-1 mt-5 space-y-2">
        {userData?.streak != null && userData.streak > 0 && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <Flame className="h-3.5 w-3.5 text-orange-500 shrink-0" />
            <span className="text-xs font-semibold text-orange-500 flex-1">
              {userData.streak} dias seguidos
            </span>
          </div>
        )}

        {energyPct != null && (
          <div className="px-3 py-2 rounded-lg bg-amber-500/8 border border-amber-500/15">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-amber-500" />
                <span className="text-[11px] font-semibold text-amber-500">
                  Energia
                </span>
              </div>
              <span className="text-[10px] tabular-nums text-amber-500/70">
                {userData.energy}/{userData.maxEnergy}
              </span>
            </div>
            <div className="h-1 rounded-full bg-amber-500/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                style={{ width: `${energyPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="mt-auto pt-4">
        <div className="space-y-1">
          {NAV_BOTTOM.map((link) => (
            <NavLink
              key={link.id}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isActive={pathname === link.href}
              onClick={onClose}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SidebarDesktop({
  collapsed,
  userData,
  nucleosCount,
  blocosCount,
  recentNucleos,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  if (collapsed) {
    return (
      <LiquidGlassCard
        glowIntensity="sm"
        shadowIntensity="xs"
        borderRadius="0px"
        blurIntensity="md"
        className="hidden md:flex w-14 flex-col items-center sticky top-0 h-screen z-30 rounded-none"
      >
        <div className="flex flex-col items-center py-4 gap-6">
          <Link
            href="/dashboard"
            className="hover:opacity-75 transition-opacity relative z-30"
          >
            <Image src="/icon.svg" height={28} width={28} alt="logo" />
          </Link>

          <div className="flex flex-col items-center gap-2">
            {COLLAPSED_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 relative z-30",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-white/10 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-6">
            <Link
              href="/dashboard/configuracoes"
              title="Configurações"
              className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all duration-200 relative z-30"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </LiquidGlassCard>
    );
  }

  return (
    <LiquidGlassCard
      glowIntensity="sm"
      shadowIntensity="xs"
      borderRadius="0px"
      blurIntensity="md"
      className="hidden md:flex w-[260px] flex-col sticky top-0 h-screen z-30 transition-all duration-300 rounded-none"
    >
      <div className="px-4 py-5 border-b border-white/10 relative z-30">
        <Link href="/dashboard" className="block">
          <NucleosLogo size="md" />
        </Link>
      </div>

      <SidebarContent
        collapsed={collapsed}
        userData={userData}
        nucleosCount={nucleosCount}
        blocosCount={blocosCount}
        recentNucleos={recentNucleos}
        onClose={onClose}
      />
    </LiquidGlassCard>
  );
}

export function DashboardLayout({
  children,
  collapsed = false,
  isMobile = false,
  isMobileMenuOpen = false,
  onMobileMenuClose = () => {},
}: DashboardLayoutProps) {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: nucleos, isLoading: nucleosLoading } = useNucleos();
  const { data: totalBlocos = 0 } = useTotalBlocosCount(nucleos || []);
  const gamification = useGamification();
  const { data: stats, isLoading: statsLoading } = gamification.useStats();
  const { data: energyData } = gamification.useEnergy();

  const isLoading = userLoading || nucleosLoading || statsLoading;

  const userData = {
    fullName: user?.fullName || user?.email?.split("@")[0] || "Usuário",
    avatarUrl: user?.avatarUrl || "",
    level: stats?.level ?? 0,
    currentXp: stats?.currentXp ?? 0,
    nextLevelXp: stats?.nextLevelXp ?? 100,
    streak: stats?.currentStreak ?? 0,
    energy: energyData?.energy,
    maxEnergy: energyData?.maxEnergy,
  };

  const nucleosCount = nucleos?.length ?? 0;
  const recentNucleos = (nucleos ?? []).slice(0, 5).map((n) => ({
    id: n.id,
    nome: n.nome,
    tipo: n.tipo,
    iconId: n.iconId,
    corDestaque: n.corDestaque,
  }));

  const sidebarProps = {
    collapsed,
    userData,
    nucleosCount,
    blocosCount: totalBlocos,
    recentNucleos,
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p className="text-white/70">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Sheet open={isMobileMenuOpen} onOpenChange={onMobileMenuClose}>
          <SheetContent
            side="left"
            className="w-[280px] p-0 border-r border-white/10 bg-transparent"
          >
            <LiquidGlassCard
              glowIntensity="sm"
              shadowIntensity="sm"
              borderRadius="0px"
              blurIntensity="lg"
              className="w-full h-full rounded-none"
            >
              <div className="px-4 py-5 border-b border-white/10 relative z-30">
                <NucleosLogo size="md" />
              </div>
              <SidebarContent {...sidebarProps} onClose={onMobileMenuClose} />
            </LiquidGlassCard>
          </SheetContent>
        </Sheet>
        <main className="flex-1 overflow-auto pb-16">
          <div className="container mx-auto p-4">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarDesktop {...sidebarProps} />
      <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
    </div>
  );
}
