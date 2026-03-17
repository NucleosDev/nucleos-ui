"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit2, Trash2, GripVertical, Plus, Play, Pause, Square, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlocoTimerProps {
  bloco: any
  onEdit?: (data: any) => void
  onDelete?: () => void
}

export function BlocoTimer({ bloco, onEdit, onDelete }: BlocoTimerProps) {
  const [tempos, setTempos] = useState<Record<string, number>>({})
  const timers = bloco.dados?.timers || []

  useEffect(() => {
    const interval = setInterval(() => {
      const novosTempos: Record<string, number> = {}
      timers.forEach((timer: any) => {
        if (timer.inicio && !timer.fim) {
          const inicio = new Date(timer.inicio).getTime()
          const agora = Date.now()
          novosTempos[timer.id] = Math.floor((agora - inicio) / 1000)
        }
      })
      setTempos(novosTempos)
    }, 1000)

    return () => clearInterval(interval)
  }, [timers])

  const formatTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
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
        <h3 className="font-medium">{bloco.titulo || "Timers"}</h3>
        <Button size="sm" variant="outline">
          <Plus className="size-4 mr-2" />
          Timer
        </Button>
      </div>

      {/* Lista de timers */}
      <div className="space-y-3">
        {timers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum timer criado
          </div>
        ) : (
          timers.map((timer: any) => {
            const tempoAtual = tempos[timer.id] || timer.duracao_segundos || 0
            const estaAtivo = timer.inicio && !timer.fim

            return (
              <div
                key={timer.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
              >
                <div className="flex items-center gap-3">
                  <Clock className="size-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{timer.titulo || "Timer"}</p>
                    <p className="text-xs text-muted-foreground">
                      {estaAtivo ? "Em andamento" : "Parado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {formatTempo(tempoAtual)}
                  </span>

                  {!estaAtivo ? (
                    <Button size="icon" variant="ghost" className="size-8">
                      <Play className="size-4 text-green-500" />
                    </Button>
                  ) : (
                    <>
                      <Button size="icon" variant="ghost" className="size-8">
                        <Pause className="size-4 text-yellow-500" />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-8">
                        <Square className="size-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}