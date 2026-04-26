"use client"

import { useEffect, useState } from "react"
import { Star, Users, Zap, Award } from "lucide-react"
import Image from "next/image"

const avatars = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia",
]

const liveActivities = [
  { user: "Maria S.", action: "completou", target: "Estudar ingles", xp: 150 },
  { user: "Joao P.", action: "desbloqueou", target: "Maratonista", xp: 500 },
  { user: "Ana L.", action: "atingiu", target: "Nivel 25", xp: 1000 },
  { user: "Pedro M.", action: "completou", target: "30 dias de streak", xp: 750 },
  { user: "Julia R.", action: "criou nucleo", target: "Meditacao", xp: 100 },
]

export function SocialProof() {
  const [currentActivity, setCurrentActivity] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentActivity((prev) => (prev + 1) % liveActivities.length)
        setIsVisible(true)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const activity = liveActivities[currentActivity]

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Live Activity Feed */}
          <div className="mb-16">
            <div 
              className={`flex items-center justify-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-lg transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
                <Zap className="size-5 text-primary" />
              </div>
              <p className="text-sm md:text-base">
                <span className="font-semibold">{activity.user}</span>
                <span className="text-muted-foreground"> {activity.action} </span>
                <span className="font-medium text-primary">{activity.target}</span>
                <span className="ml-2 text-xs text-accent font-medium">+{activity.xp} XP</span>
              </p>
              <span className="flex size-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 rounded-2xl bg-card border border-border">
              <div className="flex justify-center mb-3">
                <Users className="size-8 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">50K+</div>
              <p className="text-sm text-muted-foreground">Usuarios ativos</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card border border-border">
              <div className="flex justify-center mb-3">
                <Zap className="size-8 text-accent" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">2M+</div>
              <p className="text-sm text-muted-foreground">Tarefas completas</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card border border-border">
              <div className="flex justify-center mb-3">
                <Award className="size-8 text-orange-500" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">500K+</div>
              <p className="text-sm text-muted-foreground">Conquistas</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card border border-border">
              <div className="flex justify-center mb-3">
                <Star className="size-8 text-yellow-500" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">4.9</div>
              <p className="text-sm text-muted-foreground">Avaliacao media</p>
            </div>
          </div>

          {/* Avatar Stack + Rating */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {avatars.map((avatar, i) => (
                  <div 
                    key={i}
                    className="size-12 rounded-full border-3 border-background overflow-hidden bg-muted"
                  >
                    <Image
                      src={avatar}
                      alt={`Usuario ${i + 1}`}
                      width={48}
                      height={48}
                      className="size-full object-cover"
                    />
                  </div>
                ))}
                <div className="size-12 rounded-full border-3 border-background bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  +50K
                </div>
              </div>
              <div>
                <p className="font-semibold">Junte-se a comunidade</p>
                <p className="text-sm text-muted-foreground">Usuarios evoluindo juntos</p>
              </div>
            </div>

            <div className="h-12 w-px bg-border hidden md:block" />

            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <div>
                <p className="font-semibold">4.9 de 5</p>
                <p className="text-sm text-muted-foreground">+10.000 avaliacoes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}