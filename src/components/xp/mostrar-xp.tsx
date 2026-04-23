
import { useGamification } from "@/hooks/useGamification";

function ComponenteXPTeste() {
  const { useStats } = useGamification();
  const { data: stats } = useStats();

  return (
    <div>
      <p>Nível: {stats?.level}</p>
      <p>
        XP: {stats?.currentXp} / {stats?.nextLevelXp}
      </p>
      <p>Streak: {stats?.currentStreak} dias</p>
    </div>
  );
}
