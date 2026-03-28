"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/auth";
import { ROUTES } from "@/constants/routes";
import {
  Menu,
  X,
  Zap,
  Flame,
  ListTodo,
  Heart,
  Calendar,
  Target,
  Sparkles,
  Trophy,
  Eclipse,
} from "lucide-react";

// ========== TIPOS ==========
type CategoryId =
  | "nucleos"
  | "tasks"
  | "habits"
  | "events"
  | "goals"
  | "insights"
  | "achievements";

interface Category {
  id: CategoryId;
  name: string;
  icon: React.ReactNode;
  count: number;
  badge?: string;
  href?: string;
}

// ========== COMPONENTE DA NOVA SIDEBAR ==========
interface DashboardSidebarProps {
  categories: Category[];
  selectedCategoryId: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  userLevel: { level: number; current_xp: number; next_level_xp: number };
  streak: number;
  user: { fullName?: string; email?: string } | null;
  onClose?: () => void;
  onLogout?: () => void;
}

function DashboardSidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
  userLevel,
  streak,
  user,
  onClose,
  onLogout,
}: DashboardSidebarProps) {
  return (
    <aside className="w-60 shrink-0 border-r border-border bg-muted/30 flex flex-col h-full">
      {/* Cabeçalho com informações do usuário e botão fechar */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">
              {user?.fullName || "Meu Workspace"}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-muted-foreground">
                  Nv.{userLevel.level}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-muted-foreground">{streak}d</span>
              </div>
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Lista de categorias */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left group ${
              selectedCategoryId === cat.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={
                  selectedCategoryId === cat.id
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }
              >
                {cat.icon}
              </span>
              <span className="text-sm font-medium">{cat.name}</span>
            </div>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-medium tabular-nums ${
                selectedCategoryId === cat.id
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </nav>

      {/* Barra de progresso de XP */}
      <div className="p-3 border-t border-border">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span className="font-medium">
            XP para nível {userLevel.level + 1}
          </span>
          <span>
            {userLevel.current_xp}/{userLevel.next_level_xp}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{
              width: `${(userLevel.current_xp / userLevel.next_level_xp) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Botão de logout */}
      {onLogout && (
        <div className="p-3 border-t border-border">
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Sair
          </button>
        </div>
      )}
    </aside>
  );
}

// ========== DADOS MOCK (para categorias, nível e streak) ==========
const mockCategories: Category[] = [
  {
    id: "nucleos",
    name: "Nucleos",
    icon: <Eclipse className="w-4 h-4" />,
    count: 3,
    href: "/nucleos",
  },
  {
    id: "tasks",
    name: "Tarefas",
    icon: <ListTodo className="w-4 h-4" />,
    count: 4,
    href: "/tarefas",
  },
  {
    id: "habits",
    name: "Hábitos",
    icon: <Heart className="w-4 h-4" />,
    count: 2,
    href: "/habitos",
  },
  {
    id: "events",
    name: "Eventos",
    icon: <Calendar className="w-4 h-4" />,
    count: 3,
    href: "/calendario",
  },
  {
    id: "goals",
    name: "Metas",
    icon: <Target className="w-4 h-4" />,
    count: 2,
    href: "/metas",
  },
  {
    id: "insights",
    name: "Insights IA",
    icon: <Sparkles className="w-4 h-4" />,
    count: 3,
    href: "#",
  },
  {
    id: "achievements",
    name: "Conquistas",
    icon: <Trophy className="w-4 h-4" />,
    count: 3,
    href: "/conquistas",
  },
];

const mockUserLevel = { level: 5, current_xp: 340, next_level_xp: 500 };
const mockStreak = 12;

// ========== LAYOUT PRINCIPAL ==========
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Estado da sidebar (aberta/fechada)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Estado da categoria selecionada (pode ser usado para navegação interna)
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<CategoryId>("nucleos");

  // Carregar preferência do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null) {
      setIsSidebarOpen(saved === "true");
    }
  }, []);

  // Persistir preferência
  useEffect(() => {
    localStorage.setItem("sidebar-open", String(isSidebarOpen));
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-full">
      {/* Nova sidebar */}
      <div
        className={`
          hidden md:block shrink-0 transition-all duration-300 overflow-hidden
          ${isSidebarOpen ? "w-60" : "w-0"}
        `}
      >
        <DashboardSidebar
          categories={mockCategories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          userLevel={mockUserLevel}
          streak={mockStreak}
          user={user}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      {/* Botão para abrir a sidebar quando fechada */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-4 top-4 z-20 md:flex hidden items-center justify-center w-8 h-8 rounded-md bg-white shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          aria-label="Abrir menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      )}

      <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
