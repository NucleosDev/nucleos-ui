// src/components/lista/ListaFinanceiraInteligente.tsx
"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Zap, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { Lista, ItemLista } from "@/types/lista";

interface ListaFinanceiraInteligenteProps {
  lista: Lista;
  itens: ItemLista[];
  onAddItem: (payload: {
    listaId: string;
    nome: string;
    quantidade?: number;
    valorUnitario?: number;
  }) => Promise<void>;
  onUpdateItem: (
    id: string,
    payload: {
      nome?: string;
      quantidade?: number;
      valorUnitario?: number;
      checked?: boolean;
    },
  ) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onToggleItem: (id: string) => Promise<void>;
}

export function ListaFinanceiraInteligente({
  lista,
  itens,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleItem,
}: ListaFinanceiraInteligenteProps) {
  const [inputNome, setInputNome] = useState("");
  const [inputValor, setInputValor] = useState("");
  const [inputQtd, setInputQtd] = useState("1");
  const [inputFocado, setInputFocado] = useState(false);

  const totalGeral = itens.reduce(
    (sum, i) => sum + (i.valorUnitario || 0) * (i.quantidade || 1),
    0,
  );
  const itensConcluidos = itens.filter((i) => i.checked).length;
  const progresso =
    itens.length > 0 ? (itensConcluidos / itens.length) * 100 : 0;

  const handleAddItem = useCallback(async () => {
    if (!inputNome.trim()) return;
    try {
      await onAddItem({
        listaId: lista.id,
        nome: inputNome.trim(),
        quantidade: parseInt(inputQtd) || 1,
        valorUnitario: inputValor ? parseFloat(inputValor) : undefined,
      });
      setInputNome("");
      setInputValor("");
      setInputQtd("1");
      toast({ title: "Item adicionado!" });
    } catch {
      toast({ title: "Erro ao adicionar", variant: "destructive" });
    }
  }, [inputNome, inputValor, inputQtd, lista.id, onAddItem]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddItem();
  };

  return (
    <div className="space-y-3">
      {/* Resumo (apenas para listas financeiras) */}
      {lista.tipoLista === "financeiro" && itens.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-cyan-50 to-primary-50 rounded-lg p-3 border border-cyan-100"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-sm font-bold">
              R$ {totalGeral.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
            <span>
              {itensConcluidos}/{itens.length} itens
            </span>
            <span>{Math.round(progresso)}%</span>
          </div>
          <div className="h-1 bg-cyan-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </motion.div>
      )}

      {/* Input inline */}
      <div
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all",
          inputFocado
            ? "border-cyan-400 bg-cyan-50/20 shadow-sm"
            : "border-transparent bg-muted/20",
        )}
      >
        <Zap className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
        <Input
          value={inputNome}
          onChange={(e) => setInputNome(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setInputFocado(true)}
          onBlur={() => setInputFocado(false)}
          placeholder="Nome do item..."
          className="border-0 bg-transparent focus-visible:ring-0 p-0 h-7 text-sm flex-1 min-w-0"
        />
        <Input
          value={inputQtd}
          onChange={(e) => setInputQtd(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Qtd"
          className="border-0 bg-transparent focus-visible:ring-0 p-0 h-7 text-sm w-12 text-center shrink-0"
        />
        <Input
          value={inputValor}
          onChange={(e) => setInputValor(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="R$"
          className="border-0 bg-transparent focus-visible:ring-0 p-0 h-7 text-sm w-20 shrink-0"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={handleAddItem}
          disabled={!inputNome.trim()}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Itens */}
      <div className="divide-y divide-border/20">
        {itens.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Nenhum item ainda
          </div>
        ) : (
          itens.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
              onToggle={onToggleItem}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── Item Row ───────────────────────────────────────────────────────────────

function ItemRow({
  item,
  onUpdate,
  onDelete,
  onToggle,
}: {
  item: ItemLista;
  onUpdate: (id: string, payload: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string) => Promise<void>;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [editando, setEditando] = useState(false);
  const [editNome, setEditNome] = useState(item.nome);
  const [editValor, setEditValor] = useState(
    item.valorUnitario?.toString() || "",
  );
  const [editQtd, setEditQtd] = useState(item.quantidade?.toString() || "1");

  const valorTotal = (item.valorUnitario || 0) * (item.quantidade || 1);

  const handleSalvar = async () => {
    const novoNome = editNome.trim();
    if (novoNome && novoNome !== item.nome) {
      await onUpdate(item.id, {
        nome: novoNome,
        quantidade: parseInt(editQtd) || 1,
        valorUnitario: editValor ? parseFloat(editValor) : undefined,
      });
    }
    setEditando(false);
  };

  return (
    <motion.div
      layout
      className={cn(
        "flex items-center gap-2.5 px-1 py-2 transition-all group",
        item.checked && "opacity-50",
        isHovered && "bg-muted/20 rounded-md",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(item.id)}
        className={cn(
          "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
          item.checked
            ? "bg-cyan-500 border-cyan-500"
            : "border-muted-foreground/30 hover:border-cyan-400",
        )}
      >
        {item.checked && (
          <svg
            className="w-2.5 h-2.5 text"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {/* Nome + detalhes */}
      <div className="flex-1 min-w-0">
        {editando ? (
          <div className="flex items-center gap-1.5">
            <Input
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
              onBlur={handleSalvar}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSalvar();
                if (e.key === "Escape") setEditando(false);
              }}
              className="h-7 text-sm flex-1"
              autoFocus
            />
            <Input
              value={editQtd}
              onChange={(e) => setEditQtd(e.target.value)}
              className="h-7 text-sm w-12 text-center"
            />
            <Input
              value={editValor}
              onChange={(e) => setEditValor(e.target.value)}
              placeholder="R$"
              className="h-7 text-sm w-20"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className={cn("text-sm truncate", item.checked && "line-through")}
              onDoubleClick={() => setEditando(true)}
            >
              {item.nome}
            </span>
            {item.quantidade > 1 && (
              <span className="text-[11px] text-muted-foreground">
                x{item.quantidade}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Valor */}
      {!editando && valorTotal > 0 && (
        <span className="text-sm font-medium tabular-nums shrink-0">
          R$ {valorTotal.toFixed(2)}
        </span>
      )}

      {/* Ações hover */}
      <AnimatePresence>
        {isHovered && !editando && (
          <motion.div
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 5 }}
            className="flex items-center gap-0.5"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setEditando(true)}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <div className="cursor-grab p-0.5">
              <GripVertical className="h-3 w-3 text-muted-foreground" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
