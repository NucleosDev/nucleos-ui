import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const testimonials = [
  {
    quote:
      'O Nucleos mudou completamente minha relação com produtividade. Ver meu progresso em XP me motiva a manter a consistência todos os dias.',
    name: 'Marina Silva',
    role: 'Desenvolvedora de Software',
    initials: 'MS',
  },
  {
    quote:
      'Finalmente encontrei um sistema que não me faz sentir culpado por dias ruins. O foco em progresso gradual é revolucionário.',
    name: 'Pedro Santos',
    role: 'Estudante de Medicina',
    initials: 'PS',
  },
  {
    quote:
      'Uso para organizar meus treinos, estudos e projetos pessoais. A gamificação transforma tarefas chatas em desafios empolgantes.',
    name: 'Ana Costa',
    role: 'Designer UX',
    initials: 'AC',
  },
]

export function Testimonials() {
  return (
    <section id="depoimentos" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Depoimentos
          </p>
          <h2 className="mt-3 text-pretty text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Amado por pessoas que buscam evolução
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Veja o que nossa comunidade está dizendo sobre a experiência com
            Nucleos.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col rounded-xl border border-border/50 bg-card/50 p-6"
            >
              <blockquote className="flex-1 text-muted-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
