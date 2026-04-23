"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  LayoutGrid,
  Layers,
  CheckSquare,
  List,
  Heart,
  Timer as TimerIcon,
  Calendar,
  Database,
  Zap,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  Trophy,
  LineChart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import type { Nucleo } from "@/types/nucleo";
import type { Bloco } from "@/types/bloco";
import type { Colecao } from "@/types/colecao";
import type { Timer } from "@/types/timer";

interface SearchResult {
  type:
    | "Nucleo"
    | "bloco"
    | "coleção"
    | "tarefa"
    | "lista"
    | "hábito"
    | "timer"
    | "evento"
    | "página";
  title: string;
  url: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

interface GlobalSearchProps {
  recentNucleos?: Array<{
    id: string;
    nome: string;
    tipo?: string;
  }>;
  blocos?: Bloco[];
  colecoes?: Colecao[];
  timers?: Timer[];
  onResultClick?: () => void;
  placeholder?: string;
  className?: string;
}

// Mapeamento de ícones por tipo
const getTypeIcon = (type: SearchResult["type"]) => {
  switch (type) {
    case "Nucleo":
      return <LayoutGrid className="w-4 h-4" />;
    case "bloco":
      return <Layers className="w-4 h-4" />;
    case "coleção":
      return <Database className="w-4 h-4" />;
    case "tarefa":
      return <CheckSquare className="w-4 h-4" />;
    case "lista":
      return <List className="w-4 h-4" />;
    case "hábito":
      return <Heart className="w-4 h-4" />;
    case "timer":
      return <TimerIcon className="w-4 h-4" />;
    case "evento":
      return <Calendar className="w-4 h-4" />;
    default:
      return <Zap className="w-4 h-4" />;
  }
};

export function GlobalSearch({
  recentNucleos = [],
  blocos = [],
  colecoes = [],
  timers = [],
  onResultClick,
  placeholder = "Buscar...",
  className = "",
}: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Páginas fixas do sistema
  const paginasFixas = [
    {
      title: "Dashboard",
      url: ROUTES.DASHBOARD,
      subtitle: "Visão geral",
      type: "página" as const,
    },
    {
      title: "Meus Nucleos",
      url: ROUTES.NUCLEOS,
      subtitle: "Gerenciar Nucleos",
      type: "página" as const,
    },
    {
      title: "Meu Perfil",
      url: ROUTES.DASHBOARD_PROFILE,
      subtitle: "Informações pessoais",
      type: "página" as const,
    },
    {
      title: "Configurações",
      url: ROUTES.DASHBOARD_SETTINGS,
      subtitle: "Preferências do sistema",
      type: "página" as const,
    },
    {
      title: "Planos",
      url: ROUTES.PLANOS,
      subtitle: "Assinatura e planos",
      type: "página" as const,
    },
    {
      title: "Notificações",
      url: ROUTES.DASHBOARD_NOTIFICATIONS,
      subtitle: "Central de notificações",
      type: "página" as const,
    },
    {
      title: "Ajuda",
      url: ROUTES.AJUDA,
      subtitle: "Central de ajuda",
      type: "página" as const,
    },
    {
      title: "Conquistas",
      url: "/dashboard/conquistas",
      subtitle: "Suas conquistas e badges",
      type: "página" as const,
    },
    {
      title: "Calendário",
      url: "/dashboard/calendario",
      subtitle: "Eventos e compromissos",
      type: "página" as const,
    },
    {
      title: "Insights",
      url: "/dashboard/insights",
      subtitle: "Análises e métricas",
      type: "página" as const,
    },
    {
      title: "Gamificação",
      url: "/gamificacao",
      subtitle: "XP, níveis e recompensas",
      type: "página" as const,
    },
  ];

  // Função principal de busca
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    // 1. Buscar em Nucleos
    const nucleosMatch = recentNucleos
      .filter((n) => n.nome.toLowerCase().includes(searchTerm))
      .slice(0, 3)
      .map((n) => ({
        type: "Nucleo" as const,
        title: n.nome,
        url: `/dashboard/nucleos/${n.id}`,
        subtitle: n.tipo || "Nucleo",
        icon: getTypeIcon("Nucleo"),
      }));
    searchResults.push(...nucleosMatch);

    // 2. Buscar em BLOCOS
    const blocosMatch = blocos
      .filter((b) => b.titulo?.toLowerCase().includes(searchTerm))
      .slice(0, 2)
      .map((b) => ({
        type: "bloco" as const,
        title: b.titulo || `Bloco ${b.tipo}`,
        url: `/dashboard/nucleos/${b.nucleoId}/blocos/${b.id}`,
        subtitle: `Bloco de ${b.tipo}`,
        icon: getTypeIcon("bloco"),
      }));
    searchResults.push(...blocosMatch);

    // 3. Buscar em COLEÇÕES
    const colecoesMatch = colecoes
      .filter((c) => c.nome.toLowerCase().includes(searchTerm))
      .slice(0, 2)
      .map((c) => ({
        type: "coleção" as const,
        title: c.nome,
        url: `/colecoes/${c.id}`,
        subtitle: "Coleção de dados",
        icon: getTypeIcon("coleção"),
      }));
    searchResults.push(...colecoesMatch);

    // 4. Buscar em TIMERS
    const timersMatch = timers
      .filter((t) => t.titulo?.toLowerCase().includes(searchTerm))
      .slice(0, 2)
      .map((t) => ({
        type: "timer" as const,
        title: t.titulo || "Timer",
        url: `/timers/${t.id}`,
        subtitle: "Timer de produtividade",
        icon: getTypeIcon("timer"),
      }));
    searchResults.push(...timersMatch);

    // 5. Buscar em PÁGINAS FIXAS
    const paginasMatch = paginasFixas
      .filter((p) => p.title.toLowerCase().includes(searchTerm))
      .slice(0, 3)
      .map((p) => ({
        type: p.type,
        title: p.title,
        url: p.url,
        subtitle: p.subtitle,
        icon: getTypeIcon(p.type),
      }));
    searchResults.push(...paginasMatch);

    // Limitar a 8 resultados no total para não sobrecarregar
    setResults(searchResults.slice(0, 8));
  };

  // Atualizar resultados quando o query mudar
  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery, recentNucleos, blocos, colecoes, timers]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fechar dropdown ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleResultClick = (url: string) => {
    router.push(url);
    setSearchQuery("");
    setShowDropdown(false);
    onResultClick?.();
  };

  const handleClear = () => {
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full px-3 py-1 rounded-md bg-background/50 border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary text-sm pr-9"
          autoComplete="off"
        />

        {/* Ícone dinâmico: Lupa ou X */}
        <button
          onClick={searchQuery ? handleClear : undefined}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={searchQuery ? "Limpar busca" : "Buscar"}
        >
          {searchQuery ? (
            <X className="w-4 h-4" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Dropdown de resultados */}
      {showDropdown && searchQuery.trim() && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-popover rounded-md border border-border shadow-lg overflow-hidden">
          <div className="max-h-96 overflow-y-auto py-2">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${index}`}
                onClick={() => handleResultClick(result.url)}
                className="w-full text-left px-3 py-2 hover:bg-accent transition-colors flex items-center gap-3"
              >
                {/* Ícone do tipo */}
                <div className="text-muted-foreground shrink-0">
                  {result.icon || getTypeIcon(result.type)}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{result.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {result.subtitle}
                  </p>
                </div>

                {/* Badge do tipo */}
                <span className="text-xs text-muted-foreground capitalize px-1.5 py-0.5 rounded bg-muted shrink-0">
                  {result.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem de nenhum resultado */}
      {showDropdown && searchQuery.trim() && results.length === 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-popover rounded-md border border-border shadow-lg p-6 text-center">
          <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhum resultado encontrado para "<strong>{searchQuery}</strong>"
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tente buscar por Nucleos, blocos, coleções, timers ou páginas
          </p>
        </div>
      )}
    </div>
  );
}
