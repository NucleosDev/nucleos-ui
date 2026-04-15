"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/auth";
import { NucleosOverview } from "@/components/nucleo/ui/nucleos-overview";

export default function Dashboard() {
  const { user } = useAuth();
  const today = new Date();
  const formattedDate = format(today, "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold">
        Olá, {user?.fullName?.split(" ")[0] || "Usuário"}!
      </h1>
      <p className="text-muted-foreground mt-2">Hoje é {formattedDate}.</p>
      <div>
        <NucleosOverview />
      </div>
    </div>
  );
}
