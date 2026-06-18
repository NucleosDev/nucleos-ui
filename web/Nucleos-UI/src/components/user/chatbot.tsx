"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Bot, User, Sparkles, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/icon.svg";
import { useNucleos } from "@/hooks/useNucleo";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGamification } from "@/hooks/useGamification";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

interface HFMessage {
  role: "user" | "assistant";
  content: string;
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou o NucleosIA, seu assistente de produtividade. Como posso ajudar você hoje?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: nucleos = [] } = useNucleos();
  const { data: currentUser } = useCurrentUser();
  const { useStreak, useStats } = useGamification();
  const { data: streak } = useStreak();
  const { data: stats } = useStats();

  const context = useMemo(
    () => ({
      user: currentUser
        ? { fullName: currentUser.fullName, email: currentUser.email }
        : undefined,
      nucleos: nucleos.map((n) => ({ nome: n.nome, tipo: n.tipo ?? "geral" })),
      streak: streak
        ? {
            currentStreak: streak.currentStreak ?? 0,
            longestStreak: streak.maxStreak ?? 0,
          }
        : undefined,
      stats: stats
        ? {
            xpTotal: stats.totalXp ?? 0,
            level: stats.level ?? 1,
            xpHoje: stats.todayXp ?? 0,
          }
        : undefined,
    }),
    [currentUser, nucleos, streak, stats]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const history: HFMessage[] = messages
      .filter((m) => m.id !== "1")
      .map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));
    history.push({ role: "user", content: userMessage.text });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erro desconhecido.");
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: data.reply, sender: "bot" },
      ]);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Falha ao conectar com a IA.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[100%] w-full overflow-hidden bg-card shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
          <Image width={22} height={22} alt="nucleos-icon" src={Logo} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-none">NucleosIA</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {currentUser?.fullName
              ? `Olá, ${currentUser.fullName.split(" ")[0]}`
              : "Assistente de produtividade"}
          </p>
        </div>
        <Sparkles className="w-4 h-4 text-yellow-500 shrink-0" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted text-foreground rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-xl px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre seus Nucleos..."
            className="flex-1 rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
