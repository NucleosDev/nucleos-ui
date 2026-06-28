import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { ItemLista } from "@/types/lista";

interface ListaItemProps {
  item: ItemLista;
  onToggle: () => void;
  onDelete: () => void;
}

export function ListaItem({ item, onToggle, onDelete }: ListaItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Checkbox checked={item.checked} onCheckedChange={onToggle} />
      <div className="flex-1">
        <p className={item.checked ? "line-through text-muted-foreground" : ""}>
          {item.nome}
        </p>
        {item.quantidade > 1 && (
          <span className="text-sm text-muted-foreground">
            {item.quantidade}{" "}
            {item.valorUnitario ? `x R$ ${item.valorUnitario}` : ""}
          </span>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
