"use client";

import React from "react";
import Link from "next/link";
import {
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User,
  Settings,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/auth";
import { useUserPlan } from "@/hooks/useDashboard";
import { ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalSearch } from "@/components/ui/global-search";
import { useNucleos } from "@/hooks/useNucleo";
import { useBlocos } from "@/hooks/useBlocos";
import { useColecoes } from "@/hooks/useColecoes";
import { useTimers } from "@/hooks/useTimers";
import { NotificationBell } from "@/components/gamification/NotificationBell";

interface AuthenticatedHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

const USER_MENU = [
  { icon: User, label: "Perfil", href: ROUTES.DASHBOARD_PROFILE },
  { icon: CreditCard, label: "Planos", href: ROUTES.PLANOS },
  { icon: Settings, label: "Configurações", href: ROUTES.DASHBOARD_SETTINGS },
];

export function AuthenticatedHeader({
  onToggleSidebar,
  isSidebarCollapsed = false,
}: AuthenticatedHeaderProps) {
  const { user, logout } = useAuth();
  const { data: userPlan, isLoading: planLoading } = useUserPlan();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const { data: nucleos } = useNucleos();
  const { blocos: blocosData = [] } = useBlocos();
  const { colecoes: colecoesData = [] } = useColecoes();
  const { timers: timersData = [] } = useTimers();

  const recentNucleos = (nucleos || []).slice(0, 5).map((n: any) => ({
    id: n.id,
    nome: n.nome,
    tipo: n.tipo,
  }));

  const getInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getPlanLabel = () => {
    if (planLoading) return null;
    const name = userPlan?.plan?.name?.toLowerCase();
    if (!name || name === "free") return null;
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const openMenu = () => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setMenuOpen(true);
  };
  const closeMenu = () => {
    menuTimeout.current = setTimeout(() => setMenuOpen(false), 180);
  };

  return (
    <header className="sticky top-0 z-40 h-13 bg-background/85 backdrop-blur-[var(--glass-blur-sm)] border-b border-border/40">
      <div className="flex h-full items-center px-4 sm:px-6 gap-3">
        {/* Sidebar toggle */}
        <button
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)]"
          onClick={onToggleSidebar}
          aria-label={
            isSidebarCollapsed
              ? "Expandir barra lateral"
              : "Recolher barra lateral"
          }
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        {/* Search — grows to fill */}
        <div className="flex-1 max-w-sm">
          <GlobalSearch
            recentNucleos={recentNucleos}
            blocos={blocosData}
            colecoes={colecoesData}
            timers={timersData}
            placeholder="Pesquisar..."
            onResultClick={() => {}}
          />
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1.5">
          <NotificationBell />
          <ModeToggle />

          {/* Vertical separator */}
          <span className="h-5 w-px bg-border/60 mx-0.5" />

          {/* Avatar + user menu */}
          <div
            className="relative"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
          >
            <button
              className="flex items-center gap-1.5 rounded-lg p-1 hover:bg-accent transition-colors duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <Avatar className="h-7 w-7 ring-1 ring-border">
                <AvatarImage src={user?.avatarUrl || undefined} />
                <AvatarFallback className="text-[11px] font-semibold bg-primary/10 text-primary">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <motion.div
                animate={{ rotate: menuOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full right-0 mt-2 z-50 w-64"
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenu}
                >
                  <div
                    className="rounded-xl border border-border bg-popover shadow-[var(--shadow-lg)] overflow-hidden"
                    role="menu"
                  >
                    {/* User info */}
                    <div className="px-4 py-3.5 border-b border-border/60">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-1 ring-border">
                          <AvatarImage src={user?.avatarUrl || undefined} />
                          <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate text-foreground">
                            {user?.fullName || "Usuário"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user?.email}
                          </p>
                          {planLoading ? (
                            <Skeleton className="h-3.5 w-16 mt-0.5" />
                          ) : getPlanLabel() ? (
                            <span className="inline-block text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-px rounded-full mt-0.5">
                              {getPlanLabel()}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5 px-1.5">
                      {USER_MENU.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)]"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Sign out */}
                    <div className="py-1.5 px-1.5 border-t border-border/60">
                      <button
                        role="menuitem"
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors duration-[var(--duration-fast)]"
                      >
                        <LogOut className="h-4 w-4 shrink-0" />
                        Sair
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
