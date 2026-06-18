"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, Search, Bell, LogOut } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/auth";
import { useUserPlan } from "@/hooks/useDashboard";
import { ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Settings,
  HelpCircle,
  Zap,
  Users,
  Mail,
  FileText,
  Shield,
  CreditCard,
  LayoutGrid,
  Layers,
  Calendar,
  Trophy,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import { LiquidGlass } from "@/components/ui/liquid-glass";

interface AuthenticatedMobileHeaderProps {
  onMenuToggle?: () => void;
  isOpen?: boolean;
}

const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: LayoutGrid, label: "Nucleos", href: "/dashboard/nucleos" },
  { icon: Layers, label: "Blocos", href: "/dashboard/blocos" },
  { icon: Calendar, label: "Calendário", href: "/dashboard/calendario" },
  { icon: Trophy, label: "Conquistas", href: "/dashboard/conquistas" },
  { icon: BarChart3, label: "Insights", href: "/dashboard/insights" },
];

const accountNavItems = [
  { icon: User, label: "Meu Perfil", href: ROUTES.DASHBOARD_PROFILE },
  { icon: Settings, label: "Configurações", href: ROUTES.DASHBOARD_SETTINGS },
  { icon: CreditCard, label: "Planos", href: ROUTES.PLANOS },
];

const resourceNavItems = [
  { icon: HelpCircle, label: "Central de Ajuda", href: ROUTES.AJUDA },
  { icon: Zap, label: "Blog", href: ROUTES.BLOG },
  { icon: Users, label: "Sobre", href: ROUTES.SOBRE },
  { icon: Mail, label: "Contato", href: ROUTES.CONTATO },
  { icon: FileText, label: "Termos", href: ROUTES.TERMOS },
  { icon: Shield, label: "Privacidade", href: ROUTES.PRIVACIDADE },
];

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
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setSheetOpen(false);
  };

  const handleSheetChange = (open: boolean) => {
    setSheetOpen(open);
    onMenuToggle?.();
  };

  const getInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  };

  const getPlanLabel = () => {
    if (planLoading) return <Skeleton className="h-3 w-12 inline-block" />;
    const name = userPlan?.plan?.name;
    if (!name || name.toLowerCase() === "free") return "Grátis";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname?.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 md:hidden",
        scrolled
          ? "bg-background/90 backdrop-blur-[var(--glass-blur)] border-b border-border/50 shadow-sm"
          : "bg-background/70 backdrop-blur-[var(--glass-blur-sm)] border-b border-border/30",
      )}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/logotype-nucleos.svg" width={96} height={24} alt="Nucleos" className="h-6 w-auto" />
        </Link>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Buscar">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Notificações">
            <Bell className="h-4 w-4" />
          </Button>
          <ModeToggle />

          <Sheet open={sheetOpen} onOpenChange={handleSheetChange}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[280px] p-0 sm:w-[300px] bg-background/60 backdrop-blur-xl border-r border-border/40"
            >
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="px-5 py-4 border-b border-border/40">
                  <Image src="/logotype-nucleos.svg" width={100} height={26} alt="Nucleos" className="h-6 w-auto" />
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto py-3 space-y-1">

                  {/* User profile card */}
                  <div className="px-3 pb-2">
                    <LiquidGlass variant="subtle" radius="14px" interactive={false}>
                      <div className="flex items-center gap-3 px-4 py-3.5">
                        <Avatar className="h-10 w-10 ring-1 ring-border shrink-0">
                          <AvatarImage src={user?.avatarUrl || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-primary text-sm font-bold">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {user?.fullName || "Usuário"}
                          </p>
                          <p className="text-[11px] text-muted-foreground/70 truncate">
                            {user?.email}
                          </p>
                          <span className="inline-block text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-px rounded-full mt-0.5">
                            {getPlanLabel()}
                          </span>
                        </div>
                      </div>
                    </LiquidGlass>
                  </div>

                  {/* Main nav */}
                  <div className="px-3">
                    <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-2 mb-1.5">
                      Principal
                    </p>
                    <nav className="space-y-0.5">
                      {mainNavItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-[var(--duration-fast)]",
                              active
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {item.label}
                            {active && (
                              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary/70" />
                            )}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="mx-3 h-px bg-border/40" />

                  {/* Account nav */}
                  <div className="px-3">
                    <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-2 mb-1.5">
                      Conta
                    </p>
                    <nav className="space-y-0.5">
                      {accountNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-[var(--duration-fast)]"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>

                  <div className="mx-3 h-px bg-border/40" />

                  {/* Resources nav */}
                  <div className="px-3">
                    <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-2 mb-1.5">
                      Recursos
                    </p>
                    <nav className="space-y-0.5">
                      {resourceNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-[var(--duration-fast)]"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Logout */}
                <div className="px-3 py-3 border-t border-border/40">
                  <LiquidGlass variant="subtle" radius="10px" interactive={false}>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/8 transition-colors duration-[var(--duration-fast)] rounded-[10px]"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Sair da conta
                    </button>
                  </LiquidGlass>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
