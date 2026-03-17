// /components/nucleos/ui/blocos/bloco-calendario.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Edit2, 
  Trash2, 
  GripVertical,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { BlocoCalendario } from "../../types/bloco-components.types"

interface BlocoCalendarioProps {
  bloco: BlocoCalendario
  onEdit?: (data: any) => void
  onDelete?: () => void
  onAddEvent?: () => void
  onEditEvent?: (eventId: string) => void
}

export function BlocoCalendario({ 
  bloco, 
  onEdit, 
  onDelete,
  onAddEvent,
  onEditEvent 
}: BlocoCalendarioProps) {
  const [dataAtual, setDataAtual] = useState(new Date())
  const eventos = bloco.dados?.eventos || []

  const inicioMes = startOfMonth(dataAtual)
  const fimMes = endOfMonth(dataAtual)
  const dias = eachDayOfInterval({ start: inicioMes, end: fimMes })

  const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const getEventosDoDia = (data: Date) => {
    return eventos.filter(evento => 
      evento.data_evento && 
      format(new Date(evento.data_evento), 'yyyy-MM-dd') === format(data, 'yyyy-MM-dd')
    )
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
        <h3 className="font-medium">{bloco.titulo || "Calendário"}</h3>
        <Button size="sm" onClick={onAddEvent}>
          <Plus className="size-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Navegação do mês */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDataAtual(new Date(dataAtual.setMonth(dataAtual.getMonth() - 1)))}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="font-medium">
          {format(dataAtual, "MMMM 'de' yyyy", { locale: ptBR })}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDataAtual(new Date(dataAtual.setMonth(dataAtual.getMonth() + 1)))}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {diasDaSemana.map((dia) => (
          <div key={dia} className="text-center text-xs font-medium text-muted-foreground">
            {dia}
          </div>
        ))}
      </div>

      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-1">
        {dias.map((dia, index) => {
          const eventosDoDia = getEventosDoDia(dia)
          const isToday = format(dia, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
          
          return (
            <div
              key={dia.toISOString()}
              className={cn(
                "min-h-[80px] p-1 rounded-lg border transition-colors",
                isToday ? "border-primary bg-primary/5" : "border-border",
                "hover:bg-accent/50 cursor-pointer"
              )}
              onClick={() => console.log("Dia selecionado:", dia)}
            >
              <span className={cn(
                "text-xs font-medium",
                isToday && "text-primary"
              )}>
                {format(dia, 'd')}
              </span>
              <div className="mt-1 space-y-1">
                {eventosDoDia.slice(0, 2).map((evento) => (
                  <div
                    key={evento.id}
                    className="text-xs truncate rounded bg-primary/10 px-1 py-0.5 text-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditEvent?.(evento.id)
                    }}
                  >
                    {evento.titulo}
                  </div>
                ))}
                {eventosDoDia.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{eventosDoDia.length - 2}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}