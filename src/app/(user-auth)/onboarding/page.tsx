"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { nucleosService } from "@/services/nucleos.service";
import { blocosService } from "@/services/blocos.service";
import type { NucleoTipo } from "@/types/nucleo";
import type { BlocoTipo } from "@/types/bloco";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Dumbbell,
  DollarSign,
  Zap,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";

type BlocoTemplate = {
  tipo: BlocoTipo;
  titulo: string;
  posicao: number;
};

type Template = {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  cor: string;
  nucleo: {
    nome: string;
    tipo: NucleoTipo;
    descricao: string;
  };
  blocos: BlocoTemplate[];
};

const TEMPLATES: Template[] = [
  {
    id: "estudos",
    label: "Estudos",
    description: "Organize matérias, tarefas e hábitos de estudo",
    icon: BookOpen,
    cor: "#6366f1",
    nucleo: {
      nome: "Estudos",
      tipo: "estudo",
      descricao: "Meu espaço de aprendizado e organização acadêmica",
    },
    blocos: [
      { tipo: "tarefas", titulo: "Tarefas", posicao: 0 },
      { tipo: "habitos", titulo: "Hábitos de Estudo", posicao: 1 },
      { tipo: "notas", titulo: "Notas", posicao: 2 },
    ],
  },
  {
    id: "fitness",
    label: "Academia",
    description: "Treinos, progresso e hábitos de saúde",
    icon: Dumbbell,
    cor: "#22c55e",
    nucleo: {
      nome: "Fitness",
      tipo: "fitness",
      descricao: "Meu espaço de evolução física e saúde",
    },
    blocos: [
      { tipo: "habitos", titulo: "Treinos", posicao: 0 },
      { tipo: "tarefas", titulo: "Metas", posicao: 1 },
      { tipo: "timer", titulo: "Cronômetro", posicao: 2 },
    ],
  },
  {
    id: "financas",
    label: "Finanças",
    description: "Controle de gastos, metas e planejamento",
    icon: DollarSign,
    cor: "#f59e0b",
    nucleo: {
      nome: "Finanças",
      tipo: "financas",
      descricao: "Meu controle financeiro pessoal",
    },
    blocos: [
      { tipo: "lista", titulo: "Despesas", posicao: 0 },
      { tipo: "tarefas", titulo: "Contas a Pagar", posicao: 1 },
      { tipo: "notas", titulo: "Notas Financeiras", posicao: 2 },
    ],
  },
  {
    id: "produtividade",
    label: "Produtividade",
    description: "Tarefas, hábitos e organização diária",
    icon: Zap,
    cor: "#8b5cf6",
    nucleo: {
      nome: "Produtividade",
      tipo: "pessoal",
      descricao: "Minha central de produtividade e foco",
    },
    blocos: [
      { tipo: "tarefas", titulo: "Tarefas do Dia", posicao: 0 },
      { tipo: "habitos", titulo: "Hábitos", posicao: 1 },
      { tipo: "notas", titulo: "Notas", posicao: 2 },
    ],
  },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  async function handleSubmit() {
    if (selected.length === 0) return;
    setIsCreating(true);
    setError(null);

    try {
      const templates = TEMPLATES.filter((t) => selected.includes(t.id));

      for (const template of templates) {
        const nucleo = await nucleosService.create({
          nome: template.nucleo.nome,
          tipo: template.nucleo.tipo,
          descricao: template.nucleo.descricao,
          corDestaque: template.cor,
        });

        for (const bloco of template.blocos) {
          await blocosService.criar({
            nucleoId: nucleo.id,
            tipo: bloco.tipo,
            titulo: bloco.titulo,
            posicao: bloco.posicao,
          });
        }
      }

      localStorage.setItem("onboarding", "done");
      router.push("/dashboard");
    } catch (err) {
      console.error("Erro no onboarding:", err);
      setError("Ocorreu um erro ao criar seus núcleos. Tente novamente.");
      setIsCreating(false);
    }
  }

  function handleSkip() {
    localStorage.setItem("onboarding", "done");
    router.push("/dashboard");
  }

  const selectedCount = selected.length;
  const buttonLabel = isCreating
    ? "Criando seus Núcleos..."
    : selectedCount === 0
      ? "Selecione ao menos uma área"
      : `Criar ${selectedCount} Núcleo${selectedCount !== 1 ? "s" : ""} e Continuar`;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <LiquidGlass variant="floating" radius="50%">
              <div className="p-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </LiquidGlass>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Como você quer usar o Nucleos?
          </h1>
          <p className="text-muted-foreground text-base">
            Selecione as áreas que fazem sentido pra você. Criamos tudo
            automaticamente — núcleos e blocos prontos pra usar.
          </p>
        </motion.div>

        <div className="grid gap-3">
          {TEMPLATES.map((template, i) => {
            const Icon = template.icon;
            const active = selected.includes(template.id);

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => toggle(template.id)}
                className="cursor-pointer"
                style={
                  active
                    ? {
                        outline: `2px solid ${template.cor}`,
                        outlineOffset: "2px",
                        borderRadius: "16px",
                      }
                    : { borderRadius: "16px" }
                }
              >
                <LiquidGlass variant="interactive" radius="16px">
                  <div className="flex items-center gap-4 p-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{
                        backgroundColor: active
                          ? template.cor
                          : `${template.cor}22`,
                      }}
                    >
                      <Icon
                        className="w-5 h-5 transition-colors duration-200"
                        style={{ color: active ? "#fff" : template.cor }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{template.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                      {active && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {template.blocos.map((b) => (
                            <span
                              key={b.titulo}
                              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: `${template.cor}22`,
                                color: template.cor,
                              }}
                            >
                              {b.titulo}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{
                        borderColor: active ? template.cor : "currentColor",
                        backgroundColor: active ? template.cor : "transparent",
                        opacity: active ? 1 : 0.3,
                      }}
                    >
                      {active && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </LiquidGlass>
              </motion.div>
            );
          })}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button
            onClick={handleSubmit}
            disabled={selectedCount === 0 || isCreating}
            className="w-full h-12 text-base font-semibold"
          >
            {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {buttonLabel}
          </Button>
          <button
            onClick={handleSkip}
            disabled={isCreating}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1 disabled:opacity-50"
          >
            Pular por agora
          </button>
        </motion.div>
      </div>
    </div>
  );
}
