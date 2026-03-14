import { Target, TrendingUp, Zap, Trophy, Calendar, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'Nucleos de Foco',
    description:
      'Crie Nucleos para cada área importante da sua vida: estudos, saúde, carreira, hobbies. Organize sua energia de forma inteligente.',
  },
  {
    icon: TrendingUp,
    title: 'Sistema de XP',
    description:
      'Ganhe pontos de experiência ao completar atividades e hábitos. Veja seu progresso real através de métricas gamificadas.',
  },
  {
    icon: Zap,
    title: 'Hábitos Inteligentes',
    description:
      'Construa hábitos diários, semanais ou mensais. O sistema acompanha suas sequências e recompensa sua consistência.',
  },
  {
    icon: Trophy,
    title: 'Níveis e Conquistas',
    description:
      'Suba de nível em cada núcleo conforme evolui. Desbloqueie conquistas especiais e acompanhe sua jornada de crescimento.',
  },
  {
    icon: Calendar,
    title: 'Tracking de Atividades',
    description:
      'Registre cada atividade completada. Visualize seu histórico e identifique padrões para melhorar continuamente.',
  },
  {
    icon: BarChart3,
    title: 'Estatísticas Detalhadas',
    description:
      'Dashboards completos com gráficos e insights sobre seu desempenho. Dados que inspiram ação.',
  },
]

export function Features() {
  return (
    <section id="recursos" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Recursos
          </p>
          <h2 className="mt-3 text-pretty text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tudo o que você precisa para evoluir
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Um sistema completo projetado para transformar sua produtividade em
            uma experiência envolvente e recompensadora.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/50 hover:bg-card"
            >
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="size-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
