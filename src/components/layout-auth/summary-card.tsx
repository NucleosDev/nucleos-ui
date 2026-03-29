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
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
  className,
}: SummaryCardProps) {
  const isEmpty = value === null || value === undefined;

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          {title}
        </p>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            "bg-accent text-accent-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary",
            iconClassName,
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {isEmpty ? (
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
        ) : (
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </span>
        )}
        {subtitle ? (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        ) : (
          <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
        )}
      </div>
    </article>
  );
}
