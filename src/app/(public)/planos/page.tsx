// /app/planos/page.tsx
"use client";

import Pricing from "@/components/nucleo/pricing-section";
import {
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Check,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const PAYMENT_FREQUENCIES = ["mensal", "anual"];

export const TIERS = [
  {
    id: "gratis",
    name: "Grátis",
    price: {
      mensal: "Grátis",
      anual: "Grátis",
    },
    description: "Para começar sua jornada",
    features: [
      "Até 5 Nucleos",
      "10 hábitos por Nucleo",
      "Sistema de XP e níveis",
      "Streaks diários",
      "Conquistas básicas",
      "Estatísticas simples",
    ],
    cta: "Começar grátis",
    icon: "Sparkles",
    color: "#4D7CFF",
  },
  {
    id: "pro",
    name: "Pro",
    price: {
      mensal: 29.9,
      anual: 287, // 20% de desconto
    },
    description: "Para quem quer evoluir mais rápido",
    features: [
      "Nucleos ilimitados",
      "Hábitos ilimitados",
      "Analytics avançado",
      "Conquistas exclusivas",
      "Temas personalizados",
      "Backup na nuvem",
      "Exportação de dados",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    popular: true,
    icon: "Crown",
    color: "#00C9A7",
  },
  {
    id: "vitalicio",
    name: "Vitalício",
    price: {
      mensal: 497,
      anual: 497,
    },
    description: "Invista de uma vez por todas",
    features: [
      "Tudo do Pro",
      "Acesso vitalício",
      "Atualizações grátis",
      "Prioridade em features",
      "Beta tester exclusivo",
      "Suporte VIP",
      "Consultoria personalizada",
    ],
    cta: "Garantir acesso",
    highlighted: true,
    icon: "Infinity",
    color: "#FFD700",
  },
  {
    id: "equipe",
    name: "Equipe",
    price: {
      mensal: "Sob consulta",
      anual: "Sob consulta",
    },
    description: "Para times e organizações",
    features: [
      "Até 10 membros",
      "Nucleos compartilhados",
      "Desafios em equipe",
      "Rankings",
      "Dashboard administrativo",
      "Relatórios de equipe",
      "Integrações",
      "Suporte 24/7",
    ],
    cta: "Falar com vendas",
    icon: "Users",
    color: "#0077BE",
  },
];

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4D7CFF]/5 via-transparent to-[#00C9A7]/5">
      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-12">
        <Pricing />

        {/* Features extras */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-xl border border-[#4D7CFF]/20 bg-gradient-to-br from-[#4D7CFF]/5 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-[#4D7CFF]/10 flex items-center justify-center">
                <Sparkles className="size-5 text-[#4D7CFF]" />
              </div>
              <h3 className="font-semibold">Garantia de 30 dias</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Teste qualquer plano premium por 30 dias. Se não gostar,
              devolvemos 100% do seu dinheiro.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#00C9A7]/20 bg-gradient-to-br from-[#00C9A7]/5 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-[#00C9A7]/10 flex items-center justify-center">
                <Zap className="size-5 text-[#00C9A7]" />
              </div>
              <h3 className="font-semibold">Cancele quando quiser</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Sem multas, sem burocracia. Você pode cancelar sua assinatura a
              qualquer momento.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#FFD700]/20 bg-gradient-to-br from-[#FFD700]/5 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
                <Star className="size-5 text-[#FFD700]" />
              </div>
              <h3 className="font-semibold">Suporte incluso</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Todos os planos incluem suporte por email. Planos premium têm
              suporte prioritário.
            </p>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Ainda tem dúvidas sobre os planos?
          </p>
          <Link href="/duvidas">
            <Button variant="outline" className="gap-2">
              <HelpCircle className="size-4" />
              Ver perguntas frequentes
            </Button>
          </Link>
        </div>

        {/* Selos de confiança */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Badge
            variant="outline"
            className="gap-2 border-[#4D7CFF]/30 text-[#4D7CFF]"
          >
            <Check className="size-3" />
            Pagamento seguro
          </Badge>
          <Badge
            variant="outline"
            className="gap-2 border-[#00C9A7]/30 text-[#00C9A7]"
          >
            <Check className="size-3" />
            Sem fidelidade
          </Badge>
          <Badge
            variant="outline"
            className="gap-2 border-[#FFD700]/30 text-[#FFD700]"
          >
            <Check className="size-3" />
            Atualizações gratuitas
          </Badge>
        </div>
      </div>
    </div>
  );
}
