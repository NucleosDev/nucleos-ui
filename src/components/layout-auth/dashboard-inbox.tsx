"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import {
  Circle,
  CheckCircle2,
  Clock,
  Flame,
  Calendar,
  Target,
  Trophy,
  Eclipse,
  Activity,
  Zap,
  ListTodo,
  Heart,
  Sparkles,
  Award,
  Search,
  ArrowRight,
  ExternalLink,
  Star,
  TrendingUp,
  AlertCircle,
  BookOpen,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { ChatBot } from "./chatbot"; // Ajuste o caminho conforme necessário

// ========== DADOS MOCK ==========
const mockTasks = [
  {
    id: "1",
    titulo: "Revisar documentação do projeto",
    prioridade: "alta",
    status: "pendente",
    nucleo: "Trabalho",
    data_vencimento: new Date().toISOString(),
  },
  {
    id: "2",
    titulo: "Enviar relatório semanal",
    prioridade: "media",
    status: "pendente",
    nucleo: "Trabalho",
    data_vencimento: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: "3",
    titulo: "Agendar reunião com cliente",
    prioridade: "baixa",
    status: "pendente",
    nucleo: "Trabalho",
    data_vencimento: new Date(Date.now() + 172800000).toISOString(),
  },
  {
    id: "4",
    titulo: "Revisar PR do colega",
    prioridade: "alta",
    status: "pendente",
    nucleo: "Estudos",
    data_vencimento: new Date(Date.now() + 3600000).toISOString(),
  },
];

const mockHabits = [
  {
    id: "1",
    nome: "Beber água",
    frequencia: "diaria",
    concluido: false,
    streak: 5,
    categoria: "Saúde",
  },
  {
    id: "2",
    nome: "Meditar 10min",
    frequencia: "diaria",
    concluido: true,
    streak: 12,
    categoria: "Saúde",
  },
  {
    id: "3",
    nome: "Estudar programação",
    frequencia: "diaria",
    concluido: false,
    streak: 3,
    categoria: "Estudos",
  },
  {
    id: "4",
    nome: "Leitura noturna",
    frequencia: "diaria",
    concluido: false,
    streak: 7,
    categoria: "Estudos",
  },
];

const mockEvents = [
  {
    id: "1",
    titulo: "Workshop de Next.js",
    data_evento: new Date().toISOString(),
    duracao_minutos: 90,
    local: "Online",
    nucleo: "Estudos",
  },
  {
    id: "2",
    titulo: "Reunião de planejamento",
    data_evento: new Date(Date.now() + 86400000).toISOString(),
    duracao_minutos: 60,
    local: "Google Meet",
    nucleo: "Trabalho",
  },
  {
    id: "3",
    titulo: "Consulta médica",
    data_evento: new Date(Date.now() + 3 * 86400000).toISOString(),
    duracao_minutos: 30,
    local: "Clínica",
    nucleo: "Saúde",
  },
];

const mockGoals = [
  {
    id: "1",
    titulo: "Concluir curso de React",
    valor_meta: 100,
    valor_atual: 65,
    data_fim: new Date(Date.now() + 7 * 86400000).toISOString(),
    nucleo: "Estudos",
  },
  {
    id: "2",
    titulo: "Correr 50km no mês",
    valor_meta: 50,
    valor_atual: 28,
    data_fim: new Date(Date.now() + 14 * 86400000).toISOString(),
    nucleo: "Saúde",
  },
];

const mockInsights = [
  {
    id: "1",
    mensagem:
      "Você tem maior produtividade nas manhãs. Que tal agendar tarefas importantes antes do meio-dia?",
    tipo: "produtividade",
    priority: 5,
    applied: false,
  },
  {
    id: "2",
    mensagem:
      "Seu hábito de meditação está em alta! Considere aumentar para 15 minutos para resultados ainda melhores.",
    tipo: "habito",
    priority: 3,
    applied: false,
  },
  {
    id: "3",
    mensagem:
      "Você tem 3 tarefas com prazo hoje. Organize-as por prioridade para evitar atrasos.",
    tipo: "tarefas",
    priority: 4,
    applied: false,
  },
];

const mockAchievements = [
  {
    id: "1",
    nome: "Primeira Semana",
    descricao: "Completou 7 dias de streak",
    xp: 50,
    desbloqueado_em: new Date().toISOString(),
  },
  {
    id: "2",
    nome: "Mestre das Tarefas",
    descricao: "Concluiu 50 tarefas",
    xp: 100,
    desbloqueado_em: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "3",
    nome: "Criador de Hábitos",
    descricao: "Manteve 3 hábitos por 30 dias",
    xp: 200,
    desbloqueado_em: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

const mockNucleos = [
  {
    id: "1",
    nome: "Trabalho",
    descricao: "Projetos e tarefas profissionais",
    corDestaque: "#3B82F6",
    tarefas_pendentes: 3,
    habitos_ativos: 1,
    progresso: 72,
  },
  {
    id: "2",
    nome: "Saúde",
    descricao: "Hábitos e exercícios",
    corDestaque: "#10B981",
    tarefas_pendentes: 1,
    habitos_ativos: 2,
    progresso: 55,
  },
  {
    id: "3",
    nome: "Estudos",
    descricao: "Cursos e certificações",
    corDestaque: "#F59E0B",
    tarefas_pendentes: 2,
    habitos_ativos: 2,
    progresso: 40,
  },
];

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
  href?: string;
}

// ========== COMPONENTE PRINCIPAL ==========
export function DashboardInbox() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryId>("nucleos");
  const [selectedItemId, setSelectedItemId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "detail" | "chat">(
    "list",
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categories: Category[] = [
    {
      id: "nucleos",
      name: "Núcleos",
      icon: <Eclipse className="w-4 h-4" />,
      count: mockNucleos.length,
      href: "/nucleos",
    },
    {
      id: "tasks",
      name: "Tarefas",
      icon: <ListTodo className="w-4 h-4" />,
      count: mockTasks.filter((t) => t.status === "pendente").length,
      href: "/tarefas",
    },
    {
      id: "habits",
      name: "Hábitos",
      icon: <Heart className="w-4 h-4" />,
      count: mockHabits.filter((h) => !h.concluido).length,
      href: "/habitos",
    },
    {
      id: "events",
      name: "Eventos",
      icon: <Calendar className="w-4 h-4" />,
      count: mockEvents.length,
      href: "/calendario",
    },
    {
      id: "goals",
      name: "Metas",
      icon: <Target className="w-4 h-4" />,
      count: mockGoals.length,
      href: "/metas",
    },
    {
      id: "insights",
      name: "Insights IA",
      icon: <Sparkles className="w-4 h-4" />,
      count: mockInsights.filter((i) => !i.applied).length,
      href: "#",
    },
    {
      id: "achievements",
      name: "Conquistas",
      icon: <Trophy className="w-4 h-4" />,
      count: mockAchievements.length,
      href: "/conquistas",
    },
  ];

  const currentCategory = categories.find((c) => c.id === selectedCategory)!;

  const getItems = () => {
    switch (selectedCategory) {
      case "nucleos":
        return mockNucleos;
      case "tasks":
        return mockTasks.filter((t) => t.status === "pendente");
      case "habits":
        return mockHabits;
      case "events":
        return mockEvents;
      case "goals":
        return mockGoals;
      case "insights":
        return mockInsights;
      case "achievements":
        return mockAchievements;
      default:
        return [];
    }
  };

  const getItemTitle = (item: any) => {
    return item.titulo || item.nome || item.mensagem || "";
  };

  const filteredItems = getItems().filter((item) =>
    getItemTitle(item).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedItem = selectedItemId
    ? getItems().find((i: any) => i.id === selectedItemId)
    : null;

  const handleItemSelect = (id: string) => {
    setSelectedItemId(id);
    if (isMobile) {
      setMobileView("detail");
    }
  };

  const handleBackToList = () => {
    setMobileView("list");
  };

  // Desktop: três colunas lado a lado
  if (!isMobile) {
    return (
      <div className="flex h-[680px] w-full rounded-xl border border-border overflow-hidden bg-card shadow-sm">
        {/* Coluna 1: Lista */}
        <div className="flex-1 min-w-0 border-r border-border flex flex-col bg-card">
          <ListHeader
            title={currentCategory.name}
            href={currentCategory.href}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="flex-1 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <EmptyState />
            ) : (
              filteredItems.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => handleItemSelect(item.id)}
                  className={`w-full text-left px-4 py-3 border-b border-border/60 transition-colors hover:bg-muted/40 ${
                    selectedItemId === item.id
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : ""
                  }`}
                >
                  <ListItem
                    category={selectedCategory}
                    item={item}
                    selected={selectedItemId === item.id}
                  />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Coluna 2: Detalhes */}
        <div className="flex-1 min-w-0 border-r border-border flex flex-col bg-card overflow-hidden">
          {selectedItem ? (
            <DetailPanel category={selectedCategory} item={selectedItem} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <Eclipse className="w-10 h-10 opacity-20" />
              <p className="text-sm">Selecione um item para ver os detalhes</p>
            </div>
          )}
        </div>

        {/* Coluna 3: ChatBot */}
        <div className="flex-1 min-w-0 flex flex-col bg-green/50  overflow-hidden">
          <ChatBot />
        </div>
      </div>
    );
  }

  // Mobile: navegação entre três telas
  return (
    <div className="flex flex-col h-[680px] w-full rounded-xl border border-border overflow-hidden bg-card shadow-sm">
      {mobileView === "list" && (
        <>
          <ListHeader
            title={currentCategory.name}
            href={currentCategory.href}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showBackButton={false}
          />
          <div className="flex-1 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <EmptyState />
            ) : (
              filteredItems.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => handleItemSelect(item.id)}
                  className="w-full text-left px-4 py-3 border-b border-border/60 transition-colors hover:bg-muted/40"
                >
                  <ListItem
                    category={selectedCategory}
                    item={item}
                    selected={false}
                  />
                </button>
              ))
            )}
          </div>
        </>
      )}

      {mobileView === "detail" && selectedItem && (
        <>
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <button
              onClick={handleBackToList}
              className="p-1 -ml-1 rounded-md hover:bg-accent"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-sm font-semibold text-foreground flex-1">
              Detalhes
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <DetailPanel category={selectedCategory} item={selectedItem} />
          </div>
        </>
      )}

      {mobileView === "chat" && (
        <>
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <button
              onClick={handleBackToList}
              className="p-1 -ml-1 rounded-md hover:bg-accent"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-sm font-semibold text-foreground flex-1">
              Assistente IA
            </h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatBot />
          </div>
        </>
      )}

      {/* Barra de navegação inferior (mobile) */}
      <div className="border-t border-border bg-muted/30 p-2 flex items-center justify-around">
        <button
          onClick={() => setMobileView("list")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
            mobileView === "list"
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListTodo className="w-5 h-5" />
          <span className="text-xs">Lista</span>
        </button>
        <button
          onClick={() => setMobileView("detail")}
          disabled={!selectedItem}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
            !selectedItem
              ? "opacity-50 cursor-not-allowed text-muted-foreground"
              : mobileView === "detail"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Eclipse className="w-5 h-5" />
          <span className="text-xs">Detalhes</span>
        </button>
        <button
          onClick={() => setMobileView("chat")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
            mobileView === "chat"
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs">Chat</span>
        </button>
      </div>
    </div>
  );
}

// ========== COMPONENTES AUXILIARES ==========
function ListHeader({
  title,
  href,
  searchQuery,
  onSearchChange,
  showBackButton = true,
}: {
  title: string;
  href?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showBackButton?: boolean;
}) {
  return (
    <>
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-xs text-primary hover:underline flex items-center gap-0.5 shrink-0"
          >
            Ver todos
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      <div className="px-3 py-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-border bg-muted/50 text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-xs gap-2">
      <Search className="w-5 h-5 opacity-40" />
      <span>Nenhum item encontrado</span>
    </div>
  );
}

// ========== COMPONENTE: Item da lista ==========
function ListItem({
  category,
  item,
  selected,
}: {
  category: CategoryId;
  item: any;
  selected: boolean;
}) {
  const textClass = selected ? "text-primary" : "text-foreground";
  const mutedClass = selected ? "text-primary/60" : "text-muted-foreground";

  switch (category) {
    case "nucleos":
      return (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.corDestaque }}
            />
            <span className={`text-sm font-medium truncate ${textClass}`}>
              {item.nome}
            </span>
          </div>
          <p className={`text-xs truncate ${mutedClass} pl-4`}>
            {item.descricao}
          </p>
          <div
            className={`flex items-center gap-3 mt-1.5 pl-4 text-xs ${mutedClass}`}
          >
            <span>{item.tarefas_pendentes} tarefas</span>
            <span>{item.habitos_ativos} hábitos</span>
          </div>
        </div>
      );

    case "tasks":
      return (
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className={`text-sm font-medium leading-tight ${textClass}`}>
              {item.titulo}
            </span>
            <PrioridadeBadge prioridade={item.prioridade} />
          </div>
          <div className={`flex items-center gap-2 text-xs ${mutedClass}`}>
            <Clock className="w-3 h-3 shrink-0" />
            <span>{format(new Date(item.data_vencimento), "dd/MM")}</span>
            {item.nucleo && (
              <>
                <span>·</span>
                <span className="truncate">{item.nucleo}</span>
              </>
            )}
          </div>
        </div>
      );

    case "habits":
      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {item.concluido ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            ) : (
              <Circle className={`w-4 h-4 shrink-0 ${mutedClass}`} />
            )}
            <div className="min-w-0">
              <p
                className={`text-sm font-medium truncate ${item.concluido ? "line-through text-muted-foreground" : textClass}`}
              >
                {item.nome}
              </p>
              <p className={`text-xs ${mutedClass}`}>{item.categoria}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-xs text-muted-foreground">
              {item.streak}d
            </span>
          </div>
        </div>
      );

    case "events":
      return (
        <div>
          <div className="flex items-start gap-3">
            <div className="w-10 text-center shrink-0">
              <div className={`text-base font-bold leading-tight ${textClass}`}>
                {format(new Date(item.data_evento), "dd")}
              </div>
              <div className={`text-xs uppercase ${mutedClass}`}>
                {format(new Date(item.data_evento), "MMM", { locale: ptBR })}
              </div>
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-medium truncate ${textClass}`}>
                {item.titulo}
              </p>
              <p className={`text-xs ${mutedClass}`}>
                {item.duracao_minutos}min · {item.nucleo}
              </p>
            </div>
          </div>
        </div>
      );

    case "goals":
      return (
        <div>
          <p className={`text-sm font-medium mb-2 ${textClass}`}>
            {item.titulo}
          </p>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1">
            <div
              className="h-full bg-primary rounded-full"
              style={{
                width: `${(item.valor_atual / item.valor_meta) * 100}%`,
              }}
            />
          </div>
          <div className={`flex justify-between text-xs ${mutedClass}`}>
            <span>
              {item.valor_atual}/{item.valor_meta}
            </span>
            <span>
              {Math.round((item.valor_atual / item.valor_meta) * 100)}%
            </span>
          </div>
        </div>
      );

    case "insights":
      return (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
            <span
              className={`text-xs font-medium uppercase tracking-wide ${mutedClass}`}
            >
              {item.tipo}
            </span>
          </div>
          <p className={`text-sm leading-snug line-clamp-2 ${textClass}`}>
            {item.mensagem}
          </p>
        </div>
      );

    case "achievements":
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-medium truncate ${textClass}`}>
              {item.nome}
            </p>
            <p className={`text-xs ${mutedClass}`}>+{item.xp} XP</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ========== COMPONENTE: Painel de detalhe ==========
function DetailPanel({ category, item }: { category: CategoryId; item: any }) {
  switch (category) {
    case "nucleos":
      return <NucleoDetail nucleo={item} />;
    case "tasks":
      return <TaskDetail task={item} />;
    case "habits":
      return <HabitDetail habit={item} />;
    case "events":
      return <EventDetail event={item} />;
    case "goals":
      return <GoalDetail goal={item} />;
    case "insights":
      return <InsightDetail insight={item} />;
    case "achievements":
      return <AchievementDetail achievement={item} />;
    default:
      return null;
  }
}

// ========== PAINEIS DE DETALHE ==========
function NucleoDetail({ nucleo }: { nucleo: any }) {
  return (
    <div className="flex flex-col h-full">
      <div
        className="px-6 py-4 border-b border-border flex items-center justify-between"
        style={{ borderTopColor: nucleo.corDestaque, borderTopWidth: "3px" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: nucleo.corDestaque }}
          />
          <h3 className="font-semibold text-lg text-foreground">
            {nucleo.nome}
          </h3>
        </div>
        <Link
          href={`/nucleos/${nucleo.id}`}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Abrir núcleo
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <p className="text-sm text-muted-foreground">{nucleo.descricao}</p>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Tarefas",
              value: nucleo.tarefas_pendentes,
              icon: <ListTodo className="w-4 h-4" />,
              color: "text-blue-500",
            },
            {
              label: "Hábitos",
              value: nucleo.habitos_ativos,
              icon: <Heart className="w-4 h-4" />,
              color: "text-green-500",
            },
            {
              label: "Progresso",
              value: `${nucleo.progresso}%`,
              icon: <TrendingUp className="w-4 h-4" />,
              color: "text-primary",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-muted/40 rounded-lg p-3 flex flex-col gap-1"
            >
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-lg font-bold text-foreground">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-foreground">Progresso geral</span>
            <span className="text-muted-foreground">{nucleo.progresso}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${nucleo.progresso}%`,
                backgroundColor: nucleo.corDestaque,
              }}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-muted-foreground" />
            Tarefas pendentes
          </h4>
          <div className="space-y-2">
            {mockTasks
              .filter((t) => t.nucleo === nucleo.nome)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors"
                >
                  <Circle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground flex-1 truncate">
                    {task.titulo}
                  </span>
                  <PrioridadeBadge prioridade={task.prioridade} />
                </div>
              ))}
            {mockTasks.filter((t) => t.nucleo === nucleo.nome).length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-3">
                Nenhuma tarefa pendente neste núcleo 🎉
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskDetail({ task }: { task: any }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Circle className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">{task.titulo}</h3>
        </div>
        <PrioridadeBadge prioridade={task.prioridade} />
      </div>
      <div className="flex-1 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <InfoBlock
            label="Prazo"
            value={format(new Date(task.data_vencimento), "dd 'de' MMMM", {
              locale: ptBR,
            })}
            icon={<Clock className="w-4 h-4 text-muted-foreground" />}
          />
          <InfoBlock
            label="Núcleo"
            value={task.nucleo}
            icon={<Eclipse className="w-4 h-4 text-muted-foreground" />}
          />
          <InfoBlock
            label="Status"
            value="Pendente"
            icon={<AlertCircle className="w-4 h-4 text-muted-foreground" />}
          />
          <InfoBlock
            label="Prioridade"
            value={
              task.prioridade === "alta"
                ? "Alta"
                : task.prioridade === "media"
                  ? "Média"
                  : "Baixa"
            }
            icon={<Star className="w-4 h-4 text-muted-foreground" />}
          />
        </div>

        <div className="pt-4 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
            <CheckCircle2 className="w-4 h-4" />
            Marcar como concluída
          </button>
        </div>
      </div>
    </div>
  );
}

function HabitDetail({ habit }: { habit: any }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-rose-500" />
          <h3 className="font-semibold text-foreground">{habit.nome}</h3>
        </div>
        {habit.concluido && (
          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
            Concluído hoje
          </span>
        )}
      </div>
      <div className="flex-1 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <InfoBlock
            label="Categoria"
            value={habit.categoria}
            icon={<BookOpen className="w-4 h-4 text-muted-foreground" />}
          />
          <InfoBlock
            label="Frequência"
            value={habit.frequencia === "diaria" ? "Diário" : "Semanal"}
            icon={<Activity className="w-4 h-4 text-muted-foreground" />}
          />
          <InfoBlock
            label="Streak atual"
            value={`${habit.streak} dias`}
            icon={<Flame className="w-4 h-4 text-orange-500" />}
          />
        </div>

        <div className="pt-2">
          <p className="text-sm font-medium text-foreground mb-3">
            Últimos 7 dias
          </p>
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => {
              const done = i < habit.streak && i < 7;
              return (
                <div
                  key={i}
                  className={`flex-1 h-7 rounded-md transition-colors ${
                    done ? "bg-primary/80" : "bg-muted"
                  }`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">7 dias atrás</span>
            <span className="text-xs text-muted-foreground">Hoje</span>
          </div>
        </div>

        {!habit.concluido && (
          <div className="pt-2 border-t border-border">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
              Marcar hábito de hoje
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EventDetail({ event }: { event: any }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">{event.titulo}</h3>
      </div>
      <div className="flex-1 p-6 space-y-5">
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {format(new Date(event.data_evento), "dd")}
            </div>
            <div className="text-sm text-muted-foreground uppercase font-medium">
              {format(new Date(event.data_evento), "MMM", { locale: ptBR })}
            </div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <p className="font-medium text-foreground">
              {format(new Date(event.data_evento), "EEEE", { locale: ptBR })}
            </p>
            <p className="text-sm text-muted-foreground">
              Duração: {event.duracao_minutos} minutos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoBlock
            label="Local"
            value={event.local}
            icon={<ExternalLink className="w-4 h-4 text-muted-foreground" />}
          />
          <InfoBlock
            label="Núcleo"
            value={event.nucleo}
            icon={<Eclipse className="w-4 h-4 text-muted-foreground" />}
          />
        </div>
      </div>
    </div>
  );
}

function GoalDetail({ goal }: { goal: any }) {
  const progress = Math.round((goal.valor_atual / goal.valor_meta) * 100);
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">{goal.titulo}</h3>
      </div>
      <div className="flex-1 p-6 space-y-5">
        <div className="p-4 bg-muted/30 rounded-xl space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Progresso</span>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {goal.valor_atual} concluídos
            </span>
            <span className="text-muted-foreground">
              Meta: {goal.valor_meta}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoBlock
            label="Prazo final"
            value={format(new Date(goal.data_fim), "dd/MM/yyyy")}
            icon={<Clock className="w-4 h-4 text-muted-foreground" />}
          />
          <InfoBlock
            label="Núcleo"
            value={goal.nucleo}
            icon={<Eclipse className="w-4 h-4 text-muted-foreground" />}
          />
        </div>
      </div>
    </div>
  );
}

function InsightDetail({ insight }: { insight: any }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold text-foreground">Insight da IA</h3>
        <span className="ml-auto text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium capitalize">
          {insight.tipo}
        </span>
      </div>
      <div className="flex-1 p-6 space-y-5">
        <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
          <p className="text-sm leading-relaxed text-foreground">
            {insight.mensagem}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>Prioridade: {insight.priority}/5</span>
        </div>

        {!insight.applied && (
          <div className="pt-2 border-t border-border space-y-2">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
              <Zap className="w-4 h-4" />
              Aplicar sugestão
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-muted-foreground text-sm hover:text-foreground transition-colors">
              Ignorar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AchievementDetail({ achievement }: { achievement: any }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold text-foreground">Conquista</h3>
      </div>
      <div className="flex-1 p-6 space-y-5">
        <div className="flex flex-col items-center text-center p-6 bg-muted/20 rounded-xl gap-3">
          <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-foreground">
              {achievement.nome}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {achievement.descricao}
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
            <Zap className="w-3.5 h-3.5" />+{achievement.xp} XP
          </span>
        </div>

        <InfoBlock
          label="Desbloqueado em"
          value={format(
            new Date(achievement.desbloqueado_em),
            "dd 'de' MMMM 'de' yyyy",
            { locale: ptBR },
          )}
          icon={<Award className="w-4 h-4 text-muted-foreground" />}
        />
      </div>
    </div>
  );
}

// ========== UTILITÁRIOS ==========
function PrioridadeBadge({ prioridade }: { prioridade: string }) {
  return (
    <span
      className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
        prioridade === "alta"
          ? "bg-destructive/10 text-destructive"
          : prioridade === "media"
            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      }`}
    >
      {prioridade === "alta"
        ? "Alta"
        : prioridade === "media"
          ? "Média"
          : "Baixa"}
    </span>
  );
}

function InfoBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
      </div>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
