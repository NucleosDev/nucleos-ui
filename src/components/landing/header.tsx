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
  LayersIcon,
  Users,
  Star,
  FileText,
  Shield,
  HelpCircle,
  Sparkles,
  Rocket,
  Zap,
  BookOpen,
  Heart,
  Wallet,
  Home,
  Compass,
  CreditCard,
  Mail,
  LayoutDashboard,
  Gem,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

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

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-b border-transparent", {
        "bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg":
          scrolled,
      })}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-10 transition-opacity"
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
                  Produto
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1 pr-1.5">
                  <ul className="bg-popover grid w-[400px] grid-cols-1 gap-2 rounded-md border p-2 shadow-lg">
                    <li>
                      <ListItem
                        title="Produto"
                        href="/produto"
                        description="Conheça o Nucleos por completo"
                        icon={Gem}
                      />
                    </li>
                    <li>
                      <ListItem
                        title="Dashboard"
                        href="/dashboard"
                        description="Visualize seu progresso"
                        icon={LayoutDashboard}
                      />
                    </li>
                    <li>
                      <ListItem
                        title="Explorar"
                        href="/explorar"
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
                <NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5">
                  <div className="grid w-[500px] grid-cols-2 gap-2">
                    <ul className="bg-popover space-y-2 rounded-md border p-2 shadow">
                      <li>
                        <ListItem
                          title="Para Estudos"
                          href="/recursos"
                          description="Organize matérias e acompanhe progresso"
                          icon={BookOpen}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Para Saúde"
                          href="/recursos"
                          description="Metas de exercícios e bem-estar"
                          icon={Heart}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Para Finanças"
                          href="/recursos"
                          description="Controle orçamento e investimentos"
                          icon={Wallet}
                        />
                      </li>
                    </ul>
                    <ul className="space-y-2 p-3">
                      <li>
                        <NavigationMenuLink
                          href="/explorar"
                          className="flex p-2 hover:text-primary flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <Compass className="text-foreground size-4" />
                          <span className="font-medium">Explorar</span>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href="/blog"
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
                  Empresa
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5">
                  <div className="grid w-[400px] grid-cols-2 gap-2">
                    <ul className="bg-popover space-y-2 rounded-md border p-2 shadow">
                      <li>
                        <ListItem
                          title="Sobre"
                          href="/sobre"
                          description="Nossa história e missão"
                          icon={Users}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Blog"
                          href="/blog"
                          description="Novidades e conteúdos"
                          icon={Star}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Contato"
                          href="/contato"
                          description="Fale com a gente"
                          icon={Mail}
                        />
                      </li>
                    </ul>
                    <ul className="space-y-2 p-3">
                      <li>
                        <NavigationMenuLink
                          href="/termos"
                          className="flex p-2 hover:flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <FileText className="text-foreground size-4" />
                          <span className="font-medium">Termos</span>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href="/privacidade"
                          className="flex p-2 hover: flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <Shield className="text-foreground size-4" />
                          <span className="font-medium">Privacidade</span>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href="/ajuda"
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
                  href="/planos"
                  className="hover: rounded-md p-2 transition-colors"
                >
                  Planos
                </Link>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ModeToggle />
          <Button
            variant="ghost"
            className="w-full sm:w-auto group border-2 border-primary/30 bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-background/60 hover:border-primary/30"
            asChild
          >
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto group relative overflow-hidden bg-foreground text-primary-foreground shadow-lg shadow-foreground/25 hover:shadow-xl transition-all duration-300 hover:bg-foreground hover:text-primary"
          >
            <Link href="/cadastro">
              Criar Conta
              {/* <ArrowRight className="w-3 h-3 w-translate-x-2 opacity-1 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100" /> */}
            </Link>
          </Button>
        </div>

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

      <MobileMenu
        open={open}
        className="flex flex-col justify-between gap-4 overflow-y-auto"
      >
        <div className="flex items-center gap-2">
          <ModeToggle /> {/* ← ModeToggle agora à esquerda */}
          <span className="text-sm font-medium text-muted-foreground">
            Tema
          </span>
        </div>

        <NavigationMenu className="max-w-full">
          <div className="flex w-full flex-col gap-y-3">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground px-2">
                Produto
              </span>
              <ListItem title="Produto" href="/produto" icon={Gem} mobile />
              <ListItem
                title="Demonstração"
                href="/painel"
                icon={LayoutDashboard}
                mobile
              />
              <ListItem
                title="Explorar"
                href="/explorar"
                icon={Compass}
                mobile
              />
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground px-2">
                Recursos
              </span>
              <ListItem
                title="Para Estudos"
                href="/recursos"
                icon={BookOpen}
                mobile
              />
              <ListItem
                title="Para Saúde"
                href="/recursos"
                icon={Heart}
                mobile
              />
              <ListItem
                title="Para Finanças"
                href="/recursos"
                icon={Wallet}
                mobile
              />
              <ListItem
                title="Explorar"
                href="/explorar"
                icon={Compass}
                mobile
              />
              <ListItem title="Blog" href="/blog" icon={Zap} mobile />
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground px-2">
                Empresa
              </span>
              <ListItem title="Sobre" href="/sobre" icon={Users} mobile />
              <ListItem title="Blog" href="/blog" icon={Star} mobile />
              <ListItem title="Contatos" href="/contato" icon={Mail} mobile />
              <ListItem title="Termos" href="/termos" icon={FileText} mobile />
              <ListItem
                title="Privacidade"
                href="/privacidade"
                icon={Shield}
                mobile
              />
              <ListItem title="Ajuda" href="/ajuda" icon={HelpCircle} mobile />
            </div>

            <Link
              href="/planos"
              className="flex p-2 hover: rounded-md items-center gap-x-2 transition-colors"
            >
              <CreditCard className="size-4" />
              <span className="font-medium">Planos</span>
            </Link>
          </div>
        </NavigationMenu>

        <div className="flex flex-col gap-2 pt-4 border-t">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button className="w-full" asChild>
            <Link href="/cadastro">Começar grátis</Link>
          </Button>
        </div>
      </MobileMenu>
    </header>
  );
}

type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg",
        "fixed top-16 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden",
      )}
    >
      <div
        data-slot={open ? "open" : "closed"}
        className={cn(
          "data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out",
          "size-full p-4 overflow-y-auto",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
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
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> &
  LinkItem & { mobile?: boolean }) {
  return (
    <NavigationMenuLink
      className={cn(
        "w-full flex flex-row gap-x-2 data-[active=true]:focus: data-[active=true]:hover: data-[active=true]:/50 data-[active=true]:text-accent-foreground hover: hover:text-accent focus: focus:text-accent-foreground rounded-sm p-2 transition-colors",
        className,
      )}
      {...props}
      asChild
    >
      <Link href={href}>
        <div
          className={cn(
            "flex aspect-square items-center justify-center rounded-md border shadow-sm",
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
