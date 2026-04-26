"use client"

import { useState, useEffect } from "react"
import { 
  Brain, 
  Zap, 
  Trophy, 
  Target, 
  TrendingUp, 
  Sparkles,
  CheckCircle2,
  Clock,
  Calendar,
  BarChart3
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function BentoGrid() {
  const [activeXP, setActiveXP] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const xpTimer = setInterval(() => {
      setActiveXP(prev => (prev < 2847 ? prev + 47 : 2847))
    }, 50)
    const streakTimer = setInterval(() => {
      setStreak(prev => (prev < 21 ? prev + 1 : 21))
    }, 100)
    return () => {
      clearInterval(xpTimer)
      clearInterval(streakTimer)
    }
  }, [])

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="size-4" />
            Experiencia Completa
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Tudo que voce precisa em um so lugar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Uma plataforma completa para transformar sua rotina
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {/* Card Grande - XP em tempo real */}
          <div className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur">
                  <Zap className="size-6" />
                </div>
                <span className="text-sm font-medium opacity-90">XP em Tempo Real</span>
              </div>
              <div className="mb-8">
                <div className="text-7xl md:text-8xl font-bold mb-2 tabular-nums">
                  {activeXP.toLocaleString()}
                </div>
                <p className="text-lg opacity-80">pontos de experiencia</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Proximo nivel</span>
                  <span>3.000 XP</span>
                </div>
                <div className="h-3 rounded-full bg-white/20 overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${(activeXP / 3000) * 100}%` }}
                  />
                </div>
                <p className="text-sm opacity-70">Faltam apenas {3000 - activeXP} XP para o nivel 13</p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 opacity-10">
              <TrendingUp className="size-32" />
            </div>
          </div>

          {/* Streak */}
          <div className="group relative overflow-hidden rounded-3xl bg-card border border-border p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-orange-500/10">
                  <Trophy className="size-5 text-orange-500" />
                </div>
                <span className="text-xs font-medium text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">
                  Recorde!
                </span>
              </div>
              <div className="text-4xl font-bold mb-1">{streak} dias</div>
              <p className="text-sm text-muted-foreground">Streak atual</p>
              <div className="mt-4 flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 h-2 rounded-full ${i < 5 ? 'bg-orange-500' : 'bg-muted'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tarefas Hoje */}
          <div className="group relative overflow-hidden rounded-3xl bg-card border border-border p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-accent/10">
                  <CheckCircle2 className="size-5 text-accent" />
                </div>
                <span className="text-2xl font-bold">8/10</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Tarefas completadas</p>
              <Progress value={80} className="h-2" />
            </div>
          </div>

          {/* Foco do dia */}
          <div className="group relative overflow-hidden rounded-3xl bg-card border border-border p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Target className="size-5 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Foco de hoje</p>
              <p className="font-semibold">Estudar React</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />
                <span>2h restantes</span>
              </div>
            </div>
          </div>

          {/* Calendario */}
          <div className="group relative overflow-hidden rounded-3xl bg-card border border-border p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10">
                  <Calendar className="size-5 text-blue-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Esta semana</p>
              <div className="grid grid-cols-7 gap-1">
                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
                  <div key={i} className="text-center">
                    <span className="text-[10px] text-muted-foreground">{day}</span>
                    <div className={`mt-1 size-6 rounded-full flex items-center justify-center text-xs ${
                      i < 4 ? 'bg-primary text-primary-foreground' : i === 4 ? 'border-2 border-primary' : 'bg-muted'
                    }`}>
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card longo - AI Insights */}
          <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-r from-card to-muted/50 border border-border p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
                <Brain className="size-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Insights com IA</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Nossa IA analisa seus padroes e sugere melhorias personalizadas para sua rotina.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    Analise de habitos
                  </span>
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                    Sugestoes diarias
                  </span>
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                    Previsoes de meta
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <BarChart3 className="size-16 text-muted-foreground/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}