// src/components/nucleo/nucleo-grid-mobile.tsx
"use client";

import { NucleoCardMobile } from "@/components/nucleo/nucleo-card-mini";
import type { NucleoComStats } from "@/types/nucleo";

interface NucleoGridMobileProps {
  nucleos: NucleoComStats[];
  loading?: boolean;
  onNucleoClick?: (nucleo: NucleoComStats) => void;
  onNucleoUpdate?: (id: string, payload: any) => Promise<void>;
  onNucleoDelete?: (nucleo: NucleoComStats) => void;
  onAddNucleo?: () => void;
}

export function NucleoGridMobile({
  nucleos,
  loading = false,
  onNucleoClick,
  onNucleoUpdate,
  onNucleoDelete,
  onAddNucleo,
}: NucleoGridMobileProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/30 bg-card/50 animate-pulse overflow-hidden"
          >
            <div className="h-[80px] bg-muted/50" />
            <div className="p-3">
              <div className="h-4 w-3/4 bg-muted/50 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (nucleos.length === 0) {
    return null; // Empty state é tratado na página
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {nucleos.map((nucleo, index) => (
        <NucleoCardMobile
          key={nucleo.id}
          nucleo={nucleo}
          index={index}
          onClick={() => onNucleoClick?.(nucleo)}
          onEdit={() => onNucleoUpdate?.(nucleo.id, {})}
          onDelete={() => onNucleoDelete?.(nucleo)}
        />
      ))}
    </div>
  );
}
