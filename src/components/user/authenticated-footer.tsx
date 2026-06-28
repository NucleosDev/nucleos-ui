"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Globe2,
  MessageCircle,
  Camera,
  Briefcase,
  Code2,
  Heart,
  Mail,
  Globe,
  Shield,
  FileText,
  HelpCircle,
  Zap,
  LayoutDashboard,
  Eclipse,
  Users,
  Star,
  CreditCard,
  ArrowUp,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface AuthenticatedFooterProps {
  className?: string;
}

export function AuthenticatedFooter({ className }: AuthenticatedFooterProps) {
  const [showScrollTop, setShowScrollTop] = React.useState(false);

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

  return (
    <>
      <footer
        className={cn(
          "w-full bg-background border-t border-border/50 shrink-0",
          className,
        )}
      >
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Brand Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/icon.svg"
                  alt="Nucleos"
                  width={64}
                  height={64}
                  className="size-7"
                />
                <span className="font-bold text-lg">Nucleos</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Organize sua vida em Nucleos, acompanhe hábitos, tarefas e
                conquistas em um só lugar.
              </p>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Globe2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MessageCircle className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Camera className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Briefcase className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Code2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Navegação Column */}
            <div>
              <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                Navegação
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    href={ROUTES.DASHBOARD}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-3 w-3" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.NUCLEOS}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Eclipse className="h-3 w-3" />
                    Meus Nucleos
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.HABITOS("")}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Heart className="h-3 w-3" />
                    Hábitos
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.TAREFAS("")}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Zap className="h-3 w-3" />
                    Tarefas
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.PLANOS}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <CreditCard className="h-3 w-3" />
                    Planos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Recursos Column */}
            <div>
              <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                Recursos
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    href={ROUTES.AJUDA}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <HelpCircle className="h-3 w-3" />
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.BLOG}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Star className="h-3 w-3" />
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.EXPLORAR}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Globe className="h-3 w-3" />
                    Explorar
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.SOBRE}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Users className="h-3 w-3" />
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.CONTATO}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Mail className="h-3 w-3" />
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                Legal
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    href={ROUTES.TERMOS}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <FileText className="h-3 w-3" />
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.PRIVACIDADE}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Shield className="h-3 w-3" />
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Nucleos. Todos os direitos
                reservados.
              </p>
              <div className="flex gap-4">
                <Link
                  href={ROUTES.TERMOS}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Termos
                </Link>
                <Link
                  href={ROUTES.PRIVACIDADE}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacidade
                </Link>
                <Link
                  href={ROUTES.AJUDA}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Ajuda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 rounded-full shadow-lg transition-all duration-300 z-50",
          "bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:opacity-90",
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none",
        )}
        size="icon"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </>
  );
}
