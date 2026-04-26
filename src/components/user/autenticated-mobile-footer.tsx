"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Eclipse,
  Heart,
  Zap,
  User,
  LayoutDashboard,
  HelpCircle,
  FileText,
  Shield,
  Mail,
  Globe,
  Users,
  Star,
  CreditCard,
  ArrowUp,
  Menu,
  X,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AuthenticatedMobileFooterProps {
  className?: string;
}

export function AuthenticatedMobileFooter({
  className,
}: AuthenticatedMobileFooterProps) {
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { icon: Home, label: "Início", href: ROUTES.DASHBOARD },
    { icon: Eclipse, label: "Nucleos", href: ROUTES.NUCLEOS },
    { icon: Heart, label: "Hábitos", href: ROUTES.HABITOS("") },
    { icon: Zap, label: "Tarefas", href: ROUTES.TAREFAS("") },
    { icon: User, label: "Perfil", href: "@/dashboard/profile" },
  ];

  const menuSections = [
    {
      title: "Navegação",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: ROUTES.DASHBOARD },
        { icon: Eclipse, label: "Meus Nucleos", href: ROUTES.NUCLEOS },
        { icon: Heart, label: "Hábitos", href: ROUTES.HABITOS("") },
        { icon: Zap, label: "Tarefas", href: ROUTES.TAREFAS("") },
        { icon: CreditCard, label: "Planos", href: ROUTES.PLANOS },
      ],
    },
    {
      title: "Recursos",
      items: [
        { icon: HelpCircle, label: "Central de Ajuda", href: ROUTES.AJUDA },
        { icon: Star, label: "Blog", href: ROUTES.BLOG },
        { icon: Globe, label: "Explorar", href: ROUTES.EXPLORAR },
        { icon: Users, label: "Sobre Nós", href: ROUTES.SOBRE },
        { icon: Mail, label: "Contato", href: ROUTES.CONTATO },
      ],
    },
    {
      title: "Legal",
      items: [
        { icon: FileText, label: "Termos de Uso", href: ROUTES.TERMOS },
        {
          icon: Shield,
          label: "Política de Privacidade",
          href: ROUTES.PRIVACIDADE,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-background/95 backdrop-blur-lg border-t border-border",
          "shadow-lg",
          className,
        )}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all active:scale-95"
            >
              <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-medium text-muted-foreground">
                {item.label}
              </span>
            </Link>
          ))}

          {/* Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all active:scale-95">
                <Menu className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground">
                  Menu
                </span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>

              <div className="space-y-6 overflow-y-auto h-full pb-20">
                {menuSections.map((section) => (
                  <div key={section.title}>
                    <h4 className="font-semibold mb-3 text-sm text-foreground">
                      {section.title}
                    </h4>
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors active:bg-accent/70"
                        >
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Footer Info */}
                <div className="pt-6 mt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    © {new Date().getFullYear()} Nucleos
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    Todos os direitos reservados
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Scroll to Top Button - Adjusted position for mobile */}
      <Button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-20 right-4 z-50 rounded-full shadow-lg transition-all duration-300",
          "bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:opacity-90",
          "h-10 w-10",
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none",
        )}
        size="icon"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>

      {/* Spacer to prevent content from being hidden under the bottom bar */}
      <div className="h-16" />
    </>
  );
}
