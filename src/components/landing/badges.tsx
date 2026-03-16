"use client"

import { useState } from "react"
import { 
  Trophy, Flame, Star, Zap, Target, Crown, 
  Rocket, Medal, Award, BookOpen, Heart, Wallet
} from "lucide-react"

const badges = [
  { icon: Star, nome: "Primeiro Passo", desc: "Complete sua primeira tarefa", tier: "bronze", desbloqueada: true },
  { icon: Flame, nome: "Em Chamas", desc: "3 dias consecutivos", tier: "bronze", desbloqueada: true },
  { icon: Target, nome: "Focado", desc: "Complete 10 tarefas em um dia", tier: "prata", desbloqueada: true },
  { icon: Zap, nome: "Produtivo", desc: "50 tarefas completadas", tier: "prata", desbloqueada: true },
  { icon: Trophy, nome: "Semana Perfeita", desc: "7 dias consecutivos", tier: "ouro", desbloqueada: true },
  { icon: BookOpen, nome: "Estudioso", desc: "100 tarefas de estudo", tier: "ouro", desbloqueada: false },
  { icon: Heart, nome: "Vida Saudavel", desc: "30 dias de exercicios", tier: "ouro", desbloqueada: false },
  { icon: Wallet, nome: "Economista", desc: "Meta financeira atingida", tier: "ouro", desbloqueada: false },
  { icon: Medal, nome: "Veterano", desc: "100 dias usando o app", tier: "platina", desbloqueada: false },
  { icon: Crown, nome: "Mestre", desc: "Nivel 50 alcancado", tier: "platina", desbloqueada: false },
  { icon: Rocket, nome: "Lendario", desc: "1000 tarefas completadas", tier: "diamante", desbloqueada: false },
  { icon: Award, nome: "Perfeicao", desc: "365 dias consecutivos", tier: "diamante", desbloqueada: false },
]

const tierColors: Record<string, { bg: string; border: string; text: string }> = {
  bronze: { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-700" },
  prata: { bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-600" },
  ouro: { bg: "bg-yellow-100", border: "border-yellow-400", text: "text-yellow-700" },
  platina: { bg: "bg-cyan-100", border: "border-cyan-300", text: "text-cyan-700" },
  diamante: { bg: "bg-violet-100", border: "border-violet-300", text: "text-violet-700" },
}

const tiers = ["bronze", "prata", "ouro", "platina", "diamante"]

export function Badges() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const filteredBadges = selectedTier 
    ? badges.filter(b => b.tier === selectedTier)
    : badges

  return (
    <section className="px-6 py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Sistema de Conquistas
          </span>
        </div>

        <h2 className="text-balance text-center text-3xl font-bold tracking-tight md:text-4xl">
          Colecione conquistas e mostre sua evolucao
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Cada marco da sua jornada e recompensado. Desbloqueie badges de diferentes tiers.
        </p>

        {/* Filtros */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedTier(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTier === null 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            Todos
          </button>
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                selectedTier === tier 
                  ? "bg-primary text-primary-foreground" 
                  : `${tierColors[tier].bg} ${tierColors[tier].text} hover:opacity-80`
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Grid de Badges */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filteredBadges.map((badge, index) => {
            const colors = tierColors[badge.tier]
            return (
              <div
                key={index}
                className={`group relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  badge.desbloqueada 
                    ? `${colors.bg} ${colors.border} hover:scale-105` 
                    : "bg-muted/50 border-muted grayscale opacity-60"
                }`}
              >
                <div className={`size-12 rounded-full flex items-center justify-center ${
                  badge.desbloqueada ? colors.bg : "bg-muted"
                }`}>
                  <badge.icon className={`size-6 ${badge.desbloqueada ? colors.text : "text-muted-foreground"}`} />
                </div>
                <p className="mt-2 text-sm font-semibold text-center">{badge.nome}</p>
                <p className="text-xs text-muted-foreground text-center mt-1">{badge.desc}</p>
                
                {/* Tooltip com tier */}
                <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors.bg} ${colors.text} ${colors.border} border`}>
                  {badge.tier}
                </span>
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Voce desbloqueou <span className="font-bold text-primary">{badges.filter(b => b.desbloqueada).length}</span> de {badges.length} conquistas
        </p>
      </div>
    </section>
  )
}