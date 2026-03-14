import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-center sm:p-12 lg:p-16">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 size-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 size-64 rounded-full bg-primary-foreground/10 blur-3xl" />
          </div>

          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Pronto para transformar sua produtividade?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
            Junte-se a milhares de pessoas que estão evoluindo todos os dias com
            Nucleos. Sua jornada começa agora.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href={ROUTES.LOGIN}>
                Criar conta grátis
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/60">
            Sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  )
}
