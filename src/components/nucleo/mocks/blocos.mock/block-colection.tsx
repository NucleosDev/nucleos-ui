// /components/nucleos/ui/blocos/bloco-colecao.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { 
  Edit2, 
  Trash2, 
  GripVertical,
  Plus,
  ChevronDown,
  Table,
  Grid3X3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { BlocoColecao } from "../../types/bloco-components.types"

interface BlocoColecaoProps {
  bloco: BlocoColecao
  onEdit?: (data: any) => void
  onDelete?: () => void
  onAddItem?: () => void
  onEditItem?: (itemId: string, valores: any) => void
  onDeleteItem?: (itemId: string) => void
}

export function BlocoColecao({ 
  bloco, 
  onEdit, 
  onDelete,
  onAddItem,
  onEditItem,
  onDeleteItem 
}: BlocoColecaoProps) {
  const [visualizacao, setVisualizacao] = useState<'tabela' | 'quadro'>('tabela')
  const { colecao, campos, itens } = bloco.dados

  const getValorItem = (item: any, campoId: string) => {
    const valor = item.valores?.find((v: any) => v.campo_id === campoId)
    if (!valor) return "-"

    if (valor.valor_texto) return valor.valor_texto
    if (valor.valor_numerico) return valor.valor_numerico
    if (valor.valor_data) return new Date(valor.valor_data).toLocaleDateString('pt-BR')
    if (valor.valor_booleano !== undefined) return valor.valor_booleano ? "✓" : "✗"
    return "-"
  }

  const getTipoCampoIcon = (tipo: string) => {
    const icons = {
      texto: "T",
      numero: "123",
      data: "📅",
      booleano: "✓",
      arquivo: "📎",
      select: "▼",
      relacao: "🔗"
    }
    return icons[tipo as keyof typeof icons] || "📌"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-xl border bg-card p-4 hover:shadow-md transition-all"
    >
      {/* Barra de ferramentas */}
      <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button variant="outline" size="icon" className="size-8 bg-background shadow-sm">
          <Edit2 className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8 bg-background shadow-sm text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
        </Button>
        <div className="cursor-move">
          <GripVertical className="size-4 text-muted-foreground" />
        </div>
      </div>

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{bloco.titulo || colecao?.nome || "Coleção"}</h3>
          <Badge variant="outline" className="text-xs">
            {itens?.length || 0} itens
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle visualização */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-7", visualizacao === 'tabela' && "bg-muted")}
              onClick={() => setVisualizacao('tabela')}
            >
              <Table className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-7", visualizacao === 'quadro' && "bg-muted")}
              onClick={() => setVisualizacao('quadro')}
            >
              <Grid3X3 className="size-4" />
            </Button>
          </div>

          <Button size="sm" onClick={onAddItem}>
            <Plus className="size-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Visualização em Tabela */}
      {visualizacao === 'tabela' && (
        <div className="border rounded-lg overflow-x-auto">
          <UITable>
            <TableHeader>
              <TableRow>
                {campos?.map((campo) => (
                  <TableHead key={campo.id} className="whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {getTipoCampoIcon(campo.tipo_campo)}
                      </span>
                      {campo.nome}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(campos?.length || 0) + 1} className="text-center py-8 text-muted-foreground">
                    Nenhum item nesta coleção
                  </TableCell>
                </TableRow>
              ) : (
                itens?.map((item) => (
                  <TableRow key={item.id} className="group/item">
                    {campos?.map((campo) => (
                      <TableCell key={campo.id} className="whitespace-nowrap">
                        {getValorItem(item, campo.id)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover/item:opacity-100">
                            <ChevronDown className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditItem?.(item.id, item)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => onDeleteItem?.(item.id)}
                          >
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </UITable>
        </div>
      )}

      {/* Visualização em Quadro */}
      {visualizacao === 'quadro' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {itens?.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Nenhum item nesta coleção
            </div>
          ) : (
            itens?.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors cursor-pointer group/item"
              >
                {campos?.slice(0, 2).map((campo) => (
                  <div key={campo.id} className="text-sm">
                    <span className="text-xs text-muted-foreground">{campo.nome}:</span>{' '}
                    <span className="font-medium">{getValorItem(item, campo.id)}</span>
                  </div>
                ))}
                {campos && campos.length > 2 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    +{campos.length - 2} campos
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </motion.div>
  )
}