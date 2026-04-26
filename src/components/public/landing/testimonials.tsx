import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Lucas Mendes",
    role: "Estudante de Medicina",
    content: "O Nucleos transformou minha rotina de estudos. Consegui organizar todas as materias e ver meu progresso diariamente. Passei de media 7 para 9!",
    rating: 5,
    avatar: "LM",
    stats: { level: 24, streak: 45 }
  },
  {
    name: "Ana Carolina",
    role: "Empreendedora",
    content: "Finalmente consegui equilibrar minha vida pessoal e profissional. O sistema de nucleos me ajuda a nao negligenciar nenhuma area importante.",
    rating: 5,
    avatar: "AC",
    stats: { level: 18, streak: 32 }
  },
  {
    name: "Pedro Santos",
    role: "Desenvolvedor",
    content: "A gamificacao faz toda diferenca. Me sinto motivado a completar minhas tarefas todos os dias para manter meu streak e subir de nivel.",
    rating: 5,
    avatar: "PS",
    stats: { level: 31, streak: 67 }
  },
]

export function Testimonials() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Depoimentos
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            O que nossos usuarios dizem
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Milhares de pessoas ja transformaram suas vidas com o Nucleos
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden border-0 bg-card shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-6">
                <Quote className="absolute right-4 top-4 size-8 text-primary/10" />
                
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="mb-6 text-pretty text-muted-foreground">
                  {`"${testimonial.content}"`}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Nivel {testimonial.stats.level}</p>
                    <p className="text-sm font-medium text-primary">{testimonial.stats.streak} dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
