// src/components/nucleo/ui/nucleo-core-card.tsx
"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Trophy,
  BookOpen,
  Heart,
  Briefcase,
  Home,
  Dumbbell,
  Palette,
  Music,
  Code,
  Star,
} from "lucide-react";
import type { NucleoComStats } from "@/types/nucleo";

interface NucleoCoreCardProps {
  nucleo: NucleoComStats;
  index?: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  className?: string;
}

// Mapeamento de ícones por tipo (lowercase)
const iconesNucleo: Record<string, React.ReactNode> = {
  estudo: <BookOpen className="size-5" />,
  saude: <Heart className="size-5" />,
  profissional: <Briefcase className="size-5" />,
  pessoal: <Home className="size-5" />,
  fitness: <Dumbbell className="size-5" />,
  arte: <Palette className="size-5" />,
  musica: <Music className="size-5" />,
  programacao: <Code className="size-5" />,
  hobby: <Star className="size-5" />,
};

const coresNucleo: Record<string, string> = {
  estudo: "from-blue-500 to-indigo-600",
  saude: "from-green-500 to-emerald-600",
  profissional: "from-amber-500 to-orange-600",
  pessoal: "from-rose-500 to-pink-600",
  fitness: "from-purple-500 to-violet-600",
  arte: "from-cyan-500 to-teal-600",
  musica: "from-red-500 to-rose-600",
  programacao: "from-slate-500 to-zinc-600",
  hobby: "from-indigo-500 to-purple-600",
};

export function NucleoCoreCard({
  nucleo,
  index = 0,
  onClick,
  onEdit,
  onDelete,
  onArchive,
  className,
}: NucleoCoreCardProps) {
  const tipo = nucleo.tipo?.toLowerCase() || "pessoal";
  const icone = iconesNucleo[tipo] || <Star className="size-5" />;
  const corGradiente = coresNucleo[tipo] || coresNucleo.hobby;
  const corDestaque = nucleo.corDestaque || "#6366f1";

  const xpTotal = nucleo.xpTotal ?? 0;
  const level = nucleo.level ?? 1;
  const nextLevelXp = nucleo.nextLevelXp ?? 100;
  const currentXp = nucleo.currentXp ?? 0;
  const conquistas = nucleo.conquistas ?? 0;
  const xpHoje = nucleo.xpHoje ?? 0;

  const progressoXp =
    nextLevelXp > 0 ? Math.min((currentXp / nextLevelXp) * 100, 100) : 0;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 border border-border/50",
        className,
      )}
      onClick={onClick}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className={cn("h-2 w-full bg-gradient-to-r", corGradiente)}
        style={{
          background: nucleo.corDestaque
            ? `linear-gradient(to right, ${nucleo.corDestaque}, ${nucleo.corDestaque}dd)`
            : undefined,
        }}
      />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl text-white bg-gradient-to-br shadow-md",
                corGradiente,
              )}
              style={{
                background: nucleo.corDestaque
                  ? `linear-gradient(135deg, ${nucleo.corDestaque}, ${nucleo.corDestaque}dd)`
                  : undefined,
              }}
            >
              {icone}
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                {nucleo.nome}
              </h3>
              <p className="text-xs text-muted-foreground capitalize">{tipo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-bold">
              <Trophy className="size-3 mr-1" /> Nv. {level}
            </Badge>

            {(onEdit || onDelete || onArchive) && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
                  )}
                  {onArchive && (
                    <DropdownMenuItem onClick={onArchive}>
                      Arquivar
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={onDelete}
                        className="text-destructive"
                      >
                        Deletar
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {nucleo.descricao && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {nucleo.descricao}
          </p>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progresso do Nível</span>
            <span className="font-medium">
              {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
            </span>
          </div>
          <Progress value={progressoXp} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-primary">
              {xpTotal.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">XP Total</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-amber-500">{conquistas}</p>
            <p className="text-xs text-muted-foreground">Conquistas</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-green-500">+{xpHoje}</p>
            <p className="text-xs text-muted-foreground">XP Hoje</p>
          </div>
        </div>
      </CardContent>

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${corDestaque}, transparent 70%)`,
        }}
      />
    </Card>
  );
}
