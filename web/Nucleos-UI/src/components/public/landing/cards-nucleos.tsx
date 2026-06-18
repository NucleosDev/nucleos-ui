// app/page.tsx (ou onde você estiver usando o FeatureGrid)
import { FeatureGrid } from "@/components/ui/landing-cards-nucleos";
import {
  BookOpen,
  Code,
  Heart,
  Briefcase,
  Target,
  Coffee,
  Dumbbell,
  Camera,
  Globe,
  Palette,
  Music,
  Wallet,
  Users,
  Home,
  Sparkles,
  Zap,
  Trophy,
  Rocket,
} from "lucide-react";

export default function CardsNucleos() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2
          id="blocks-heading"
          className="text-4xl md:text-5xl font-extrabold tracking-tight mt-6 text-center text-neutral-900 dark:text-white"
        >
          Sua Rotina não cabe em uma{" "}
          <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Lista de Tarefas
          </span>
          <p className="text-lg md:text-xl mt-4 text-center text-neutral-700 dark:text-neutral-300">
            Núcleos transforma objetivos em sistemas vivos de progresso.
          </p>
        </h2>
      </div>
      <FeatureGrid
        features={[
          {
            Icon: Heart,
            title: "Saúde e Bem-estar",
            description:
              "Rotina de exercícios, meditação e alimentação balanceada.",
          },

          // Card 5 (novo)
          {
            Icon: Globe,
            title: "Aprendizado de Idiomas",
            description:
              "Praticando inglês e iniciando francês com métodos de imersão.",
          },
          // Card 6 (novo)
          {
            Icon: Wallet,
            title: "Controle Financeiro",
            description:
              "Organizando gastos, investimentos e planejamento financeiro pessoal.",
          },
          // Card 7 (novo - exemplo extra)
          {
            Icon: Music,
            title: "Produção Musical",
            description:
              "Criando beats e aprendendo teoria musical com ferramentas digitais.",
          },
          // Card 8 (exemplo extra)
          {
            Icon: Palette,
            title: "Design de Interfaces",
            description:
              "Estudando UI/UX design, Figma e princípios de design visual.",
          },
          // Card 9 (exemplo extra)
          {
            Icon: Trophy,
            title: "Metas e Conquistas",
            description:
              "Acompanhando objetivos pessoais e celebrando cada conquista.",
          },
        ]}
      />
    </div>
  );
}
