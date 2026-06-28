"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion, Variants, Transition } from "framer-motion";
import Link from "next/link";
import {
  Code2,
  Palette,
  CheckSquare,
  GraduationCap,
  Building2,
  Rocket,
  LucideIcon,
} from "lucide-react";

export default function NucleosMost() {
  const gradientRef = useRef<HTMLDivElement>(null);

  const transitionVariants = {
    item: {
      hidden: {
        opacity: 0,
        filter: "blur(12px)",
        y: 12,
      },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          type: "spring" as const,
          bounce: 0.3,
          duration: 1.5,
        } as Transition,
      },
    },
  };

  useEffect(() => {
    if (!gradientRef.current) return;
    gsap.fromTo(
      gradientRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1.6, ease: "power3.out" },
    );
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">
      <div className="relative w-full">
        <div
          ref={gradientRef}
          className="absolute inset-0 -z-10 transition-colors duration-700 dark:bg-black rounded-2xl"
          style={{
            backgroundImage: `
                linear-gradient(180deg, var(--background) 0%, rgba(163, 216, 255, 0.15) 25%, rgba(157, 247, 181, 0.15) 50%, rgba(109, 193, 245, 0.12) 70%, rgba(66, 135, 192, 0.10) 85%, rgba(184, 255, 184, 0.08) 100%),
                radial-gradient(at 20% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 60%),
                radial-gradient(at 80% 70%, rgba(243, 229, 245, 0.06) 0%, transparent 70%)
            `,
            backgroundBlendMode: "overlay, screen",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
        />

        <div className="pt-8 pb-12 sm:pt-12 sm:pb-16 text-center">
          <div className="relative max-w-3xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-800 dark:text-gray-200 font-bold tracking-tight leading-tight">
              Use a{" "}
              <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Orbit
              </span>{" "}
              para criar tarefas por você.
            </h1>

            <h4 className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Descreva o que precisa fazer e a Orbit organiza, prioriza e cria
              suas tarefas automaticamente — para você focar no que realmente
              importa.
            </h4>

            <div className="flex items-center justify-center mt-8 mb-4">
              <div
                className="relative"
                style={{ animation: "orbitFloat 3s ease-in-out infinite" }}
              >
                <div
                  className="absolute inset-0 rounded-full blur-2xl"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(77,124,255,0.45) 0%, rgba(0,201,167,0.25) 60%, transparent 100%)",
                    transform: "scale(2.2)",
                    zIndex: 0,
                  }}
                />
                <Image
                  src="/orbit-icon.svg"
                  alt="Orbit"
                  width={100}
                  height={100}
                  className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 drop-shadow-lg"
                  priority
                />
              </div>
            </div>

            <style jsx>{`
              @keyframes orbitFloat {
                0%,
                100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-4px);
                }
              }
              @keyframes pulseGlow {
                0%,
                100% {
                  box-shadow:
                    0 0 20px rgba(77, 124, 255, 0.3),
                    0 0 40px rgba(0, 201, 167, 0.2);
                }
                50% {
                  box-shadow:
                    0 0 30px rgba(77, 124, 255, 0.5),
                    0 0 60px rgba(0, 201, 167, 0.3);
                }
              }
              @keyframes gradient {
                0% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
                100% {
                  background-position: 0% 50%;
                }
              }
              .animate-gradient {
                animation: gradient 3s ease infinite;
                background-size: 200% 200%;
              }
            `}</style>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                item: transitionVariants.item,
              }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <div className="flex items-center justify-center">
                <Button
                  asChild
                  className="w-full sm:w-auto min-w-[160px] sm:min-w-[180px] group relative overflow-hidden bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white border-0 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold transition-all duration-500 rounded-xl"
                  style={{
                    animation: "pulseGlow 3s ease-in-out infinite",
                  }}
                >
                  <Link
                    href="/cadastro"
                    className="flex items-center justify-center gap-2"
                  >
                    <span>Usar Orbit</span>
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </Button>
              </div>
            </AnimatedGroup>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-12">
        <BrandsGrid />
      </div>
    </div>
  );
}

interface Brand {
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

export const BrandsGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const brands: Brand[] = [
    {
      name: "Desenvolvimento",
      icon: Code2,
      description: "Código & Tecnologia",
      color: "#4D7CFF",
    },
    {
      name: "Design & Arte",
      icon: Palette,
      description: "Criatividade Visual",
      color: "#FF6B6B",
    },
    {
      name: "Tarefas & Gestão",
      icon: CheckSquare,
      description: "Produtividade",
      color: "#00C9A7",
    },
    {
      name: "Educação",
      icon: GraduationCap,
      description: "Aprendizado",
      color: "#FFA94D",
    },
    {
      name: "Negócios",
      icon: Building2,
      description: "Empresarial",
      color: "#845EF7",
    },
    {
      name: "Inovação",
      icon: Rocket,
      description: "Futuro & Criatividade",
      color: "#FF6B9D",
    },
  ];

  return (
    <div ref={ref} className={cn("w-full py-4 sm:py-8", className)} {...props}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-center justify-items-center">
          {brands.map((brand) => {
            const Icon = brand.icon;
            return (
              <div
                key={brand.name}
                className="flex items-center justify-center w-full group"
              >
                <div className="relative w-full max-w-[120px] sm:max-w-[140px] aspect-square flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:scale-105 p-2">
                  <div className="relative flex items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle, ${brand.color} 0%, transparent 70%)`,
                        transform: "scale(1.5)",
                      }}
                    />
                    <Icon
                      size={32}
                      className="relative text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-all duration-300"
                      strokeWidth={1.5}
                      style={{
                        color: brand.color,
                        opacity: 0.7,
                      }}
                    />
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 leading-tight">
                      {brand.name}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 leading-tight">
                      {brand.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

BrandsGrid.displayName = "BrandsGrid";

type PresetType =
  | "fade"
  | "slide"
  | "scale"
  | "blur"
  | "blur-slide"
  | "zoom"
  | "flip"
  | "bounce"
  | "rotate"
  | "swing";

type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  preset?: PresetType;
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(4px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
    },
  },
  "blur-slide": {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(4px)", y: 20 },
      visible: { opacity: 1, filter: "blur(0px)", y: 0 },
    },
  },
  zoom: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 300, damping: 20 },
      },
    },
  },
  flip: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, rotateX: -90 },
      visible: {
        opacity: 1,
        rotateX: 0,
        transition: { type: "spring" as const, stiffness: 300, damping: 20 },
      },
    },
  },
  bounce: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: -50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 400, damping: 10 },
      },
    },
  },
  rotate: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, rotate: -180 },
      visible: {
        opacity: 1,
        rotate: 0,
        transition: { type: "spring" as const, stiffness: 200, damping: 15 },
      },
    },
  },
  swing: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, rotate: -10 },
      visible: {
        opacity: 1,
        rotate: 0,
        transition: { type: "spring" as const, stiffness: 300, damping: 8 },
      },
    },
  },
};

function AnimatedGroup({
  children,
  className,
  variants,
  preset,
}: AnimatedGroupProps) {
  const selectedVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };

  const containerVariants = variants?.container || selectedVariants.container;
  const itemVariants = variants?.item || selectedVariants.item;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(className)}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export { AnimatedGroup };
