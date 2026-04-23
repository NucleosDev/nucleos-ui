"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  LucideIcon,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  Mail,
  CreditCard,
  LayoutDashboard,
  Eclipse,
  LogOut,
  User,
  Settings,
  Compass,
  Calendar,
  Trophy,
  Bell,
  Award,
  History,
  Key,
  Globe,
  BookOpen,
  FolderTree,
  Layers,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/auth";
import { useUserPlan } from "@/hooks/useDashboard";
import { ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSearch } from "@/components/ui/global-search";
import { useNucleos } from "@/hooks/useNucleo";
import { useBlocos } from "@/hooks/useBlocos";
import { useColecoes } from "@/hooks/useColecoes";
import { useTimers } from "@/hooks/useTimers";
import NucleosLogo from "@/components/nucleo/NucleosLogo";

interface AuthenticatedHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export function AuthenticatedHeader({
  onToggleSidebar,
  isSidebarCollapsed = false,
}: AuthenticatedHeaderProps) {
  const { user, logout } = useAuth();
  const { data: userPlan, isLoading: planLoading } = useUserPlan();
  const scrolled = useScroll(10);
  const [isAvatarHovered, setIsAvatarHovered] = React.useState(false);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const { data: nucleos } = useNucleos();
  const { blocos: blocosData = [] } = useBlocos();
  const { colecoes: colecoesData = [] } = useColecoes();
  const { timers: timersData = [] } = useTimers();

  const recentNucleos = (nucleos || []).slice(0, 5).map((nucleo) => ({
    id: nucleo.id,
    nome: nucleo.nome,
    tipo: nucleo.tipo,
  }));

  const handleLogout = async () => {
    await logout();
  };

  const getPlanDisplay = () => {
    if (planLoading) {
      return <Skeleton className="h-4 w-16" />;
    }
    const planName = userPlan?.plan?.name;
    if (!planName || planName.toLowerCase() === "free") {
      return "Plano Grátis";
    }
    const formattedName = planName.charAt(0).toUpperCase() + planName.slice(1);
    return `Plano: ${formattedName}`;
  };

  const getPlanClassName = () => {
    if (planLoading) return "";
    const planName = userPlan?.plan?.name?.toLowerCase();
    if (planName === "pro" || planName === "premium") {
      return "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient font-semibold";
    }
    if (planName === "enterprise" || planName === "business") {
      return "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient font-semibold";
    }
    return "bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient";
  };

  const getInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const profileMenuItems = [
    {
      icon: User,
      label: "Meu Perfil",
      href: ROUTES.DASHBOARD_PROFILE,
      color: "text-blue-500",
    },
    {
      icon: Settings,
      label: "Configurações",
      href: ROUTES.DASHBOARD_SETTINGS,
      color: "text-gray-500",
    },
    {
      icon: CreditCard,
      label: "Planos",
      href: ROUTES.PLANOS,
      color: "text-purple-500",
    },
    {
      icon: Bell,
      label: "Notificações",
      href: ROUTES.DASHBOARD_NOTIFICATIONS,
      color: "text-yellow-500",
    },
    {
      icon: Calendar,
      label: "Calendário",
      href: "/dashboard/calendario",
      color: "text-green-500",
    },
    {
      icon: Trophy,
      label: "Conquistas",
      href: "/dashboard/conquistas",
      color: "text-amber-500",
    },
    {
      icon: Award,
      label: "XP e Níveis",
      href: "/gamificacao",
      color: "text-indigo-500",
    },
    {
      icon: History,
      label: "Histórico",
      href: "/dashboard/atividades",
      color: "text-slate-500",
    },
  ];

  const accountMenuItems = [
    {
      icon: Key,
      label: "Segurança",
      href: "/dashboard/seguranca",
      color: "text-red-500",
    },
    {
      icon: Globe,
      label: "Idioma",
      href: "/dashboard/idioma",
      color: "text-teal-500",
    },
  ];

  const handleAvatarMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsAvatarHovered(true);
  };

  const handleAvatarMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsAvatarHovered(false), 200);
  };

  const handleMenuMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsAvatarHovered(true);
  };

  const handleMenuMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsAvatarHovered(false), 200);
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border/30">
      <nav className="relative mx-auto grid h-14 w-full grid-cols-[1fr_auto_1fr] items-center px-6 sm:px-8 lg:px-10">
        {/* Lado esquerdo: Botão de toggle e informações */}
        <div className="flex justify-start items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-accent/50 transition-all duration-200"
            onClick={onToggleSidebar}
            aria-label={
              isSidebarCollapsed ? "Abrir menu lateral" : "Fechar menu lateral"
            }
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>

          {/* <Link href={ROUTES.PLANOS} className={cn("ml-2", getPlanClassName())}>
            {getPlanDisplay()}
          </Link> */}

          <div className="w-full max-w-md">
            <GlobalSearch
              recentNucleos={recentNucleos}
              blocos={blocosData}
              colecoes={colecoesData}
              timers={timersData}
              placeholder="Procurar..."
              onResultClick={() => {
                console.log("Resultado clicado");
              }}
            />
          </div>
        </div>

        {/* Centro: Busca global */}
        <div className="flex items-center justify-center"></div>

        {/* Lado direito: Ícones e avatar */}
        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-accent/50"
                >
                  <Mail className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-0">
                <div className="p-4 text-center">
                  <Mail className="h-8 w-8 mx-auto text-muted-foreground mb-2 opacity-50" />
                  <p className="text-sm font-medium">Nenhuma mensagem</p>
                  <p className="text-xs text-muted-foreground mt-1">Em breve</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-accent/50"
                >
                  <Bell className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-0">
                <div className="p-4 text-center">
                  <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2 opacity-50" />
                  <p className="text-sm font-medium">Nenhuma notificação</p>
                  <p className="text-xs text-muted-foreground mt-1">Em breve</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Barra vertical */}
          <div className="h-7 w-px bg-border/70 mx-1" />
          <ModeToggle />

          {/* Avatar com hover menu */}
          <div className="relative">
            <div
              onMouseEnter={handleAvatarMouseEnter}
              onMouseLeave={handleAvatarMouseLeave}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <div className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 ring-2 ring-primary/20 transition-all duration-300 hover:ring-primary/40">
                    <AvatarImage src={user?.avatarUrl || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white text-sm font-medium">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <motion.div
                  animate={{ rotate: isAvatarHovered ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </div>
            </div>

            <AnimatePresence>
              {isAvatarHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 z-50"
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                >
                  <div className="w-80 bg-popover rounded-lg border border-border shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                      <div>
                        <p className="font-semibold text-base">
                          Olá! {user?.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {getPlanDisplay()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 max-h-96 overflow-y-auto">
                      <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Minha Conta
                      </p>
                      {profileMenuItems.map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsAvatarHovered(false)}
                            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-all duration-200 group"
                          >
                            <item.icon className={cn("h-4 w-4", item.color)} />
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </Link>
                        </motion.div>
                      ))}

                      <div className="h-px bg-border my-2 mx-2" />

                      <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Configurações
                      </p>
                      {accountMenuItems.map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.02 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsAvatarHovered(false)}
                            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-all duration-200 group"
                          >
                            <item.icon className={cn("h-4 w-4", item.color)} />
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </Link>
                        </motion.div>
                      ))}

                      <div className="h-px bg-border my-2 mx-2" />

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsAvatarHovered(false);
                          }}
                          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all duration-200 group"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Sair da conta
                          </span>
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
}

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);
  const onScroll = React.useCallback(
    () => setScrolled(window.scrollY > threshold),
    [threshold],
  );
  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  React.useEffect(() => onScroll(), [onScroll]);
  return scrolled;
}
