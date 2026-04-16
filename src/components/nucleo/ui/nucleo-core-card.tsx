"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NucleoProgress } from "./nucleo-progress";
import type { NucleoComStats } from "@/types";
import {
  BookOpen,
  Heart,
  Briefcase,
  Home,
  Dumbbell,
  Palette,
  Music,
  Code,
  Trophy,
  Zap,
  Star,
} from "lucide-react";

interface NucleoCoreCardProps {
  nucleo: NucleoComStats;
  index?: number;
  onClick?: () => void;
  className?: string;
}

// Mapeamento de ícones por tipo
const iconesNucleo: Record<string, React.ReactNode> = {
  estudos: <BookOpen className="size-5" />,
  saude: <Heart className="size-5" />,
  trabalho: <Briefcase className="size-5" />,
  casa: <Home className="size-5" />,
  fitness: <Dumbbell className="size-5" />,
  arte: <Palette className="size-5" />,
  musica: <Music className="size-5" />,
  dev: <Code className="size-5" />,
  pessoal: <Star className="size-5" />,
};

// Cores por tipo
const coresNucleo: Record<string, string> = {
  estudos: "from-blue-500 to-indigo-600",
  saude: "from-green-500 to-emerald-600",
  trabalho: "from-amber-500 to-orange-600",
  casa: "from-rose-500 to-pink-600",
  fitness: "from-purple-500 to-violet-600",
  arte: "from-cyan-500 to-teal-600",
  musica: "from-red-500 to-rose-600",
  dev: "from-slate-500 to-zinc-600",
  pessoal: "from-indigo-500 to-purple-600",
};

export function NucleoCoreCard({
  nucleo,
  index = 0,
  onClick,
  className,
}: NucleoCoreCardProps) {
  const tipo = nucleo.tipo?.toLowerCase() || "pessoal";
  const icone = iconesNucleo[tipo] || <Star className="size-5" />;
  const corGradiente = coresNucleo[tipo] || coresNucleo.pessoal;
  const corDestaque = nucleo.corDestaque || "#6366f1";

  const xpTotal = nucleo.xpTotal || 0;
  const level = nucleo.level || 1;
  const nextLevelXp = nucleo.nextLevelXp || 100;
  const currentXp = nucleo.currentXp || 0;
  const conquistas = nucleo.conquistas || 0;
  const xpHoje = nucleo.xpHoje || 0;

  const progressoXp = Math.min((currentXp / nextLevelXp) * 100, 100);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        "border border-border/50",
        className,
      )}
      onClick={onClick}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Faixa superior colorida */}
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
            {/* Ícone do núcleo */}
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

          {/* Badge de nível */}
          <Badge variant="secondary" className="font-bold">
            <Trophy className="size-3 mr-1" />
            Nv. {level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Descrição */}
        {nucleo.descricao && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {nucleo.descricao}
          </p>
        )}

        {/* Barra de XP */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progresso do Nível</span>
            <span className="font-medium">
              {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
            </span>
          </div>
          <Progress value={progressoXp} className="h-2" />
        </div>

        {/* Estatísticas */}
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

      {/* Efeito de hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${corDestaque}, transparent 70%)`,
        }}
      />
    </Card>
  );
}
