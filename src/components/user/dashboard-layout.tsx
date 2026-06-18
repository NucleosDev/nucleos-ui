// components/layout/dashboard-layout.tsx
"use client";

// import { LiquidGlass } from "@/components/ui/liquid-glass";
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
  Zap,
  TrendingUp,
  Inbox,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useDashboard";
import { useNucleos } from "@/hooks/useNucleo";
import type { Nucleo } from "@/types/nucleo";
import { useTotalBlocosCount } from "@/hooks/useBlocos";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
    id: "insights",
    label: "Dicas",
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
    label: "Ranking",
    icon: TrendingUp,
    href: "/dashboard/gamificacao",
  },
  {
    id: "chatbot",
    label: "Orbit",
    icon: MessageSquare,
    href: "/dashboard/chatbot",
  },
  {
    id: "inbox",
    label: "Social",
    icon: Inbox,
    href: "/dashboard/inbox",
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
  { icon: Lightbulb, href: "/dashboard/insights", label: "Dicas" },
];

// ── BgUser (fundo blur extraído) ─────────────────────────────────────────────

// ── NavLink (sidebar expandida) ──────────────────────────────────────────────

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
        "relative bg-transparent flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
        isActive
          ? "text-foreground"
          : "text-foreground/40 hover:text-foreground/75",
      )}
    >
      {isActive && (
        <span className="absolute inset-0 rounded-xl border border-primary/30 bg-primary/5" />
      )}

      <Icon
        className={cn(
          "h-4 w-4 shrink-0 relative z-10 transition-colors duration-200",
          isActive ? "text-primary" : "text-foreground/40",
        )}
      />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

// ── NavIcon (sidebar colapsada standalone - usado apenas no settings) ─────────

function NavIcon({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}) {
  return (
    <div className="">
      <Link
        href={href}
        title={label}
        className="relative flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 group"
      >
        {isActive ? (
          <div
            className="absolute inset-0 rounded-2xl backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.09)",
              boxShadow:
                "inset 1.5px 1.5px 1px 0 rgba(255,255,255,0.3), inset -1.5px -1.5px 1px 0 rgba(255,255,255,0.10), 0 4px 10px rgba(0,0,0,0.25)",
            }}
          />
        ) : (
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-/[0.05]" />
        )}
        <Icon
          className={cn(
            "h-[18px] w-[18px] relative z-10 transition-all duration-300",
            isActive ? "text" : "text/40 group-hover:text/70",
          )}
          strokeWidth={isActive ? 2.2 : 1.5}
        />
      </Link>
    </div>
  );
}

// ── SidebarContent ───────────────────────────────────────────────────────────

function SidebarContent({ userData, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col flex-1 overflow-y-auto py-4">
      {/* Main nav */}
      <div className="px-3 space-y-1">
        <p className="px-3 text-[10px] font-semibold text/25 uppercase tracking-widest mb-2">
          Principal
        </p>
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
      <div className="mx-4 my-4 h-px bg-/[0.06]" />

      {/* Secondary nav */}
      <div className="px-3 space-y-1">
        <p className="px-3 text-[10px] font-semibold text/25 uppercase tracking-widest mb-2">
          Explorar
        </p>
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

      {/* Bottom nav */}
      <div className="mt-auto pt-3 mx-3 space-y-1 ">
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

// ── SidebarDesktop ───────────────────────────────────────────────────────────

function SidebarDesktop({
  collapsed,
  userData,
  nucleosCount,
  blocosCount,
  recentNucleos,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 280, damping: 36, mass: 1 }}
      className="hidden md:flex sticky top-0 z-40 h-screen overflow-hidden shrink-0 box-border bg-foreground/5 backdrop-blur-lg border-r border-border/30"
    >
      <div className="flex flex-col h-full w-full bg-background">
        {/* Fundo BgUser quando colapsada */}

        <AnimatePresence mode="wait" initial={false}>
          {collapsed ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: "easeInOut" }}
              className="relative z-10 flex flex-col items-center pt-4 w-full h-full"
            >
              {/* Glass pill — logo + nav icons together */}
              <div className="relative w-full px-3">
                <div className="absolute top-[-12] z-10 flex flex-col items-center gap-0.5 py-2">
                  {/* Logo inside the pill */}
                  <Link
                    href="/dashboard"
                    title="Início"
                    className="flex items-center justify-center w-10 h-10 rounded-xl hover:opacity-75 transition-opacity"
                  >
                    <Image
                      src="/lettermark-nucleos.svg"
                      height={32}
                      width={32}
                      alt="logo"
                    />
                  </Link>

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
                        className="relative flex items-center justify-center w-10 h-10 rounded-xl group transition-colors duration-200"
                      >
                        {isActive && (
                          <span
                            className="absolute inset-0 rounded-xl"
                            style={{ background: "rgba(255,255,255,0.09)" }}
                          />
                        )}
                        <Icon
                          className={cn(
                            "h-[18px] w-[18px] relative z-10 transition-all duration-200",
                            isActive ? "text" : "text/35 group-hover:text/65",
                          )}
                          strokeWidth={isActive ? 2.2 : 1.5}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto">
                <NavIcon
                  href="/dashboard/configuracoes"
                  icon={Settings}
                  label="Configurações"
                  isActive={pathname === "/dashboard/configuracoes"}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: "easeInOut" }}
              className="flex flex-col w-full h-full"
            >
              {/* Logo + nav expandida */}
              <div className="px-5 py-4 ">
                <Link href="/dashboard" className="block">
                  <Image
                    src="/logotype-nucleos.svg"
                    width={120}
                    height={32}
                    alt="Nucleos"
                    priority
                    className="h-8 w-auto"
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

  const userData = {
    fullName: user?.fullName || user?.email?.split("@")[0] || "Usuário",
    avatarUrl: user?.avatarUrl || "",
    level: stats?.level,
    currentXp: stats?.currentXp,
    nextLevelXp: stats?.nextLevelXp,
    streak: stats?.currentStreak,
  };

  const nucleosCount = nucleos?.length ?? 0;
  const recentNucleos = (nucleos ?? []).slice(0, 5).map((n: Nucleo) => ({
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
            className="w-[240px] p-0 bg-black/90 backdrop-blur-3xl"
          >
            <div className="px-5 py-4 ">
              <Image
                src="/logotype-nucleos.svg"
                width={120}
                height={32}
                alt="Nucleos"
                priority
                className="h-8 w-auto"
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
      {/* Sidebar */}
      <SidebarDesktop {...sidebarProps} />

      {/* Main area */}
      <main className="relative flex-1 min-w-0 overflow-y-auto bg-background">
        {/* Content */}
        <div className="relative z-10 min-h-full">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
