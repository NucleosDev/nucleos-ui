"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Heart, Wallet, Zap, CheckCircle2 } from "lucide-react"

const nucleos = [
  {
    icon: BookOpen,
    title: "Estudos",
    description: "Organize rotinas de aprendizado e metas de estudo.",
    progress: 75,
    tasks: { completed: 3, total: 4 },
    xp: 450,
    color: "bg-blue-500",
  },
  {
    icon: Heart,
    title: "Saude",
    description: "Registre exercicios e acompanhe habitos saudaveis.",
    progress: 66,
    tasks: { completed: 2, total: 3 },
    xp: 320,
    color: "bg-rose-500",
  },
  {
    icon: Wallet,
    title: "Financas",
    description: "Controle gastos e planeje seu futuro financeiro.",
    progress: 50,
    tasks: { completed: 1, total: 2 },
    xp: 180,
    color: "bg-emerald-500",
  },
  {
    icon: Zap,
    title: "Produtividade",
    description: "Organize tarefas e aumente sua eficiencia.",
    progress: 90,
    tasks: { completed: 9, total: 10 },
    xp: 680,
    color: "bg-amber-500",
  },
]

export function Nucleos() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Areas de Desenvolvimento
          </span>
        </div>

        <h2 className="text-balance text-center text-3xl font-bold tracking-tight md:text-4xl">
          Acompanhe seu progresso em cada area
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Cada nucleo representa uma area da sua vida. Complete tarefas, ganhe XP e evolua constantemente.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {nucleos.map((nucleo) => (
            <Card
              key={nucleo.title}
              className="group border transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className={`flex size-12 items-center justify-center rounded-xl ${nucleo.color} text-white`}>
                    <nucleo.icon className="size-6" />
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
                    +{nucleo.xp} XP
                  </span>
                </div>
                <CardTitle className="text-lg">{nucleo.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {nucleo.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <CheckCircle2 className="size-4" />
                      Tarefas
                    </span>
                    <span className="font-medium">
                      {nucleo.tasks.completed}/{nucleo.tasks.total}
                    </span>
                  </div>
                  <Progress value={nucleo.progress} className="h-2" />
                  <p className="text-right text-xs text-muted-foreground">
                    {nucleo.progress}% completo
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}