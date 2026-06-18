import { HeroHome } from "@/components/ui/hero-home";

export default function HeroSection() {
  return (
    <HeroHome
      title='Tudo começa com um <span class="bg-gradient-to-r from-chart-3 via-chart-4 to-chart-3 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Nucleo</span>.'
      subtitle="O espaço certo para cada ideia. Organize. Realize. Evolua. Simples, flexível e ao seu alcance."
      eyebrow="Início"
      ctaLabel="Comece agora"
      ctaHref="#"
      demoLabel="Ver demonstração"
      demoHref="#demo"
    />
  );
}
