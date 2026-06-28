import { FeatureGrid } from "@/components/ui/landing-cards-nucleos";
import { Heart, Globe, Wallet, Music, Palette, Trophy } from "lucide-react";

export default function CardsNucleos() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FeatureGrid
          sectionTitle={
            <>
              Sua Rotina não cabe em uma{" "}
              <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Lista de Tarefas
              </span>
            </>
          }
          sectionDescription="Núcleos transforma objetivos em sistemas vivos de progresso."
          features={[
            {
              Icon: Heart,
              title: "Saúde e Bem-estar",
              description:
                "Rotina de exercícios, meditação e alimentação balanceada.",
            },
            {
              Icon: Globe,
              title: "Aprendizado de Idiomas",
              description:
                "Praticando inglês e iniciando francês com métodos de imersão.",
            },
            {
              Icon: Wallet,
              title: "Controle Financeiro",
              description:
                "Organizando gastos, investimentos e planejamento financeiro pessoal.",
            },
            {
              Icon: Music,
              title: "Produção Musical",
              description:
                "Criando beats e aprendendo teoria musical com ferramentas digitais.",
            },
            {
              Icon: Palette,
              title: "Design de Interfaces",
              description:
                "Estudando UI/UX design, Figma e princípios de design visual.",
            },
            {
              Icon: Trophy,
              title: "Metas e Conquistas",
              description:
                "Acompanhando objetivos pessoais e celebrando cada conquista.",
            },
          ]}
        />
      </div>
    </div>
  );
}
