// src/components/layout-auth/authenticated-header.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { createPortal } from "react-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LucideIcon } from "lucide-react";
import {
  Users,
  Star,
  FileText,
  Shield,
  ClipboardList,
  HelpCircle,
  Clipboard,
  Zap,
  BookOpen,
  Heart,
  Wallet,
  Home,
  Compass,
  Calendar,
  CreditCard,
  Mail,
  LayoutDashboard,
  Eclipse,
  LogOut,
  Send,
  User,
  Settings,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/auth";
import { ROUTES } from "@/constants/routes";

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

interface AuthenticatedHeaderProps {
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

export function AuthenticatedHeader({
  onMenuToggle,
  isMobile,
}: AuthenticatedHeaderProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  const plan = user?.subscription?.plan;
  const subscription = user?.subscription;

  const closeMenu = React.useCallback(() => {
    setOpen(false);
  }, []);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header
      className={cn("sticky top-0 z-50 w-full  dark:bg ", {
        " bg dark:bg backdrop-blur-lg": scrolled,
      })}
    >
      <nav className="bg dark:bg mx-auto flex h-16 w-full w-full items-center justify-between px-4 sm:px-6 lg:px-8 bg-primary/5 dark:bg-gray-900">
        <div className="flex items-center gap-6 bg dark:bg">
          <Link
            href={"/"}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            onClick={closeMenu}
          >
            <Image
              src="/icon.svg"
              alt="Nucleos"
              width={32}
              height={32}
              className="size-8"
              priority
            />
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Criar
                </NavigationMenuTrigger>
                <NavigationMenuContent className="">
                  <div className="grid w-[500px] grid-cols-2 gap-2">
                    <ul className="bg-popover space-y-2 rounded-mdshadow">
                      <li>
                        <ListItem
                          title="Novo Nucleo"
                          href={ROUTES.HABITOS("")}
                          description="Acompanhe sua rotina"
                          icon={Heart}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Nova Tarefa"
                          href={ROUTES.TAREFAS("")}
                          description="Organize suas tarefas"
                          icon={Clipboard}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Nova Equipe"
                          href="/calendario"
                          description="Planeje seus eventos"
                          icon={Calendar}
                        />
                      </li>
                    </ul>
                    <ul className="space-y-2 p-3">
                      <li>
                        <NavigationMenuLink
                          href={ROUTES.AJUDA}
                          className="flex p-2 hover:text-primary flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <HelpCircle className="text-foreground size-4" />
                          <span className="font-medium">Tutorial</span>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href={ROUTES.BLOG}
                          className="flex p-2 flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <Send className="text-foreground size-4" />
                          <span className="font-medium">Convidar</span>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Nucleos
                </NavigationMenuTrigger>
                <NavigationMenuContent className="">
                  <ul className="bg-popover grid w-[400px] grid-cols-1 gap-2 rounded-md shadow-lg">
                    <li>
                      <ListItem
                        title="Dashboard"
                        href={ROUTES.DASHBOARD}
                        description="Seu resumo e atividades"
                        icon={LayoutDashboard}
                      />
                    </li>
                    <li>
                      <ListItem
                        title="Nucleos"
                        href={ROUTES.NUCLEOS}
                        description="Gerencie seus Nucleos"
                        icon={Eclipse}
                      />
                    </li>
                    <li>
                      <ListItem
                        title="Explorar"
                        href={ROUTES.EXPLORAR}
                        description="Descubra novos recursos"
                        icon={Compass}
                      />
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Hábitos
                </NavigationMenuTrigger>
                <NavigationMenuContent className="">
                  <div className="grid w-[400px] grid-cols-2 gap-2">
                    <ul className="bg-popover space-y-2 rounded-md shadow">
                      <li>
                        <ListItem
                          title="Sobre"
                          href={ROUTES.SOBRE}
                          description="Nossa história e missão"
                          icon={Users}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Blog"
                          href={ROUTES.BLOG}
                          description="Novidades e conteúdos"
                          icon={Star}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Contato"
                          href={ROUTES.CONTATO}
                          description="Fale com a gente"
                          icon={Mail}
                        />
                      </li>
                    </ul>
                    <ul className="space-y-2 p-3">
                      <li>
                        <NavigationMenuLink
                          href={ROUTES.TERMOS}
                          className="flex p-2 hover:flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <FileText className="text-foreground size-4" />
                          <span className="font-medium">Termos</span>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href={ROUTES.PRIVACIDADE}
                          className="flex p-2 hover: flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <Shield className="text-foreground size-4" />
                          <span className="font-medium">Privacidade</span>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href={ROUTES.AJUDA}
                          className="flex p-2 hover: flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <HelpCircle className="text-foreground size-4" />
                          <span className="font-medium">Ajuda</span>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Tarefas
                </NavigationMenuTrigger>
                <NavigationMenuContent className="">
                  <div className="grid w-[500px] grid-cols-2 gap-2">
                    <ul className="bg-popover space-y-2 rounded-mdshadow">
                      <li>
                        <ListItem
                          title="Hábitos"
                          href={ROUTES.HABITOS("")}
                          description="Acompanhe sua rotina"
                          icon={Heart}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Tarefas"
                          href={ROUTES.TAREFAS("")}
                          description="Organize suas tarefas"
                          icon={Clipboard}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Calendário"
                          href="/calendario"
                          description="Planeje seus eventos"
                          icon={Calendar}
                        />
                      </li>
                    </ul>
                    <ul className="space-y-2 p-3">
                      <li>
                        <NavigationMenuLink
                          href={ROUTES.AJUDA}
                          className="flex p-2 hover:text-primary flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <HelpCircle className="text-foreground size-4" />
                          <span className="font-medium">Central de Ajuda</span>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href={ROUTES.BLOG}
                          className="flex p-2 flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <Zap className="text-foreground size-4" />
                          <span className="font-medium">Blog</span>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Perfil
                </NavigationMenuTrigger>
                <NavigationMenuContent className="">
                  <div className="grid w-[400px] grid-cols-2 gap-2">
                    <ul className="bg-popover space-y-2 rounded-md shadow">
                      <li>
                        <ListItem
                          title="Sobre"
                          href={ROUTES.SOBRE}
                          description="Nossa história e missão"
                          icon={Users}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Blog"
                          href={ROUTES.BLOG}
                          description="Novidades e conteúdos"
                          icon={Star}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Contato"
                          href={ROUTES.CONTATO}
                          description="Fale com a gente"
                          icon={Mail}
                        />
                      </li>
                    </ul>
                    <ul className="space-y-2 p-3">
                      <li>
                        <NavigationMenuLink
                          href={ROUTES.TERMOS}
                          className="flex p-2 hover:flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <FileText className="text-foreground size-4" />
                          <span className="font-medium">Termos</span>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href={ROUTES.PRIVACIDADE}
                          className="flex p-2 hover: flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <Shield className="text-foreground size-4" />
                          <span className="font-medium">Privacidade</span>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href={ROUTES.AJUDA}
                          className="flex p-2 hover: flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <HelpCircle className="text-foreground size-4" />
                          <span className="font-medium">Ajuda</span>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuLink className="px-3" asChild>
                <Link
                  href={ROUTES.PLANOS}
                  className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
                >
                  {/* {user?.subscription?.plan?.name || "Planos"} */}
                  Plano: Pro
                </Link>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop: tema e perfil */}
        <div className="hidden items-center gap-2 md:flex">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                aria-label="Menu do usuário"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                    {user?.fullName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROUTES.DASHBOARD_PROFILE}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={ROUTES.DASHBOARD_SETTINGS}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile: botão hambúrguer */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <MenuToggleIcon open={open} className="size-5" duration={300} />
          </Button>
        </div>
      </nav>

      {/* MobileMenu (já existente, contém todos os links) */}
      <MobileMenu
        open={open}
        onClose={closeMenu}
        className="flex flex-col justify-between gap-4 overflow-y-auto"
      >
        <NavigationMenu className="max-w-full">
          <div className="flex w-full flex-col gap-y-3">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground px-2">
                Menu
              </span>
              <ListItem
                title="Dashboard"
                href={ROUTES.DASHBOARD}
                icon={LayoutDashboard}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Nucleos"
                href={ROUTES.NUCLEOS}
                icon={Eclipse}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Hábitos"
                href={ROUTES.HABITOS("")}
                icon={Heart}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Tarefas"
                href={ROUTES.TAREFAS("")}
                icon={ClipboardList}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Perfil"
                href={ROUTES.DASHBOARD_PROFILE}
                icon={User}
                mobile
                onClick={closeMenu}
              />
              <ListItemTheme mobile onClose={closeMenu} />
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground px-2">
                Recursos
              </span>
              <ListItem
                title="Central de Ajuda"
                href={ROUTES.AJUDA}
                icon={HelpCircle}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Blog"
                href={ROUTES.BLOG}
                icon={Zap}
                mobile
                onClick={closeMenu}
              />
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground px-2">
                Empresa
              </span>
              <ListItem
                title="Sobre"
                href={ROUTES.SOBRE}
                icon={Users}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Contato"
                href={ROUTES.CONTATO}
                icon={Mail}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Termos"
                href={ROUTES.TERMOS}
                icon={FileText}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Privacidade"
                href={ROUTES.PRIVACIDADE}
                icon={Shield}
                mobile
                onClick={closeMenu}
              />
            </div>

            <Link
              href={ROUTES.PLANOS}
              className="flex p-2 hover:bg-accent rounded-md items-center gap-x-2 transition-colors"
              onClick={closeMenu}
            >
              <CreditCard className="size-4" />
              <span className="font-medium">Planos</span>
            </Link>
          </div>
        </NavigationMenu>

        <div className="flex flex-col gap-2 pt-4 ">
          <Button
            variant="outline"
            className="w-full"
            asChild
            onClick={closeMenu}
          >
            <Link href={ROUTES.DASHBOARD_PROFILE}>Meu Perfil</Link>
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </MobileMenu>
    </header>
  );
}

// ========== COMPONENTES AUXILIARES (extraídos do header público) ==========

type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
  onClose: () => void;
};

function MobileMenu({
  open,
  onClose,
  children,
  className,
  ...props
}: MobileMenuProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className={cn(
          "fixed inset-0 bg/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        className={cn(
          "bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg",
          "fixed top-16 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden md:hidden",
          "transition-all duration-300 ease-in-out transform",
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-2 opacity-0 pointer-events-none",
        )}
      >
        <div
          className={cn("size-full p-4 overflow-y-auto", className)}
          {...props}
        >
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
}

function ListItemTheme({
  mobile,
  onClose,
}: {
  mobile?: boolean;
  onClose?: () => void;
}) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  return (
    <NavigationMenuLink
      className="w-full flex flex-row gap-x-2 rounded-sm p-2 transition-colors cursor-pointer hover:bg-accent"
      asChild
    >
      <div onClick={toggleTheme}>
        <div
          className={cn(
            "flex aspect-square items-center justify-center rounded-md shadow-sm",
            mobile ? "size-10" : "size-12 bg-background/40",
          )}
        >
          {theme === "light" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          )}
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="font-medium">
            Tema {theme === "light" ? "Claro" : "Escuro"}
          </span>
          <span className="text-muted-foreground text-xs line-clamp-1">
            Clique para alternar
          </span>
        </div>
      </div>
    </NavigationMenuLink>
  );
}

function ListItem({
  title,
  description,
  icon: Icon,
  className,
  href,
  mobile,
  onClick,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> &
  LinkItem & { mobile?: boolean; onClick?: () => void }) {
  return (
    <NavigationMenuLink
      className={cn(
        "w-full flex flex-row gap-x-2 rounded-sm p-2 transition-colors hover:bg-accent",
        className,
      )}
      {...props}
      asChild
    >
      <Link href={href} onClick={onClick}>
        <div
          className={cn(
            "flex aspect-square items-center justify-center rounded-md shadow-sm",
            mobile ? "size-10" : "size-12 bg-background/40",
          )}
        >
          <Icon
            className={cn("text-foreground", mobile ? "size-4" : "size-5")}
          />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="font-medium">{title}</span>
          {description && (
            <span className="text-muted-foreground text-xs line-clamp-1">
              {description}
            </span>
          )}
        </div>
      </Link>
    </NavigationMenuLink>
  );
}

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);

  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  React.useEffect(() => {
    onScroll();
  }, [onScroll]);

  return scrolled;
}
