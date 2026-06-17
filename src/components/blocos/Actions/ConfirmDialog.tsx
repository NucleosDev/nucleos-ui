"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import {
  GlassModal,
  GlassModalFooter,
  GlassButton,
} from "@/components/ui/glass-modal";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDangerous = false,
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <GlassModal
      open={open}
      onClose={() => !isLoading && onOpenChange(false)}
      size="max-w-sm"
    >
      <div className="px-5 pt-5 pb-2 space-y-3">
        <div className="flex items-start gap-3">
          {isDangerous && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-xs text-muted-foreground/70 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      <GlassModalFooter>
        <GlassButton
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
        >
          {cancelText}
        </GlassButton>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text- transition-opacity hover:opacity-90 disabled:opacity-50 min-w-[90px] justify-center"
          style={{
            background: isDangerous ? "hsl(var(--destructive))" : "#6366f1",
            boxShadow: isDangerous
              ? "0 4px 12px hsl(var(--destructive) / 0.35)"
              : "0 4px 12px #6366f135",
          }}
        >
          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isLoading ? "Processando..." : confirmText}
        </button>
      </GlassModalFooter>
    </GlassModal>
  );
}
