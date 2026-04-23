// src/app/(user-auth)/dashboard/gamificacao/page.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LevelCard } from "@/components/gamification/LevelCard";
import { StreaksList } from "@/components/gamification/StreaksList";
import { ConquistasList } from "@/components/gamification/ConquistasList";
import { Leaderboard } from "@/components/gamification/Leaderboard";
import { XPHistoryList } from "@/components/gamification/XPHistoryList";

export default function GamificacaoPage() {
  return (
    <div className="container py-8 space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold">Gamificação</h1>
        <p className="text-muted-foreground">
          Acompanhe seu progresso, conquistas e ranking
        </p>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LevelCard />
        <StreaksList />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="conquistas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
          <TabsTrigger value="leaderboard">Ranking Global</TabsTrigger>
          <TabsTrigger value="history">Histórico de XP</TabsTrigger>
        </TabsList>

        <TabsContent value="conquistas">
          <ConquistasList />
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>

        <TabsContent value="history">
          <XPHistoryList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
