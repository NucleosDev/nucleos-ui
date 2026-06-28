// /components/nucleos/utils/nucleo-helpers.ts
import { Nucleo } from "@/types/nucleo"
import { XpLog, EnergyLog } from "@/types/logs"

export function calculateLevel(xp: number): { level: number; nextLevelXp: number } {
  // Fórmula: cada nível requer 1000 XP * nível atual
  const level = Math.floor(xp / 1000) + 1
  const nextLevelXp = level * 1000
  return { level, nextLevelXp }
}

export function calculateProgress(xp: number, nextLevelXp: number): number {
  return (xp / nextLevelXp) * 100
}

export function getXpForToday(logs?: XpLog[]): number {
  if (!logs) return 0
  const today = new Date().toDateString()
  return logs
    .filter(log => new Date(log.created_at).toDateString() === today)
    .reduce((sum, log) => sum + log.xp_amount, 0)
}

export function getXpForWeek(logs?: XpLog[]): number {
  if (!logs) return 0
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  return logs
    .filter(log => new Date(log.created_at) >= weekAgo)
    .reduce((sum, log) => sum + log.xp_amount, 0)
}

export function getEnergyForToday(logs?: EnergyLog[]): number {
  if (!logs) return 0
  const today = new Date().toDateString()
  return logs
    .filter(log => new Date(log.created_at).toDateString() === today)
    .reduce((sum, log) => sum + log.energy_amount, 0)
}

export function getUnlockedAchievements(achievements?: any[]): number {
  if (!achievements) return 0
  return achievements.filter(ach => ach.unlocked_at).length
}

export function getTypeStyles(tipo: string): string {
  const styles = {
    pessoal: 'bg-primary/10 text-primary border-primary/20',
    profissional: 'bg-accent/10 text-accent border-accent/20',
    projeto: 'bg-destructive/10 text-destructive border-destructive/20',
    estudo: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
    hobby: 'bg-chart-4/10 text-chart-4 border-chart-4/20'
  }
  return styles[tipo as keyof typeof styles] || styles.pessoal
}

export function getTypeIcon(tipo: string): string {
  const icons = {
    pessoal: '👤',
    profissional: '💼',
    projeto: '📊',
    estudo: '📚',
    hobby: '🎨'
  }
  return icons[tipo as keyof typeof icons] || '📌'
}

export function formatXp(xp: number): string {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`
  return xp.toString()
}