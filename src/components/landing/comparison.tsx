import { Check, X } from "lucide-react"

const comparisons = [
  {
    feature: "Organizacao de tarefas",
    semNucleos: "Espalhadas em varios apps",
    comNucleos: "Tudo em um so lugar",
  },
  {
    feature: "Motivacao",
    semNucleos: "Facilmente perdida",
    comNucleos: "Sistema de XP e niveis",
  },
  {
    feature: "Acompanhamento",
    semNucleos: "Sem visao geral",
    comNucleos: "Dashboard completo",
  },
  {
    feature: "Consistencia",
    semNucleos: "Dificil manter habitos",
    comNucleos: "Streaks e conquistas",
  },
  {
    feature: "Personalizacao",
    semNucleos: "Limitada",
    comNucleos: "Nucleos personalizados",
  },
]

export function Comparison() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Antes e Depois
          </span>
        </div>

        <h2 className="text-balance text-center text-3xl font-bold tracking-tight md:text-4xl">
          A diferenca que o Nucleos faz
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Compare sua rotina antes e depois de usar o Nucleos.
        </p>

        <div className="mt-12 overflow-hidden rounded-2xl border">
          {/* Header */}
          <div className="grid grid-cols-3 bg-muted/50">
            <div className="p-4 font-medium">Aspecto</div>
            <div className="p-4 font-medium text-center border-x bg-destructive/5 text-destructive">
              Sem Nucleos
            </div>
            <div className="p-4 font-medium text-center bg-primary/5 text-primary">
              Com Nucleos
            </div>
          </div>

          {/* Rows */}
          {comparisons.map((item, index) => (
            <div 
              key={item.feature} 
              className={`grid grid-cols-3 ${index !== comparisons.length - 1 ? "border-b" : ""}`}
            >
              <div className="p-4 font-medium">{item.feature}</div>
              <div className="p-4 text-center border-x flex items-center justify-center gap-2 text-muted-foreground">
                <X className="size-4 text-destructive" />
                <span className="text-sm">{item.semNucleos}</span>
              </div>
              <div className="p-4 text-center flex items-center justify-center gap-2">
                <Check className="size-4 text-primary" />
                <span className="text-sm font-medium">{item.comNucleos}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}