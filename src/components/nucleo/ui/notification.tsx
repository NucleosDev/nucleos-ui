"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

export interface Notificacao {
  id: string
  titulo: string
  mensagem: string
  icone?: React.ReactNode
  imagem?: string
  tempo?: string
  acao?: {
    label: string
    onClick: () => void
  }
  tipo?: 'sucesso' | 'aviso' | 'info' | 'conquista'
  lida?: boolean
}

interface NotificacaoIOSProps {
  notificacao: Notificacao
  onClose?: () => void
  onClick?: () => void
  className?: string
  variant?: 'flutuante' | 'lista'
}

export function NotificacaoIOS({
  notificacao,
  onClose,
  onClick,
  className,
  variant = 'flutuante'
}: NotificacaoIOSProps) {
  const { titulo, mensagem, icone, imagem, tempo, acao, tipo = 'info', lida } = notificacao

  const getTipoStyles = () => {
    const styles = {
      sucesso: 'from-green-500/20 to-green-500/5 border-green-500/30',
      aviso: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
      info: 'from-primary/20 to-primary/5 border-primary/30',
      conquista: 'from-accent/20 to-accent/5 border-accent/30'
    }
    return styles[tipo]
  }

  const getIconePadrao = () => {
    if (icone) return icone
    return (
      <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <Image src="/icon.svg" alt="Nucleos" width={20} height={20} className="invert" />
      </div>
    )
  }

  return (
    <motion.div
      initial={variant === 'flutuante' ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100 }}
      whileHover={{ scale: variant === 'flutuante' ? 1.02 : 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={cn(
        "relative rounded-2xl bg-card/80 backdrop-blur-xl border shadow-xl",
        "bg-gradient-to-br",
        getTipoStyles(),
        !lida && "ring-2 ring-primary/20",
        variant === 'flutuante' ? "w-[320px]" : "w-full",
        className
      )}
      onClick={onClick}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Ícone */}
          <div className="shrink-0">
            {imagem ? (
              <Image src={imagem} alt={titulo} width={40} height={40} className="rounded-xl" />
            ) : (
              getIconePadrao()
            )}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-sm truncate">{titulo}</p>
              {tempo && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">{tempo}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{mensagem}</p>
            
            {/* Ação */}
            {acao && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  acao.onClick()
                }}
                className="mt-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {acao.label}
              </button>
            )}
          </div>

          {/* Botão fechar (apenas flutuante) */}
          {variant === 'flutuante' && onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="shrink-0 size-6 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Indicador de não lida */}
        {!lida && variant === 'lista' && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-primary" />
        )}
      </div>
    </motion.div>
  )
}

// Container para notificações flutuantes
export function NotificacoesContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 w-[320px] pointer-events-none">
      <div className="pointer-events-auto space-y-2">
        {children}
      </div>
    </div>
  )
}