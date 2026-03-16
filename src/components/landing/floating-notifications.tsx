"use client"

import { useEffect, useState } from "react"
import { Trophy, Flame, Star, Target, Zap, CheckCircle2, TrendingUp, Award } from "lucide-react"

const notifications = [
  {
    icon: Trophy,
    title: "Nova conquista!",
    message: "Voce desbloqueou 'Primeira Semana'",
    color: "bg-yellow-500",
    delay: 0,
  },
  {
    icon: Flame,
    title: "Streak em chamas!",
    message: "7 dias consecutivos",
    color: "bg-orange-500",
    delay: 2,
  },
  {
    icon: Star,
    title: "Level Up!",
    message: "Voce alcancou o nivel 5",
    color: "bg-primary",
    delay: 4,
  },
  {
    icon: Target,
    title: "Meta atingida!",
    message: "100% das tarefas de hoje",
    color: "bg-accent",
    delay: 6,
  },
  {
    icon: Zap,
    title: "+250 XP",
    message: "Bonus de consistencia",
    color: "bg-purple-500",
    delay: 8,
  },
]

function NotificationCard({ notification, index }: { notification: typeof notifications[0], index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const positions = [
      { x: -120, y: -80 },
      { x: 100, y: -60 },
      { x: -80, y: 40 },
      { x: 120, y: 60 },
      { x: 0, y: -100 },
    ]
    setPosition(positions[index % positions.length])

    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, notification.delay * 1000)

    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, (notification.delay + 3) * 1000)

    const loopTimer = setInterval(() => {
      setIsVisible(true)
      setTimeout(() => setIsVisible(false), 3000)
    }, notifications.length * 2000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
      clearInterval(loopTimer)
    }
  }, [notification.delay, index])

  return (
    <div
      className={`absolute transition-all duration-500 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      style={{
        left: `calc(50% + ${position.x}px)`,
        top: `calc(50% + ${position.y}px)`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-xl backdrop-blur-sm min-w-[200px]">
        <div className={`p-2 rounded-xl ${notification.color}`}>
          <notification.icon className="size-4 text-white" />
        </div>
        <div>
          <p className="font-semibold text-sm">{notification.title}</p>
          <p className="text-xs text-muted-foreground">{notification.message}</p>
        </div>
      </div>
    </div>
  )
}

export function FloatingNotifications() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Celebre cada conquista
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Notificacoes motivacionais em tempo real para manter voce engajado
          </p>
        </div>

        <div className="relative h-[400px] max-w-3xl mx-auto">
          {/* Central Phone Mockup */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-[450px] bg-card border-4 border-foreground/10 rounded-[3rem] shadow-2xl overflow-hidden z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground/10 rounded-b-2xl" />
            <div className="p-6 pt-10">
              <div className="text-center mb-6">
                <div className="size-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">12</span>
                </div>
                <p className="font-semibold">Nivel 12</p>
                <p className="text-xs text-muted-foreground">2.847 / 3.000 XP</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <CheckCircle2 className="size-5 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Estudar React</p>
                    <p className="text-xs text-muted-foreground">+50 XP</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <CheckCircle2 className="size-5 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Academia</p>
                    <p className="text-xs text-muted-foreground">+75 XP</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 opacity-50">
                  <Target className="size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Meditar</p>
                    <p className="text-xs text-muted-foreground">+30 XP</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium">
                  <Flame className="size-3" />
                  21 dias
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <TrendingUp className="size-3" />
                  +15%
                </div>
              </div>
            </div>
          </div>

          {/* Floating Notifications */}
          {notifications.map((notification, index) => (
            <NotificationCard key={index} notification={notification} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}