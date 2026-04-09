"use client"
import { useState, useEffect } from 'react'
import { gamificacaoService } from '@/services/tarefas.service'

export function useGamificacao() {
  const [level, setLevel] = useState<any>(null)
  const [conquistas, setConquistas] = useState<any[]>([])
  const [streaks, setStreaks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [l, c, s] = await Promise.all([
          gamificacaoService.getLevel(),
          gamificacaoService.getConquistas(),
          gamificacaoService.getStreaks(),
        ])
        setLevel(l)
        setConquistas(c)
        setStreaks(s)
      } catch {
        // silently fail — use mock data
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const currentStreak = streaks.find(s => s.streakType === 'daily')?.currentStreak ?? 0

  return { level, conquistas, streaks, currentStreak, loading }
}
