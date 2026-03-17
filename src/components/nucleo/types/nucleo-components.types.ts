import { Nucleo, NucleoAchievement } from "@/types/nucleo"
import { XpLog, EnergyLog } from "@/types/logs"

export interface NucleoWithStats extends Nucleo {
  xpTotal?: number
  xpHoje?: number
  xpSemana?: number
  energyTotal?: number
  energyHoje?: number
  level?: number
  nextLevelXp?: number
  xpLogs?: XpLog[]
  energyLogs?: EnergyLog[]
  achievements?: NucleoAchievement[]
  conquistasDesbloqueadas?: number
}

export interface NucleoCardProps {
  nucleo: NucleoWithStats
  variant?: 'default' | 'compact' | 'detailed'
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onArchive?: () => void
  className?: string
  href?: string
}

export interface NucleoProgressProps {
  xpAtual: number
  xpMax: number
  nivel: number
  energy?: number
  conquistas?: number
  showDetails?: boolean
  className?: string
  variant?: 'default' | 'minimal'
}