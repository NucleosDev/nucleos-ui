"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Campo } from "@/types/colecao";

interface EditableTableCellProps {
  valor: any;
  campo: Campo;
  onSave: (novoValor: any) => Promise<void>;
  isLoading?: boolean;
}

export function EditableTableCell({
  valor,
  campo,
  onSave,
  isLoading = false,
}: EditableTableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(valor);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (editValue === valor) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      setEditValue(valor);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(valor);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const formatDisplay = () => {
    if (valor === undefined || valor === null) return "-";
    if (campo.tipoCampo === "booleano") return valor ? "Sim" : "Não";
    if (campo.tipoCampo === "data") {
      return new Date(valor).toLocaleDateString("pt-BR");
    }
    return String(valor);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        {campo.tipoCampo === "booleano" ? (
          <button
            onClick={() => {
              setEditValue(!editValue);
              handleSave();
            }}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              editValue
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-700",
            )}
          >
            {editValue ? "Sim" : "Não"}
          </button>
        ) : (
          <Input
            ref={inputRef}
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            type={campo.tipoCampo === "numero" ? "number" : "text"}
            className="h-7 text-sm border-blue-300 focus:border-blue-500"
            disabled={isSaving}
          />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer px-2 py-1 rounded hover:bg-blue-50 transition-colors group"
    >
      <span className="text-slate-700 font-medium">{formatDisplay()}</span>
      <span className="ml-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
        ✎
      </span>
    </div>
  );
}
