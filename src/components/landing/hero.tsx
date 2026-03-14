import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-40 lg:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
          <Sparkles className="size-4" />
          <span>Sistema de produtividade gamificado</span>
        </div>

        <h1 className="text-pretty text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Transforme sua vida em uma{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            jornada de evolução
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Crie Nucleos de foco para cada área da sua vida. Acompanhe atividades,
          construa hábitos, ganhe experiência e suba de nível. Produtividade
          nunca foi tão envolvente.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href={ROUTES.LOGIN}>
              Começar agora
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
            <Link href="#como-funciona">Ver demonstração</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Grátis para começar. Sem cartão de crédito.
        </p>
      </div>

      <div className="relative mx-auto mt-16 max-w-4xl lg:mt-20">
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-border/50 bg-secondary/30 px-4 py-3">
            <div className="size-3 rounded-full bg-destructive/60" />
            <div className="size-3 rounded-full bg-chart-3/60" />
            <div className="size-3 rounded-full bg-accent/60" />
          </div>
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <CoreCard
                name="Estudos"
                level={12}
                xp={2450}
                xpMax={3000}
                color="primary"
                icon=""
              />
              <CoreCard
                name="Fitness"
                level={8}
                xp={1200}
                xpMax={2000}
                color="accent"
                icon=""
              />
              <CoreCard
                name="Trabalho"
                level={15}
                xp={4500}
                xpMax={5000}
                color="chart-3"
                icon=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CoreCard({
  name,
  level,
  xp,
  xpMax,
  color,
  icon,
}: {
  name: string
  level: number
  xp: number
  xpMax: number
  color: string
  icon: string
}) {
  const progress = (xp / xpMax) * 100

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="font-medium text-foreground">{name}</span>
        </div>
        <span className={`rounded-full bg-${color}/10 px-2 py-0.5 text-xs font-medium text-${color}`}>
          Nv. {level}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full bg-${color} transition-all`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {xp.toLocaleString('pt-BR')} / {xpMax.toLocaleString('pt-BR')} XP
      </p>
    </div>
  )
}
