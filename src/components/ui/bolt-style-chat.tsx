"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Lightbulb,
  Paperclip,
  Image as ImageIcon,
  FileCode,
  ChevronDown,
  Check,
  Sparkles,
  Snail,
  Orbit,
  Bolt,
  Github,
  SendHorizontal,
  TrendingUp,
  Target,
  Calendar,
  Rocket,
  Star,
} from "lucide-react";
import Image from "next/image";

// TYPES
interface Model {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

// FIGMA ICON
function FigmaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M8 24C10.208 24 12 22.208 12 20V16H8C5.792 16 4 17.792 4 20C4 22.208 5.792 24 8 24Z"
        fill="currentColor"
      />
      <path
        d="M4 12C4 9.792 5.792 8 8 8H12V16H8C5.792 16 4 14.208 4 12Z"
        fill="currentColor"
      />
      <path
        d="M4 4C4 1.792 5.792 0 8 0H12V8H8C5.792 8 4 6.208 4 4Z"
        fill="currentColor"
      />
      <path
        d="M12 0H16C18.208 0 20 1.792 20 4C20 6.208 18.208 8 16 8H12V0Z"
        fill="currentColor"
      />
      <path
        d="M20 12C20 14.208 18.208 16 16 16C13.792 16 12 14.208 12 12C12 9.792 13.792 8 16 8C18.208 8 20 9.792 20 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Orbit Icon Component
export default function OrbitIcon({
  className,
  color,
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/Orbit.svg"
        alt="Orbit"
        width={16}
        height={16}
        className="w-full h-full object-contain"
        style={{
          filter: color === "white" ? "brightness(0) invert(1)" : "none",
        }}
      />
    </div>
  );
}

// MODEL SELECTOR
const models: Model[] = [
  {
    id: "orbit-pro",
    name: "Orbit Pro",
    description: "IA mais poderosa e completa",
    icon: <OrbitIcon className="size-4" color="white" />,
    badge: "Pro",
  },
  {
    id: "orbit-fast",
    name: "Orbit Fast",
    description: "Respostas ultrarrápidas",
    icon: <Snail className="size-4 text-[#4D7CFF]" />,
    badge: "Padrão",
  },
  {
    id: "orbit-brain",
    name: "Deep Orbit",
    description: "Análise profunda e insights",
    icon: <Orbit className="size-4 text-[#5B7FFF]" />,
  },
];

function ModelSelector({
  selectedModel = "orbit-fast",
  onModelChange,
}: {
  selectedModel?: string;
  onModelChange?: (model: Model) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(
    models.find((m) => m.id === selectedModel) || models[0],
  );

  const handleSelect = (model: Model) => {
    setSelected(model);
    setIsOpen(false);
    onModelChange?.(model);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent/50 active:scale-95"
      >
        {selected.icon}
        <span>{selected.name}</span>
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 z-50 min-w-[240px] bg-popover/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-1.5">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Escolha seu modelo
              </div>
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-all duration-150 ${
                    selected.id === model.id
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex-shrink-0">{model.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{model.name}</span>
                      {model.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            model.badge === "Pro"
                              ? "bg-[#00C9A7]/20 text-[#00C9A7]"
                              : "bg-[#4D7CFF]/20 text-[#4D7CFF]"
                          }`}
                        >
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {model.description}
                    </span>
                  </div>
                  {selected.id === model.id && (
                    <Check className="size-4 text-[#00C9A7] flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// SUGGESTION CARDS
const suggestions = [
  {
    icon: <TrendingUp className="size-4" />,
    title: "Produtividade",
    description: "Crie um sistema de rotina diária com IA",
    prompt:
      "Quero criar um sistema de produtividade diária com rastreamento de hábitos",
  },
  {
    icon: <Target className="size-4" />,
    title: "Metas",
    description: "Defina e acompanhe seus objetivos trimestrais",
    prompt: "Me ajude a definir metas trimestrais para evoluir meus Nucleos",
  },
  {
    icon: <Calendar className="size-4" />,
    title: "Agenda",
    description: "Planeje sua semana com assistência inteligente",
    prompt: "Quero organizar minha semana de forma produtiva",
  },
];

// CHAT INPUT
function ChatInput({
  onSend,
  placeholder = "Descreva o que você quer criar ou organizar...",
}: {
  onSend?: (message: string) => void;
  placeholder?: string;
}) {
  const [message, setMessage] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim()) {
      onSend?.(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    onSend?.(prompt);
  };

  return (
    <div className="w-full space-y-4">
      {/* Suggestion cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestionClick(suggestion.prompt)}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200 text-left group"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              {suggestion.icon}
            </div>
            <div>
              <p className="text-sm font-medium">{suggestion.title}</p>
              <p className="text-xs text-muted-foreground">
                {suggestion.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="relative w-full">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#4D7CFF]/20 via-[#00C9A7]/20 to-[#5B7FFF]/20 rounded-b-xl pointer-events-none" />
        <div className="relative rounded-2xl bg-card border border-border shadow-lg">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground px-5 pt-5 pb-3 focus:outline-none min-h-[80px] max-h-[200px]"
              style={{ height: "80px" }}
            />
          </div>

          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="flex items-center justify-center size-8 rounded-full bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-95"
                >
                  <Plus
                    className={`size-4 transition-transform duration-200 ${
                      showAttachMenu ? "rotate-45" : ""
                    }`}
                  />
                </button>

                {showAttachMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowAttachMenu(false)}
                    />
                    <div className="absolute bottom-full left-0 mb-2 z-50 bg-popover backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="p-1.5 min-w-[180px]">
                        {[
                          {
                            icon: <Paperclip className="size-4" />,
                            label: "Anexar arquivo",
                          },
                          {
                            icon: <ImageIcon className="size-4" />,
                            label: "Adicionar imagem",
                          },
                          {
                            icon: <FileCode className="size-4" />,
                            label: "Importar código",
                          },
                        ].map((item, i) => (
                          <button
                            key={i}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-150"
                          >
                            {item.icon}
                            <span className="text-sm">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <ModelSelector />
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200">
                <Lightbulb className="size-4" />
                <span className="hidden sm:inline">Planejar</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:opacity-90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-primary/20"
              >
                <span className="hidden sm:inline">Conversar com Orbit</span>
                <SendHorizontal className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ANIMATED BACKGROUND
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4D7CFF]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00C9A7]/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#5B7FFF]/15 rounded-full blur-[120px] animate-pulse delay-2000" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

// ANNOUNCEMENT BADGE
function AnnouncementBadge({
  text,
  href = "#",
}: {
  text: string;
  href?: string;
}) {
  const content = (
    <>
      <Rocket className="size-4 relative z-10 text-[#00C9A7]" />
      <span className="relative z-10 font-medium">{text}</span>
    </>
  );

  const className =
    "relative inline-flex items-center gap-2 px-5 py-2 min-h-[40px] rounded-full text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-gradient-to-r from-[#4D7CFF]/10 to-[#00C9A7]/10 border border-primary/20 hover:border-primary/40";

  return href !== "#" ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  ) : (
    <button className={className}>{content}</button>
  );
}

// IMPORT BUTTONS
function ImportButtons({ onImport }: { onImport?: (source: string) => void }) {
  return (
    <div className="flex items-center gap-4 justify-center flex-wrap">
      <span className="text-sm text-muted-foreground">ou importe de</span>
      <div className="flex gap-2">
        {[
          {
            id: "figma",
            name: "Figma",
            icon: <FigmaIcon className="size-4" />,
          },
          { id: "github", name: "GitHub", icon: <Github className="size-4" /> },
        ].map((option) => (
          <button
            key={option.id}
            onClick={() => onImport?.(option.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-95"
          >
            {option.icon}
            <span>{option.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// MAIN BOLT CHAT COMPONENT
interface BoltChatProps {
  title?: string;
  subtitle?: string;
  announcementText?: string;
  announcementHref?: string;
  placeholder?: string;
  onSend?: (message: string) => void;
  onImport?: (source: string) => void;
}

export function BoltStyleChat({
  title = "O que você vai",
  subtitle = "Transforme suas ideias em sistemas inteligentes e evolua seus Nucleos com o poder da IA.",
  announcementText = "✨ Orbit AI agora disponível! Comece grátis",
  announcementHref = "#",
  placeholder = "Descreva sua ideia, planeje um projeto ou peça ajuda ao Orbit AI...",
  onSend,
  onImport,
}: BoltChatProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-background">
      <AnimatedBackground />

      {/* Logo and announcement */}
      <div className="absolute top-8 left-0 right-0 flex flex-col items-center gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="relative w-18 h-18 rounded-full bg-background/50 flex items-center justify-center shadow-lg">
              <Image
                src="/Orbit.svg"
                alt="Orbit AI"
                width={58}
                height={58}
                className=""
              />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] bg-clip-text text-transparent">
              Orbit AI
            </h2>
            <p className="text-xs text-muted-foreground">Nucleos</p>
          </div>
        </div>
        {/* <AnnouncementBadge text={announcementText} href={announcementHref} /> */}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-20">
        {/* Title section */}
        <div className="text-center mb-8">
          {/* <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-3">
            {title}{" "}
            <span className="bg-gradient-to-r from-[#4D7CFF] via-[#5B7FFF] to-[#00C9A7] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              evoluir
            </span>{" "}
            hoje?
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p> */}
        </div>

        {/* Chat input */}
        <div className="w-full max-w-3xl mb-8">
          <ChatInput placeholder={placeholder} onSend={onSend} />
        </div>

        {/* Import buttons */}
        {/* <ImportButtons onImport={onImport} /> */}
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground">
          Potencializado por{" "}
          <span className="bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] bg-clip-text text-transparent font-medium">
            Orbit AI
          </span>{" "}
          • Sua inteligência para transformar ideias em realidade
        </p>
      </div>
    </div>
  );
}
