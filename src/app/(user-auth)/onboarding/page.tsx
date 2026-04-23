"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNucleos } from "@/hooks/useNucleo";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { BookOpen, Dumbbell, DollarSign, Zap } from "lucide-react";

type Option = {
  id: string;
  label: string;
  description: string;
  icon: any;
  templates: {
    title: string;
    blocks: string[];
  }[];
};

const OPTIONS: Option[] = [
  {
    id: "estudos",
    label: "Estudos",
    description: "Organizar matérias e provas",
    icon: BookOpen,
    templates: [
      {
        title: "Estudos",
        blocks: ["tarefa"], //
      },
    ],
  },
  {
    id: "academia",
    label: "Academia",
    description: "Treinos e evolução",
    icon: Dumbbell,
    templates: [
      {
        title: "Treino",
        blocks: ["habito"], // 👈 EXISTE
      },
    ],
  },
  {
    id: "financas",
    label: "Finanças",
    description: "Controle financeiro",
    icon: DollarSign,
    templates: [
      {
        title: "Finanças",
        blocks: ["tarefa"], // usa tarefa por enquanto
      },
    ],
  },
  {
    id: "produtividade",
    label: "Produtividade",
    description: "Organizar tarefas do dia a dia",
    icon: Zap,
    templates: [
      {
        title: "Produtividade",
        blocks: ["tarefa", "habito"], // mistura
      },
    ],
  },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const { create, isCreating } = useNucleos();

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  async function handleSubmit() {
    try {
      const templates = OPTIONS.filter((opt) =>
        selected.includes(opt.id),
      ).flatMap((opt) => opt.templates);

      for (const nucleo of templates) {
        await create({
          title: nucleo.title,
          blocks: nucleo.blocks,
        } as any);
      }
      localStorage.setItem("onboarding", "done");
      router.push("/painel");
    } catch (err) {
      console.error("ERRO:", err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Como você quer usar o Nucleos?</h1>
          <p className="text-muted-foreground">
            Vamos criar tudo automaticamente pra você
          </p>
        </div>

        <div className="grid gap-4">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = selected.includes(opt.id);

            return (
              <Card
                key={opt.id}
                onClick={() => toggle(opt.id)}
                className={`cursor-pointer border-2 ${
                  active ? "border-primary bg-primary/5" : "hover:border-muted"
                }`}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <Checkbox checked={active} />
                  <Icon className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {opt.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={selected.length === 0 || isCreating}
          className="w-full h-12"
        >
          {isCreating ? "Criando seus Nucleos..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
