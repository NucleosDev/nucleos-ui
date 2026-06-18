import { cn } from "@/lib/utils";

interface WaveDividerProps {
  /** Cor da wave (o formato da onda) */
  waveColor?: string;
  /** Cor da seção de baixo (aparece através do recorte da wave) */
  bottomBg?: string;
  flipX?: boolean;
  flipY?: boolean;
  className?: string;
}

export function WaveDivider({
  waveColor = "var(--background)",
  bottomBg,
  flipX = false,
  flipY = false,
  className,
}: WaveDividerProps) {
  // Aplicar transformações mantendo a posição
  const transform = [flipX && "scaleX(-1)", flipY && "scaleY(-1)"]
    .filter(Boolean)
    .join(" ");

  // Adicionar translate para centralizar quando inverter
  const transformStyle = transform
    ? {
        transform: transform,
        transformOrigin: "center center", // Isso evita deslocamento
      }
    : undefined;

  const hasBottomBg = !!bottomBg;

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 w-full leading-none z-10 pointer-events-none",
        className,
      )}
      aria-hidden="true"
    >
      <div style={transformStyle}>
        {hasBottomBg ? (
          <svg
            viewBox="0 0 500 80"
            preserveAspectRatio="none"
            className="w-full h-[80px] -mb-px block"
          >
            <rect x="0" y="0" width="500" height="80" fill={bottomBg} />
            <path
              d="M0,20 C150,-40 340,80 500,40 L500,80 L0,80 Z"
              fill={waveColor}
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 500 80"
            preserveAspectRatio="none"
            className="w-full h-[80px] -mb-px block"
            fill={waveColor}
          >
            <path d="M0,20 C150,-40 340,80 500,40 L500,80 L0,80 Z" />
          </svg>
        )}
      </div>
    </div>
  );
}
