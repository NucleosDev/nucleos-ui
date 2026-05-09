"use client";

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
  ChevronRight,
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
  { id: "dashboard",     label: "Início",        icon: Grid2x2,     href: "/dashboard" },
  { id: "nucleos",       label: "Núcleos",        icon: Aperture,    href: "/dashboard/nucleos" },
  { id: "calendario",   label: "Calendário",     icon: CalendarDays,href: "/dashboard/calendario" },
  { id: "insights",     label: "Insights",        icon: BarChart3,   href: "/dashboard/insights" },
];

const NAV_SECONDARY = [
  { id: "conquistas",   label: "Conquistas",     icon: Trophy,      href: "/dashboard/conquistas" },
  { id: "chatbot",      label: "Assistente",      icon: MessageSquare, href: "/dashboard/chatbot" },
  { id: "notificacoes", label: "Notificações",   icon: Bell,        href: "/dashboard/notificacoes" },
];

const NAV_BOTTOM = [
  { id: "perfil",          label: "Perfil",         icon: User,     href: "/dashboard/perfil" },
  { id: "configuracoes",   label: "Configurações",  icon: Settings, href: "/dashboard/configuracoes" },
];

const COLLAPSED_LINKS = [
  { icon: Grid2x2,     href: "/dashboard",           label: "Início" },
  { icon: Aperture,    href: "/dashboard/nucleos",   label: "Núcleos" },
  { icon: CalendarDays,href: "/dashboard/calendario",label: "Calendário" },
  { icon: BarChart3,   href: "/dashboard/insights",  label: "Insights" },
];

function NavLink({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
  className,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "nav-item group",
        isActive && "active",
        className,
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors duration-[var(--duration-fast)]",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      <span>{label}</span>
      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary/70" />
      )}
    </Link>
  );
}

function SidebarContent({ userData, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col flex-1 overflow-y-auto py-3">
      {/* Main nav */}
      <div className="px-2 space-y-0.5">
        {NAV_MAIN.map((link) => (
          <NavLink
            key={link.id}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isActive={
              link.href === "/dashboard"
                ? pathname === link.href
                : pathname === link.href || pathname?.startsWith(link.href + "/")
            }
            onClick={onClose}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="mx-3 my-3 h-px bg-border/50" />

      {/* Secondary nav */}
      <div className="px-2 space-y-0.5">
        {NAV_SECONDARY.map((link) => (
          <NavLink
            key={link.id}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isActive={pathname === link.href || pathname?.startsWith(link.href + "/")}
            onClick={onClose}
          />
        ))}
      </div>

      {/* Streak indicator */}
      {userData.streak !== undefined && userData.streak > 0 && (
        <div className="mx-3 mt-4">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-orange-500/8 border border-orange-500/15">
            <Flame className="h-3.5 w-3.5 text-orange-500 shrink-0" />
            <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
              {userData.streak} dias seguidos
            </span>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="mt-auto pt-3 border-t border-border/50 mx-2 space-y-0.5">
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
  );
}

function SidebarDesktop({ collapsed, userData, nucleosCount, blocosCount, recentNucleos }: DashboardSidebarProps) {
  const pathname = usePathname();

  if (collapsed) {
    return (
      <aside className="hidden md:flex w-14 flex-col items-center border-r border-border/40 sticky top-0 h-screen py-4 bg-sidebar z-30">
        {/* Logo */}
        <Link href="/dashboard" className="mb-6 hover:opacity-75 transition-opacity">
          <Image src="/icon.svg" height={24} width={24} alt="logo" />
        </Link>

        {/* Collapsed nav icons */}
        <div className="flex flex-col items-center gap-1 w-full px-2">
          {COLLAPSED_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-[var(--duration-fast)]",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
        </div>

        {/* Bottom icon */}
        <div className="mt-auto px-2">
          <Link
            href="/dashboard/configuracoes"
            title="Configurações"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-[var(--duration-fast)]"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden md:flex w-[220px] flex-col border-r border-border/40 sticky top-0 h-screen bg-sidebar z-30 transition-all duration-[var(--duration-base)]">
      {/* Header / Logo */}
      <div className="px-4 py-4 border-b border-border/40">
        <Link href="/dashboard" className="block">
          <NucleosLogo size="md" />
        </Link>
      </div>

      {/* Nav content */}
      <SidebarContent
        collapsed={collapsed}
        userData={userData}
        nucleosCount={nucleosCount}
        blocosCount={blocosCount}
        recentNucleos={recentNucleos}
      />
    </aside>
  );
}

export function DashboardLayout({
  children,
  collapsed = false,
  isMobile = false,
  isMobileMenuOpen = false,
  onMobileMenuClose = () => {},
}: DashboardLayoutProps) {
  const { data: user } = useCurrentUser();
  const { data: nucleos } = useNucleos();
  const { data: totalBlocos = 0 } = useTotalBlocosCount(nucleos || []);
  const gamification = useGamification();
  const { data: stats } = gamification.useStats();

  const userData = {
    fullName: user?.fullName || user?.email?.split("@")[0] || "Usuário",
    avatarUrl: user?.avatarUrl || "",
    level: stats?.level,
    currentXp: stats?.currentXp,
    nextLevelXp: stats?.nextLevelXp,
    streak: stats?.currentStreak,
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

  if (isMobile) {
    return (
      <div className="flex">
        <Sheet open={isMobileMenuOpen} onOpenChange={onMobileMenuClose}>
          <SheetContent side="left" className="w-[220px] p-0 bg-sidebar border-r border-border/40">
            <div className="px-4 py-4 border-b border-border/40">
              <NucleosLogo size="md" />
            </div>
            <SidebarContent
              {...sidebarProps}
              onClose={onMobileMenuClose}
            />
          </SheetContent>
        </Sheet>
        <main className="flex-1 overflow-auto pb-16">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarDesktop {...sidebarProps} />
      <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
    </div>
  );
}
