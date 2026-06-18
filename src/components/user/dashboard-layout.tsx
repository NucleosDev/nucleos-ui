// components/layout/dashboard-layout.tsx
"use client";

import { useGamification } from "@/hooks/useGamification";
import {
  CalendarDays,
  Trophy,
  Bell,
  User,
  Settings,
  Grid2x2,
  MessageSquare,
  Aperture,
  TrendingUp,
  Inbox,
  Lightbulb,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useDashboard";
import { useNucleos } from "@/hooks/useNucleo";
import type { Nucleo } from "@/types/nucleo";
import { useTotalBlocosCount } from "@/hooks/useBlocos";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    id: "foco",
    label: "Foco",
    icon: Timer,
    href: "/dashboard/foco",
  },
  {
    id: "insights",
    label: "Insights",
    icon: Lightbulb,
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
    id: "gamificacao",
    label: "Gamificação",
    icon: TrendingUp,
    href: "/dashboard/gamificacao",
  },
  {
    id: "orbit",
    label: "Orbit",
    icon: MessageSquare,
    href: "/dashboard/orbit",
  },
  { id: "inbox", label: "Notificações", icon: Inbox, href: "/dashboard/inbox" },
];

const COLLAPSED_LINKS = [
  { icon: Grid2x2, href: "/dashboard", label: "Início" },
  { icon: Aperture, href: "/dashboard/nucleos", label: "Núcleos" },
  { icon: CalendarDays, href: "/dashboard/calendario", label: "Calendário" },
  { icon: Timer, href: "/dashboard/foco", label: "Foco" },
  { icon: Lightbulb, href: "/dashboard/insights", label: "Insights" },
  { icon: Trophy, href: "/dashboard/conquistas", label: "Conquistas" },
  { icon: TrendingUp, href: "/dashboard/gamificacao", label: "Gamificação" },
];

// ── NavLink ──────────────────────────────────────────────────────────────────

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
        "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
        isActive
          ? "text-foreground bg-accent"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors duration-150",
          isActive ? "text-primary" : "text-muted-foreground/70",
        )}
      />
      <span>{label}</span>
      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
      )}
    </Link>
  );
}

// ── SidebarContent ───────────────────────────────────────────────────────────

function SidebarContent({
  userData,
  recentNucleos,
  nucleosCount,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const getInitials = () => {
    if (!userData.fullName) return "U";
    return userData.fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* ── Principal ── */}
      <div className="px-3 pt-3 pb-1">
        <p className="px-3 text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-1.5">
          Principal
        </p>
        <div className="space-y-0.5">
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
      </div>

      <div className="mx-4 my-2 h-px bg-border/50" />

      {/* ── Explorar ── */}
      <div className="px-3 pb-1">
        <p className="px-3 text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-1.5">
          Explorar
        </p>
        <div className="space-y-0.5">
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
      </div>

      <div className="mx-4 my-2 h-px bg-border/50" />

      {/* ── Meus Núcleos (Documents-style) ── */}
      <div className="px-3 pb-2">
        <div className="flex items-center justify-between px-3 mb-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Meus Núcleos
          </p>
          <Link
            href="/dashboard/nucleos"
            onClick={onClose}
            className="flex items-center justify-center h-4 w-4 rounded text-muted-foreground/40 hover:text-foreground transition-colors"
          >
            <Plus className="h-3 w-3" />
          </Link>
        </div>

        {recentNucleos.length === 0 ? (
          <p className="px-3 py-1.5 text-xs text-muted-foreground/40">
            Nenhum núcleo ainda
          </p>
        ) : (
          <div className="space-y-0.5">
            {recentNucleos.map((n) => (
              <Link
                key={n.id}
                href={`/dashboard/nucleos/${n.id}`}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 group",
                  pathname === `/dashboard/nucleos/${n.id}`
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                )}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: n.corDestaque || "#4D7CFF" }}
                />
                <span className="truncate flex-1">{n.nome}</span>
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />
              </Link>
            ))}
          </div>
        )}

        {nucleosCount > 6 && (
          <Link
            href="/dashboard/nucleos"
            onClick={onClose}
            className="flex items-center px-3 py-1.5 text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors mt-0.5"
          >
            Ver todos ({nucleosCount})
          </Link>
        )}
      </div>

      {/* ── Bottom: Settings + User ── */}
      <div className="mt-auto border-t border-border/50">
        <div className="px-3 pt-2 pb-1 space-y-0.5">
          <NavLink
            href="/dashboard/perfil"
            icon={User}
            label="Perfil"
            isActive={pathname === "/dashboard/perfil"}
            onClick={onClose}
          />
          <NavLink
            href="/dashboard/configuracoes"
            icon={Settings}
            label="Configurações"
            isActive={pathname === "/dashboard/configuracoes"}
            onClick={onClose}
          />
        </div>

        {/* User profile card — shadcn style */}
        <div className="px-3 pb-3 pt-1">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors cursor-default group">
            <Avatar className="h-7 w-7 shrink-0 ring-1 ring-border">
              <AvatarImage src={userData.avatarUrl || undefined} />
              <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate text-foreground/90 leading-tight">
                {userData.fullName || "Usuário"}
              </p>
              <p className="text-[10px] text-muted-foreground/60 leading-tight mt-px">
                Nível {userData.level || 1} · {userData.streak || 0} dias streak
              </p>
            </div>
            <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SidebarDesktop ───────────────────────────────────────────────────────────

function SidebarDesktop({
  collapsed,
  userData,
  nucleosCount,
  blocosCount,
  recentNucleos,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const getInitials = () => {
    if (!userData.fullName) return "U";
    return userData.fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 280, damping: 36, mass: 1 }}
      className="hidden md:flex sticky top-0 z-40 h-screen overflow-hidden shrink-0 border-r border-border/50 bg-background"
    >
      <div className="flex flex-col h-full w-full">
        <AnimatePresence mode="wait" initial={false}>
          {collapsed ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="flex flex-col items-center h-full w-full py-3 gap-0.5"
            >
              {/* Logo */}
              <Link
                href="/dashboard"
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-accent transition-colors mb-2"
                title="Início"
              >
                <Image
                  src="/lettermark-nucleos.svg"
                  height={28}
                  width={28}
                  alt="Nucleos"
                />
              </Link>

              {/* Nav icons */}
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
                      "relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-150",
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                    )}
                  >
                    <Icon
                      className="h-[18px] w-[18px]"
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                    {isActive && (
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}

              {/* Bottom */}
              <div className="mt-auto flex flex-col items-center gap-0.5 border-t border-border/50 pt-2 w-full px-1.5">
                <Link
                  href="/dashboard/configuracoes"
                  title="Configurações"
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                    pathname === "/dashboard/configuracoes"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                  )}
                >
                  <Settings className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </Link>
                <div className="flex items-center justify-center w-10 h-10">
                  <Avatar className="h-7 w-7 ring-1 ring-border">
                    <AvatarImage src={userData.avatarUrl || undefined} />
                    <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="flex flex-col w-full h-full"
            >
              {/* Logo */}
              <div className="flex items-center justify-center px-3 py-6 border-b border-border/50 shrink-0">
                <Link href="/dashboard" className="block w-full">
                  <Image
                    src="/logotype-nucleos.svg"
                    width={200}
                    height={100}
                    alt="Nucleos"
                    priority
                    style={{ width: "100%", height: "auto" }}
                  />
                </Link>
              </div>

              <SidebarContent
                collapsed={collapsed}
                userData={userData}
                nucleosCount={nucleosCount}
                blocosCount={blocosCount}
                recentNucleos={recentNucleos}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

// ── DashboardLayout ──────────────────────────────────────────────────────────

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
  const { data: streak } = gamification.useStreak();

  const userData = {
    fullName: user?.fullName || user?.email?.split("@")[0] || "Usuário",
    avatarUrl: user?.avatarUrl || "",
    level: stats?.level,
    currentXp: stats?.currentXp,
    nextLevelXp: stats?.nextLevelXp,
    streak: streak?.currentStreak,
  };

  const nucleosCount = nucleos?.length ?? 0;
  const recentNucleos = (nucleos ?? []).slice(0, 6).map((n: Nucleo) => ({
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
          <SheetContent
            side="left"
            className="w-[260px] p-0 bg-background border-r border-border/50"
          >
            <div className="px-5 py-4 border-b border-border/50">
              <Image
                src="/logotype-nucleos.svg"
                width={110}
                height={28}
                alt="Nucleos"
                priority
                className="h-7 w-auto"
              />
            </div>
            <SidebarContent {...sidebarProps} onClose={onMobileMenuClose} />
          </SheetContent>
        </Sheet>
        <main className="flex-1 overflow-auto pb-16">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarDesktop {...sidebarProps} />
      <main className="relative flex-1 min-w-0 overflow-y-auto bg-background">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
