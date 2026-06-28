// @ts-nocheck
"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";

// ── Variant presets ────────────────────────────────────────────────────────────

const VARIANT_PRESETS = {
  minimal: {
    blurIntensity: "sm",
    glowIntensity: "none",
    shadowIntensity: "xs",
  },
  subtle: { blurIntensity: "sm", glowIntensity: "xs", shadowIntensity: "sm" },
  default: { blurIntensity: "md", glowIntensity: "sm", shadowIntensity: "sm" },
  strong: { blurIntensity: "lg", glowIntensity: "md", shadowIntensity: "md" },
  floating: { blurIntensity: "lg", glowIntensity: "md", shadowIntensity: "sm" },
  dark: { blurIntensity: "xl", glowIntensity: "sm", shadowIntensity: "xs" },
  visionOS: { blurIntensity: "xl", glowIntensity: "lg", shadowIntensity: "sm" },
  interactive: {
    blurIntensity: "sm",
    glowIntensity: "xs",
    shadowIntensity: "sm",
  },
  button: {
    blurIntensity: "md",
    glowIntensity: "sm",
    shadowIntensity: "sm",
  },
  panel: {
    blurIntensity: "xl",
    glowIntensity: "none",
    shadowIntensity: "none",
  },
  inline: {
    blurIntensity: "none",
    glowIntensity: "none",
    shadowIntensity: "none",
  },
};

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  // New API
  variant?: keyof typeof VARIANT_PRESETS;
  radius?: string;
  interactive?: boolean;
  // Legacy API
  draggable?: boolean;
  expandable?: boolean;
  width?: string;
  height?: string;
  expandedWidth?: string;
  expandedHeight?: string;
  blurIntensity?: "sm" | "md" | "lg" | "xl" | "none";
  shadowIntensity?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  borderRadius?: string;
  glowIntensity?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  [key: string]: any;
}

export const LiquidGlass = ({
  children,
  className = "",
  // New API
  variant,
  radius,
  interactive,
  // Legacy API
  draggable = false,
  expandable = false,
  width,
  height,
  expandedWidth,
  expandedHeight,
  blurIntensity: blurProp,
  borderRadius: borderRadiusProp,
  glowIntensity: glowProp,
  shadowIntensity: shadowProp,
  ...props
}: LiquidGlassProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Resolve props: variant presets override individual props
  const preset = variant
    ? (VARIANT_PRESETS[variant] ?? VARIANT_PRESETS.default)
    : null;
  const blurIntensity = preset?.blurIntensity ?? blurProp ?? "xl";
  const glowIntensity = preset?.glowIntensity ?? glowProp ?? "sm";
  const shadowIntensity = preset?.shadowIntensity ?? shadowProp ?? "md";
  const borderRadius = radius ?? borderRadiusProp ?? "32px";

  // Button variant sempre tem hover/tap e cursor pointer
  const isButton = variant === "button";

  // Panel variant: sem bordas, apenas vidro puro
  const isPanel = variant === "panel";

  // Floating variant: animação de flutuação automática
  const isFloating = variant === "floating";

  // Interactive variant: hover/tap ativado por padrão
  const isInteractive = variant === "interactive";

  // Determina se deve ter animações de interação
  const hasHoverTap =
    isButton ||
    isInteractive ||
    interactive === true ||
    (interactive !== false && (draggable || expandable));

  const hasMotion = draggable || expandable || hasHoverTap || isFloating;

  const handleToggleExpansion = (e: {
    target: { closest: (arg0: string) => any };
  }) => {
    if (!expandable) return;
    if (e.target.closest("a, button, input, select, textarea")) return;
    setIsExpanded(!isExpanded);
  };

  const blurClasses = {
    sm: "backdrop-blur-xs",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  const shadowStyles = {
    none: "inset 0 0 0 0 rgba(255, 255, 255, 0)",
    xs: "inset 1px 1px 1px 0 rgba(255, 255, 255, 0.3), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.3)",
    sm: "inset 2px 2px 2px 0 rgba(255, 255, 255, 0.35), inset -2px -2px 2px 0 rgba(255, 255, 255, 0.35)",
    md: "inset 3px 3px 3px 0 rgba(255, 255, 255, 0.45), inset -3px -3px 3px 0 rgba(255, 255, 255, 0.45)",
    lg: "inset 4px 4px 4px 0 rgba(255, 255, 255, 0.5), inset -4px -4px 4px 0 rgba(255, 255, 255, 0.5)",
    xl: "inset 6px 6px 6px 0 rgba(255, 255, 255, 0.55), inset -6px -6px 6px 0 rgba(255, 255, 255, 0.55)",
    "2xl":
      "inset 8px 8px 8px 0 rgba(255, 255, 255, 0.6), inset -8px -8px 8px 0 rgba(255, 255, 255, 0.6)",
  };

  const glowStyles = {
    none: "0 0 0 0 rgba(0, 0, 0, 0)",
    xs: "0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 16px rgba(255, 255, 255, 0.05)",
    sm: "0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 24px rgba(255, 255, 255, 0.1)",
    md: "0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 32px rgba(255, 255, 255, 0.15)",
    lg: "0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 40px rgba(255, 255, 255, 0.2)",
    xl: "0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 48px rgba(255, 255, 255, 0.25)",
    "2xl":
      "0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 60px rgba(255, 255, 255, 0.3)",
  };

  const containerVariants = expandable
    ? {
        collapsed: {
          width: width || "auto",
          height: height || "auto",
          transition: { duration: 0.4, ease: [0.5, 1.5, 0.5, 1] },
        },
        expanded: {
          width: expandedWidth || "auto",
          height: expandedHeight || "auto",
          transition: { duration: 0.4, ease: [0.5, 1.5, 0.5, 1] },
        },
      }
    : {};

  // Animação de flutuação para a variante floating
  const floatingVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const MotionComponent = hasMotion ? motion.div : "div";

  const motionProps = hasMotion
    ? {
        // Variants para expandable
        variants: expandable
          ? containerVariants
          : isFloating
            ? floatingVariants
            : undefined,
        animate: expandable
          ? isExpanded
            ? "expanded"
            : "collapsed"
          : isFloating
            ? "animate"
            : undefined,
        // Click para expandable
        onClick: expandable ? handleToggleExpansion : undefined,
        // Drag
        drag: draggable,
        dragConstraints: draggable
          ? { left: 0, right: 0, top: 0, bottom: 0 }
          : undefined,
        dragElastic: draggable ? 0.3 : undefined,
        dragTransition: draggable
          ? { bounceStiffness: 300, bounceDamping: 10, power: 0.3 }
          : undefined,
        whileDrag: draggable ? { scale: 1.02, cursor: "grabbing" } : undefined,
        // Hover e Tap (apenas para não-botões, botão usa CSS)
        whileHover: hasHoverTap && !isButton ? { scale: 1.01 } : undefined,
        whileTap: hasHoverTap && !isButton ? { scale: 0.98 } : undefined,
      }
    : {};

  return (
    <>
      {/* Hidden SVG Filter */}
      <svg className="hidden">
        <defs>
          <filter
            id="glass-blur"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.007"
              numOctaves="1"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="200"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <MotionComponent
        className={cn(
          "relative",
          // Cursor styles
          draggable && "cursor-grab active:cursor-grabbing",
          (expandable || isButton) && "cursor-pointer",
          // Button specific styles
          isButton && [
            "inline-flex items-center justify-center gap-2 whitespace-nowrap flex-nowrap",
            "active:scale-95 transition-transform duration-150",
            "hover:brightness-110",
          ],
          // Panel specific styles
          isPanel && "border-none",
          // Floating specific styles
          isFloating && "will-change-transform",
          className,
        )}
        style={{
          borderRadius,
          ...(width && !expandable && { width }),
          ...(height && !expandable && { height }),
        }}
        {...motionProps}
        {...props}
      >
        {/* Bend Layer (Backdrop blur with distortion) */}
        <div
          className={cn(
            "absolute inset-0 z-0",
            blurIntensity !== "none" && blurClasses[blurIntensity],
          )}
          style={{
            borderRadius,
            filter: blurIntensity !== "none" ? "url(#glass-blur)" : undefined,
          }}
        />

        {/* Face Layer (Main shadow and glow) */}
        {glowIntensity !== "none" && (
          <div
            className="absolute inset-0 z-10"
            style={{
              borderRadius,
              boxShadow: glowStyles[glowIntensity],
            }}
          />
        )}

        {/* Edge Layer (Inner highlights) */}
        {shadowIntensity !== "none" && (
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              borderRadius,
              boxShadow: shadowStyles[shadowIntensity],
            }}
          />
        )}

        {/* Content — must be above decorative layers */}
        <div className="relative z-30 h-full">{children}</div>
      </MotionComponent>
    </>
  );
};

// Backwards-compat alias
export const LiquidGlassCard = LiquidGlass;
