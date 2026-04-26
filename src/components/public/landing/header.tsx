"use client";

import { useEffect, useState } from "react";
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
  HelpCircle,
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

  // Função para fechar o menu
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

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-b", {
        "bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-lg border-border/40":
          scrolled,
        "bg-background border-transparent": !scrolled,
      })}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Desktop - Menu Esquerdo (Tudo exceto botões de ação) */}
        <div className="hidden md:flex md:items-center md:flex-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                  Produto
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1 pr-1.5">
                  <ul className="bg-popover grid w-[400px] grid-cols-1 gap-2 rounded-md border p-2 shadow-lg">
                    <li>
                      <ListItem
                        title="Visão Geral"
                        href="/produto"
                        description="Conheça o Nucleos por completo"
                        icon={Gem}
                      />
                    </li>
                    <li>
                      <ListItem
                        title="Dashboard"
                        href="/painel"
                        description="Visualize seu progresso em tempo real"
                        icon={LayoutDashboard}
                      />
                    </li>
                    <li>
                      <ListItem
                        title="Explorar"
                        href="/explorar"
                        description="Descubra novos recursos e funcionalidades"
                        icon={Compass}
                      />
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                  Recursos
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5">
                  <div className="grid w-[500px] grid-cols-2 gap-2">
                    <ul className="bg-popover space-y-2 rounded-md border p-2 shadow">
                      <li>
                        <ListItem
                          title="Para Estudos"
                          href="/estudos"
                          description="Organize matérias e acompanhe progresso acadêmico"
                          icon={BookOpen}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Para Saúde"
                          href="/saude"
                          description="Metas de exercícios e bem-estar físico"
                          icon={Heart}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Para Finanças"
                          href="/financas"
                          description="Controle orçamento e investimentos"
                          icon={Wallet}
                        />
                      </li>
                    </ul>
                    <ul className="space-y-1 p-2">
                      <li>
                        <NavigationMenuLink
                          href="/explorar"
                          className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <Compass className="text-foreground size-4" />
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              Explorar
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Descubra todas as funcionalidades
                            </span>
                          </div>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href="/blog"
                          className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <Zap className="text-foreground size-4" />
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">Blog</span>
                            <span className="text-xs text-muted-foreground">
                              Dicas, novidades e conteúdos
                            </span>
                          </div>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                  Empresa
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5">
                  <div className="grid w-[400px] grid-cols-2 gap-2">
                    <ul className="bg-popover space-y-2 rounded-md border p-2 shadow">
                      <li>
                        <ListItem
                          title="Sobre Nós"
                          href="/sobre"
                          description="Nossa história, missão e valores"
                          icon={Users}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Blog"
                          href="/blog"
                          description="Novidades, artigos e conteúdos"
                          icon={Star}
                        />
                      </li>
                      <li>
                        <ListItem
                          title="Contato"
                          href="/contato"
                          description="Fale com nossa equipe"
                          icon={Mail}
                        />
                      </li>
                    </ul>
                    <ul className="space-y-1 p-2">
                      <li>
                        <NavigationMenuLink
                          href="/termos"
                          className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <FileText className="text-foreground size-4" />
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              Termos de Uso
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Condições e políticas
                            </span>
                          </div>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href="/privacidade"
                          className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <Shield className="text-foreground size-4" />
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              Privacidade
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Como protegemos seus dados
                            </span>
                          </div>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href="/ajuda"
                          className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2 transition-colors"
                        >
                          <HelpCircle className="text-foreground size-4" />
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              Central de Ajuda
                            </span>
                            <span className="text-xs text-muted-foreground">
                              FAQ e suporte
                            </span>
                          </div>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuLink asChild>
                <Link
                  href="/planos"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                >
                  Planos
                </Link>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Logo Centralizada (Desktop e Mobile) */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link
            href="/"
            className="flex items-center justify-center hover:opacity-80 transition-opacity group"
            onClick={closeMenu}
          >
            <Image
              src="/icon.svg"
              alt="Nucleos"
              width={64}
              height={64}
              className="size-8 transition-transform group-hover:scale-105"
              priority
            />
          </Link>
        </div>

        {/* Desktop - Botões de Ação à Direita */}
        <div className="hidden md:flex md:items-center md:gap-2">
          <ModeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="border-2 border-primary/20 hover:border-primary/40 bg-background/50 backdrop-blur-sm transition-all duration-300"
            asChild
          >
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-gradient-to-r from-foreground to-foreground/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/cadastro">Criar Conta</Link>
          </Button>
        </div>

        {/* Mobile - Layout com Theme Toggle à esquerda, Logo centro, Hamburguer direita */}
        <div className="flex md:hidden items-center justify-between w-full">
          <div className="flex items-center">
            <ModeToggle />
          </div>

          <Link
            href="/"
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            <Image
              src="/icon.svg"
              alt="Nucleos"
              width={64}
              height={64}
              className="size-7"
              priority
            />
          </Link>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            className="w-10 h-10"
          >
            <MenuToggleIcon open={open} className="size-5" duration={300} />
          </Button>
        </div>
      </nav>

      <MobileMenu
        open={open}
        onClose={closeMenu}
        className="flex flex-col justify-between gap-4 overflow-y-auto"
      >
        <NavigationMenu className="max-w-full">
          <div className="flex w-full flex-col gap-y-4">
            {/* Seção Produto */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Produto
              </span>
              <ListItem
                title="Visão Geral"
                href="/produto"
                icon={Gem}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Dashboard"
                href="/painel"
                icon={LayoutDashboard}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Explorar"
                href="/explorar"
                icon={Compass}
                mobile
                onClick={closeMenu}
              />
            </div>

            {/* Seção Recursos */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Recursos
              </span>
              <ListItem
                title="Para Estudos"
                href="/recursos?tipo=estudos"
                icon={BookOpen}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Para Saúde"
                href="/recursos?tipo=saude"
                icon={Heart}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Para Finanças"
                href="/recursos?tipo=financas"
                icon={Wallet}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Blog"
                href="/blog"
                icon={Zap}
                mobile
                onClick={closeMenu}
              />
            </div>

            {/* Seção Empresa */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Empresa
              </span>
              <ListItem
                title="Sobre Nós"
                href="/sobre"
                icon={Users}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Contato"
                href="/contato"
                icon={Mail}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Blog"
                href="/blog"
                icon={Star}
                mobile
                onClick={closeMenu}
              />
            </div>

            {/* Seção Legal */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Legal
              </span>
              <ListItem
                title="Termos de Uso"
                href="/termos"
                icon={FileText}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Privacidade"
                href="/privacidade"
                icon={Shield}
                mobile
                onClick={closeMenu}
              />
              <ListItem
                title="Central de Ajuda"
                href="/ajuda"
                icon={HelpCircle}
                mobile
                onClick={closeMenu}
              />
            </div>

            {/* Planos */}
            <div className="space-y-2 pt-2 border-t">
              <Link
                href="/planos"
                className="flex p-2 hover:bg-accent rounded-md items-center gap-x-2 transition-colors"
                onClick={closeMenu}
              >
                <CreditCard className="size-4" />
                <div className="flex flex-col">
                  <span className="font-medium">Planos e Preços</span>
                  <span className="text-xs text-muted-foreground">
                    Escolha o plano ideal para você
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </NavigationMenu>

        <div className="flex flex-col gap-3 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            asChild
            onClick={closeMenu}
          >
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button
            className="w-full bg-gradient-to-r from-foreground to-foreground/80"
            asChild
            onClick={closeMenu}
          >
            <Link href="/cadastro">Começar Grátis</Link>
          </Button>
        </div>
      </MobileMenu>
    </header>
  );
}

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
      {/* Overlay com fade */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu com slide lateral */}
      <div
        id="mobile-menu"
        className={cn(
          "bg-background/95 supports-[backdrop-filter]:bg-background/95 backdrop-blur-lg",
          "fixed top-16 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-t md:hidden",
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
        "w-full flex flex-row gap-x-2 rounded-md p-2 transition-colors hover:bg-accent",
        className,
      )}
      {...props}
      asChild
    >
      <Link href={href} onClick={onClick}>
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
          <span className="font-medium text-sm">{title}</span>
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
