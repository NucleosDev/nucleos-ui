// src/components/blocos/cruds/ListasBlocoCard.tsx
"use client";

import { useState } from "react";
import { Plus, Check, ChevronDown, ListTodo } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { CriarListaModal } from "@/components/lista/CriarListaModal";
import { ListaFinanceiraInteligente } from "@/components/lista/ListaFinanceiraInteligente";
import { useListas } from "@/hooks/useListas";
import { useItensLista } from "@/hooks/useItensLista";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Bloco } from "@/types/bloco";

interface ListasBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete?: () => void;
  onEdit?: () => void;
  isDeleting?: boolean;
}

const TIPO_LABEL: Record<string, string> = {
  compras: "Compras",
  financeiro: "Financeiro",
  geral: "Geral",
};

export function ListasBlocoCard({ bloco }: ListasBlocoCardProps) {
  const { listas, isLoading, criar, isCreating } = useListas(bloco.id);
  const [modalAberta, setModalAberta] = useState(false);
  const [colapsadas, setColapsadas] = useState<Set<string>>(new Set());

  const toggleLista = (id: string) =>
    setColapsadas((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleCriar = async (nome: string, tipoLista: string) => {
    try {
      await criar({ blocoId: bloco.id, nome, tipoLista: tipoLista as any });
      toast({ title: "Lista criada!" });
      setModalAberta(false);
    } catch (e: any) {
      toast({
        title: "Erro ao criar lista",
        description: e?.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    );
  }

  if (listas.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl mb-3"
            style={{ background: "#06b6d418", border: "1px solid #06b6d430" }}
          >
            <ListTodo className="h-5 w-5" style={{ color: "#06b6d4" }} />
          </div>
          <p className="text-sm text-muted-foreground/60 mb-4">
            Nenhuma lista ainda
          </p>
          <button
            onClick={() => setModalAberta(true)}
            disabled={isCreating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text- transition-opacity hover:opacity-90"
            style={{
              background: "#06b6d4",
              boxShadow: "0 4px 12px rgba(6,182,212,0.25)",
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Criar primeira lista
          </button>
        </div>
        <CriarListaModal
          open={modalAberta}
          onClose={() => setModalAberta(false)}
          onConfirm={handleCriar}
          isSubmitting={isCreating}
        />
      </>
    );
  }

  return (
    <div className="space-y-2">
      {listas.map((lista) => (
        <ListaExpandivel
          key={lista.id}
          lista={lista}
          isExpanded={!colapsadas.has(lista.id)}
          onToggle={() => toggleLista(lista.id)}
        />
      ))}

      <button
        onClick={() => setModalAberta(true)}
        disabled={isCreating}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-muted-foreground/60 hover:text-muted-foreground border border-dashed border-border/40 hover:border-border/70 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        Nova lista
      </button>

      <CriarListaModal
        open={modalAberta}
        onClose={() => setModalAberta(false)}
        onConfirm={handleCriar}
        isSubmitting={isCreating}
      />
    </div>
  );
}

function ListaExpandivel({
  lista,
  isExpanded,
  onToggle,
}: {
  lista: any;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { itens, criarItem, atualizarItem, excluirItem, toggleItem } =
    useItensLista(lista.id);
  const done = itens.filter((i: any) => i.concluido).length;
  const total = itens.length;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-card/60 overflow-hidden",
        "transition-[border-color] duration-[var(--duration-fast)]",
        isExpanded && "border-border/80",
      )}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-accent/40 transition-colors text-left"
      >
        <div
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
          style={{ background: "#06b6d418" }}
        >
          <Check className="h-3.5 w-3.5" style={{ color: "#06b6d4" }} />
        </div>
        <span className="text-sm font-medium flex-1 truncate">
          {lista.nome}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {total > 0 && (
            <span className="text-[11px] tabular-nums text-muted-foreground/60">
              {done}/{total}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground/40">
            {TIPO_LABEL[lista.tipoLista] ?? "Geral"}
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground/40 transition-transform duration-[var(--duration-fast)]",
              !isExpanded && "-rotate-90",
            )}
          />
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-border/30"
          >
            <div className="px-3.5 py-3">
              <ListaFinanceiraInteligente
                lista={lista}
                itens={itens}
                onAddItem={async (p) => {
                  await criarItem(p as any);
                }}
                onUpdateItem={async (id, p) => {
                  await atualizarItem({ id, payload: p });
                }}
                onDeleteItem={async (id) => {
                  await excluirItem(id);
                }}
                onToggleItem={async (id) => {
                  await toggleItem(id);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
