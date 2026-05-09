"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Campo } from "@/types/colecao";

interface EditableTableCellProps {
  valor: any;
  campo: Campo;
  onSave: (novoValor: any) => Promise<void>;
  isLoading?: boolean;
}

export function EditableTableCell({ valor, campo, onSave }: EditableTableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(valor);
  const [isSaving,  setIsSaving]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) { inputRef.current?.focus(); inputRef.current?.select(); }
  }, [isEditing]);

  const handleSave = async () => {
    if (editValue === valor) { setIsEditing(false); return; }
    setIsSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch {
      setEditValue(valor);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter")  handleSave();
    if (e.key === "Escape") { setEditValue(valor); setIsEditing(false); }
  };

  const formatDisplay = () => {
    if (valor === undefined || valor === null) return "—";
    if (campo.tipoCampo === "booleano") return valor ? "Sim" : "Não";
    if (campo.tipoCampo === "data") return new Date(valor).toLocaleDateString("pt-BR");
    return String(valor);
  };

  if (isEditing) {
    return (
      <div className="flex items-center">
        {campo.tipoCampo === "booleano" ? (
          <button
            onClick={() => { setEditValue(!editValue); handleSave(); }}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
              editValue ? "bg-emerald-500 text-white" : "bg-muted/50 text-muted-foreground",
            )}
          >
            {editValue ? "Sim" : "Não"}
          </button>
        ) : (
          <input
            ref={inputRef}
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            type={campo.tipoCampo === "numero" ? "number" : "text"}
            disabled={isSaving}
            className="h-7 w-full px-2 text-sm rounded-lg bg-background border border-border/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 disabled:opacity-50"
          />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="group cursor-pointer px-2 py-1 rounded-md hover:bg-accent transition-colors"
    >
      <span className="text-sm font-medium text-foreground/80">{formatDisplay()}</span>
      <span className="ml-1.5 text-[10px] text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">✎</span>
    </div>
  );
}
