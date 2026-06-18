import React, { CSSProperties, ReactNode } from "react";
import Image from "next/image";

type IPhoneModel = "14" | "14-pro" | "15" | "15-pro" | "x" | "plain";

type Orientation = "portrait" | "landscape";

type WallpaperFit = "cover" | "contain" | "fill";

export interface IPhoneMockupProps {
  model?: IPhoneModel;
  color?:
    | "black"
    | "midnight"
    | "silver"
    | "starlight"
    | "space-black"
    | "gold"
    | "blue"
    | "pink"
    | "titanium"
    | "natural-titanium"
    | "green"
    | "red"
    | string;
  orientation?: Orientation;
  scale?: number;

  // Frame
  bezel?: number;
  radius?: number;
  shadow?: boolean | string;

  // Screen + content
  screenBg?: string;
  wallpaper?: string;
  wallpaperFit?: WallpaperFit;
  wallpaperPosition?: string;

  // Cutouts
  showDynamicIsland?: boolean;
  showNotch?: boolean;
  islandWidth?: number;
  islandHeight?: number;
  islandRadius?: number;
  notchWidth?: number;
  notchHeight?: number;
  notchRadius?: number;

  // Safe area insets
  safeArea?: boolean;
  safeAreaOverrides?: Partial<{
    top: number;
    bottom: number;
    left: number;
    right: number;
  }>;

  // Details
  showHomeIndicator?: boolean;
  innerShadow?: boolean;

  // Custom styling hooks
  style?: CSSProperties;
  className?: string;
  frameStyle?: CSSProperties;
  screenStyle?: CSSProperties;

  children?: ReactNode;
}

/* Device specs (logical pixels) */
const DEVICE_SPECS: Record<
  IPhoneModel,
  {
    w: number;
    h: number;
    radius: number;
    bezel: number;
    topSafe: number;
    bottomSafe: number;
    notch?: { w: number; h: number; r: number };
    island?: { w: number; h: number; r: number };
  }
> = {
  x: {
    w: 375,
    h: 812,
    radius: 50,
    bezel: 12,
    topSafe: 47,
    bottomSafe: 34,
    notch: { w: 210, h: 35, r: 18 },
  },
  "14": {
    w: 390,
    h: 844,
    radius: 56,
    bezel: 12,
    topSafe: 47,
    bottomSafe: 34,
    notch: { w: 225, h: 33, r: 18 },
  },
  "14-pro": {
    w: 393,
    h: 852,
    radius: 56,
    bezel: 12,
    topSafe: 59,
    bottomSafe: 34,
    island: { w: 126, h: 37, r: 20 },
  },
  "15": {
    w: 393,
    h: 852,
    radius: 56,
    bezel: 12,
    topSafe: 59,
    bottomSafe: 34,
    island: { w: 126, h: 37, r: 20 },
  },
  "15-pro": {
    w: 393,
    h: 852,
    radius: 56,
    bezel: 12,
    topSafe: 59,
    bottomSafe: 34,
    island: { w: 126, h: 37, r: 20 },
  },
  plain: {
    w: 390,
    h: 844,
    radius: 56,
    bezel: 12,
    topSafe: 16,
    bottomSafe: 16,
  },
};

const PRESET_COLORS: Record<string, string> = {
  black: "#0b0b0d",
  midnight: "#0b0c10",
  silver: "#d7d8dc",
  starlight: "#f1eee9",
  "space-black": "#1c1e22",
  gold: "#f2dfb3",
  blue: "#2b4fa8",
  pink: "#ffbfd1",
  titanium: "#837a72",
  "natural-titanium": "#a69a8a",
  green: "#2b622e",
  red: "#c81f2f",
};

function shade(hex: string, pct: number): string {
  const h = hex.trim();
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  if (!m) return hex;
  const [r, g, b] = [
    parseInt(m[1], 16),
    parseInt(m[2], 16),
    parseInt(m[3], 16),
  ];
  const k = (100 + pct) / 100;
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `#${to(r).toString(16).padStart(2, "0")}${to(g).toString(16).padStart(2, "0")}${to(b).toString(16).padStart(2, "0")}`;
}

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({
  model = "14-pro",
  color = "space-black",
  orientation = "portrait",
  scale = 1,

  bezel,
  radius,
  shadow = true,

  screenBg = "#000",
  wallpaper,
  wallpaperFit = "cover",
  wallpaperPosition = "center",

  showDynamicIsland,
  showNotch,
  islandWidth,
  islandHeight,
  islandRadius,
  notchWidth,
  notchHeight,
  notchRadius,

  safeArea = true,
  safeAreaOverrides,

  showHomeIndicator = true,
  innerShadow = true,

  style,
  className,
  frameStyle,
  screenStyle,

  children,
}) => {
  const spec = DEVICE_SPECS[model];
  const W = spec.w;
  const H = spec.h;

  // Sempre usar Dynamic Island (mesmo para modelos com notch)
  const useIsland = true;
  const useNotch = false;

  const resolvedRadius = radius ?? spec.radius;
  const resolvedBezel = bezel ?? spec.bezel;

  const isLandscape = orientation === "landscape";
  const screenWidth = isLandscape ? H : W;
  const screenHeight = isLandscape ? W : H;

  const outerWidth = screenWidth + resolvedBezel * 2;
  const outerHeight = screenHeight + resolvedBezel * 2;
  const outerRadius = resolvedRadius + resolvedBezel;

  const colorHex = PRESET_COLORS[color] ?? color;
  const frameGradient = `linear-gradient(135deg, ${shade(colorHex, 8)} 0%, ${colorHex} 40%, ${shade(colorHex, -14)} 100%)`;

  const outerShadow =
    typeof shadow === "string"
      ? shadow
      : shadow
        ? `0 12px 30px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.22)`
        : "none";

  const innerShadowCss = innerShadow
    ? "inset 0 0 0 1px rgba(255,255,255,0.03), inset 0 10px 20px rgba(0,0,0,0.35), inset 0 -8px 16px rgba(0,0,0,0.28)"
    : "none";

  const finalIslandW = islandWidth ?? 220;
  const finalIslandH = islandHeight ?? 38;
  const finalIslandR = islandRadius ?? 20;

  const insets = {
    top: safeAreaOverrides?.top ?? DEVICE_SPECS["15-pro"].topSafe,
    bottom: safeAreaOverrides?.bottom ?? DEVICE_SPECS["15-pro"].bottomSafe,
    left: safeAreaOverrides?.left ?? 0,
    right: safeAreaOverrides?.right ?? 0,
  };

  const wrapperStyle: CSSProperties = {
    boxSizing: "border-box",
    display: "inline-block",
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    ...style,
  };

  const frameBoxStyle: CSSProperties = {
    width: outerWidth,
    height: outerHeight,
    borderRadius: outerRadius,
    background: frameGradient,
    padding: resolvedBezel,
    boxSizing: "border-box",
    boxShadow: outerShadow,
    position: "relative",
    overflow: "hidden",
    ...frameStyle,
  };

  const screenBoxStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    borderRadius: resolvedRadius,
    position: "relative",
    overflow: "hidden",
    background: screenBg,
    boxShadow: innerShadowCss,
    ...screenStyle,
  };

  const wallpaperStyle: CSSProperties | undefined = wallpaper
    ? {
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: wallpaperFit,
        backgroundPosition: wallpaperPosition,
        backgroundRepeat: "no-repeat",
        zIndex: 0,
      }
    : undefined;

  const cutoutCommon: CSSProperties = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#000",
    zIndex: 2,
    boxShadow: "0 1px 2px rgba(0,0,0,0.7)",
  };

  const homeIndicatorStyle: CSSProperties = {
    position: "absolute",
    bottom: 8,
    left: "50%",
    transform: "translateX(-50%)",
    width: Math.round(screenWidth * 0.34),
    maxWidth: 140,
    height: 5,
    borderRadius: 3,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.35))",
    opacity: 0.9,
    zIndex: 3,
    pointerEvents: "none",
  };

  const contentStyle: CSSProperties = safeArea
    ? {
        position: "absolute",
        top: insets.top,
        right: insets.right,
        bottom: insets.bottom,
        left: insets.left,
        overflow: "hidden",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
      }
    : {
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
      };

  // ECG line path generator
  const generateEcgPath = (width: number, height: number) => {
    const margin = width * 0.05;
    const startX = margin;
    const endX = width - margin;
    const availableWidth = endX - startX;
    const cx = width / 2;
    const cy = height * 0.5;
    const amp = height * 0.25;

    return `M ${startX} ${cy} 
      L ${cx - availableWidth * 0.18} ${cy} 
      L ${cx - availableWidth * 0.12} ${cy - amp * 0.5} 
      L ${cx - availableWidth * 0.07} ${cy + amp * 0.35} 
      L ${cx - availableWidth * 0.025} ${cy - amp * 2.2} 
      L ${cx + availableWidth * 0.035} ${cy + amp * 1.6} 
      L ${cx + availableWidth * 0.08} ${cy - amp * 0.9} 
      L ${cx + availableWidth * 0.13} ${cy + amp * 0.2} 
      L ${cx + availableWidth * 0.18} ${cy} 
      L ${endX} ${cy}`;
  };

  return (
    <div className={className} style={wrapperStyle}>
      <div style={frameBoxStyle} aria-label={`iPhone mockup (${model})`}>
        <div style={screenBoxStyle}>
          {/* Imagem placeholder como wallpaper */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
            }}
          >
            <Image
              src="/hero-nucleos-mobile.svg"
              alt="iPhone screen"
              fill
              sizes={`${screenWidth}px`}
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          {/* Wallpaper adicional se fornecido */}
          {wallpaper && <div aria-hidden style={wallpaperStyle} />}

          {/* Dynamic Island - tamanho fixo do 15-pro */}
          <div
            aria-hidden
            style={{
              ...cutoutCommon,
              top: 11,
              width: finalIslandW,
              height: finalIslandH,
              borderRadius: finalIslandR,
              overflow: "hidden",
            }}
          >
            {/* ECG Heartbeat Line */}
            <svg
              width={finalIslandW}
              height={finalIslandH}
              viewBox={`0 0 ${finalIslandW} ${finalIslandH}`}
              style={{
                position: "absolute",
                top: 3,
                left: 0,
                height: "80%",
                opacity: 0.8,
                zIndex: 0,
              }}
            >
              <defs>
                <linearGradient
                  id={`islandEcgGrad-${finalIslandW}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity="0"
                  />
                  <stop
                    offset="15%"
                    stopColor="var(--primary)"
                    stopOpacity="0.6"
                  />
                  <stop
                    offset="50%"
                    stopColor="var(--primary)"
                    stopOpacity="1"
                  />
                  <stop
                    offset="85%"
                    stopColor="var(--primary)"
                    stopOpacity="0.6"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity="0"
                  />
                </linearGradient>
                <filter id={`islandGlow-${finalIslandW}`}>
                  <feGaussianBlur stdDeviation="0.6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d={generateEcgPath(finalIslandW, finalIslandH)}
                fill="none"
                stroke={`url(#islandEcgGrad-${finalIslandW})`}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#islandGlow-${finalIslandW})`}
              />
            </svg>

            {/* Logo no canto direito */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: finalIslandW * 0.08,
                transform: "translateY(-50%)",
                opacity: 0.8,
                zIndex: 1,
              }}
            >
              <Image
                src="/Icon.svg"
                alt="Logo"
                width={finalIslandH * 0.8}
                height={finalIslandH * 0.8}
                style={{
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Brilho superior */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "35%",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)",
                borderRadius: `${finalIslandR}px ${finalIslandR}px 0 0`,
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Screen content */}
          <div style={contentStyle}>{children}</div>

          {/* Home indicator */}
          {showHomeIndicator && <div aria-hidden style={homeIndicatorStyle} />}
        </div>
      </div>
    </div>
  );
};

export default IPhoneMockup;
