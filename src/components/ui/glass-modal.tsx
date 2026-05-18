// src/components/ui/glass-modal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidGlass } from "@/components/ui/liquid-glass";

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  /** max-w override e.g. "max-w-md" (default "max-w-md") */
  size?: string;
}

export function GlassModal({ open, onClose, children, className, size = "max-w-md" }: GlassModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className={cn("w-full pointer-events-auto", size, className)}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <LiquidGlass variant="strong" radius="16px" interactive={false}>
                <div className="max-h-[90vh] overflow-y-auto">
                  {children}
                </div>
              </LiquidGlass>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

interface GlassModalHeaderProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  accent?: string;
  onClose: () => void;
}

export function GlassModalHeader({ title, description, icon: Icon, accent = "#6366f1", onClose }: GlassModalHeaderProps) {
  return (
    <div className="px-5 pt-5 pb-4 border-b border-border/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `${accent}18` }}
            >
              <Icon className="h-4 w-4" style={{ color: accent }} />
            </div>
          )}
          <div>
            <h2 className="text-sm font-semibold">{title}</h2>
            {description && (
              <p className="text-xs text-muted-foreground/60 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

export function GlassInput({ label, error, className, ...props }: GlassInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground/70">{label}</label>
      <input
        {...props}
        className={cn(
          "w-full px-3 py-2 text-sm rounded-xl bg-muted/40 border transition-[border-color,box-shadow]",
          "placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2",
          error
            ? "border-destructive/50 focus:ring-destructive/20"
            : "border-border/50 focus:ring-primary/20 focus:border-primary/40",
          className,
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function GlassModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border/30">
      {children}
    </div>
  );
}

export function GlassButton({
  variant = "default",
  children,
  className,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "destructive" }) {
  return (
    <LiquidGlass
      variant="button"
      radius="12px"
      className={cn(
        "text-xs font-semibold",
        variant === "default" && "text-white",
        variant === "outline" && "text-white/60",
        variant === "destructive" && "text-red-400",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      onClick={props.onClick}
    >
      <span className="flex items-center gap-1.5 px-3.5 py-2">
        {children}
      </span>
    </LiquidGlass>
  );
}
