"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Suggestion {
  id: string;
  text: string;
  action?: string | null;
}

interface AISuggestionsProps {
  suggestions?: Suggestion[] | null;
  isLoading?: boolean;
  onSuggestionClick?: (suggestion: Suggestion) => void;
}

function SuggestionSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg p-3">
      <div className="mt-0.5 h-4 w-4 animate-pulse rounded bg-muted shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="h-3.5 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function AISuggestions({
  suggestions,
  isLoading,
  onSuggestionClick,
}: AISuggestionsProps) {
  const showSkeleton =
    isLoading || suggestions === null || suggestions === undefined;

  return (
    <section
      aria-label="Sugestões da IA"
      className="rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      {/* Cabeçalho */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">
          Sugestões para você hoje
        </h2>
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-1">
        {showSkeleton ? (
          <>
            <SuggestionSkeleton />
            <SuggestionSkeleton />
            <SuggestionSkeleton />
          </>
        ) : suggestions!.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground leading-relaxed">
            Nenhuma sugestão por enquanto. Continue usando o Nucleos!
          </p>
        ) : (
          suggestions!.map((s) => (
            <button
              key={s.id}
              onClick={() => onSuggestionClick?.(s)}
              className={cn(
                "group flex w-full items-start gap-3 rounded-lg p-3 text-left",
                "transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60 transition-colors group-hover:text-primary" />
              <div className="flex flex-1 items-start justify-between gap-2">
                <span className="text-xs leading-relaxed text-foreground">
                  {s.text}
                </span>
                <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/0 transition-all group-hover:text-muted-foreground" />
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
