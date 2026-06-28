// src/components/gamification/XPHistoryList.tsx
"use client";

import { Zap, Trophy, Flame, Award, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/hooks/useGamification";
import { gamificacaoService } from "@/services/gamificacao.service";

export function XPHistoryList() {
  const { useXpHistory } = useGamification();
  const { data: transactions, isLoading } = useXpHistory(20);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma transação de XP ainda. Complete ações para ganhar XP!
      </div>
    );
  }

  // Converte as transações do backend para o formato do frontend
  const convertedTransactions =
    gamificacaoService.convertToXPTransaction(transactions);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "tarefa":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case "habito":
        return <Flame className="w-4 h-4 text-orange-500" />;
      case "nucleo":
        return <Trophy className="w-4 h-4 text-purple-500" />;
      case "streak":
        return <Flame className="w-4 h-4 text-red-500" />;
      case "conquista":
        return <Award className="w-4 h-4 text-green-500" />;
      default:
        return <Zap className="w-4 h-4 text-primary" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "tarefa":
        return "Tarefa Concluída";
      case "habito":
        return "Hábito Registrado";
      case "nucleo":
        return "Nucleo Criado";
      case "streak":
        return "Streak Mantido";
      case "conquista":
        return "Conquista Desbloqueada";
      default:
        return source;
    }
  };

  return (
    <div className="space-y-2">
      {convertedTransactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
        >
          <div className="flex items-center gap-3">
            {getSourceIcon(tx.source)}
            <div>
              <p className="font-medium">{getSourceLabel(tx.source)}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {tx.createdAt.toLocaleDateString()} às{" "}
                {tx.createdAt.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <p className="font-bold text-primary">+{tx.amount} XP</p>
        </div>
      ))}
    </div>
  );
}
