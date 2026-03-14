import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Grátis',
    description: 'Perfeito para começar sua jornada de evolução.',
    price: 'R$ 0',
    period: '/mês',
    features: [
      'Até 3 Nucleos',
      '10 hábitos por núcleo',
      'Tracking de atividades',
      'Sistema de XP e níveis',
      'Estatísticas básicas',
    ],
    cta: 'Começar grátis',
    featured: false,
  },
  {
    name: 'Pro',
    description: 'Para quem leva a evolução a sério.',
    price: 'R$ 19',
    period: '/mês',
    features: [
      'Nucleos ilimitados',
      'Hábitos ilimitados',
      'Conquistas exclusivas',
      'Estatísticas avançadas',
      'Temas personalizados',
      'Backup na nuvem',
      'Suporte prioritário',
    ],
    cta: 'Assinar Pro',
    featured: true,
  },
  {
    name: 'Equipe',
    description: 'Para grupos e organizações.',
    price: 'R$ 49',
    period: '/mês',
    features: [
      'Tudo do Pro',
      'Até 10 membros',
      'Desafios em grupo',
      'Ranking de equipe',
      'Dashboard administrativo',
      'Integrações',
    ],
    cta: 'Fale conosco',
    featured: false,
  },
]

export function Pricing() {
  return (
    <section
      id="precos"
      className="bg-secondary/30 px-4 py-20 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Preços
          </p>
          <h2 className="mt-3 text-pretty text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Escolha seu plano de evolução
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comece grátis e evolua conforme suas necessidades. Sem surpresas,
            sem letras miúdas.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-8 ${
                plan.featured
                  ? 'border-primary bg-card shadow-lg'
                  : 'border-border/50 bg-card/50'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                  Mais popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.featured ? 'default' : 'outline'}
                asChild
                className="w-full"
              >
                <Link href={ROUTES.LOGIN}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
