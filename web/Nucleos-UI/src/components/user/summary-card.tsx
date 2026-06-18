import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: number | string | null;
  subtitle?: string | null;
  icon: LucideIcon;
  iconClassName?: string;
  trend?: "up" | "down" | "neutral" | null;
  className?: string;
}

export function SummaryCard({
  title, value, subtitle, icon: Icon, iconClassName, className,
}: SummaryCardProps) {
  const isEmpty = value === null || value === undefined;

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border/50",
        "bg-card/60 backdrop-blur-sm p-4 overflow-hidden",
        "transition-all duration-[var(--duration-base)]",
        "hover:border-border/80 hover:shadow-[var(--shadow-sm)] hover:-translate-y-px",
        className,
      )}
    >
      {/* Inner top highlight — reveals on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-base)]" />

      <div className="flex items-start justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
          {title}
        </p>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            "bg-muted/50 text-muted-foreground/60",
            "transition-colors duration-[var(--duration-fast)]",
            "group-hover:bg-primary/10 group-hover:text-primary",
            iconClassName,
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        {isEmpty ? (
          <div className="h-7 w-20 animate-pulse rounded-md bg-muted/50" />
        ) : (
          <span className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
            {value}
          </span>
        )}
        {subtitle ? (
          <p className="text-[11px] text-muted-foreground/50 leading-relaxed">{subtitle}</p>
        ) : (
          <div className="h-3 w-28 animate-pulse rounded bg-muted/40" />
        )}
      </div>
    </article>
  );
}
