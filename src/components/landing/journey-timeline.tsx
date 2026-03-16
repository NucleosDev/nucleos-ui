import { 
  UserPlus, Target, Trophy, TrendingUp, Crown, Sparkles
} from "lucide-react"

const etapas = [
  {
    icon: UserPlus,
    titulo: "Dia 1 - Comeco",
    descricao: "Crie sua conta e configure seus primeiros nucleos de acordo com seus objetivos.",
    nivel: "Nivel 1",
  },
  {
    icon: Target,
    titulo: "Semana 1 - Habitos",
    descricao: "Adicione tarefas diarias e comece a construir sua rotina. Ganhe seus primeiros XPs.",
    nivel: "Nivel 5",
  },
  {
    icon: Trophy,
    titulo: "Mes 1 - Conquistas",
    descricao: "Desbloqueie suas primeiras conquistas e veja seu progresso nos graficos.",
    nivel: "Nivel 15",
  },
  {
    icon: TrendingUp,
    titulo: "Mes 3 - Evolucao",
    descricao: "Seus habitos estao consolidados. Voce ja nota a diferenca na sua produtividade.",
    nivel: "Nivel 30",
  },
  {
    icon: Crown,
    titulo: "Mes 6 - Dominio",
    descricao: "Voce domina suas areas de desenvolvimento e inspira outros usuarios.",
    nivel: "Nivel 50",
  },
  {
    icon: Sparkles,
    titulo: "Ano 1 - Transformacao",
    descricao: "Uma pessoa completamente transformada. Seus objetivos do ano passado sao realidade.",
    nivel: "Nivel 100",
  },
]

export function JourneyTimeline() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Sua Jornada
          </span>
        </div>

        <h2 className="text-balance text-center text-3xl font-bold tracking-tight md:text-4xl">
          O caminho para a sua melhor versao
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Veja o que esperar em cada etapa da sua jornada no Nucleos.
        </p>

        <div className="mt-12 relative">
          {/* Linha central */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

          <div className="space-y-8 md:space-y-0">
            {etapas.map((etapa, index) => (
              <div 
                key={index}
                className={`relative flex flex-col md:flex-row items-center gap-4 md:gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Conteudo */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className={`p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow ${
                    index % 2 === 0 ? "md:ml-auto md:mr-8" : "md:mr-auto md:ml-8"
                  } max-w-sm`}>
                    <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <etapa.icon className="size-5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {etapa.nivel}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{etapa.titulo}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{etapa.descricao}</p>
                  </div>
                </div>

                {/* Circulo central */}
                <div className="relative z-10 flex size-12 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground font-bold shadow-lg">
                  {index + 1}
                </div>

                {/* Espacador */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}