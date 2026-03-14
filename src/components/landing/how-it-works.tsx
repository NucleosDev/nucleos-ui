const steps = [
  {
    number: '01',
    title: 'Crie seus Nucleos',
    description:
      'Defina as áreas da sua vida que deseja desenvolver. Cada núcleo representa um centro de energia focado no seu crescimento.',
  },
  {
    number: '02',
    title: 'Estabeleça Hábitos',
    description:
      'Adicione hábitos a cada núcleo. Configure a frequência e a quantidade de XP que cada um vale. Construa sua rotina ideal.',
  },
  {
    number: '03',
    title: 'Complete Atividades',
    description:
      'Registre suas atividades diárias. Cada tarefa completada adiciona experiência ao seu núcleo correspondente.',
  },
  {
    number: '04',
    title: 'Evolua e Celebre',
    description:
      'Acompanhe seu progresso, suba de nível e desbloqueie conquistas. Sua jornada de evolução acontece um passo de cada vez.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="bg-secondary/30 px-4 py-20 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Como funciona
          </p>
          <h2 className="mt-3 text-pretty text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simples de usar, poderoso para evoluir
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comece sua jornada em minutos. O sistema foi projetado para ser
            intuitivo e motivador desde o primeiro dia.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-1/2 hidden h-px w-full bg-gradient-to-r from-primary/50 to-transparent lg:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
