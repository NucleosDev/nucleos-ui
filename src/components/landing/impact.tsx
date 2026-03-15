import { Progress } from "@/components/ui/progress"
import { Users, Target, TrendingUp, Award } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "2.500+",
    label: "Usuarios ativos",
    progress: 85,
  },
  {
    icon: Target,
    value: "15.000+",
    label: "Metas alcancadas",
    progress: 92,
  },
  {
    icon: TrendingUp,
    value: "89%",
    label: "Taxa de engajamento",
    progress: 89,
  },
  {
    icon: Award,
    value: "500+",
    label: "Niveis conquistados",
    progress: 78,
  },
]

const benefits = [
  "Organizacao de estudos",
  "Planejamento pessoal",
  "Desenvolvimento de habitos saudaveis",
  "Apoio ao crescimento profissional",
]

export function Impact() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Resultados Reais
          </span>
        </div>

        <h2 className="text-balance text-center text-3xl font-bold tracking-tight md:text-4xl">
          Impacto do Projeto
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          O Nucleos foi pensado como uma ferramenta de desenvolvimento pessoal
          que pode ajudar estudantes e membros da comunidade.
        </p>

        {/* Stats Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border bg-card p-6 text-center transition-all hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="size-6 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              <div className="mt-4">
                <Progress value={stat.progress} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mt-16 rounded-2xl bg-secondary/50 p-8">
          <h3 className="mb-6 text-center text-xl font-semibold">
            O que voce vai conquistar
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit}
                className="flex items-center gap-3 rounded-lg bg-card p-4"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}