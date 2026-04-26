"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, Heart, Wallet, Zap, Plus, Check, 
  Trophy, Flame, Star, Calendar
} from "lucide-react"

const tabs = [
  { id: "hoje", label: "Hoje", icon: Calendar },
  { id: "nucleos", label: "Nucleos", icon: Zap },
  { id: "conquistas", label: "Conquistas", icon: Trophy },
]

const tarefasHoje = [
  { id: 1, titulo: "Estudar React por 1h", nucleo: "Estudos", xp: 50, concluida: true },
  { id: 2, titulo: "30min de caminhada", nucleo: "Saude", xp: 30, concluida: true },
  { id: 3, titulo: "Revisar orcamento mensal", nucleo: "Financas", xp: 40, concluida: false },
  { id: 4, titulo: "Organizar tarefas da semana", nucleo: "Produtividade", xp: 25, concluida: false },
]

const conquistas = [
  { id: 1, titulo: "Primeiro Passo", desc: "Complete sua primeira tarefa", icone: Star, desbloqueada: true },
  { id: 2, titulo: "Semana Perfeita", desc: "7 dias consecutivos", icone: Flame, desbloqueada: true },
  { id: 3, titulo: "Mestre dos Estudos", desc: "100 tarefas de estudo", icone: BookOpen, desbloqueada: false },
  { id: 4, titulo: "Vida Saudavel", desc: "30 dias de exercicios", icone: Heart, desbloqueada: false },
]

const nucleoIcons: Record<string, typeof BookOpen> = {
  Estudos: BookOpen,
  Saude: Heart,
  Financas: Wallet,
  Produtividade: Zap,
}

const nucleoColors: Record<string, string> = {
  Estudos: "text-blue-500",
  Saude: "text-rose-500",
  Financas: "text-emerald-500",
  Produtividade: "text-amber-500",
}

export function AppPreview() {
  const [activeTab, setActiveTab] = useState("hoje")
  const [tarefas, setTarefas] = useState(tarefasHoje)

  const toggleTarefa = (id: number) => {
    setTarefas(tarefas.map(t => 
      t.id === id ? { ...t, concluida: !t.concluida } : t
    ))
  }

  const tarefasConcluidas = tarefas.filter(t => t.concluida).length
  const progressoHoje = (tarefasConcluidas / tarefas.length) * 100

  return (
    <section className="px-6 py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Experimente Agora
          </span>
        </div>

        <h2 className="text-balance text-center text-3xl font-bold tracking-tight md:text-4xl">
          Veja como funciona na pratica
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Interaja com a demonstracao abaixo e descubra como o Nucleos pode transformar sua rotina.
        </p>

        <div className="mt-12 flex justify-center">
          <Card className="w-full max-w-md overflow-hidden border-2">
            {/* Header do App */}
            <div className="bg-primary p-4 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Ola, Usuario</p>
                  <p className="font-semibold">Nivel 12 - Explorador</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
                    <Flame className="size-4" />
                    <span className="text-sm font-medium">7</span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>2.450 XP</span>
                  <span>3.000 XP</span>
                </div>
                <div className="h-2 rounded-full bg-white/30">
                  <div className="h-2 rounded-full bg-white" style={{ width: "82%" }} />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="size-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Conteudo */}
            <div className="p-4 min-h-[320px]">
              {activeTab === "hoje" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Progresso de Hoje</p>
                      <p className="text-sm text-muted-foreground">
                        {tarefasConcluidas} de {tarefas.length} tarefas
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(progressoHoje)}%
                    </div>
                  </div>
                  <Progress value={progressoHoje} className="h-2" />

                  <div className="space-y-2 mt-4">
                    {tarefas.map((tarefa) => {
                      const Icon = nucleoIcons[tarefa.nucleo]
                      return (
                        <button
                          key={tarefa.id}
                          onClick={() => toggleTarefa(tarefa.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            tarefa.concluida
                              ? "bg-primary/5 border-primary/30"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className={`flex size-8 items-center justify-center rounded-full border-2 transition-colors ${
                            tarefa.concluida
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-muted-foreground/30"
                          }`}>
                            {tarefa.concluida && <Check className="size-4" />}
                          </div>
                          <div className="flex-1 text-left">
                            <p className={`text-sm font-medium ${tarefa.concluida ? "line-through text-muted-foreground" : ""}`}>
                              {tarefa.titulo}
                            </p>
                            <p className={`text-xs ${nucleoColors[tarefa.nucleo]} flex items-center gap-1`}>
                              <Icon className="size-3" />
                              {tarefa.nucleo}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            +{tarefa.xp} XP
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <Button className="w-full mt-2" variant="outline" size="sm">
                    <Plus className="size-4 mr-2" />
                    Adicionar Tarefa
                  </Button>
                </div>
              )}

              {activeTab === "nucleos" && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { nome: "Estudos", icon: BookOpen, cor: "bg-blue-500", progresso: 75 },
                    { nome: "Saude", icon: Heart, cor: "bg-rose-500", progresso: 66 },
                    { nome: "Financas", icon: Wallet, cor: "bg-emerald-500", progresso: 50 },
                    { nome: "Produtividade", icon: Zap, cor: "bg-amber-500", progresso: 90 },
                  ].map((nucleo) => (
                    <div key={nucleo.nome} className="p-4 rounded-xl border hover:border-primary/50 transition-colors cursor-pointer">
                      <div className={`size-10 rounded-lg ${nucleo.cor} flex items-center justify-center mb-3`}>
                        <nucleo.icon className="size-5 text-white" />
                      </div>
                      <p className="font-medium text-sm">{nucleo.nome}</p>
                      <div className="mt-2">
                        <Progress value={nucleo.progresso} className="h-1.5" />
                        <p className="text-xs text-muted-foreground mt-1">{nucleo.progresso}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "conquistas" && (
                <div className="space-y-3">
                  {conquistas.map((conquista) => (
                    <div
                      key={conquista.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        conquista.desbloqueada ? "bg-primary/5 border-primary/30" : "opacity-50"
                      }`}
                    >
                      <div className={`size-10 rounded-full flex items-center justify-center ${
                        conquista.desbloqueada ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        <conquista.icone className="size-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{conquista.titulo}</p>
                        <p className="text-xs text-muted-foreground">{conquista.desc}</p>
                      </div>
                      {conquista.desbloqueada && (
                        <Check className="size-5 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}