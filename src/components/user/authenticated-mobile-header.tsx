"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, Search, Bell, LogOut } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/auth";
import { useUserPlan } from "@/hooks/useDashboard";
import { ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, User, Settings, CreditCard,
  HelpCircle, Zap, Users, Mail, FileText, Shield,
  LayoutGrid, Layers, Calendar, Trophy, BarChart3,
} from "lucide-react";
import NucleosLogo from "@/components/nucleo/NucleosLogo";

interface AuthenticatedMobileHeaderProps {
  onMenuToggle?: () => void;
  isOpen?: boolean;
}

const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)]";

export function AuthenticatedMobileHeader({
  onMenuToggle,
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

  const handleLogout = async () => { await logout(); setSheetOpen(false); };

  const getInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  };

  const getPlanLabel = () => {
    const name = userPlan?.plan?.name;
    if (!name || name.toLowerCase() === "free") return "Grátis";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname?.startsWith(href);

  const mainNavItems = [
    { icon: LayoutDashboard, label: "Dashboard",   href: "/dashboard"              },
    { icon: LayoutGrid,      label: "Núcleos",     href: "/dashboard/nucleos"      },
    { icon: Calendar,        label: "Calendário",  href: "/dashboard/calendario"   },
    { icon: Trophy,          label: "Conquistas",  href: "/dashboard/conquistas"   },
    { icon: BarChart3,       label: "Insights",    href: "/dashboard/insights"     },
  ];

  const accountNavItems = [
    { icon: User,       label: "Meu Perfil",      href: ROUTES.DASHBOARD_PROFILE  },
    { icon: Settings,   label: "Configurações",   href: ROUTES.DASHBOARD_SETTINGS },
    { icon: CreditCard, label: "Planos",           href: ROUTES.PLANOS             },
  ];

  const resourceNavItems = [
    { icon: HelpCircle, label: "Ajuda",       href: ROUTES.AJUDA       },
    { icon: Zap,        label: "Blog",        href: ROUTES.BLOG        },
    { icon: Users,      label: "Sobre",       href: ROUTES.SOBRE       },
    { icon: Mail,       label: "Contato",     href: ROUTES.CONTATO     },
    { icon: FileText,   label: "Termos",      href: ROUTES.TERMOS      },
    { icon: Shield,     label: "Privacidade", href: ROUTES.PRIVACIDADE },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-[var(--duration-base)] md:hidden",
        scrolled
          ? "bg-background/92 backdrop-blur-[var(--glass-blur)] border-b border-border/50 shadow-[var(--shadow-xs)]"
          : "bg-background/75 backdrop-blur-[var(--glass-blur-sm)] border-b border-border/30",
      )}
    >
      <div className="flex items-center justify-between px-4 h-12">
        <Link href="/dashboard">
          <NucleosLogo size="sm" />
        </Link>

        <div className="flex items-center gap-0.5">
          <button className={iconBtn} aria-label="Buscar">
            <Search className="h-4 w-4" />
          </button>
          <button className={iconBtn} aria-label="Notificações">
            <Bell className="h-4 w-4" />
          </button>
          <ModeToggle />

          <Sheet open={sheetOpen} onOpenChange={(open) => { setSheetOpen(open); onMenuToggle?.(); }}>
            <SheetTrigger asChild>
              <button className={iconBtn} aria-label="Menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-r border-border/40">
              <div className="flex flex-col h-full">

                {/* User profile */}
                <div className="px-4 pt-5 pb-4 border-b border-border/40">
                  <NucleosLogo size="sm" />
                  <div className="flex items-center gap-3 mt-4">
                    <Avatar className="h-10 w-10 ring-1 ring-border">
                      <AvatarImage src={user?.avatarUrl || undefined} />
                      <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.fullName || "Usuário"}
                      </p>
                      <p className="text-xs text-muted-foreground/60 truncate">{user?.email}</p>
                      {planLoading ? (
                        <Skeleton className="h-3 w-12 mt-1" />
                      ) : (
                        <span className="inline-block text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-px rounded-full mt-0.5">
                          {getPlanLabel()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Scrollable nav */}
                <div className="flex-1 overflow-y-auto py-3">
                  {/* Main nav */}
                  <div className="px-2 space-y-0.5">
                    {mainNavItems.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSheetOpen(false)}
                          className={cn("nav-item", active && "active")}
                        >
                          <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                          <span>{item.label}</span>
                          {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary/70" />}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mx-3 my-3 h-px bg-border/40" />

                  {/* Account nav */}
                  <div className="px-2 space-y-0.5">
                    <p className="px-2.5 mb-1 text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                      Conta
                    </p>
                    {accountNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSheetOpen(false)}
                        className="nav-item"
                      >
                        <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="mx-3 my-3 h-px bg-border/40" />

                  {/* Resources */}
                  <div className="px-2 space-y-0.5">
                    <p className="px-2.5 mb-1 text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                      Recursos
                    </p>
                    {resourceNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSheetOpen(false)}
                        className="nav-item"
                      >
                        <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Sign out */}
                <div className="p-3 border-t border-border/40">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors duration-[var(--duration-fast)]"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Sair da conta
                  </button>
                </div>

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
