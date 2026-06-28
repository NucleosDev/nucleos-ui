// components/lista/ListaCardInline.tsx
"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  MoreVertical,
  Pencil,
  ListChecks,
  ShoppingCart,
  Coins,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useItensLista } from "@/hooks/useItensLista";
import { toast } from "@/hooks/use-toast";
import type { Lista } from "@/types/lista";

const tipoIconMap: Record<string, any> = {
  generica: ListChecks,
  compras: ShoppingCart,
  financeiro: Coins,
};

interface ListaCardInlineProps {
  lista: Lista;
  onDelete: () => void;
  onEdit: (novoNome: string) => Promise<void> | void;
  onSelect?: () => void; // para navegação detalhada (ex: página dedicada)
}

export function ListaCardInline({
  lista,
  onDelete,
  onEdit,
  onSelect,
}: ListaCardInlineProps) {
  const [novoItemNome, setNovoItemNome] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(lista.nome);

  const {
    itens,
    isLoading,
    criarItem,
    toggleItem,
    excluirItem,
    isCreating,
    isToggling,
    isDeleting,
  } = useItensLista(lista.id);

  const Icon = tipoIconMap[lista.tipoLista] || ListChecks;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoItemNome.trim()) return;
    try {
      await criarItem({
        listaId: lista.id,
        nome: novoItemNome,
      });
      setNovoItemNome("");
    } catch (error) {
      toast({ title: "Erro ao adicionar item", variant: "destructive" });
    }
  };

  const handleSaveEdit = async () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== lista.nome) {
      await onEdit(trimmed);
    }
    setIsEditing(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest('[role="checkbox"]')
    ) {
      return;
    }
    onSelect?.();
  };

  return (
    <Card
      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-1.5">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                autoFocus
                className="h-8 w-40 text-base font-medium"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <CardTitle className="text-base font-medium">
                {lista.nome}
              </CardTitle>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir lista
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ) : itens.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            Nenhum item ainda.
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {itens.map((item) => (
              <div key={item.id} className="flex items-center gap-2 group">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(item.id)}
                  disabled={isToggling}
                  className="mt-0.5"
                  onClick={(e) => e.stopPropagation()}
                />
                <span
                  className={`flex-1 text-sm ${
                    item.checked ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {item.nome}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    excluirItem(item.id);
                  }}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.stopPropagation();
            handleAddItem(e);
          }}
          className="flex gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Input
            placeholder="Adicionar item..."
            value={novoItemNome}
            onChange={(e) => setNovoItemNome(e.target.value)}
            className="h-9 text-sm"
            disabled={isCreating}
          />
          <Button
            type="submit"
            size="icon"
            variant="outline"
            className="h-9 w-9"
            disabled={isCreating || !novoItemNome.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
