"use client";

import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/auth";
import {
  Menu,
  Zap,
  Flame,
  PlusCircle,
  ChevronRight,
  Layers,
  Activity,
  Lightbulb,
  Sparkles,
  LayoutGrid,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ========== DADOS MOCK ==========
const mockUserLevel = { level: 5, current_xp: 340, next_level_xp: 500 };
const mockStreak = 12;

// Links principais
const mainLinks = [
  {
    id: "nucleos",
    label: "Núcleos",
    icon: LayoutGrid,
    href: "/dashboard/nucleos",
    count: 3,
  },
  {
    id: "blocos",
    label: "Blocos",
    icon: Layers,
    href: "/dashboard/blocos",
    count: 6,
  },
  {
    id: "atividades",
    label: "Atividades Recentes",
    icon: Activity,
    href: "/dashboard/atividades",
    count: 8,
  },
];

// Insights mock (exibidos como cards na sidebar)
const mockInsights = [
  {
    id: "1",
    title: "Tarefas pendentes",
    description: "Você tem 4 tarefas para hoje.",
    icon: Calendar,
  },
  {
    id: "2",
    title: "Streak",
    description: "Continue assim! 12 dias de streak.",
    icon: Flame,
  },
  {
    id: "3",
    title: "Sugestão IA",
    description: "Que tal revisar suas metas da semana?",
    icon: Sparkles,
  },
];

// ========== COMPONENTE DA SIDEBAR ==========
interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCreateNucleo: () => void;
  onLogout?: () => void;
  className?: string;
}

function DashboardSidebar({
  collapsed,
  onToggleCollapse,
  onCreateNucleo,
  onLogout,
  className,
}: DashboardSidebarProps) {
  const xpPercent = Math.min(
    (mockUserLevel.current_xp / mockUserLevel.next_level_xp) * 100,
    100,
  );

  // Estado colapsado: barra fina com botão de expandir
  if (collapsed) {
    return (
      <aside
        className={cn(
          "w-3 bg-muted/30 border-r border-border flex flex-col items-center py-4",
          className,
        )}
      >
        <button
          onClick={onToggleCollapse}
          className="w-6 h-6 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
          aria-label="Expandir menu"
        >
          <ChevronRight className="h-4 w-4 text-primary" />
        </button>
      </aside>
    );
  }

  // Estado expandido
  return (
    <aside
      className={cn(
        "w-64 flex flex-col h-full bg-muted/30 border-r border-border",
        className,
      )}
    >
      {/* Cabeçalho do usuário */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-primary">U</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">Meu Workspace</p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-muted-foreground">
                Nv.{mockUserLevel.level}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="text-xs text-muted-foreground">
                {mockStreak}d
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 ml-auto shrink-0"
          onClick={onToggleCollapse}
          aria-label="Recolher menu"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </Button>
      </div>

      {/* Botão Novo Núcleo */}
      <div className="p-3">
        <Button
          className="w-full bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:opacity-90"
          onClick={onCreateNucleo}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Núcleo
        </Button>
      </div>

      {/* Links principais */}
      <nav className="px-2 py-2 space-y-0.5">
        <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Principal
        </p>
        {mainLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.id}
              href={link.href}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </div>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium tabular-nums">
                {link.count}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Seção de Insights (mock) */}
      <div className="px-3 py-3 border-t border-border mt-2">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-semibold">Insights para você</span>
        </div>
        <div className="space-y-3">
          {mockInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div
                key={insight.id}
                className="bg-background/60 rounded-lg p-3 border border-border/50"
              >
                <div className="flex items-start gap-2">
                  <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barra de progresso XP */}
      <div className="p-3 border-t border-border mt-auto">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span className="font-medium">
            XP para nível {mockUserLevel.level + 1}
          </span>
          <span>
            {mockUserLevel.current_xp}/{mockUserLevel.next_level_xp}
          </span>
        </div>
        <Progress value={xpPercent} className="h-1.5" />
      </div>

      {/* Logout */}
      {onLogout && (
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive"
            onClick={onLogout}
          >
            Sair
          </Button>
        </div>
      )}
    </aside>
  );
}

// ========== SIDEBAR MOBILE (Sheet) ==========
function MobileSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="h-full" onClick={() => setOpen(false)}>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ========== LAYOUT PRINCIPAL ==========
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const handleLogout = async () => {
    await logout();
  };

  const handleCreateNucleo = () => {
    setIsCreateModalOpen(true);
  };

  const sidebarContent = (
    <DashboardSidebar
      collapsed={collapsed}
      onToggleCollapse={() => setCollapsed(!collapsed)}
      onCreateNucleo={handleCreateNucleo}
      onLogout={handleLogout}
    />
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Desktop */}
      <div className="hidden md:block h-full shrink-0">{sidebarContent}</div>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-auto relative">
        {/* Header móvel */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm md:hidden">
          <MobileSidebar>{sidebarContent}</MobileSidebar>
          <h1 className="text-lg font-semibold">Nucleos</h1>
          <div className="w-8" />
        </div>

        {/* Área de conteúdo */}
        <div className="p-4 md:p-8">{children}</div>
      </main>

      {/* Modal de criação de núcleo (substitua pelo seu componente) */}
      {/* <CreateNucleoModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} /> */}
    </div>
  );
}
