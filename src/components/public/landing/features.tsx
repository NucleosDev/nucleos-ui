import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Zap, 
  BarChart3, 
  Bell, 
  Smartphone,
  Shield,
  Sparkles
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Gamificacao Inteligente",
    description: "Sistema de XP, niveis e conquistas que torna a organizacao pessoal viciante e divertida.",
    highlight: "primary"
  },
  {
    icon: BarChart3,
    title: "Analytics Detalhados",
    description: "Graficos e relatorios que mostram sua evolucao ao longo do tempo em cada area.",
    highlight: "accent"
  },
  {
    icon: Bell,
    title: "Lembretes Inteligentes",
    description: "Notificacoes personalizadas que se adaptam a sua rotina e horarios.",
    highlight: "primary"
  },
  {
    icon: Smartphone,
    title: "Multi-plataforma",
    description: "Acesse de qualquer lugar: web, iOS e Android com sincronizacao em tempo real.",
    highlight: "accent"
  },
  {
    icon: Shield,
    title: "Privacidade Total",
    description: "Seus dados sao criptografados e nunca compartilhados com terceiros.",
    highlight: "primary"
  },
  {
    icon: Sparkles,
    title: "IA Assistente",
    description: "Sugestoes personalizadas baseadas em seus habitos e padroes de comportamento.",
    highlight: "accent"
  },
]

export function Features() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div data-animate="fade-up" className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent-foreground">
            Recursos
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Tudo que voce precisa para evoluir
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Ferramentas poderosas projetadas para maximizar seu potencial
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              data-animate="fade-up"
              data-delay={String((index + 1) * 100)}
              className="group relative overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className={`mb-4 flex size-12 items-center justify-center rounded-xl ${
                  feature.highlight === 'primary' ? 'bg-primary/10' : 'bg-accent/20'
                }`}>
                  <feature.icon className={`size-6 ${
                    feature.highlight === 'primary' ? 'text-primary' : 'text-accent-foreground'
                  }`} />
                </div>
                
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>

                <div className="absolute bottom-0 left-0 h-1 w-full bg-border/30">
                  <div className={`h-full w-0 transition-all duration-500 group-hover:w-full ${
                    feature.highlight === 'primary' ? 'bg-primary' : 'bg-accent'
                  }`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview de Dashboard */}
        <div data-animate="fade-up" data-delay="200" className="mt-16 rounded-2xl border bg-card p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Seu Dashboard</h3>
              <p className="text-sm text-muted-foreground">Visao geral do seu progresso</p>
            </div>
            <div className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              Nivel 15
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground">XP Semanal</p>
              <p className="mt-1 text-2xl font-bold">1.250</p>
              <Progress value={62} className="mt-3 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">62% da meta</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground">Tarefas Hoje</p>
              <p className="mt-1 text-2xl font-bold">8/12</p>
              <Progress value={67} className="mt-3 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">67% completo</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground">Streak Atual</p>
              <p className="mt-1 text-2xl font-bold text-primary">14 dias</p>
              <Progress value={100} className="mt-3 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">Recorde: 21 dias</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground">Conquistas</p>
              <p className="mt-1 text-2xl font-bold">23/50</p>
              <Progress value={46} className="mt-3 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">46% desbloqueado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}