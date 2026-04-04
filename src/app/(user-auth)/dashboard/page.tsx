"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Flame,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { DashboardHeader } from "@/components/layout-auth/dashboard-header";
import { NucleoCard } from "@/components/layout-auth/nucleoCard";
import { TaskCard } from "@/components/layout-auth/TaskCard";
import { User} from "@/src/types/tarefas";

import {
  useDashboardStats,
  useUserLevel,
  useStreaks,
  useNucleos,
  useTarefasVencendo,
  useConcluirTarefa,
  useCurrentUser,
} from "@/hooks/useDashboard";

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: user } = useCurrentUser();

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  const { data: level, isLoading: levelLoading } = useUserLevel();
  const { data: streaks } = useStreaks();

  const {
    data: nucleos,
    isLoading: nucleosLoading,
    error: nucleosError,
  } = useNucleos();

  const { data: tarefasVencendo, isLoading: tarefasLoading } =
    useTarefasVencendo();

  const concluirMutation = useConcluirTarefa();

  
  const nomeCompleto = user?.nome ?? "";
  const primeiroNome = nomeCompleto ? nomeCompleto.split(" ")[0] : "você";

  const userEmail = user?.email ?? "";
  const userAvatar = user?.avatarUrl ?? "";

  const hora = new Date().getHours();
  const saudacao =
    hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const nucleosFiltrados = (nucleos ?? []).filter((n) => {
    const nome = n.nome?.toLowerCase?.() ?? "";
    const descricao = n.descricao?.toLowerCase?.() ?? "";
    const query = searchQuery.toLowerCase();

    return nome.includes(query) || descricao.includes(query);
  });

  const streakPrincipal = streaks?.find((s) => s.ativo) ?? streaks?.[0];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        userName={nomeCompleto}
        userEmail={userEmail}
        userAvatarUrl={userAvatar}
        onNewNucleo={() => router.push("/nucleos/novo")}
        onSearch={setSearchQuery}
      />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-20 md:px-6 lg:pt-24">
        {/* Saudação */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-foreground text-balance">
            {saudacao}, {primeiroNome}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Aqui está o resumo do seu progresso.
          </p>
        </div>

        {/* Stats */}
        {statsError ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Não foi possível carregar as estatísticas.
            </AlertDescription>
          </Alert>
        ) : statsLoading || levelLoading ? (
          <div className="mb-8">
            {/* Skeleton */}
          </div>
        ) : (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs">Nível</p>
                <p className="text-2xl font-bold">
                  Nível {level?.nivel ?? "—"}
                </p>
                {level && (
                  <Progress
                    value={Math.round(
                      (level.xpAtual / level.xpProximoNivel) * 100
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs">Streak</p>
                <p className="text-2xl font-bold">
                  {streakPrincipal?.atual ??
                    stats?.tarefasConcluidasHoje ??
                    0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs">Núcleos ativos</p>
                <p className="text-2xl font-bold">
                  {stats?.nucleosAtivos ?? nucleos?.length ?? 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs">Concluídas hoje</p>
                <p className="text-2xl font-bold">
                  {stats?.tarefasConcluidasHoje ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Núcleos */}
        {nucleosFiltrados.map((n) => (
          <NucleoCard
            key={n.id}
            nucleo={n}
            onClick={(id) => router.push(`/nucleos/${id}`)}
          />
        ))}

        {/* Tarefas */}
        {tarefasVencendo?.map((t) => (
          <TaskCard
            key={t.id}
            tarefa={t}
            onConcluir={(id) => concluirMutation.mutate(id)}
          />
        ))}
      </main>
    </div>
  );
}
