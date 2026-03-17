// /components/nucleos/ui/blocos/bloco-texto.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { 
  Edit2, 
  Trash2, 
  GripVertical,
  Bold,
  Italic,
  List,
  Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { BlocoTexto } from "../../types/bloco-components.types"

interface BlocoTextoProps {
  bloco: BlocoTexto
  onEdit?: (conteudo: string) => void
  onDelete?: () => void
  isEditing?: boolean
}

export function BlocoTexto({ bloco, onEdit, onDelete, isEditing: externalEditing }: BlocoTextoProps) {
  const [isEditing, setIsEditing] = useState(externalEditing || false)
  const [conteudo, setConteudo] = useState(bloco.dados?.conteudo || "")

  const handleSave = () => {
    onEdit?.(conteudo)
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-xl border bg-card p-4 hover:shadow-md transition-all"
    >
      {/* Barra de ferramentas */}
      <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-8 bg-background shadow-sm"
          onClick={() => setIsEditing(!isEditing)}
        >
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

      {/* Título do bloco */}
      <div className="mb-3 flex items-center gap-2">
        <h3 className="font-medium text-sm">{bloco.titulo || "Bloco de Texto"}</h3>
      </div>

      {/* Conteúdo */}
      {isEditing ? (
        <div className="space-y-3">
          <div className="flex gap-1 border-b pb-2">
            <Button variant="ghost" size="icon" className="size-8">
              <Bold className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <Italic className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <List className="size-4" />
            </Button>
          </div>
          <Textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva seu texto aqui..."
            className="min-h-[150px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="size-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      ) : (
        <div className="prose prose-sm max-w-none">
          {bloco.dados?.conteudo ? (
            <p className="whitespace-pre-wrap">{bloco.dados.conteudo}</p>
          ) : (
            <p className="text-muted-foreground italic">Nenhum conteúdo</p>
          )}
        </div>
      )}
    </motion.div>
  )
}