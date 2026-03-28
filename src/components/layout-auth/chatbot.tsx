"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/icon.svg";
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Função mock para resposta da IA
const mockResponse = async (userMessage: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simula delay

  const lowerMsg = userMessage.toLowerCase();
  if (lowerMsg.includes("tarefa") || lowerMsg.includes("tarefas")) {
    return "Você tem 3 tarefas pendentes hoje. A mais urgente é 'Revisar documentação do projeto'. Posso ajudá-lo a organizá-las?";
  }
  if (lowerMsg.includes("hábito") || lowerMsg.includes("habito")) {
    return "Seu hábito de meditação está com 12 dias de streak! Continue assim. Que tal aumentar para 15 minutos?";
  }
  if (lowerMsg.includes("meta") || lowerMsg.includes("objetivo")) {
    return "Sua meta de concluir o curso de React está em 65%. Faltam 7 dias para o prazo. Precisa de ajuda com algum tópico?";
  }
  if (lowerMsg.includes("núcleo") || lowerMsg.includes("nucleo")) {
    return "Seus núcleos são Trabalho, Saúde e Estudos. O núcleo Trabalho tem 3 tarefas pendentes e está com 72% de progresso.";
  }
  return "Olá! Sou a NucleosIA. Posso ajudar com tarefas, hábitos, metas ou núcleos. O que você gostaria de saber?";
};

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou seu assistente de produtividade. Como posso ajudar você hoje?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const botText = await mockResponse(input);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botText,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[100%] w-full overflow-hidden bg-card shadow-sm">
      {/* Cabeçalho */}
      <div className="px-4 py-4 border-b border-border flex items-center gap-2">
        <div className="w-8 h-8 py-4 rounded-full bg-primary/5 flex items-center justify-center">
          <Image
            width={30}
            height={30}
            alt="nucleos-icon-chatbot"
            src={Logo}
            // href={Image}
          />
          {/* <Bot className="w-4 h-4 text-primary" /> */}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Sempre online</p>
        </div>
        <Sparkles className="w-4 h-4 text-yellow-500 ml-auto" />
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-xl px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
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
            placeholder="Digite sua mensagem..."
            className="flex-1 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
