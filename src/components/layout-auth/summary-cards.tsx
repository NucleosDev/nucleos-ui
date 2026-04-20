import { Boxes, CheckCheck, Clock, TrendingUp } from "lucide-react";
import { SummaryCard } from "./summary-card";

export interface SummaryData {
  activeNucleos: number | null;
  tasksCompletedToday: number | null;
  focusedTimeMinutes: number | null;
  overallProgress: number | null;
}

interface SummaryCardsProps {
  data?: SummaryData | null;
}

function formatFocusTime(minutes: number | null): string | null {
  if (minutes === null) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return `${h}h ${m}min`;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  return (
    <section aria-label="Resumo rápido">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          title="Nucleos ativos"
          value={data?.activeNucleos ?? null}
          subtitle={
            data?.activeNucleos !== null && data?.activeNucleos !== undefined
              ? data.activeNucleos === 1
                ? "1 Nucleo em andamento"
                : `${data.activeNucleos} Nucleos em andamento`
              : null
          }
          icon={Boxes}
        />
        <SummaryCard
          title="Tarefas concluídas hoje"
          value={data?.tasksCompletedToday ?? null}
          subtitle={
            data?.tasksCompletedToday !== null &&
            data?.tasksCompletedToday !== undefined
              ? "tarefas finalizadas hoje"
              : null
          }
          icon={CheckCheck}
          iconClassName="bg-green-50 text-green-600 group-hover:bg-green-100 group-hover:text-green-700"
        />
        <SummaryCard
          title="Tempo focado"
          value={formatFocusTime(data?.focusedTimeMinutes ?? null)}
          subtitle={
            data?.focusedTimeMinutes !== null &&
            data?.focusedTimeMinutes !== undefined
              ? "de foco acumulado"
              : null
          }
          icon={Clock}
          iconClassName="bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700"
        />
        <SummaryCard
          title="Progresso geral"
          value={
            data?.overallProgress !== null &&
            data?.overallProgress !== undefined
              ? `${data.overallProgress}%`
              : null
          }
          subtitle={
            data?.overallProgress !== null &&
            data?.overallProgress !== undefined
              ? "da meta total atingida"
              : null
          }
          icon={TrendingUp}
          iconClassName="bg-amber-50 text-amber-600 group-hover:bg-amber-100 group-hover:text-amber-700"
        />
      </div>
    </section>
  );
}
