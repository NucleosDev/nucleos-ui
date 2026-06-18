"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type AnimateType = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale-up" | "fade-in";
type DelayValue = "100" | "150" | "200" | "300" | "400" | "500";

export function FadeIn({
  children,
  type = "fade-up",
  delay,
  className,
  as: Tag = "div",
  threshold = 0.12,
}: {
  children: React.ReactNode;
  type?: AnimateType;
  delay?: DelayValue;
  className?: string;
  as?: React.ElementType;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      data-animate={type === "fade-in" ? "fade-up" : type}
      {...(delay ? { "data-delay": delay } : {})}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}

export function FadeInStagger({
  children,
  className,
  baseDelay = 0,
  stagger = 100,
}: {
  children: React.ReactNode[];
  className?: string;
  baseDelay?: number;
  stagger?: number;
}) {
  const delays: DelayValue[] = ["100", "200", "300", "400", "500"];
  return (
    <div className={className}>
      {children.map((child, i) => {
        const delay = baseDelay + i * stagger;
        const delayStr = delays[Math.min(i, delays.length - 1)];
        return (
          <FadeIn key={i} type="fade-up" delay={delayStr}>
            {child}
          </FadeIn>
        );
      })}
    </div>
  );
}
