// src/components/canvas/FunctionalBlockPreview.tsx
"use client";

import { ExternalLink } from "lucide-react";

interface FunctionalBlockPreviewProps {
  blockId: string;
  blockType: string;
  title: string;
  onOpen?: () => void;
}

export function FunctionalBlockPreview({
  blockId,
  blockType,
  title,
  onOpen,
}: FunctionalBlockPreviewProps) {
  const getIcon = () => {
    switch (blockType) {
      case "tarefas":
        return "📋";
      case "habitos":
        return "🔥";
      case "lista":
        return "📝";
      case "calendario":
        return "📅";
      case "timer":
        return "⏱️";
      case "colecoes":
        return "🗂️";
      case "notas":
        return "📄";
      default:
        return "🔷";
    }
  };

  return (
    <div
      className="rounded-lg border border-primary/20 bg-primary/5 p-4 cursor-pointer hover:shadow-md transition-all"
      onClick={onOpen}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getIcon()}</span>
          <span className="font-medium">{title || blockType}</span>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
