import Link from "next/link";
import { MoreVertical, Pencil, Trash2, Calendar, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Colecao } from "@/types/colecao";

interface ColecaoCardProps {
  colecao: Colecao;
  nucleoId: string;
  blocoId: string;
  onEdit: (colecao: Colecao) => void;
  onDelete: (id: string) => void;
  onSelect?: (colecao: Colecao) => void;
  onGerenciarCampos?: (colecao: Colecao) => void;
}

export function ColecaoCard({
  colecao,
  nucleoId,
  blocoId,
  onEdit,
  onDelete,
  onSelect,
  onGerenciarCampos,
}: ColecaoCardProps) {
  const detalhesUrl = `/dashboard/nucleos/${nucleoId}/blocos/${blocoId}/colecoes/${colecao.id}`;

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(colecao);
    }
    // A navegação é feita pelo Link sobreposto
  };

  return (
    <Card
      className="group relative hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <Link href={detalhesUrl} className="absolute inset-0 z-0" />
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-1">{colecao.nome}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mt-1 -mr-2"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(colecao);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar nome
              </DropdownMenuItem>
              {onGerenciarCampos && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onGerenciarCampos(colecao);
                  }}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Gerenciar campos
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(colecao.id);
                }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir coleção
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Criada em{" "}
              {new Date(colecao.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" />
            <span>
              {colecao.campos?.length ?? 0} campo
              {colecao.campos?.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="relative z-10 pt-0" />
    </Card>
  );
}
