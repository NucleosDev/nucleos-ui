// src/components/ui/glass-modal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

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
              <div
                className="overflow-hidden rounded-2xl max-h-[90vh] overflow-y-auto"
                style={{
                  background: "var(--popover)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow:
                    "0 24px 48px -8px oklch(0.18 0.02 250 / 0.28), 0 8px 20px -4px oklch(0.18 0.02 250 / 0.14), inset 0 1px 0 rgba(255,255,255,0.08)",
                  backdropFilter: "blur(24px) saturate(180%)",
                }}
              >
                {children}
              </div>
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
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "destructive" }) {
  return (
    <button
      {...props}
      className={cn(
        "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50",
        variant === "default" && "bg-primary text-primary-foreground hover:opacity-90",
        variant === "outline" && "border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent",
        variant === "destructive" && "border border-destructive/30 text-destructive hover:bg-destructive/10",
        className,
      )}
    >
      {children}
    </button>
  );
}
