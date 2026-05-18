// components/ui/landing-cards-nucleos.tsx
import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Sparkles,
  Zap,
  Award,
  Layers,
  Globe,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import { LiquidGlass } from "./liquid-glass";
import { BgUser } from "../user/bg-user";

// --- Utility for class name merging ---
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Simple hash function for consistent mock numbers ---
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// --- Types ---
interface Feature {
  Icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

interface MockNucleoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  type?: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

interface FeatureGridProps {
  sectionTitle: string;
  sectionDescription: string;
  features?: Feature[];
  className?: string;
  ref?: React.Ref<HTMLElement>;
}

// --- Mock Nucleo Card Sub-component ---
const MockNucleoCard = React.forwardRef<HTMLDivElement, MockNucleoCardProps>(
  (
    {
      icon: Icon,
      title,
      description,
      color = "#4D7CFF",
      type = "núcleo",
      className,
    },
    ref,
  ) => {
    const titleId = React.useId();

    // Gerar stats mockados consistentes usando hash do título
    const mockStats = React.useMemo(() => {
      const seed = hashString(title);
      const blocosCount = (seed % 12) + 1;
      const conquistasCount = hashString(title + "conquistas") % 5;
      const conexoesCount = hashString(title + "conexoes") % 8;

      return {
        blocosCount,
        conquistasCount,
        conexoesCount,
      };
    }, [title]);

    return (
      <LiquidGlass
        ref={ref}
        className={cn(
          "group relative isolate overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer",
          "shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2),0_8px_10px_-6px_rgba(0,0,0,0.1)]",
          "border border-/10 bg-black/5 backdrop-blur-lg",
          "dark:bg-black/30 dark:hover:bg-black/50",
          "hover:scale-[1.02] hover:border-accent-foreground/20",
          className,
        )}
        aria-labelledby={titleId}
      >
        {/* SVG clipPath para a wave */}
        <svg
          width="0"
          height="0"
          className="absolute pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <clipPath
              id={`mock-wave-clip-${titleId}`}
              clipPathUnits="objectBoundingBox"
            >
              <path d="M 0 0 L 1 0 L 1 0.85 C 0.68 1, 0.30 0.55, 0 0.775 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Image / Gradient Section */}
        <div
          className="relative w-full overflow-hidden h-[200px]"
          style={{
            clipPath: `url(#mock-wave-clip-${titleId})`,
            WebkitClipPath: `url(#mock-wave-clip-${titleId})`,
          }}
        >
          {/* Gradient aura */}
          <div
            className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${color}30 0%, ${color}18 40%, oklch(0.115 0.018 245 / 0.4) 100%)`,
            }}
          >
            {/* Radial glow */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 70% 70% at 30% 40%, ${color}25 0%, transparent 70%)`,
              }}
            />
            {/* Faint grid texture */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, oklch(1 0 0) 0px, oklch(1 0 0) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, oklch(1 0 0) 0px, oklch(1 0 0) 1px, transparent 1px, transparent 28px)`,
              }}
            />
          </div>

          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-card/95 via-card/50 to-transparent" />
          <div
            className="absolute inset-0 z-10 opacity-30"
            style={{
              background: `radial-gradient(ellipse 60% 80% at 80% 20%, ${color}44 0%, transparent 70%)`,
            }}
          />

          {/* Type badge */}
          <div className="absolute top-3 right-3 z-30">
            <div
              className="px-2.5 py-1 rounded-full text-xs font-medium text- capitalize"
              style={{
                background: `${color}55`,
                backdropFilter: "blur(10px) saturate(140%)",
                WebkitBackdropFilter: "blur(10px) saturate(140%)",
                border: `1px solid ${color}66`,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.18), 0 2px 6px rgba(0,0,0,0.12)",
              }}
            >
              {type}
            </div>
          </div>
        </div>

        {/* Floating icon */}
        <div className="absolute z-30 left-12" style={{ top: "122px" }}>
          <div className="relative inline-flex">
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-2xl blur-xl opacity-55"
              style={{ background: color }}
            />
            {/* Glass icon container */}
            <div
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(145deg, ${color}ee, ${color}bb)`,
                border: "1.5px solid rgba(255,255,255,0.28)",
                boxShadow:
                  "inset 0 1.5px 0 rgba(255,255,255,0.40), 0 8px 20px rgba(0,0,0,0.22)",
              }}
            >
              <Icon className="h-7 w-7 text-" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative p-5 transition-all duration-300">
          {/* Title */}
          <div className="mb-3">
            <h3
              id={titleId}
              className="text-lg font-bold leading-tight tracking-tight text-foreground line-clamp-1 group-hover:text-foreground/60 transition-colors"
            >
              {title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>

          {/* Stats Section */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {mockStats.conquistasCount > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5">
                <Award className="h-3 w-3 text-yellow-500" />
                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                  {mockStats.conquistasCount} conquistas
                </span>
              </div>
            )}

            {mockStats.conexoesCount > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-primary-500/10 px-2 py-0.5">
                <Globe className="h-3 w-3 text-primary-500" />
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                  {mockStats.conexoesCount} conexões
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5">
              <Layers className="h-3 w-3 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {mockStats.blocosCount} blocos
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Criado recentemente
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">Ativo</span>
            </div>
          </div>
        </div>
      </LiquidGlass>
    );
  },
);
MockNucleoCard.displayName = "MockNucleoCard";

// --- Main FeatureGrid Component ---
export const FeatureGrid = React.forwardRef<HTMLElement, FeatureGridProps>(
  (
    { sectionTitle, sectionDescription, features = [], className, ...props },
    ref,
  ) => {
    const titleId = React.useId();

    // Cores para os cards mock
    const mockColors = [
      "#4D7CFF",
      "#00C9A7",
      "#FF6B6B",
      "#A78BFA",
      "#F59E0B",
      "#EC4899",
    ];

    // Tipos para os cards mock
    const mockTypes = [
      "estudo",
      "projeto",
      "hobby",
      "profissional",
      "pessoal",
      "fitness",
    ];

    return (
      <div className="h-full relative w-full">
        <BgUser></BgUser>
        <section
          ref={ref}
          className={cn("w-full py-12", className)}
          aria-labelledby={titleId}
          {...props}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2
                id={titleId}
                className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl"
              >
                {sectionTitle}
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                {sectionDescription}
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <MockNucleoCard
                  key={index}
                  icon={feature.Icon}
                  title={feature.title}
                  description={feature.description}
                  color={mockColors[index % mockColors.length]}
                  type={mockTypes[index % mockTypes.length]}
                  className={feature.className}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  },
);
FeatureGrid.displayName = "FeatureGrid";
