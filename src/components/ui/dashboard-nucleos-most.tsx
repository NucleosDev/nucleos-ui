"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion, Variants, Transition } from "framer-motion";
import Link from "next/link";

export default function NucleosMost() {
  const gradientRef = useRef<HTMLDivElement>(null);

  // Corrigindo as variantes com tipos corretos
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
    
    <div className="p-6 overflow-hidden rounded-xl">
      <div className="relative w-full">
        <div
          ref={gradientRef}
          className="absolute inset-0 -z-10 transition-colors duration-700 dark:bg-black max-h-[90vh] rounded-2xl"
          style={{
            backgroundImage: `
                linear-gradient(180deg, var(--background) 0%, #A3D8FF 25%, #9DF7B5 50%, #6DC1F5 70%, #4287C0 85%, #B8FFB8 100%),
                radial-gradient(at 20% 30%, #ffffff33 0%, transparent 60%),
                radial-gradient(at 80% 70%, #f3e5f533 0%, transparent 70%)
            `,
            backgroundBlendMode: "overlay, screen",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
        />

        <div className="pt-4 pb-10 sm:pt-6 sm:pb-12 text-center">
          <div className="relative max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl text-gray-800 dark:text-gray-200 font-bold tracking-tight">
              Nucleos: Organize sua vida como nunca antes
            </h1>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Crie espaços dedicados para cada área da sua vida, acompanhe seu
              progresso e evolua de forma consistente com nosso sistema de
              gamificação.
            </p>
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
              className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
            >
              <div
                key={1}
                className="flex items-center justify-center gap-2 rounded-[14px] "
              >
                <Button
                  variant="ghost"
                  className="w-full sm:w-auto group border-2 border-primary/30 bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-background/50 hover:border-primary/30"
                  asChild
                >
                  <Link href="/entrar">Entrar</Link>
                </Button>
                <Button
                  asChild
                  className="w-full sm:w-auto group relative overflow-hidden bg-foreground text-primary-foreground shadow-lg shadow-foreground/25 hover:shadow-xl transition-all duration-300 hover:bg-foreground hover:text-primary-foreground border-2 border-background/50"
                >
                  <Link href="/cadastro">
                    Criar Conta
                    {/* <ArrowRight className="w-3 h-3 w-translate-x-2 opacity-1 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100" /> */}
                  </Link>
                </Button>
              </div>
            </AnimatedGroup>
          </div>
        </div>

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
        >
          <div className="relative overflow-hidden px-2">
            <div
              aria-hidden
              className="bg-gradient-to-b from-background to-background absolute inset-0 z-10 from-transparent from-35%"
            />
            <div className="inset-shadow-2xs max-h-[40vh] ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-t-2xl border border-gray-50 border-b-0 p-4 shadow-lg shadow-zinc-950/15 ring-1">
              <Link href="https://nucleos.app" target="_blank">
                <Image
                  className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                  src="https://tailark.com/_next/image?url=%2Fmail2.png&w=3840&q=75"
                  alt="app screen"
                  width={2700}
                  height={1440}
                  unoptimized
                />
                <Image
                  className="z-2 border-border/25 aspect-15/8 relative rounded-2xl dark:hidden"
                  src="https://tailark.com/_next/image?url=%2Fmail2-light.png&w=3840&q=75"
                  alt="app screen"
                  width={2700}
                  height={1440}
                  unoptimized
                />
              </Link>
            </div>
          </div>
        </AnimatedGroup>
      </div>
      <BrandsGrid />
    </div>
  );
}

export const BrandsGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const brands = [
    {
      name: "loops",
      logo: "/placeholder-logo.png",
    },
    {
      name: "pwc",
      logo: "/placeholder-logo.png",
    },
    {
      name: "resend",
      logo: "/placeholder-logo.png",
    },
    {
      name: "udio",
      logo: "/placeholder-logo.png",
    },
    {
      name: "krea",
      logo: "/placeholder-logo.png",
    },
    {
      name: "gopuff",
      logo: "/placeholder-logo.png",
    },
  ];

  return (
    <div ref={ref} className={cn("py-8", className)} {...props}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="max-w-xs mx-auto grid grid-cols-2 items-center md:grid-cols-3 md:max-w-lg lg:grid-cols-6 lg:max-w-3xl">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center p-4"
            >
              <div className="relative h-[76px] w-full">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
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
