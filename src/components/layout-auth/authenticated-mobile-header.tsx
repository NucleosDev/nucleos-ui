"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Search, Bell } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/auth";
import { useUserPlan } from "@/hooks/useDashboard";
import { ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Eclipse,
  Heart,
  ClipboardList,
  User,
  Settings,
  HelpCircle,
  Zap,
  Users,
  Mail,
  FileText,
  Shield,
  CreditCard,
  LogOut,
  LayoutGrid,
  Layers,
  Calendar,
  Trophy,
  BarChart3,
} from "lucide-react";
import NucleosLogo from "@/components/nucleo/NucleosLogo";

interface AuthenticatedMobileHeaderProps {
  onMenuToggle?: () => void;
  isOpen?: boolean;
}

export function AuthenticatedMobileHeader({
  onMenuToggle,
  isOpen = false,
}: AuthenticatedMobileHeaderProps) {
  const { user, logout } = useAuth();
  const { data: userPlan, isLoading: planLoading } = useUserPlan();
  const [scrolled, setScrolled] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setSheetOpen(false);
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

  const getPlanDisplay = () => {
    if (planLoading) {
      return <Skeleton className="h-3 w-12" />;
    }
    const planName = userPlan?.plan?.name;
    if (!planName || planName.toLowerCase() === "free") {
      return "Grátis";
    }
    return planName.charAt(0).toUpperCase() + planName.slice(1);
  };

  const handleSheetChange = (open: boolean) => {
    setSheetOpen(open);
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  // Links principais do dashboard
  const mainNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: LayoutGrid, label: "Núcleos", href: "/dashboard/nucleos" },
    { icon: Layers, label: "Blocos", href: "/dashboard/blocos" },
    { icon: Calendar, label: "Calendário", href: "/dashboard/calendario" },
    { icon: Trophy, label: "Conquistas", href: "/dashboard/conquistas" },
    { icon: BarChart3, label: "Insights", href: "/dashboard/insights" },
  ];

  // Links de conta
  const accountNavItems = [
    { icon: User, label: "Meu Perfil", href: ROUTES.DASHBOARD_PROFILE },
    { icon: Settings, label: "Configurações", href: ROUTES.DASHBOARD_SETTINGS },
    { icon: CreditCard, label: "Planos", href: ROUTES.PLANOS },
  ];

  // Links de recursos
  const resourceNavItems = [
    { icon: HelpCircle, label: "Central de Ajuda", href: ROUTES.AJUDA },
    { icon: Zap, label: "Blog", href: ROUTES.BLOG },
    { icon: Users, label: "Sobre", href: ROUTES.SOBRE },
    { icon: Mail, label: "Contato", href: ROUTES.CONTATO },
    { icon: FileText, label: "Termos", href: ROUTES.TERMOS },
    { icon: Shield, label: "Privacidade", href: ROUTES.PRIVACIDADE },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 md:hidden",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-background/80 backdrop-blur-sm border-b border-border/30",
      )}
    >
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <NucleosLogo size="sm" />
        </Link>

        {/* Ações direitas */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            aria-label="Notificações"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <ModeToggle />

          {/* Menu hambúrguer com Sheet */}
          <Sheet open={sheetOpen} onOpenChange={handleSheetChange}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-85 p-0 sm:w-96">
              <div className="flex flex-col h-full">
                {/* Cabeçalho do Sheet */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <NucleosLogo size="sm" />
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSheetOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button> */}
                </div>

                {/* Conteúdo do menu */}
                <div className="flex-1 overflow-y-auto">
                  {/* Perfil do usuário */}
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.avatarUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white text-lg font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-base">
                        {user?.fullName || "Usuário"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          Plano {getPlanDisplay()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Links principais */}
                  <div className="p-4 border-b border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Principal
                    </p>
                    <nav className="space-y-1">
                      {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                              active
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Links da conta */}
                  <div className="p-4 border-b border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Conta
                    </p>
                    <nav className="space-y-1">
                      {accountNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all"
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </nav>
                  </div>

                  {/* Links de recursos */}
                  <div className="p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Recursos
                    </p>
                    <nav className="space-y-1">
                      {resourceNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all"
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Botão Sair */}
                <div className="p-4 border-t border-border">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair da conta
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
