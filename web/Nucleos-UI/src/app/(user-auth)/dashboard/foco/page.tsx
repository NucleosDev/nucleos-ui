"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FocusSession } from "@/components/focus/FocusSession";
import { FocoStartView } from "@/components/focus/FocoStartView";
import { Timer } from "lucide-react";

function FocoContent() {
  const params = useSearchParams();
  const hasTarefaId = !!params.get("tarefaId");

  // Task-specific focus → fullscreen immersive mode
  if (hasTarefaId) {
    return <FocusSession />;
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 md:px-6 h-14 flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8">
          <Timer className="h-3.5 w-3.5 text-primary" />
        </div>
        <h1 className="text-sm font-semibold tracking-tight">Foco</h1>
      </div>

      <FocoStartView />
    </div>
  );
}

export default function FocoPage() {
  return (
    <Suspense>
      <FocoContent />
    </Suspense>
  );
}
