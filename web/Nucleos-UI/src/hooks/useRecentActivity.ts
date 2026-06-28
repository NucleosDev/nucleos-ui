// hooks/useRecentActivity.ts
import { Flame, CheckCircle, PlusCircle, Edit } from "lucide-react";

export function useRecentActivity(limit = 5) {
  const mockActivities = [
    {
      id: "1",
      icon: CheckCircle,
      title: "Completou tarefa 'Revisar documentação'",
      nucleoName: "Projeto Alpha",
      time: "Há 2 horas",
      xp: 50,
    },
    {
      id: "2",
      icon: Flame,
      title: "Manteve streak de 12 dias",
      nucleoName: "Hábitos Saudáveis",
      time: "Há 5 horas",
      xp: 30,
    },
    {
      id: "3",
      icon: PlusCircle,
      title: "Criou nova coleção 'Artigos'",
      nucleoName: "Estudos",
      time: "Ontem",
    },
    {
      id: "4",
      icon: Edit,
      title: "Atualizou perfil do Nucleo",
      nucleoName: "Pessoal",
      time: "Ontem",
    },
  ];

  return {
    activities: mockActivities.slice(0, limit),
    loading: false,
  };
}
