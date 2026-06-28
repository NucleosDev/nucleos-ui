import { Check, X, Sparkles, Zap, Trophy, Target, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const comparisons = [
  {
    id: "1",
    feature: "Tarefas",
    semNucleos: "Espalhadas em vários apps",
    comNucleos: "Tudo em um só lugar",
    icon: <Zap className="size-5 text-[#4D7CFF]" />,
  },
  {
    id: "2",
    feature: "Motivação",
    semNucleos: "Facilmente perdida",
    comNucleos: "Sistema de XP e níveis",
    icon: <Trophy className="size-5 text-[#FFD700]" />,
  },
  {
    id: "3",
    feature: "Rotina",
    semNucleos: "Sem visão geral",
    comNucleos: "Dashboard completo",
    icon: <Target className="size-5 text-[#00C9A7]" />,
  },
  {
    id: "4",
    feature: "Incentivo",
    semNucleos: "Difícil manter hábitos",
    comNucleos: "Streaks e conquistas",
    icon: <Flame className="size-5 text-[#FF8C42]" />,
  },
  {
    id: "5",
    feature: "Visual",
    semNucleos: "Sem personalização",
    comNucleos: "Nucleos personalizados",
    icon: <Sparkles className="size-5 text-[#2EBD59]" />,
  },
];

export function Comparison() {
  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-8 lg:px-16 bg-background">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4D7CFF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-12 text-center">
        <Badge
          variant="outline"
          className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF] mb-4"
        >
          <Sparkles className="size-4" />
          <span>Evolução.</span>
        </Badge>

        <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          A diferença que o{" "}
          <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Nucleos
          </span>{" "}
          faz
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Compare sua rotina antes e depois de usar o Nucleos.
        </p>
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden rounded-2xl border border-border/50 shadow-2xl">

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_2fr_2fr]">
          <div className="p-6 bg-muted/20 border-b border-border/50 flex items-center">
            <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground/60">
              Aspecto
            </span>
          </div>
          <div className="p-6 bg-muted/30 border-b border-l border-border/50 flex items-center justify-center gap-3">
            <X className="size-5 text-muted-foreground/50" />
            <span className="font-semibold text-muted-foreground text-base">
              Antes do Nucleos
            </span>
          </div>
          <div className="p-6 border-b border-l border-[#4D7CFF]/20 flex items-center justify-center gap-3 bg-gradient-to-r from-[#4D7CFF]/10 to-[#00C9A7]/10">
            <Check className="size-5 text-[#00C9A7]" />
            <span className="font-semibold text-base bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] bg-clip-text text-transparent">
              Depois do Nucleos
            </span>
          </div>
        </div>

        {/* Rows */}
        {comparisons.map((item, index) => (
          <div
            key={item.id}
            className={`grid grid-cols-[1fr_2fr_2fr] group transition-colors hover:bg-muted/10 ${
              index !== comparisons.length - 1 ? "border-b border-border/40" : ""
            }`}
          >
            {/* Feature */}
            <div className="p-6 flex items-center gap-3 bg-muted/10">
              <div className="shrink-0 size-9 rounded-xl bg-background border border-border/60 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <span className="font-semibold text-sm text-foreground/90">
                {item.feature}
              </span>
            </div>

            {/* Before */}
            <div className="p-6 border-l border-border/40 flex items-center justify-center">
              <div className="flex items-center gap-2.5 text-muted-foreground/70">
                <div className="shrink-0 size-5 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center">
                  <X className="size-3 text-muted-foreground/50" />
                </div>
                <span className="text-sm">{item.semNucleos}</span>
              </div>
            </div>

            {/* After */}
            <div className="p-6 border-l border-[#4D7CFF]/15 flex items-center justify-center bg-gradient-to-r from-[#4D7CFF]/5 to-[#00C9A7]/5">
              <div className="flex items-center gap-2.5">
                <div className="shrink-0 size-5 rounded-full bg-gradient-to-br from-[#4D7CFF] to-[#00C9A7] flex items-center justify-center shadow-sm shadow-[#4D7CFF]/20">
                  <Check className="size-3 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {item.comNucleos}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom badges */}
      <div className="mt-10 flex justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4D7CFF]/10 border border-[#4D7CFF]/20">
          <Trophy className="size-4 text-[#FFD700]" />
          <span className="text-sm font-medium">Conquiste.</span>
        </div>
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00C9A7]/10 border border-[#00C9A7]/20">
          <Flame className="size-4 text-[#FF8C42]" />
          <span className="text-sm font-medium">Desafie-se.</span>
        </div>
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2EBD59]/10 border border-[#2EBD59]/20">
          <Sparkles className="size-4 text-[#2EBD59]" />
          <span className="text-sm font-medium">Evolua.</span>
        </div>
      </div>
    </section>
  );
}
