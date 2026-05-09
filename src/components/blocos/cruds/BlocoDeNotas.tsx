"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlocoNotas } from "@/hooks/useBlocoNotas";
import { useBlocos } from "@/hooks/useBlocos";
import { cn } from "@/lib/utils";

interface BlocoDeNotasProps {
  bloco: {
    id: string;
    titulo: string | null;
    configuracoes?: Record<string, any> | null;
  };
  nucleoId: string;
  onDelete?: () => void;
}

export function BlocoDeNotas({ bloco }: BlocoDeNotasProps) {
  const { update } = useBlocos();
  const [conteudo, setConteudo] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const blocoAdaptado = {
    id: bloco.id,
    titulo: bloco.titulo || "",
    configuracoes: bloco.configuracoes || undefined,
  };

  const { carregarConteudo, salvarConteudo } = useBlocoNotas({
    bloco: blocoAdaptado,
    blocoId: bloco.id,
    onUpdateBloco: update,
  });

  useEffect(() => {
    carregarConteudo().then((texto) => {
      setConteudo(texto);
      setCarregando(false);
    });
  }, []);

  // Auto-resize textarea height
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => { resizeTextarea(); }, [conteudo, resizeTextarea]);

  const persistSave = useCallback(async (text: string) => {
    setSaveState("saving");
    try {
      await salvarConteudo(text);
      setSaveState("saved");
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("idle");
    }
  }, [salvarConteudo]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setConteudo(text);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persistSave(text), 800);
  };

  // Cleanup timers on unmount
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (idleTimer.current) clearTimeout(idleTimer.current);
  }, []);

  if (carregando) {
    return (
      <div className="space-y-2 px-1">
        <Skeleton className="h-4 w-3/5 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="h-4 w-full rounded" />
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Ambient glow when focused */}
      <div className="absolute -inset-1 rounded-xl bg-primary/4 opacity-0 group-focus-within:opacity-100 transition-opacity duration-[var(--duration-slow)] pointer-events-none" />

      {/* Writing surface */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={conteudo}
          onChange={handleChange}
          placeholder="Comece a escrever…"
          rows={6}
          className={cn(
            "w-full resize-none bg-transparent outline-none border-none",
            "text-[0.9375rem] leading-[1.75] text-foreground/90",
            "placeholder:text-muted-foreground/30",
            "font-[inherit] tracking-[var(--doc-tracking)]",
            "transition-colors duration-[var(--duration-fast)]",
            // subtle focus ring on the entire block, not on textarea itself
            "focus:ring-0 focus:outline-none",
          )}
          style={{ fontFamily: "inherit" }}
          spellCheck
        />

        {/* Save indicator */}
        <div
          aria-live="polite"
          className={cn(
            "absolute bottom-0 right-0 flex items-center gap-1",
            "text-[10px] font-medium text-muted-foreground/40",
            "transition-[opacity,transform] duration-[var(--duration-slow)]",
            saveState === "idle"
              ? "opacity-0 translate-y-0.5 pointer-events-none"
              : "opacity-100 translate-y-0",
          )}
        >
          {saveState === "saving" ? (
            <Loader2 className="h-2.5 w-2.5 animate-spin" />
          ) : (
            <span className="h-1 w-1 rounded-full bg-muted-foreground/30 inline-block" />
          )}
          {saveState === "saving" ? "Salvando" : "Salvo"}
        </div>
      </div>

      {/* Word count — only visible on hover/focus */}
      {conteudo.length > 0 && (
        <div className="flex items-center gap-1.5 pt-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-[var(--duration-base)]">
          <FileText className="h-3 w-3 text-muted-foreground/30" />
          <span className="text-[10px] text-muted-foreground/30 tabular-nums">
            {conteudo.split(/\s+/).filter(Boolean).length} palavras
          </span>
        </div>
      )}
    </div>
  );
}
