"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Edit2, Trash2, GripVertical, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface BlocoTextoProps {
  bloco: any
  onEdit?: (conteudo: string) => void
  onDelete?: () => void
}

export function BlocoTexto({ bloco, onEdit, onDelete }: BlocoTextoProps) {
  const [isEditing, setIsEditing] = useState(false)
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

      {/* Título */}
      <h3 className="font-medium text-sm mb-3">{bloco.titulo || "Bloco de Texto"}</h3>

      {/* Conteúdo */}
      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva seu texto aqui..."
            className="min-h-[150px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              <X className="size-4 mr-2" />
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
            <p className="whitespace-pre-wrap text-sm">{bloco.dados.conteudo}</p>
          ) : (
            <p className="text-muted-foreground italic text-sm">Nenhum conteúdo</p>
          )}
        </div>
      )}
    </motion.div>
  )
}