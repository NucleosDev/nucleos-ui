// src/components/canvas/BlockRenderer.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Pencil, Trash2, ExternalLink, GripVertical, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import { TarefasBlocoCard } from "@/components/blocos/cruds/TarefasBlocoCard";
import { ListasBlocoCard } from "@/components/blocos/cruds/ListasBlocoCard";
import { CalendarioBlocoCard } from "@/components/blocos/cruds/CalendarioBlocoCard";
import { TimersBlocoCard } from "@/components/blocos/cruds/TimersBlocoCard";
import { HabitosBlocoCard } from "@/components/blocos/cruds/HabitosBlocoCard";
import { BlocoDeNotas } from "@/components/blocos/cruds/BlocoDeNotas";
import type { Bloco } from "@/types/bloco";

// Mapeamento de ícones e títulos por tipo
const blockMeta: Record<string, { title: string; color: string }> = {
  tarefas: {
    title: "Tarefas",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  habitos: {
    title: "Hábitos",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  habito: {
    title: "Hábito",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  timer: {
    title: "Timer",
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  timers: {
    title: "Timers",
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  notas: {
    title: "Notas",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  lista: {
    title: "Lista",
    color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  },
  calendario: {
    title: "Calendário",
    color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  },
  colecoes: {
    title: "Coleções",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
};

interface BlockRendererProps {
  bloco: Bloco;
  nucleoId: string;
  isSubBloco?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  className?: string;
}

export function BlockRenderer({
  bloco,
  nucleoId,
  isSubBloco = false,
  onDelete,
  onEdit,
  onDuplicate,
  className,
}: BlockRendererProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const meta = blockMeta[bloco.tipo] || {
    title: bloco.tipo,
    color: "bg-gray-500/10 text-gray-500",
  };

  const commonProps = {
    bloco,
    nucleoId,
    onDelete: onDelete || (() => {}),
    onEdit: onEdit || (() => {}),
    isDeleting: false,
  };

  const renderContent = () => {
    switch (bloco.tipo) {
      case "colecoes":
        return <ColecoesBlocoCard {...commonProps} />;
      case "lista":
        return <ListasBlocoCard {...commonProps} />;
      case "tarefas":
        return <TarefasBlocoCard {...commonProps} />;
      case "calendario":
        return <CalendarioBlocoCard {...commonProps} />;
      case "timer":
      case "timers":
        return <TimersBlocoCard {...commonProps} />;
      case "habitos":
      case "habito":
        return <HabitosBlocoCard {...commonProps} />;
      case "notas":
        return (
          <BlocoDeNotas
            bloco={bloco}
            nucleoId={nucleoId}
            onDelete={onDelete || (() => {})}
          />
        );
      default:
        return (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Bloco do tipo "{bloco.tipo}" em desenvolvimento
            </p>
          </div>
        );
    }
  };

  const handleOpenFullPage = () => {
    router.push(`/dashboard/nucleos/${nucleoId}/blocos/${bloco.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn("group relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-200 hover:shadow-md",
          isSubBloco && "ml-6 border-l-2 border-l-primary/30",
        )}
      >
        {/* Cabeçalho do bloco */}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn("text-xs font-medium", meta.color)}
              >
                {meta.title}
              </Badge>
              {isSubBloco && (
                <Badge variant="secondary" className="text-[10px]">
                  Sub-bloco
                </Badge>
              )}
            </div>

            {/* Menu de ações - aparece no hover */}
            <div
              className={cn(
                "flex items-center gap-1 transition-opacity duration-200",
                isHovered ? "opacity-100" : "opacity-0",
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleOpenFullPage}
                title="Abrir em tela cheia"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onEdit}
                  title="Editar"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )}
              {onDuplicate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onDuplicate}
                  title="Duplicar"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={onDelete}
                  title="Excluir"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}

              {/* Drag handle para reordenar */}
              <div className="cursor-grab ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Título do bloco */}
          {bloco.titulo && (
            <CardTitle className="text-base font-medium mt-2">
              {bloco.titulo}
            </CardTitle>
          )}
        </CardHeader>

        <CardContent className="pt-0">{renderContent()}</CardContent>
      </Card>
    </motion.div>
  );
}
