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
    <div className="min-h-screen">
      <FeatureGrid
        className=""
        sectionTitle="Sua vida não cabe

em uma lista de tarefas."
        sectionDescription="Núcleos transforma objetivos em sistemas vivos de progresso. "
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
