"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "O que sao os Nucleos?",
    answer: "Nucleos sao areas da sua vida que voce deseja organizar e evoluir, como estudos, saude, financas e produtividade. Cada nucleo possui suas proprias tarefas, metas e sistema de progressao."
  },
  {
    question: "Como funciona o sistema de XP e niveis?",
    answer: "Ao completar tarefas dentro dos seus nucleos, voce ganha pontos de experiencia (XP). Conforme acumula XP, voce sobe de nivel, desbloqueando novas funcionalidades e conquistas. O sistema foi projetado para manter voce motivado."
  },
  {
    question: "Posso criar meus proprios nucleos personalizados?",
    answer: "Sim! Alem dos nucleos padrao (Estudos, Saude, Financas e Produtividade), voce pode criar nucleos totalmente personalizados para qualquer area da sua vida que deseja organizar."
  },
  {
    question: "O Nucleos e gratuito?",
    answer: "O Nucleos oferece um plano gratuito com funcionalidades essenciais. Para recursos avancados como analytics detalhados, nucleos ilimitados e integracao com outros apps, temos planos premium."
  },
  {
    question: "Como funciona o streak?",
    answer: "O streak conta quantos dias consecutivos voce completou pelo menos uma tarefa. Manter seu streak alto desbloqueia bonus de XP e conquistas especiais. Se perder um dia, o streak reseta."
  },
  {
    question: "Posso usar em multiplos dispositivos?",
    answer: "Sim! Seus dados sao sincronizados na nuvem, permitindo acesso de qualquer dispositivo. Temos apps para iOS, Android e versao web."
  },
]

export function FAQ() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            FAQ
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Perguntas frequentes
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Tire suas duvidas sobre o Nucleos
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50">
              <AccordionTrigger className="py-5 text-left text-base font-medium hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
