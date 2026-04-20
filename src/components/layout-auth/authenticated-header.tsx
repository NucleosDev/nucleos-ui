// src/components/layout-auth/authenticated-header.tsx
"use client";
// import { useUser } from "@/hooks/useUser";
// const { user } = useUser();
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
  Heart,
  CreditCard,
  Mail,
  LayoutDashboard,
  Eclipse,
  LogOut,
  User,
  Settings,
  Compass,
  Calendar,
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
import { useUserPlan } from "@/hooks/useDashboard";
import { ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { data: userPlan, isLoading: planLoading } = useUserPlan();
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

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

  // Determinar o nome do plano para exibição
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

  // Determinar a classe CSS baseada no plano
  const getPlanClassName = () => {
    if (planLoading) {
      return "";
    }

    const planName = userPlan?.plan?.name?.toLowerCase();

    if (planName === "pro" || planName === "premium") {
      return "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient font-semibold";
    }

    if (planName === "enterprise" || planName === "business") {
      return "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient font-semibold";
    }

    return "bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border/50"
          : "bg-transparent",
      )}
    >
      <nav className="relative mx-auto grid h-16 w-[95%] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        {/* ========== COLUNA ESQUERDA ========== */}
        <div className="flex justify-start items-center gap-2">
          {/* Mobile: Botão de tema */}
          <div className="flex md:hidden">
            <ModeToggle />
          </div>

          {/* Desktop: Links de navegação principais */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Criar
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[500px] grid-cols-2 gap-2 p-2">
                    <ul className="space-y-2">
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
                          title="Novo Hábito"
                          href="/habitos/novo"
                          description="Crie novos hábitos"
                          icon={Zap}
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
                <NavigationMenuContent>
                  <ul className="grid w-[400px] grid-cols-1 gap-2 p-2">
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
                        title="Meus Nucleos"
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
                  Recursos
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] grid-cols-2 gap-2 p-2">
                    <ul className="space-y-2">
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
                          className="flex p-2 hover:flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <Shield className="text-foreground size-4" />
                          <span className="font-medium">Privacidade</span>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href={ROUTES.AJUDA}
                          className="flex p-2 hover:flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <HelpCircle className="text-foreground size-4" />
                          <span className="font-medium">Ajuda</span>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* ========== COLUNA CENTRAL (Logo sempre ao meio) ========== */}
        <Link
          href={"/"}
          className="flex items-center justify-center transition-opacity hover:opacity-80"
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

        {/* ========== COLUNA DIREITA ========== */}
        <div className="flex items-center justify-end gap-2">
          {/* Desktop: Links secundários + Tema + Perfil */}
          <div className="hidden md:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    Perfil
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] grid-cols-2 gap-2 p-2">
                      <ul className="space-y-2">
                        <li>
                          <ListItem
                            title="Meu Perfil"
                            href={ROUTES.DASHBOARD_PROFILE}
                            description="Suas informações pessoais"
                            icon={User}
                          />
                        </li>
                        <li>
                          <ListItem
                            title="Configurações"
                            href={ROUTES.DASHBOARD_SETTINGS}
                            description="Preferências do sistema"
                            icon={Settings}
                          />
                        </li>
                        <li>
                          <ListItem
                            title="Planos"
                            href={ROUTES.PLANOS}
                            description="Gerencie sua assinatura"
                            icon={CreditCard}
                          />
                        </li>
                      </ul>
                      <ul className="space-y-2 p-3">
                        <li>
                          <NavigationMenuLink
                            href={ROUTES.AJUDA}
                            className="flex p-2 hover:flex-row rounded-md items-center gap-x-2 transition-colors"
                          >
                            <HelpCircle className="text-foreground size-4" />
                            <span className="font-medium">
                              Central de Ajuda
                            </span>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink
                            href={ROUTES.BLOG}
                            className="flex p-2 flex-row rounded-md items-center gap-x-2 transition-colors"
                          >
                            <Zap className="text-foreground size-4" />
                            <span className="font-medium">Dicas Rápidas</span>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuLink className="px-3" asChild>
                  <Link href={ROUTES.PLANOS} className={getPlanClassName()}>
                    {getPlanDisplay()}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuList>
            </NavigationMenu>

            <ModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  aria-label="Menu do usuário"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white text-sm font-medium">
                      {user?.fullName?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56">
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
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.PLANOS}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Planos</span>
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

          {/* Mobile: Botão hambúrguer */}
          <div className="flex md:hidden">
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
        </div>
      </nav>

      {/* Menu Mobile (Portal) */}
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
              <span className="font-medium">
                {planLoading
                  ? "Carregando..."
                  : userPlan?.plan?.name || "Grátis"}
              </span>
            </Link>
          </div>
        </NavigationMenu>

        <div className="flex flex-col gap-2 pt-4">
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

// ========== COMPONENTES AUXILIARES ==========

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
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
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

// Ícone Send (caso não esteja disponível no pacote lucide-react)
function Send(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
