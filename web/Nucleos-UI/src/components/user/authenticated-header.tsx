// components/layout/authenticated-header.tsx
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
import { LiquidGlass } from "@/components/ui/liquid-glass";

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
    <div className="sticky top-0 z-50 h-14 w-full box-border bg-background border-b border-border/30">
      <div className="flex h-full items-center px-4 sm:px-6 gap-3">
        {/* Sidebar toggle */}
        <LiquidGlass
          variant="button"
          radius="14px"
          className="flex items-center justify-center w-9 h-9 shrink-0 transition-all duration-200"
          onClick={onToggleSidebar}
          aria-label={
            isSidebarCollapsed
              ? "Expandir barra lateral"
              : "Recolher barra lateral"
          }
        >
          <div className="flex items-center justify-center w-full h-full">
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px]" />
            ) : (
              <PanelLeftClose className="h-[18px] w-[18px]" />
            )}
          </div>
        </LiquidGlass>

        {/* Search */}
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
        <div className="ml-auto inline-flex items-center gap-2 whitespace-nowrap flex-nowrap">
          {/* Notification Bell */}
          <LiquidGlass
            variant="button"
            radius="14px"
            className="flex items-center justify-center w-9 h-9"
          >
            <NotificationBell />
          </LiquidGlass>

          {/* Mode Toggle */}
          <LiquidGlass
            variant="button"
            radius="14px"
            className="flex items-center justify-center w-9 h-9"
          >
            <ModeToggle />
          </LiquidGlass>

          {/* Separator */}
          <span className="h-5 w-px bg-background/[0.08] mx-0.5" />

          {/* User menu */}
          <LiquidGlass
            variant="strong"
            radius="14px"
            className="flex items-center px-1.5 py-0.5"
          >
            <div
              className="relative"
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
            >
              <button
                className="flex items-center gap-1.5 rounded-lg p-1 hover:bg-background/[0.06] transition-colors duration-200"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <Avatar className="h-7 w-7 ring-1 ring-white/[0.15]">
                  <AvatarImage src={user?.avatarUrl || undefined} />
                  <AvatarFallback className="text-[11px] font-semibold bg-background/[0.10] /80">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  animate={{ rotate: menuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <ChevronDown className="h-3 w-3 /50" />
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
                    {/* Dropdown com LiquidGlass */}
                    <LiquidGlass
                      variant="visionOS"
                      radius="16px"
                      className="overflow-hidden border border-white/[0.08]"
                    >
                      {/* User info */}
                      <div className="px-4 py-3.5 border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 ring-1 ring-white/[0.15]">
                            <AvatarImage src={user?.avatarUrl || undefined} />
                            <AvatarFallback className="text-sm font-semibold bg-background/[0.10] /80">
                              {getInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate /90">
                              {user?.fullName || "Usuário"}
                            </p>
                            <p className="text-xs /40 truncate">
                              {user?.email}
                            </p>
                            {planLoading ? (
                              <Skeleton className="h-3.5 w-16 mt-0.5" />
                            ) : getPlanLabel() ? (
                              <span className="inline-block text-[10px] font-medium /70 bg-background/[0.08] px-1.5 py-px rounded-full mt-0.5">
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
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium /60 hover:/90 hover:bg-background/[0.06] transition-colors duration-200"
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      {/* Sign out */}
                      <div className="py-1.5 px-1.5 border-t border-white/[0.06]">
                        <button
                          onClick={() => {
                            logout();
                            setMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/8 transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4 shrink-0" />
                          Sair
                        </button>
                      </div>
                    </LiquidGlass>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </LiquidGlass>
        </div>
      </div>
    </div>
  );
}
